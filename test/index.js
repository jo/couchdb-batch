var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn
var _ = require('highland')
var test = require('tap').test

var api = require('..')
var docs = [
  { foo: 'bar1' },
  { foo: 'bar2' },
  { foo: 'bar3' },
  { foo: 'bar4' },
  { foo: 'bar5' }
]
var fixturePath = path.resolve(path.join(__dirname, 'fixtures/docs.jsonl'))
var cliPath = path.resolve(path.join(__dirname, '../cli.js'))

test('api', function (t) {
  var i = 0
  _(docs)
    .pipe(api({ batchSize: 2 }))
    .on('data', function (data) {
      t.ok(data.docs)
      t.equal(data.docs.length, i == 2 ? 1 : 2)
      i++
    })
    .on('end', t.end)
})

test('cli', function (t) {
  var cli = spawn(cliPath, ['-n', 2])
  var expected = [
    '{"docs":[{"foo":"bar1"},{"foo":"bar2"}]}',
    '{"docs":[{"foo":"bar3"},{"foo":"bar4"}]}',
    '{"docs":[{"foo":"bar5"}]}',
    ''
  ].join('\n')
  var output = new Buffer('')
  cli.stdout.on('data', function (data) {
    output = Buffer.concat([output, data])
  })
  cli.on('close', function () {
    t.equal(output.toString(), expected)
    t.end()
  })
  fs.createReadStream(fixturePath).pipe(cli.stdin)
})
