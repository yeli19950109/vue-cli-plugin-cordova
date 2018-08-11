const {
    info
} = require('@vue/cli-shared-utils');

module.exports = (api, options) => {
    api.chainWebpack(webpackConfig => {
        if (process.env.NODE_ENV === 'production') {
            webpackConfig.plugin('copy')
                .tap(args => {
                    args[0][0].ignore.push('cordova');
                    args[0][0].ignore.push('config.xml');
                    return args
                });
            webpackConfig.plugin('cordova')
                .use(require('html-webpack-include-assets-plugin'), [{
                    assets: 'cordova.js',
                    append: false,
                    publicPath: false
                }]);
            // FIXME: This is a temporary patch.
            // When the following PR is merged into file-loader, modify it to use cssOutputPath and useRelativePath.
            // https://github.com/webpack-contrib/file-loader/pull/150
            webpackConfig.plugin('extract-css')
                .tap(args => {
                    args[0].filename = '[name].[contenthash:8].css';
                    args[0].chunkFilename = '[name].[id].[contenthash:8].css';
                })
        }
    });

    api.configureWebpack(config => {
        if (process.env.NODE_ENV === 'production') {
            // Default publicPath is '/'
            // And it's not working well with the 'file://' protocol
            config.output.publicPath = ''
        }
        if (process.env.NODE_ENV === 'development') {
            // Default publicPath is '/'
            // And it's not working well with the 'file://' protocol
            config.devtool = 'cheap-eval-source-map';
        }
    });

    api.configureDevServer((config) => {
        config.before = (app) => {
            app.get('/cordova.js', function (req, res) {
                res.setHeader('Content-Type', 'application/javascript');
                res.write('');
                res.end('');
            });
        };
    })
};
