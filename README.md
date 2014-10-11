# better-dom-boilerplate
> Quick starter for a better-dom plugin
### Dependencies

```json
  "devDependencies": {
    "better-dom-boilerplate": "git://github.com/chemerisuk/better-dom-boilerplate.git"
  }
```

### Scripts

```json
  "scripts": {
    "test": "gulp test --gulpfile node_modules/better-dom-boilerplate/gulpfile.js --cwd .",
    "start": "gulp dev --gulpfile node_modules/better-dom-boilerplate/gulpfile.js --cwd ."
  }
```

### Directory structure:
```
├── project/
│   ├── .gitignore
│   ├── .jshintrc
│   ├── .travis.yml
│   ├── LICENSE.txt
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
│   ├── src
│   │   ├── project.js
│   │   ├── project.css
│   ├── test
│   │   ├── project.{topic1}.spec.js
│   │   ├── project.{topic2}.spec.js
│   │   ├── ...
```