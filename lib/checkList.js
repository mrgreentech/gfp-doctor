const examinePackage = require('./examine-package');

module.exports = function(key) {
    let list = {
        package: [
            {
                desc: 'using public npm version of gfp eslint config',
                errorMsg: 'remove gfp-eslint-config from package.json and run "npm install --save-dev eslint-config-gfp"',
                fn: examinePackage.checkGfpEslintConfig
            }
        ]
    };

    return list[key];
};
