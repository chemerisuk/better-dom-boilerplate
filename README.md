# better-dom-boilerplate
> Quick starter for a better-dom plugin

### Initial steps

```
$ git clone your_plugin_repo.git && cd your_plugin_repo
$ npm init
```

When it asks for the test command reply with:

```
gulp test --gulpfile node_modules/better-dom-boilerplate/gulpfile.js --cwd .
```

### Dependencies

```
$ npm install git://github.com/chemerisuk/better-dom-boilerplate.git --save-dev
```

### NPM scripts

```json
"test": "gulp test --gulpfile node_modules/better-dom-boilerplate/gulpfile.js --cwd .",
"start": "gulp dev --gulpfile node_modules/better-dom-boilerplate/gulpfile.js --cwd ."
```

### Customization
Use property `autoprefixer` in `package.json` to override list of supported browsers. Default value:

```json
"autoprefixer": [
  "last 2 versions", "android 2.3", "IE >= 8", "Opera 12.1"
]
```

### Directory structure
```
├── project/
│   ├── .gitignore
│   ├── .jshintrc
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