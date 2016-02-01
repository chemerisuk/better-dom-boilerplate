module.exports = function(config) {
    "use strict";

    var pkg = require("../../package");
    var babelConfig = require.resolve("./.babelrc");
    var files = pkg.karmaFiles || ["bower_components/better-dom/dist/better-dom.js"];

    config.set({
        basePath: "../../",
        singleRun: true,
        frameworks: ["jasmine-ajax", "jasmine"],
        preprocessors: {"test/*.spec.js": ["babel"]},
        babelPreprocessor: {"extends": babelConfig},
        plugins: ["karma-jasmine-ajax", "karma-phantomjs-launcher", "karma-jasmine", "karma-coverage", "karma-coveralls", "karma-babel-preprocessor"],
        browsers: ["PhantomJS"],
        files: files.concat("build/*.js", "test/*.spec.js")
    });
};
