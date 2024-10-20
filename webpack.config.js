const GasPlugin = require("gas-webpack-plugin");

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    output: {
        filename: 'Code.js',
        path: __dirname,
    },
    resolve: {
        extensions: ['.ts',],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new GasPlugin()
    ]
};