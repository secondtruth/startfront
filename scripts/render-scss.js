'use strict';
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const postcss = require('postcss');
const sass = require('sass');
const sh = require('shelljs');

const mainSourceFile = 'styles.scss';
const sourceDir = upath.resolve(__dirname, '../src/scss');
const destFile = 'styles.css';
const destDir = upath.resolve(__dirname, '../dist/css');

module.exports = function renderSCSS() {
    const results = sass.compileString(entryPoint, {
        loadPaths: [
            sourceDir,
            upath.resolve(__dirname, '../node_modules')
        ]
    });

    if (!sh.test('-e', destDir)) {
        sh.mkdir('-p', destDir);
    }

    postcss([autoprefixer]).process(results.css, {from: destFile, to: destFile}).then(processed => {
        processed.warnings().forEach(warn => {
            console.warn(warn.toString())
        })
        fs.writeFileSync(upath.join(destDir, destFile), processed.css.toString());
    })
};

const entryPoint = `/*!
 * ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
 * Copyright 2022-${new Date().getFullYear()} ${packageJSON.author}
 * Licensed under ${packageJSON.license} (https://github.com/secondtruth/${packageJSON.name}/blob/main/LICENSE.md)
 */
@import "${mainSourceFile}"
`
