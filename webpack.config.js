const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => {

    const mode = process.env.NODE_ENV || 'development';
    const SOURCE_FOLDER = path.resolve(__dirname, 'src');
    const DIST_FOLDER = path.resolve(__dirname, 'dist');
    const LIB_FILE = path.resolve(__dirname + '/node_modules/enqweb3/dist/enqweb3lib.ext.min.js')

    const COPY = {
        patterns: [
            {
                from: path.join(SOURCE_FOLDER, 'copied/popup.html'),
                to: path.join(SOURCE_FOLDER, 'copied/index.html'),
            },
            {
                from: path.join(SOURCE_FOLDER, 'copied'),
                to: DIST_FOLDER
            },
            {
                from: LIB_FILE,
                to: DIST_FOLDER
            }]
    };

    const plugins = [];

    plugins.push(new CopyWebpackPlugin(COPY));

    return {
        mode,
        entry: {
            popup: path.resolve(SOURCE_FOLDER, 'popup.js'),
            background: path.resolve(SOURCE_FOLDER, 'background.js'),
            contentScript: path.resolve(SOURCE_FOLDER, 'contentScript.js'),
            lockAccount: path.resolve(SOURCE_FOLDER, 'lockAccount.js'),
        },
        output: {
            filename: '[name].js',
            path: DIST_FOLDER,
            publicPath: './'
        },
        devtool: 'inline-source-map',
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".styl", ".css", ".png", ".jpg", ".gif", ".svg", ".woff", ".woff2", ".ttf", ".otf"]
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
            ],
        },
    };
};
