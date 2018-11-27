const pkg = require("../../package");
const gulp = require("gulp");
const gulpif = require("gulp-if");
const PluginError = require("plugin-error");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const jshint = require("gulp-jshint");
const deploy = require("gulp-gh-pages");
const header = require("gulp-header");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");

const babel = require("gulp-babel");
const babelConfig = require.resolve("./.babelrc");
const karma = require("karma");
const karmaConfig = require.resolve("./karma.conf");
const jshintConfig = require.resolve("./.jshintrc");

if (process.env.npm_package_version) {
    pkg.version = process.env.npm_package_version;
}


function applyConfigOverrides(sectionName, config) {
    var section = pkg.config && pkg.config[sectionName];

    if (typeof section === "object") {
        Object.keys(section).forEach(function(key) {
            // apply overriden value
            config[key] = section[key];
        });
    }

    return config;
}

gulp.task("lint", function() {
    return gulp.src(["src/*.js", "test/*.spec.js", "*.js"])
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(gulpif(process.env.TRAVIS_JOB_NUMBER, jshint.reporter("fail")));
});

gulp.task("compile", ["lint"], function() {
    return gulp.src(["src/*.js"])
        .pipe(plumber())
        .pipe(babel({extends: babelConfig}))
        .pipe(concat(pkg.name + ".js"))
        .pipe(gulp.dest("build/"));
});

gulp.task("test", ["compile"], function(done) {
    var config = { configFile: karmaConfig };

    if (process.env.TRAVIS_JOB_NUMBER) {
        config.reporters = ["coverage", "dots", "coveralls"];

        config.preprocessors = {
            "test/*.spec.js": ["babel"],
            "build/*.js": ["coverage"]
        };

        config.coverageReporter = {
            type: "lcovonly",
            dir: "coverage/"
        };
    }

    new karma.Server(applyConfigOverrides("karma", config), function(resultCode) {
        done(resultCode ? new PluginError("karma", "Specs were not passed") : null);
    }).start();
});

gulp.task("dev", ["compile"], function() {
    gulp.watch("src/**", ["compile"]);

    new karma.Server(applyConfigOverrides("karma", {
        configFile: karmaConfig,
        reporters: ["coverage", "progress"],
        preprocessors: {
            "build/*.js": "coverage",
            "test/*.spec.js": ["babel"]
        },
        background: true,
        singleRun: false
    })).start();
});

gulp.task("dist", ["test"], function() {
    var banner = [
        "/**",
        " * <%= name %>: <%= description %>",
        " * @version <%= version %> <%= new Date().toUTCString() %>",
        " * @link <%= homepage %>",
        " * @copyright <%= new Date().getFullYear() %> <%= author %>",
        " * @license <%= license %>",
        " */"
    ].join("\n");

    return gulp.src("build/*.js")
        .pipe(header(banner + "\n", pkg))
        .pipe(gulp.dest("dist/"))
        .pipe(uglify({preserveComments: "license"}))
        .pipe(rename({extname: ".min.js"}))
        .pipe(gulp.dest("dist/"));
});

gulp.task("gh-pages", function() {
    var filesToKeep = ["index.html", "README.md", "build/*", "demo/*"];
    filesToKeep = filesToKeep.concat(Object.keys(pkg.peerDependencies || {}).map(name => "node_modules/" + name + "/**"));
    return gulp.src(filesToKeep, {base: "."})
        .pipe(deploy({cacheDir: "/tmp/" + pkg.name}));
});
