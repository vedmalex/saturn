import path from 'path';
import program from 'commander';
import Mocha from 'mocha';

import { version as saturnVersion } from '../package.json';
import { description as saturnDescription } from '../package.json';
import appRootDir from 'app-root-dir'

// Determine the project root based on package.json and node_modules
const projectRoot = appRootDir.get();
const saturnRoot = path.resolve(__dirname, '..');
const saturn = path.resolve(saturnRoot, './bin/saturn.js');

// Get the saturn configuration out of the project root and merge it with the defaults
// TODO Set defaults
const defaultConf = {
};
const projectConf = Object.assign({},
  defaultConf,
  require(path.resolve(projectRoot, './package.json')).saturn
);

// TODO Import concurrently as module
const concurrently = path.resolve(saturnRoot, './vendor/concurrently.js');

function doSpawn(command, args, options) {
  var child = spawn(command, args, Object.assign({
    stdio: ['ignore', process.stdout, process.stderr]
  }, options));
}

program
  .version(saturnVersion)
  .description(saturnDescription);

program
  .command('create [path]')
  .description('Create a simple Saturn app.')
  .option('-l, --list', 'List available Saturn app examples.')
  .option('-e, --example <example>', 'Create your app using the provided example.')
  .action((path, options) => {
    if (options.list) {
      console.log('Show list of starter kits');
    } else if (path) {
      //doSpawn(concurrently, ['--kill-others', startProd, startProdApi]);
      console.log('Create %s', path);
      // If example set, use that for the app's code base.
      if (options.example) {
        console.log('Using this example %s', options.example);
      }
    } else {
      // Since the path argument in the create command is optional if an option is set
      // we need to handle error checking ourselves
      console.error(`No command or options provided.
saturn create --help to view available commands and options.`);
    }
  });

program
  .command('test')
  .description('Run the Mocha test runner. Define tests in files named `*-test[s]-*.js`.')
  .action(() => {
    const mocha = new Mocha({});

    glob(`${appRoot}/**/*.test?(s).js`, (err, files) => {
      files.filter(f => !f.match('node_modules')).forEach(f => mocha.addFile(f));

      // Run the tests.
      mocha.run(function(failures){
        process.on('exit', function () {
          process.exit(failures);  // Exit with non-zero status if there were failures.
        });
      });
    });
  });

program
  .command('start [server]')
  .description('Runs the two production servers concurrently or runs the provided server.')
  .option('-l, --location <path>', 'Start the production server at the provided path.')
  .action((server, options) => {
    // If a server is not provided, start all the development servers
    if (!server) {
      console.log('Starting the production servers...');
    } else {
      // Start the provided server
    }
  });

program
  .command('dev [server]')
  .description('Runs the three development servers concurrently or runs the provided server.')
  .option('-l, --location <path>', 'Start the development server at the provided path.')
  .action((server, options) => {
    // If a server is not provided, start all the development servers
    if (!server) {
      console.log('Starting the development servers...');
    } else {
      // Start the provided server
    }
  });

  program
    .command('deploy')
    .description('Experimental Command - Deploys to Galaxy. Requires the deploy-node branch of Meteor checked out and available as curmeteor.')
    .action(() => {
      console.log('Deploy to Galaxy');
    });


program.parse(process.argv);

// Show help if no arguments were provided
if (program.args && !program.args.length) {
    program.help();
}
