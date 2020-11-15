// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const isCI = process.env.CI === 'true';

module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/helipopper-playground'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });

  if (isCI) {
    config.set({
      customLaunchers: {
        ChromeHeadlessCustom: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox', '--disable-gpu']
        }
      }
    });
  }
};
