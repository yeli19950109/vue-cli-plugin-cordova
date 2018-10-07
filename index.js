const {
    info
} = require('@vue/cli-shared-utils');

module.exports = (api, options) => {
    api.chainWebpack(webpackConfig => {
        if (process.env.NODE_ENV === 'production') {
            // FIXME: This is a temporary patch.
            // When the following PR is merged into file-loader, modify it to use cssOutputPath and useRelativePath.
            // https://github.com/webpack-contrib/file-loader/pull/150
            webpackConfig.plugin('extract-css')
                .tap(args => {
                    args[0].filename = '[name].[contenthash:8].css';
                    args[0].chunkFilename = '[name].[id].[contenthash:8].css';
                })
        }

        webpackConfig.plugin('cordova')
            .use(require('html-webpack-include-assets-plugin'), [{
                assets: 'cordova.js',
                append: false,
                publicPath: false
            }]);
    });

    api.configureWebpack(config => {

        if (process.env.NODE_ENV === 'production') {
            // Default publicPath is '/'
            // And it's not working well with the 'file://' protocol
        }
        if (process.env.NODE_ENV === 'development') {
            // Default publicPath is '/'
            // And it's not working well with the 'file://' protocol
            config.devtool = 'cheap-eval-source-map';
        }

    });

    api.configureDevServer((config) => {
        config.before = function(app) {
            app.get('/cordova.js', function(req, res) {
                res.setHeader('Content-Type', 'application/javascript');
                res.write('window.cordova=undefined;');
                res.end('');
            });
        };
    })
};
