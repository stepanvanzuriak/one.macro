const { createMacro } = require("babel-plugin-macros");

const methods = {
  when: () => {},
  overload: ({ references, babel: { types: t, template } }) => {
    references.map((referencePath) => {
      const functionsMap = {};
      const guards = [];

      const overloadFunctionName = referencePath.parentPath.container.id.name;

      referencePath.parentPath.node.arguments.forEach((element, index) => {
        console.log(element);
        if (t.isArrowFunctionExpression(element)) {
          const key = element.params.length;
          functionsMap[key] = element;
        } else if (
          t.isCallExpression(element) &&
          element.callee.name === "when"
        ) {
          functionsMap[`with__guard__${index}`] = element.arguments[1];
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
              func
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
            Object.keys(functionsMap).map((key) => {
              if (key.startsWith("with__guard")) {
                return t.ifStatement(
                  t.identifier(
                    `${overloadFunctionName}__guard__${
                      key.split("__")[2]
                    }.apply(undefined, arguments)`
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

              return t.ifStatement(
                t.binaryExpression(
                  "===",
                  t.identifier("arguments.length"),
                  t.numericLiteral(Number(key))
                ),
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
