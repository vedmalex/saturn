#!/usr/bin/env node

var argv = require('yargs').argv;
var command = argv._.shift();

var path = require('path');
// Map remaining arguments to paths inside the app
var files = argv._.map(function(file) {
  return path.join(process.cwd(), file);
});

// XXX: figure out the best way to hook up this dotenv / config
require('dotenv').config({ silent: true });
if (command === 'build' || command === 'start-prod' ||
    command === 'start-prod-api' || command === 'start') {
  process.env.NODE_ENV = 'production';
} else {
  process.env.NODE_ENV = 'development';
}

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

function doSpawn(command, options) {
  var spawn = require('child_process').spawn;
  var child = spawn(command, options);
  child.stdout.on('data', function(d) { console.log(d.toString()); });
  child.stderr.on('data', function(d) { console.err(d.toString()); });

}

function run() {
  require('../babel/server.babel'); // babel registration (runtime transpilation for node)

  if (command === 'dev') {
    var saturn = path.resolve(__dirname, './saturn.js');
    var startDev = saturn + ' start-dev ' + argv.appServer;
    var startDevApi = saturn + ' start-dev-api ' + argv.apiServer;
    var watchClient = saturn + ' watch-client ' + argv.appClient;

    var concurrently = path.resolve(__dirname, '../vendor/concurrently.js');
    doSpawn(concurrently, ['--kill-others', startDev, startDevApi, watchClient]);
  } else if (command === 'start') {
    var saturn = path.resolve(__dirname, './saturn.js');
    var startProd = saturn + ' start-prod ' + argv.appServer;
    var startProdApi = saturn + ' start-prod-api ' + argv.apiServer;

    var concurrently = path.resolve(__dirname, '../vendor/concurrently.js');
    doSpawn(concurrently, ['--kill-others', startProd, startProdApi]);
  } else if (command === 'watch-client') {
    require('../server/webpack-dev')(files[0]);
  } else if (command === 'build') {
    require('../server/webpack-build')(files[0]);
  } else if (command === 'start-dev' || command == 'start-prod') {
    /**
     * Define isomorphic constants. XXX: where should these go
     */
    global.__CLIENT__ = false;
    global.__SERVER__ = true;
    global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
    global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

    // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
    var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
    global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
      .development(__DEVELOPMENT__)
      .server(process.cwd(), function() {
        require(files[0]);
      });
  } else if (command === 'start-dev-api' || command === 'start-prod-api') {
      require(files[0]);
  }
}
