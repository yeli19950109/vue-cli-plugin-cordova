module.exports = (api, options, rootOptions) => {
    const fs = require('file-system');

    api.extendPackage({
        scripts: {
            'cordova-dev': 'vue-cli-service build --mode development --dest www',
            'cordova-prod': 'vue-cli-service build --dest www'
        },
        dependencies: {
            'cordova-android': '^7.1.1',
            'cordova-ios': '^4.5.5',
            'cordova-plugin-device': '^2.0.2',
            'cordova-plugin-splashscreen': '^5.0.2',
            'cordova-plugin-statusbar': '^2.4.2',
            'cordova-plugin-whitelist': '^1.3.3',
            "cordova-plugin-keyboard": "^1.2.0",
        },
        cordova: {
            plugins: {
                "cordova-plugin-whitelist": {},
                "cordova-plugin-device": {},
                "cordova-plugin-splashscreen": {},
                "cordova-plugin-keyboard": {},
                "cordova-plugin-statusbar": {}
            },
            platforms: [
                'android',
                'ios'
            ]
        }
    });

    api.render('./templates', options);

    api.onCreateComplete(() => {
        // .gitignore - not included in files on postProcessFiles
        const ignorePath = api.resolve('.gitignore');
        const ignore = fs.existsSync(ignorePath)
            ? fs.readFileSync(ignorePath, 'utf-8')
            : '';
        fs.writeFileSync(ignorePath, ignore + '\n# Cordova\n/www\n/platforms\n/plugins\n');
        fs.writeFileSync(
            api.resolve(".browserslistrc"),
            "ios > 9\n" +
            "android > 4.4.4\n"
        );
        fs.writeFileSync(
            api.resolve(".editorconfig"),
            "# http://editorconfig.org\n" +
            "root = true\n" +
            "\n" +
            "[*]\n" +
            "charset = utf-8\n" +
            "indent_style = tab\n" +
            "end_of_line = lf\n" +
            "insert_final_newline = true\n" +
            "trim_trailing_whitespace = true\n" +
            "\n" +
            "[*.md]\n" +
            "insert_final_newline = false\n" +
            "trim_trailing_whitespace = false"
        )
    })
};

