const { createMacro } = require('babel-plugin-macros');

const methods = {
    overload: ({ references, babel: { types: t, template } }) => { 

        references.map(referencePath => {
          
            const functionsMap = referencePath.parentPath.node.arguments.map(el => ({[el.params.map(parm => parm.name)]: el}))
            console.log("parentPath.node.arguments", functionsMap)
            const buildAssignment = template(`
            TARGET.KEY = VALUE;
          `);

          referencePath.parentPath.getStatementParent().insertBefore(
              
            [buildAssignment({TARGET: t.identifier("a"), KEY: t.identifier("a"), VALUE: t.identifier("a")}),
            buildAssignment({TARGET: t.identifier("a"), KEY: t.identifier("a"), VALUE: t.identifier("a")})
        ]);

        referencePath.parentPath.replaceWith(
            // [t.functionExpression(null, [t.identifier("a")], t.blockStatement([])),
            // t.functionExpression(null, [t.identifier("b")], t.blockStatement([]))]
            // t.callExpression(t.identifier("import"), [
            //   t.stringLiteral("./test"),
            // ]),
            buildAssignment({TARGET: t.identifier("a"), KEY: t.identifier("a"), VALUE: t.identifier("a")}),

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
  });;