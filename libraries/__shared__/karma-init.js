/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require('path');

module.exports = function(config, opts) {
  config.set({
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-sourcemap-loader',
      'karma-webpack',
      require(path.resolve(__dirname, './karma-plugins/karma-mocha')),
      require(path.resolve(__dirname, './karma-plugins/karma-custom-html-reporter')),
      require(path.resolve(__dirname, './karma-plugins/karma-custom-json-reporter'))
    ],
    browsers: ['ChromeHeadless', 'FirefoxHeadless'], // run in Chrome and Firefox
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [ '-headless' ],
        displayName: 'FirefoxHeadless'
      },
    },
    singleRun: true, // set this to false to leave the browser open
    frameworks: ['mocha'], // use the mocha test framework
    files: [
      { pattern: '../../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js', watched: false },
      { pattern: '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js', watched: false },
      'tests.webpack.js' // just load this file
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap'] // preprocess with webpack and our sourcemap loader
    },
    reporters: ['dots', 'custom-html', 'custom-json'], // report results in these formats
    htmlReporter: {
      outputFile: path.resolve(opts.libraryPath, './results/results.html'),
      pageTitle: `${opts.libraryName} + Custom Elements`,
      groupSuites: true,
      useCompactStyle: true
    },
    jsonResultReporter: {
      outputFile: path.resolve(opts.libraryPath, './results/results.json')
    },
    webpack: { // kind of a copy of your webpack config
      // devtool: 'inline-source-map', // just do inline source maps instead of the default
      resolve: {
        modules: [
          path.resolve(__dirname, './webcomponents/src'),
          path.resolve(opts.libraryPath, './node_modules'),
          path.resolve(opts.libraryPath, '../../node_modules')
        ]
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          }
        ]
      }
    },
    webpackServer: {
      // noInfo: true // please don't spam the console when running in karma!
    }
  });
};