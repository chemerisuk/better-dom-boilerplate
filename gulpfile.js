var pkg = require("../../package");
var gulp = require("gulp");
var gulpif = require("gulp-if");
var filter = require("gulp-filter");
var es6transpiler = require("gulp-es6-transpiler");
var plumber = require("gulp-plumber");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer-core");
var csswring = require("csswring");
var replace = require("gulp-replace");
var argv = require("yargs").argv;
var bump = require("gulp-bump");
var git = require("gulp-git");
var tag_version = require("gulp-tag-version");
var deploy = require("gulp-gh-pages");
var header = require("gulp-header");

var karma = require("karma").server;
var karmaConfig = require.resolve("./karma.conf");
var jshintConfig = require.resolve("./.jshintrc");
var browsers = pkg.autoprefixer || ["last 2 versions", "android 2.3", "IE >= 8", "Opera 12.1"];
var url = require("postcss-url")({url: "inline"});


gulp.task("lint", function() {
    return gulp.src(["src/*.js", "test/*.spec.js", "*.js"])
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(gulpif(process.env.TRAVIS_JOB_NUMBER, jshint.reporter("fail")));
});

gulp.task("compile", ["lint"], function() {
    var jsFilter = filter("*.js");
    var cssFilter = filter("*.css");

    return gulp.src(["src/*.js", "src/*.css"])
        .pipe(cssFilter)
        .pipe(plumber())
        .pipe(postcss([ autoprefixer({browsers: browsers}), csswring, url ]))
        .pipe(replace(/\\|"/g, "\\$&")) // handle symbols need to escape
        .pipe(replace(/([^{]+)\{([^}]+)\}/g, "DOM.importStyles(\"$1\", \"$2\");\n"))
        .pipe(cssFilter.restore())
        .pipe(jsFilter)
        .pipe(plumber())
        .pipe(es6transpiler())
        .pipe(jsFilter.restore())
        .pipe(concat(pkg.name + ".js"))
        .pipe(gulp.dest("build/"));
});

gulp.task("test", ["compile"], function(done) {
    var config = { configFile: karmaConfig, preprocessors: [] };

    if (process.env.TRAVIS_JOB_NUMBER) {
        config = {
            configFile: karmaConfig,
            reporters: ["coverage", "dots", "coveralls"],
            coverageReporter: {
                type: "lcovonly",
                dir: "coverage/"
            }
        };
    }

    karma.start(config, done);
});

gulp.task("dev", ["compile"], function() {
    gulp.watch("src/**", ["compile"]);

    karma.start({
        configFile: karmaConfig,
        reporters: ["coverage", "progress"],
        background: true,
        singleRun: false
    });
});

gulp.task("bump", function() {
    var version = argv.tag;

    if (!version) throw new gutil.PluginError("bump", "You need to specify --tag parameter");

    return gulp.src("*.json")
        .pipe(bump({version: version}))
        .pipe(gulp.dest("./"));
});

gulp.task("dist", ["compile", "bump"], function() {
    var banner = [
        "/**",
        " * <%= pkg.name %>: <%= pkg.description %>",
        " * @version <%= version %> <%= new Date().toUTCString() %>",
        " * @link <%= pkg.homepage %>",
        " * @copyright 2014 <%= pkg.author %>",
        " * @license <%= pkg.license %>",
        " */"
    ].join("\n");

    return gulp.src("build/*.js")
        .pipe(header(banner + "\n", { pkg: pkg, version: argv.tag }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("release", ["dist"], function(done) {
    gulp.src(["*.json", "dist/*.js"])
        .pipe(git.commit("version " + argv.tag))
        .pipe(filter("package.json"))
        .pipe(tag_version())
        .on("end", function() {
            git.push("origin", "master", {}, function() {
                git.push("origin", "master", {args: "--tags"}, done);
            });
        });
});

gulp.task("gh-pages", function() {
    return gulp.src(["index.html", "README.md", "build/*", "i18n/*", "bower_components/**/*"], {base: "."})
        .pipe(deploy({cacheDir: "/tmp/" + pkg.name}));
});
