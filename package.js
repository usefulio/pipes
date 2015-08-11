Package.describe({
  name: 'usefulio:pipes',
  version: '0.0.1',
  summary: 'Compos-able processing pipelines',
  git: 'https://github.com/usefulio/pipes',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('underscore');

  api.addFiles('pipes.js','server');
  api.export('Pipes');
});

Package.onTest(function(api) {
  api.use('tinytest');

  api.use('underscore');

  api.use('usefulio:pipes');
  api.addFiles('pipes-tests.js','server');
});