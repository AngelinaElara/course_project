const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

app.use(express.json({extended: true}))

app.use('/auth', require('./routes/auth.routes'))
app.use('/google/auth', require('./routes/googleAuth.routes'))
app.use('/review', require('./routes/review.routes'))

const PORT = 5000
 
async function start() {
  try { 
    await mongoose.connect(config.get('mongoUrl'), {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => console.log(`Server OK - ${PORT}`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()  