const express = require('./express')

const app = express()

app.use(function(req, res, next) {
  console.log('middleware')
  next()
})

app.use('/error', function(req, res, next) {
  console.log('middleware - error')
  next('error')
})

app.get('/', (req, res) => {
  console.log(req.path)
  console.log(req.query)
  console.log(req.hostname)
  res.end('hello express')
})

app.get('/hello', (req, res) => {
  res.end('hello world')
})

app.use(function(err, req, res, next) {
  console.log(err)
  next()
})

app.listen(3000, function() {
  console.log('server is running')
})
