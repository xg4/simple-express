const http = require('http')
const url = require('url')

class Application {
  constructor() {
    this.routes = []

    http.METHODS.forEach(method => {
      method = method.toLowerCase()
      this[method] = function(path, handler) {
        const layer = {
          method,
          path,
          handler
        }
        this.routes.push(layer)
      }
    })
  }

  handler(req, res) {
    const reqMethod = req.method.toLowerCase()
    const { pathname: reqPath } = url.parse(req.url, true)
    for (let i = 0; i < this.routes.length; i++) {
      const { method, path, handler } = this.routes[i]
      if (
        (reqMethod === method || method === 'all') &&
        (reqPath === path || path === '*')
      ) {
        handler(req, res)
      }
    }
    res.end(`Cannot ${reqMethod.toUpperCase()} ${reqPath}`)
  }

  all(path, handler) {
    const layer = {
      method: 'all',
      path,
      handler
    }
    this.routes.push(layer)
  }

  listen(...args) {
    return http.createServer(this.handler.bind(this)).listen(...args)
  }
}

module.exports = function express() {
  return new Application()
}
