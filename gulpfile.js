var pkg = require("../../package");
var gulp = require("gulp");
var gulpif = require("gulp-if");
var gutil = require("gulp-util");
var filter = require("gulp-filter");
var plumber = require("gulp-plumber");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csswring = require("csswring");
var replace = require("gulp-replace");
var git = require("gulp-git");
var deploy = require("gulp-gh-pages");
var header = require("gulp-header");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var bump = require("gulp-bump");

var babel = require("gulp-babel");
var babelConfig = require.resolve("./.babelrc");
var karma = require("karma");
var karmaConfig = require.resolve("./karma.conf");
var jshintConfig = require.resolve("./.jshintrc");
var browsers = pkg.autoprefixer || ["last 2 versions", "android 2.3", "IE >= 8", "Opera 12.1"];
var url = require("postcss-url")({url: "inline"});
var customProperties = require("postcss-custom-properties");

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
    var jsFilter = filter("*.js", {restore: true});
    var cssFilter = filter("*.css", {restore: true});
    var autoprefixerConfig = applyConfigOverrides("autoprefixer", {browsers: browsers});

    return gulp.src(["src/*.js", "src/*.css"])
        .pipe(cssFilter)
        .pipe(plumber())
        .pipe(postcss([ customProperties(), autoprefixer(autoprefixerConfig), csswring, url ]))
        .pipe(replace(/\\|"/g, "\\$&")) // handle symbols need to escape
        .pipe(replace(/([^{]+)\{((?:[^{]+\{[^}]+\})+|[^}]+)\}/g, "DOM.importStyles(\"$1\", \"$2\");\n"))
        .pipe(cssFilter.restore)
        .pipe(jsFilter)
        .pipe(plumber())
        .pipe(babel({extends: babelConfig}))
        .pipe(jsFilter.restore)
        .pipe(concat(pkg.name + ".js"))
        .pipe(gulp.dest("build/"));
});

gulp.task("test", ["compile"], function(done) {
    var config = { configFile: karmaConfig };

    if (process.env.TRAVIS_JOB_NUMBER) {
        config = {
            configFile: karmaConfig,
            reporters: ["coverage", "dots", "coveralls"],
            preprocessors: { "build/*.js": "coverage" },
            coverageReporter: {
                type: "lcovonly",
                dir: "coverage/"
            }
        };
    }

    new karma.Server(applyConfigOverrides("karma", config), function(resultCode) {
        done(resultCode ? new gutil.PluginError("karma", "Specs were not passed") : null);
    }).start();
});

gulp.task("dev", ["compile"], function() {
    gulp.watch("src/**", ["compile"]);

    new karma.Server(applyConfigOverrides("karma", {
        configFile: karmaConfig,
        reporters: ["coverage", "progress"],
        preprocessors: { "build/*.js": "coverage" },
        background: true,
        singleRun: false
    })).start();
});

gulp.task("bower", function() {
    return gulp.src("./bower.json")
        .pipe(bump({version: pkg.version}))
        .pipe(gulp.dest("./"));
});

gulp.task("dist", ["test", "bower"], function(done) {
    var banner = [
        "/**",
        " * <%= name %>: <%= description %>",
        " * @version <%= version %> <%= new Date().toUTCString() %>",
        " * @link <%= homepage %>",
        " * @copyright <%= new Date().getFullYear() %> <%= author %>",
        " * @license <%= license %>",
        " */"
    ].join("\n");

    gulp.src("build/*.js")
        .pipe(header(banner + "\n", pkg))
        .pipe(gulp.dest("dist/"))
        .pipe(uglify({preserveComments: "license"}))
        .pipe(rename({extname: ".min.js"}))
        .pipe(gulp.dest("dist/"))
        .on("end", function() {
            git.exec({args: "add -A dist bower.json", quiet: true}, done);
        });
});

gulp.task("gh-pages", function() {
    return gulp.src(["index.html", "README.md", "build/*", "i18n/*", "bower_components/**/*", "demo/*"], {base: "."})
        .pipe(deploy({cacheDir: "/tmp/" + pkg.name}));
});
