/* eslint-disable */
Package.describe({
  name: 'pushplaybang:boundary',
  version: '0.0.7',
  summary: 'flexible isomorphic pagination package for meteor',
  git: 'https://github.com/Pushplaybang/boundary',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('blaze-html-templates');
  api.use('es5-shim');
  api.use('ecmascript');
  api.use('reactive-dict');
  api.addFiles('lib/server.js', 'server');
  api.addFiles('lib/Boundary.js', 'client');
  api.addFiles('client/Boundary.css', 'client');
  api.addFiles('client/Boundary.html', 'client');
  api.addFiles('client/helpers.js', 'client');
  api.export('Boundary', ['client', 'server']);
});
