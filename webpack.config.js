const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = (env, argv) => ({
entry: path.resolve(__dirname, 'src', 'index.js'),
output: {
path: path.resolve(__dirname, 'dist'),
filename: 'bundle.[contenthash].js',
clean: true,
publicPath: '/',
},
module: {
rules: [
{
test: /\.js$/,
exclude: /node_modules/,
use: {
loader: 'babel-loader'
}
},
{
test: /\.css$/i,
use: ['style-loader', 'css-loader']
}
]
},
plugins: [
new HtmlWebpackPlugin({
template: path.resolve(__dirname, 'src', 'index.html'),
title: 'Notes App'
})
],
devtool: argv.mode === 'development' ? 'inline-source-map' : false,
devServer: {
static: path.resolve(__dirname, 'dist'),
compress: true,
port: 8080,
hot: true,
open: true
}
});