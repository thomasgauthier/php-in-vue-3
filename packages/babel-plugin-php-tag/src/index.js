import util from "util"
const engine = require('php-parser');

const parser = new engine({
  // some options :
  parser: {
    extractDoc: true,
    php7: true
  },
  ast: {
    withPositions: true
  }
});


export default function ({ types: t }) {


  const op = [];


  return {
    visitor: {
      TaggedTemplateExpression(path, state) {
        if (path.node.tag.name == "php") {
          // throw new Error(util.inspect(path.node.quasi.quasis));
          let code = path.node.quasi.quasis[0].value.raw
          const ast = parser.parseEval(code);


          const lastchild = ast.children[ast.children.length - 1];
          if (lastchild.kind == "expressionstatement") {


            code = code.slice(0, lastchild.loc.start.offset) + "return " + code.slice(lastchild.loc.start.offset);
          }

          // code = `ob_start();${code} return ob_get_clean();`.replace(/\n/g, "\\n")
          code = code.replace(/\n/g, "\\n");

          path.replaceWithSourceString(`(() => {  return PHP.helper.__call("eval", [\`${code}\`]); })()`);
        }
      }
    }
  };
}
