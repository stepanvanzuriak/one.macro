const { createMacro } = require('babel-plugin-macros');

function inlineGuardToExp(guard, t) {
  // To compare arrays
  if (t.isArrayExpression(guard.right)) {
    // TODO: Double check this
    return  t.binaryExpression(
      '===',
      t.callExpression(t.identifier('JSON.stringify'), [t.identifier(`arguments[${guard.__oneMacroIndex}]`)]),
      t.callExpression(t.identifier('JSON.stringify'), [guard.right]),
    );
  } 


  return t.binaryExpression(
    '===',
    t.identifier(`arguments[${guard.__oneMacroIndex}]`),
    guard.right,
  );
}

function getGuardName(inlineGuards, t) {
  return inlineGuards
    .map((el) => {
      let name = el.right.value;

      if (t.isIdentifier(el.right)) {
        name = el.right.name;
      }

      if (t.isArrayExpression(el.right)) {
        name = 'arrayExpression'
      }

      return String(name).split(' ').join('_');
    })
    .join('__');
}

const methods = {
  when: () => {},
  overload: ({ references, babel: { types: t, template } }) => {
    references.map((referencePath) => {
      const functionsMap = {};
      const guards = [];
      
      const overloadFunctionName = referencePath.parentPath.container.id.name;

      referencePath.parentPath.node.arguments.forEach((element, index) => {
        if (t.isArrowFunctionExpression(element)) {
          let key = element.params.length + "_" + element.params.map(param => param.type[0]).join("");

          const inlineGuards = element.params
            .map((el, index) => {
              if (t.isAssignmentPattern(el)) {
                el.__oneMacroIndex = index;
              }
              return el;
            })
            .filter(t.isAssignmentPattern);

          if (inlineGuards.length) {
            uniqInlineGuardsKey = getGuardName(inlineGuards, t);
            key += `__${uniqInlineGuardsKey}`;
          }

          functionsMap[key] = { element, inlineGuards, paramsLength: element.params.length  };
        } else if (
          t.isCallExpression(element) &&
          element.callee.name === 'when'
        ) {
          functionsMap[`with__guard__${index}`] = {
            element: element.arguments[1],
            inlineGuards: [],
          };
          guards.push({
            key: `${overloadFunctionName}__guard__${index}`,
            func: element.arguments[0],
          });
        }
      });

      const overloadedFunctions = Object.entries(functionsMap).flatMap(
        ([key, func]) => {
          return t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(`${overloadFunctionName}__${key}`),
              func.element,
            ),
          ]);
        },
      );

      const definedGuards = guards.map((el) => {
        return t.variableDeclaration('const', [
          t.variableDeclarator(t.identifier(el.key), el.func),
        ]);
      });

      referencePath.parentPath
        .getStatementParent()
        .insertBefore([...overloadedFunctions, ...definedGuards]);

      referencePath.parentPath.replaceWith(
        t.functionExpression(
          t.identifier(overloadFunctionName),
          [],
          t.blockStatement(
            Object.entries(functionsMap)
            // Sort by inline guards complexity
            .sort((a, b) => b[1].inlineGuards.length - a[1].inlineGuards.length)
            .map(([key, val]) => {
              if (key.startsWith('with__guard')) {
                const numberOfParams = key.split('__')[2];
                return t.ifStatement(
                  t.identifier(
                    `${overloadFunctionName}__guard__${numberOfParams}.apply(undefined, arguments)`,
                  ),
                  t.blockStatement([
                    t.returnStatement(
                      t.identifier(
                        `${overloadFunctionName}__${key}.apply(undefined, arguments)`,
                      ),
                    ),
                  ]),
                );
              }

              let extraChecks = false;

              if (val.inlineGuards.length) {
                extraChecks = val.inlineGuards
                  .map((el) => inlineGuardToExp(el, t))
                  .reduceRight((a, el) => {
                    if (!a) {
                      return el;
                    }

                    return t.logicalExpression('&&', el, a);
                  }, null);
              }

              const numberOfParams = val.paramsLength;

              const ifExp = extraChecks
                ? t.logicalExpression(
                    '&&',
                    t.binaryExpression(
                      '===',
                      t.identifier('arguments.length'),
                      t.numericLiteral(numberOfParams),
                    ),
                    extraChecks,
                  )
                : t.binaryExpression(
                    '===',
                    t.identifier('arguments.length'),
                    t.numericLiteral(numberOfParams),
                  );

              return t.ifStatement(
                ifExp,
                t.blockStatement([
                  t.returnStatement(
                    t.identifier(
                      `${overloadFunctionName}__${key}.apply(undefined, arguments)`,
                    ),
                  ),
                ]),
              );
            }),
          ),
        ),
      );
    });
  },
};

module.exports = createMacro(({ references, state, babel }) => {
  Object.entries(methods).forEach(([methodName, handler]) => {
    if (references[methodName]) {
      handler({ references: references[methodName], state, babel });
    }
  });
});
