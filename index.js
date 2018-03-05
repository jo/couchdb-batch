var _ = require('highland')

module.exports = function (options) {
  options = options || {}
  
  var batchSize = options.batchSize || 256
  var batchTime = options.batchTime || 1000

  return _.pipeline(
    _.batchWithTimeOrCount(batchTime, batchSize),
    _.map(function (docs) {
      return {
        docs: docs
      }
    })
  )
}
