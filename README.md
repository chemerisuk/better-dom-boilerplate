# better-dom-boilerplate
> Quick starter for a better-dom plugin

### Initial steps

```sh
$ git clone your_plugin_repo.git && cd your_plugin_repo
$ npm init
```

### Dependencies

```sh
$ npm install git://github.com/chemerisuk/better-dom-boilerplate.git --save-dev
```

You also need to have `[bower](http://bower.io/)` installed globally.

### NPM scripts

```json
"test": "gulp test --gulpfile node_modules/better-dom-boilerplate/gulpfile.js --cwd .",
"start": "gulp dev --gulpfile node_modules/better-dom-boilerplate/gulpfile.js --cwd .",
"release": "gulp release --gulpfile node_modules/better-dom-boilerplate/gulpfile.js --cwd .",
"gh-pages": "gulp gh-pages --gulpfile node_modules/better-dom-boilerplate/gulpfile.js --cwd ."
```

NOTE: before running `npm run release` you have to change `"version"` field in `package.json` to the disared value.

### Customization
Use property `autoprefixer` in `package.json` to override list of supported browsers. Default value:

```json
"autoprefixer": [
  "last 2 versions", "android 2.3", "IE >= 8", "Opera 12.1"
]
```

Property `karmaFiles` can be used to specify list of dependencies for testing:

```json
"karmaFiles": [
  "file1.js",
  "file2.js",
  ...
]
```

`"build/*.js"`, `"test/*.spec.js"` are ALWAYS included.

### Directory structure
```
├── project/
│   ├── .gitignore
│   ├── .travis.yml
│   ├── README.md
│   ├── build
│   │   ├── project.js
│   ├── dist
│   │   ├── project.js
│   ├── i18n
│   │   ├── project.{lang1}.js
│   │   ├── project.{lang2}.js
│   │   ├── ...
│   ├── src
│   │   ├── project.js
│   │   ├── project.css
│   │   ├── ...
│   ├── test
│   │   ├── {topic1}.spec.js
│   │   ├── {topic2}.spec.js
│   │   ├── ...
```