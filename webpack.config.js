const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CustomModuleIdsPlugin = require('custom-module-ids-webpack-plugin');
const replaceRequire = "./helpers/replaceRequire.js"

module.exports = {
    entry: './src/entry.js',
    target: 'es2020',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /server-renderer\.cjs\.(?:prod\.)?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [],
                        plugins : [replaceRequire]
                      }
                }
            }
        ]
    },
    resolve: {
        fallback: {
            "stream": false,
            "util": false,
            "buffer": false
        },
        mainFields: ['main', 'module'],
    },
    plugins: [
        new VueLoaderPlugin(),
        (() => {
            let i = 0;

            return new CustomModuleIdsPlugin({
                idFunction: function (libIdent, module) {
                    let match = libIdent && libIdent.match(/node_modules\/(@vue\/.+?)\/dist\/.*\.js/);

                    if (match) {
                        return match[1];
                    }

                    if (libIdent && libIdent.match(/node_modules\/vue\/dist/)) {
                        return "vue"
                    }

                    return i++;
                }
            })
        })()
    ],
}