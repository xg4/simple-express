const express = require('./express')

const app = express()

app.get('/', (req, res) => {
  res.end('hello express')
})

app.get('/hello', (req, res) => {
  res.end('hello world')
})

app.listen(3000, function() {
  console.log('server is running')
})
