import path from 'path';
import yargs from 'yargs';
import { spawn } from 'child_process';

import webpackDev from '../server/webpack-dev';
import webpackBuild from '../server/webpack-build';

// XXX: is there a better way to do this? Can it come in via argv?
const appRoot = process.cwd();
const saturnRoot = __dirname;
var saturn = path.resolve(saturnRoot, './saturn.js');
const concurrently = path.resolve(saturnRoot, '../vendor/concurrently.js');

function appFile(filepath) {
  return path.resolve(appRoot, filepath);
}

function prepare(_argv) {
  const argv = yargs(_argv.slice(2))
    .pkgConf('saturn', appRoot)
    .argv;

  // Map remaining arguments to paths inside the app
  const command = argv._.shift();
  const files = argv._.map(appFile);

  return {
    command,
    argv,
    files,
  };
}

function doSpawn(command, options) {
  var child = spawn(command, options);
  child.stdout.on('data', function(d) { console.log(d.toString()); });
  child.stderr.on('data', function(d) { console.err(d.toString()); });
}

export function dev(_argv) {
  const { argv } = prepare(_argv);

  var startDev = saturn + ' start-dev ' + argv.appServer;
  var startDevApi = saturn + ' start-dev-api ' + argv.apiServer;
  var watchClient = saturn + ' watch-client ' + argv.appClient;

  doSpawn(concurrently, ['--kill-others', startDev, startDevApi, watchClient]);
};

export function start(_argv) {
  const { argv } = prepare(_argv);

  var startProd = saturn + ' start-prod ' + argv.appServer;
  var startProdApi = saturn + ' start-prod-api ' + argv.apiServer;

  doSpawn(concurrently, ['--kill-others', startProd, startProdApi]);
};

export function watchClient(_argv) {
  const { files, argv } = prepare(_argv);
  webpackDev(files.shift() || appFile(argv.appClient));
};

export function build(_argv) {
  const { files, argv } = prepare(_argv);
  webpackBuild(files.shift() || appFile(argv.appClient));
};

export function startApi(_argv) {
  const { files, argv } = prepare(_argv);
  require(files.shift() || appFile(argv.apiServer));
};

export { startApi as startDevApi, startApi as startProdApi };

function startApp(_argv) {
  const { files, argv } = prepare(_argv);
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
}

export { startApp as startDev, startApp as startProd };
