# couchdb-bulk
Batches a stream of single documents into bulk docs jsons.

## Installation
```sh
npm install -g couchdb-bulk
```

## API Usage
```js
var bulk = require('couchdb-bulk')

process.stdin
  .pipe(bulk({ batchSize: 3, batchTime: 100 }))
  .pipe(process.stdout)
```

## CLI Usage
```sh
couchdb-bulk docs.jsonl
```

## Tests
```sh
npm test
```
