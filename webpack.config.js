const fs = require("fs");
const path = require("path");

const babel = require("@babel/core");

const CustomModuleIdsPlugin = require('custom-module-ids-webpack-plugin');
const EventHooksPlugin = require('event-hooks-webpack-plugin');

const replaceRequire = "./helpers/replaceRequire.js"
const babelPhpTag = require('./packages/babel-plugin-php-tag')
const { VueLoaderPlugin } = require('./packages/vue-loader');
const vueTemplatePhpTagCompiler = require('./packages/vue-php-tag-template-compiler');


module.exports = {
    entry: './src/entry.js',
    target: 'es2018',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            "stream": false,
            "util": "util",
            "buffer": false
        },
        mainFields: ['main', 'module'],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: path.resolve(__dirname, 'packages', 'vue-loader'),
                options: {
                    compiler: vueTemplatePhpTagCompiler,
                    ssr: true,
                    babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy']
                }
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /server-renderer\.cjs\.(?:prod\.)?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [],
                        plugins: [replaceRequire]
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: process.env.NODE_ENV == "production"
    },
    plugins: [
        new VueLoaderPlugin(),
        new EventHooksPlugin({
            assetEmitted: (file, { outputPath }) => {

                if (file.match(/\.js$/)) {
                    const filePath = path.resolve(outputPath, file);
                    const transform = babel.transformFileSync(filePath, { plugins: [babelPhpTag] }).code;
                    fs.writeFileSync(filePath, transform);
                }
            }
        }),
        (() => {
            let i = 0;

            return new CustomModuleIdsPlugin({
                idFunction: function (libIdent) {
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