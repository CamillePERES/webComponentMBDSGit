const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.static('public'))

app.use('/assets', express.static(__dirname + '/assets'))
app.use('/dist', express.static(__dirname + '/dist'))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



