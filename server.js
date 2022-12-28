const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieSession = require('cookie-session')

require('./auth/passport')
require('./auth/passportGoogle')
require('./auth/passportVk')

const apiGoogle = require('./routes/loginWithGoogle')
const apiVk = require('./routes/loginWithVk')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.json({extended: true}))
app.use('/auth', require('./routes/auth.routes'))
app.use('/review', require('./routes/review.routes'))
app.use('/users', require('./routes/user.routes'))
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cors({ origin: 'http://5-180-180-221.cloud-xip.com:5000', credentials: true }))
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.get('cookieKey')],
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use('/api/v1', apiGoogle)
app.use('/api', apiVk)

if(process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

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