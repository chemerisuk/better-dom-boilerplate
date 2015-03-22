module.exports = function(config) {
    "use strict";

    var pkg = require("../../package");
    var files = pkg.karmaFiles || ["bower_components/better-dom/dist/better-dom.js"];

    config.set({
        basePath: "../../",
        singleRun: true,
        frameworks: ["jasmine-ajax", "jasmine"],
        browsers: ["PhantomJS"],
        files: files.concat("build/*.js", "test/*.spec.js")
    });
};
