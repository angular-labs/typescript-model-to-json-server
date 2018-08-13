#!/usr/bin/env node

const yargs = require('yargs');
const path = require('path');
const { modelToArray, sendToJson } = require('./../lib');
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

const modelPath = path.join(__dirname, `${argv._[0]}`);
const jsonPath = path.join(__dirname, `${argv.json}`);
const inserts = Number(argv.inserts);
const clean = argv.clean;

let attrs = modelToArray(modelPath);

sendToJson(attrs, inserts, clean, jsonPath, argv._[0]);