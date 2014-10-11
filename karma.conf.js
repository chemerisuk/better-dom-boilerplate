module.exports = function(config) {
    "use strict";

    config.set({
        basePath: "../../",
        singleRun: true,
        frameworks: ["jasmine"],
        browsers: ["PhantomJS"],
        preprocessors: { "build/*.js": "coverage" },
        files: [
            "bower_components/better-dom/dist/better-dom.js",
            "build/*.js",
            "test/*.spec.js"
        ]
    });
};
