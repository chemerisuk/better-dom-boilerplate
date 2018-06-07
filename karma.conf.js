module.exports = function(config) {
    "use strict";

    var pkg = require("../../package");
    var babelConfig = require.resolve("./.babelrc");

    config.set({
        basePath: "../../",
        singleRun: true,
        frameworks: ["jasmine-ajax", "jasmine"],
        preprocessors: {"test/*.spec.js": ["babel"]},
        babelPreprocessor: {options: {"extends": babelConfig}},
        plugins: ["karma-jasmine-ajax", "karma-chrome-launcher", "karma-jasmine", "karma-coverage", "karma-coveralls", "karma-babel-preprocessor"],
        browsers: ["ChromeHeadless"],
        files: pkg.karmaFiles.concat("build/*.js", "test/*.spec.js"),
        coverageReporter: {
            type: "html",
            dir: "coverage/"
        }
    });
};
