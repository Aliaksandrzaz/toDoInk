
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const SRC_DIR = './src';
const DIST_DIR = './dist';

module.exports = {
    context: __dirname,
    entry: {
        app:  ["@babel/polyfill", "./src/app.js"]
    },
    output: {
        path: path.resolve(__dirname, DIST_DIR),
        filename: '[name].[hash].js'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            { test: /\.(js)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-proposal-class-properties" ],
                    }
                }

            }
            ,
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
            ,
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /.*?pages\/.+?\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            outputPath: './pages',
                        }
                    }
                ]
            }
        ],

    },

    mode: 'development',
    devServer: {
        contentBase: DIST_DIR,
        compress: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(SRC_DIR, './index.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }),
    ]
};
