const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
module.exports = {
    entry: './src/index.js',
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            jQuery: 'jquery',            
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
    },
    module: {
        rules: [
            {
                test: /.css$/, // 針對所有.css 的檔案作預處理
                use: [
                    'style-loader',  // 這個會後執行
                    'css-loader' // 這個會先執行
                ]
            }
        ]
    }
};