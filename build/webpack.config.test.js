/**
 *  测试环境  
 */
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path=require('path');
// var HappyPack = require('happypack');
// var happyThreadPool = HappyPack.ThreadPool({ size: 5 });
var os = require('os');
var UglifyJsParallelPlugin = require('webpack-uglify-parallel');

module.exports={
    entry: {
        app:'./src/app.js'
    },
    output:{
        path:path.resolve(__dirname, "../release"),
        publicPath:"",//TODO 填写生产环境静态文件路径
        filename:'[name].[chunkhash:8].js'
    },
    externals: {
        'vue': 'Vue',
        'vue-router':'VueRouter'
    },
    resolve: {
        root: path.resolve('./'),
        extensions: ['', '.js', '.json', '.vue'],
    },
    vue: {
        loaders: {
            css: ExtractTextPlugin.extract('style-loader', 'css-loader')
        }
    },
    module: {
        loaders: [
            // {test: /\.css$/, loaders: [ 'happypack/loader?id=css' ] },
            // {test: /\.less$/, loaders: [ 'happypack/loader?id=less']},
            // {test: /\.js$/, loaders: [ 'happypack/loader?id=js']},
            // {test: /\.vue$/, [ 'happypack/loader?id=vue']},
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            {test: /\.less$/, loader: ExtractTextPlugin.extract('css-loader', 'less-loader')},
            {test: /\.js$/, exclude: /node_modules|vue\/src|vue-router\/|vue-loader\//, loader: 'babel' },
            {test: /\.vue$/, loader: 'vue' },

            {test: /\.(png|jpg|gif)$/, loader: 'url-loader?name=images/[hash].[ext]&limit=8192'},
            {test: /\.(html|tpl)$/, loader: 'html-loader'},
            {test: /\.woff/, loader : 'url?prefix=font/&limit=10000&mimetype=application/font-woff' },
            {test: /\.ttf/,loader : 'file?prefix=font/'}, 
            {test: /\.eot/,loader : 'file?prefix=font/'}, 
            {test: /\.svg/,loader : 'file?prefix=font/'}
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         drop_console: true,
        //         warnings: false
        //     }
        // }),
        new UglifyJsParallelPlugin({
            workers: os.cpus().length,
            mangle: true,
            compressor: {
                warnings: false,
                drop_console: true,
                drop_debugger: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('test')
            }
        }),
        new ExtractTextPlugin("[name].[contenthash:8].css", {
            allChunks: true,
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        // createHappyPlugin('js', ['babel']),
        // createHappyPlugin('css', ['style!css']),
        // createHappyPlugin('less', ['css!less']),
        // createHappyPlugin('vue', ['vue']),
        // createHappyPlugin('png|jpg|gif', ['url-loader']),
        // createHappyPlugin('html|tpl', ['html-loader']),
    ],
    devtools:false
}

// function createHappyPlugin(id, loaders) {
//     return new HappyPack({
//         id: id,
//         loaders: loaders,
//         threadPool: happyThreadPool,
//         cache: true,
//         verbose: true
//     });
// }