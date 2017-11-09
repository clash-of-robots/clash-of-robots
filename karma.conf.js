/** @format */

const customLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '61',
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '52',
  },
  /*sl_ios_safari: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: '11.0'
  },*/
  /*sl_ios_android: {
    base: 'SauceLabs',
    browserName: 'Android',
    platformVersion: '7.1'
  },*/
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'Windows 10',
  },
};

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'karma-typescript'],
    singleRun: true,
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      { pattern: 'src/**/*.ts' }, // *.tsx for React Jsx
      { pattern: 'test/**/*.ts' },
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript'], // *.tsx for React Jsx
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
    },
    sauceLabs: {
      testName: 'Clash of Robots',
    },
    reporters: ['progress', 'saucelabs', 'karma-typescript'],
    //browsers: ['ChromeHeadless'],
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
  });
};
