#!/usr/bin/env node

var argv = require('yargs').argv;

var command = argv._.shift();

var path = require('path');
// Map remaining arguments to paths inside the app
var files = argv._.map(function(file) {
  return path.join(process.cwd(), file);
});

require('../babel/server.babel'); // babel registration (runtime transpilation for node)
require('dotenv').config({ silent: true });

if (command === 'dev') {
  var spawn = require('child_process').spawn;

  var saturn = path.resolve(__dirname, './saturn.js');
  var startDev = saturn + ' start-dev ' + argv.appServer;
  var startDevApi = saturn + ' start-dev-api ' + argv.apiServer;
  var watchClient = saturn + ' watch-client ' + argv.appClient;

  var concurrently = path.resolve(__dirname, '../vendor/concurrently.js');
  var child = spawn(concurrently, ['--kill-others', startDev, startDevApi, watchClient]);
  child.stdout.on('data', function(d) { console.log(d.toString()); });
  child.stderr.on('data', function(d) { console.err(d.toString()); });

} else if (command === 'watch-client') {
  require('../server/webpack-dev')(files[0]);
} else {
  if (process.env.NODE_ENV !== 'production') {
    if (require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json$)/i
    })) {
      run();
    }
  } else {
    run();
  }

  function run() {

    if (command === 'start-dev') {
      /**
       * Define isomorphic constants.
       */
      global.__CLIENT__ = false;
      global.__SERVER__ = true;
      global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
      global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

      // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
      var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
      global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
        .development(__DEVELOPMENT__)
        .server(path.resolve(__dirname, '..'), function() {
          require(files[0]);
        });
    } else if (command === 'start-dev-api') {
      require(files[0]);
    }
  }
}
