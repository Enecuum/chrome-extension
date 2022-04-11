const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const execSync = require('child_process').execSync
const CreateFileWebpack = require('create-file-webpack')
const webpack = new require('webpack')

module.exports = () => {

    const mode = process.env.NODE_ENV || 'development'
    const SOURCE_FOLDER = path.resolve(__dirname, 'src')
    const DIST_FOLDER = path.resolve(__dirname, 'dist')
    const LIB_FILE = path.resolve(__dirname + '/node_modules/enq-web3/dist/enqweb3lib.ext.min.js')
    const VERSION = execSync('git rev-parse --short HEAD').toString().trim()

    const COPY = {
        patterns: [
            {
                from: path.join(SOURCE_FOLDER, 'copied'),
                to: DIST_FOLDER
            },
            {
                from: LIB_FILE,
                to: path.join(DIST_FOLDER, 'lib'),
            }]
    }

    const plugins = [];

    plugins.push(new CopyWebpackPlugin(COPY))
    plugins.push(new CreateFileWebpack({
        path: './dist/',
        fileName: 'VERSION',
        content: VERSION
    }))
    // plugins.push(new webpack.EnvironmentPlugin(['VERSION']))
    plugins.push(new webpack.DefinePlugin({VERSION: JSON.stringify(VERSION)}))

    return {
        mode,
        entry: {
            popup: path.resolve(SOURCE_FOLDER, 'popup.js'),
            background: path.resolve(SOURCE_FOLDER, 'background.js'),
            contentScript: path.resolve(SOURCE_FOLDER, 'contentScript.js'),
            lockAccount: path.resolve(SOURCE_FOLDER, 'lockAccount.js'),
            '../serviceWorker': path.resolve(SOURCE_FOLDER, 'serviceWorker.ts'),
            serviceWorkerRegistration: path.resolve(SOURCE_FOLDER, 'serviceWorkerRegistration.ts'),
            workerDataParse: path.resolve(SOURCE_FOLDER, './utils/workerDataParse.js'),
        },
        output: {
            filename: 'js/[name].js',
            path: DIST_FOLDER,
            publicPath: './'
        },
        devtool: 'inline-source-map',
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".styl", ".css", ".png", ".jpg", ".icns", ".gif", ".svg", ".woff", ".woff2", ".ttf", ".otf"]
        },
        plugins,

        module: {
            rules: [
                {
                    test: /\.(jsx?)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],

        },
    }
}
