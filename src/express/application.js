const http = require('http')
const url = require('url')

module.exports = class Application {
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
    let index = 0
    const next = err => {
      if (index === this.routes.length) {
        res.end(`Cannot ${reqMethod.toUpperCase()} ${reqPath}`)
        return
      }
      const { method, path, handler } = this.routes[index++]

      // err
      if (err) {
        if (handler.length === 4) {
          handler(err, req, res, next)
        } else {
          next(err)
        }
        return
      }
      if (handler.length === 4) {
        handler(err, req, res, next)
        return
      }

      // middleware
      if (method === 'middleware') {
        if (reqPath.startsWith(path)) {
          handler(req, res, next)
        } else {
          next()
        }
        return
      }

      // router
      if (
        (reqMethod === method || method === 'all') &&
        (reqPath === path || path === '*')
      ) {
        handler(req, res)
      } else {
        next()
      }
    }

    next()
  }

  use(path, handler) {
    if (typeof handler !== 'function') {
      handler = path
      path = '/'
    }

    const layer = {
      method: 'middleware',
      path,
      handler
    }

    this.routes.push(layer)
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
