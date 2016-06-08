#!/usr/bin/env node

var command = process.argv[2];
var file = process.argv[3];
var path = require('path');
var pathToFile = path.join(process.cwd(), file);

require('../babel/server.babel'); // babel registration (runtime transpilation for node)
require('dotenv').config({ silent: true });

if (command === 'watch-client') {
  require('../server/webpack-dev')(pathToFile);
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
          require(pathToFile);
        });
    } else if (command === 'start-dev-api') {
      require(pathToFile);
    }
  }
}
