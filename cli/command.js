#!/usr/bin/env node

const argv = require('yargs').argv,
      _ = require('lodash'),
      path = require('path'),
      filePath = path.join(__dirname, `${argv.model}`),
      dbPath = path.join(__dirname, `${argv.db}`),
      inserts = Number(argv.inserts),
      clean = argv.clean,
      { modelToArray, sendToJson } = require('./../lib');

let attrs = modelToArray(filePath);

sendToJson(attrs, inserts, clean, dbPath);