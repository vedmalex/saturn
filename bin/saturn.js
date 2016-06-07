#!/usr/bin/env node

var command = process.argv[2];
var serverFile = process.argv[3];

require('dotenv').config({ silent: true });

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
  require('../babel/server.babel'); // babel registration (runtime transpilation for node)

  if (command === 'start-dev-api') {
    var path = require('path');
    require(path.join(process.cwd(), serverFile));
  }
}
