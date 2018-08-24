#!/usr/bin/env node

const yargs = require('yargs');
const path = require('path');
const {
  modelToArray,
  sendToJson, clearFile,
  makeRelationship
} = require('./../lib');
const pkg = require('./../package.json');


const argv = yargs
  .config('config')
  .usage('$0 [options] <source>')
  .options({
    json: {
      alias: 'j',
      description: 'Set json path',
      default: 'db.json'
    },
    inserts: {
      alias: 'i',
      description: 'Set the number of random inserts',
      default: 5
    },
    clean: {
      alias: 'c',
      description: 'Clean json before generating'
    },
    replace: {
      alias: 'r',
      description: 'Replace objects already generated from model.'
    }
  })
  .boolean('clean')
  .help('help')
  .alias('help', 'h')
  .version(pkg.version)
  .alias('version', 'v')
  .example('$0 user.model.ts --json=db.json --inserts=5 --clean', '')
  .example('$0 user.model.ts --json=db.json --inserts=3', '')
  .epilog('https://github.com/angular-labs/typescript-model-to-json-server')
  .require(1, 'Missing <model> argument')
  .argv

const jsonPath = path.join(process.cwd(), `${argv.json}`);
const inserts = Number(argv.inserts);
const replace = argv.replace;
const clean = argv.clean;

if (clean) clearFile(jsonPath);

for(let i = 0; i < argv._.length; i++) {
  const modelPath = path.join(process.cwd(), `${argv._[i]}`);

  let attrs = modelToArray(modelPath);

  sendToJson(attrs, inserts, replace, jsonPath, argv._[i]);
}

makeRelationship(jsonPath);
