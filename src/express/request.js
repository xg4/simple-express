const url = require('url')

module.exports = function(req, res, next) {
  const { pathname, query } = url.parse(req.url, true)
  req.path = pathname
  req.query = query
  req.hostname = req.headers.host.split(':')[0]
  next()
}
