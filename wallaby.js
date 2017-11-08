module.exports = function (w) {

  return {
    files: [
      'src/**/*.ts',
      'test/utils/**/*.ts'
    ],

    tests: [
      'test/*.spec.ts'
    ],

    preprocessors: {
      '**/*.js': file => require('babel-core').transform(
                                   file.content,
                                   {sourceMap: true, presets: ['env']})
    },

    testFramework: 'mocha',

    env: {
      type: 'node'
    },

    setup: function () {
      require('babel-polyfill');
    }
  };
};
