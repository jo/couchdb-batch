#!/usr/bin/env node

const fs = require('fs')
const _ = require('highland')
const minimist = require('minimist')

const pkg = require('./package.json')
const bulk = require('.')

const options = minimist(process.argv.slice(2), {
  string: ['batchsize', 'batchtime'],
  alias: {
    n: 'batchsize',
    t: 'batchtime'
  }
})

const arg = options._[0]
const inStream = (!process.stdin.isTTY || arg === '-' || !arg)
  ? process.stdin
  : fs.createReadStream(arg)

const bulkOptions = {
  batchSize: options.batchsize && parseInt(options.batchsize, 10),
  batchTime: options.batchtime && parseInt(options.batchtime, 10)
}

_(inStream)
  .split()
  .filter(function (line) {
    return line
  })
  .map(function (line) {
    return JSON.parse(line)
  })
  .pipe(bulk(bulkOptions))
  .map(function (data) {
    return JSON.stringify(data) + '\n'
  })
  .pipe(process.stdout)
