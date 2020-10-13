
const compiler = require('@vue/compiler-ssr');
const { compile } = require('@vue/compiler-dom')

const initialCompile = compiler.compile;
compiler.compile = (template, options) => {

    const templateAST = compile(template).ast;

    function replace(str, replacements) {

        const parts = [];
        let cutlength = 0;
        let rest = str;
        for (let i = 0; i < replacements.length; i++) {
            const { start, end } = replacements[i].loc;

            const part = rest.substring(0, start - cutlength);
            rest = rest.substring(end - cutlength);
            parts.push(part)
            cutlength += part.length + (end - start);
        }

        parts.push(rest);


        let finalString = "";

        for (let i = 0; i < replacements.length; i++) {
            finalString += parts[i] + replacements[i].content;
        }

        finalString += parts[replacements.length]


        return finalString;
    }

    const replacements = [];


    const visit = function (node) {
        if (Array.isArray(node)) {
            node.forEach((child) => {
                visit(child);
            })
        } else if (typeof node == 'object') {
            if (node.type == 4) {
                const matches = Array.from(node.content.matchAll(/php`.*?(?<!\\)`/gs));
                matches.forEach((match, idx) => {
                    let code = match[0].substring(4, match[0].length - 1)
                    code = `ob_start();${code} return ob_get_clean();`.replace(/\n/g, "\\n")

                    replacements.push({
                        loc: {
                            start: node.loc.start.offset + match.index,
                            end: node.loc.start.offset + match.index + match[0].length
                        },
                        content: `(() => {  return PHP.helper.__call(\`eval\`, [\`${code}\`]); })()`
                    })
                })
            }

            for (const key in node) {
                if (key != "codegenNode") {
                    visit(node[key]);
                }
            }
        }
    }


    visit(templateAST.children);

    return initialCompile(replace(template, replacements), options);
}


module.exports =  require('@vue/compiler-ssr');