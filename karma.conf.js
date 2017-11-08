/** @format */

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'karma-typescript'],
    singleRun: true,
    files: [
      { pattern: 'src/**/*.ts' }, // *.tsx for React Jsx
      { pattern: 'test/**/*.ts' },
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript'], // *.tsx for React Jsx
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['ChromeHeadless'],
  });
};
