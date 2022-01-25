const { createMacro } = require("babel-plugin-macros");

function inlineGuardToExp(guard, t) {
  return t.binaryExpression(
    "===",
    t.identifier(`arguments[${guard.__oneMacroIndex}]`),
    guard.right
  );
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
          let key = element.params.length;

          const inlineGuards = element.params
            .map((el, index) => {
              if (t.isAssignmentPattern(el)) {
                el.__oneMacroIndex = index;
              }
              return el;
            })
            .filter(t.isAssignmentPattern);

          if (inlineGuards.length) {
            uniqInlineGuardsKey = inlineGuards.map(el => String(el.right.value)).join("__")
            key += `__${uniqInlineGuardsKey}`;
          }

          functionsMap[key] = { element, inlineGuards };
        } else if (
          t.isCallExpression(element) &&
          element.callee.name === "when"
        ) {
          functionsMap[`with__guard__${index}`] = {
            element: element.arguments[1],
          };
          guards.push({
            key: `${overloadFunctionName}__guard__${index}`,
            func: element.arguments[0],
          });
        }
      });

      const overloadedFunctions = Object.entries(functionsMap).flatMap(
        ([key, func]) => {
          return t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier(`${overloadFunctionName}__${key}`),
              func.element
            ),
          ]);
        }
      );

      const definedGuards = guards.map((el) => {
        return t.variableDeclaration("const", [
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
            Object.entries(functionsMap).map(([key, val]) => {
              if (key.startsWith("with__guard")) {
                const numberOfParams = key.split("__")[2];
                return t.ifStatement(
                  t.identifier(
                    `${overloadFunctionName}__guard__${numberOfParams}.apply(undefined, arguments)`
                  ),
                  t.blockStatement([
                    t.returnStatement(
                      t.identifier(
                        `${overloadFunctionName}__${key}.apply(undefined, arguments)`
                      )
                    ),
                  ])
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

                    return t.logicalExpression("&&", el, a);
                  }, null);
              }

              const numberOfParams = Number(key.split("__")[0]);

              const ifExp = extraChecks
                ? t.logicalExpression(
                    "&&",
                    t.binaryExpression(
                      "===",
                      t.identifier("arguments.length"),
                      t.numericLiteral(numberOfParams)
                    ),
                    extraChecks
                  )
                : t.binaryExpression(
                    "===",
                    t.identifier("arguments.length"),
                    t.numericLiteral(numberOfParams)
                  );

              return t.ifStatement(
                ifExp,
                t.blockStatement([
                  t.returnStatement(
                    t.identifier(
                      `${overloadFunctionName}__${key}.apply(undefined, arguments)`
                    )
                  ),
                ])
              );
            })
          )
        )
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
