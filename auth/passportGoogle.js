const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')
const config = require('config')
const jwt = require('jsonwebtoken')

// const GOOGLE_CALLBACK_URL = 'http://5-180-180-221.cloud-xip.com:5000/api/v1/auth/google/callback'
const GOOGLE_CALLBACK_URL = 'http://localhost:5000/api/v1/auth/google/callback'

passport.use(new GoogleStrategy({
  clientID: config.get('GOOGLE_CLIENT_ID'),
  clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
  callbackURL: GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
  scope: ['profile', 'email'],
}, async (req, accessToken, refreshToken, profile, cb) => {
  try {
    const email = profile.emails[0].value
    const name = profile.name.givenName
    const user = await User.findOne({email})

    if (user) {
      const token = jwt.sign(
        {userId: user.id},
        config.jwtSecret,
        {expiresIn: '1h'}
      )
      const userDB = {token, UserId: user.id, name: user.name}
      req.user = userDB
      return cb(null, userDB)
    } else {
      const user = new User({name, email})
      await user.save()
      const token = jwt.sign(
        {userId: user.id},
        config.jwtSecret,
        {expiresIn: '1h'}
      )
      const userDB = {token, UserId: user.id, name: user.name}
      req.user = userDB
      return cb(null, userDB)
    }
  } catch (error) {
    cb(error)
  }
}))

passport.serializeUser((user, cb) => {
  console.log('Serializing user:', user)
  cb(null, user)
})

passport.deserializeUser(function(user, cb) {
  cb(null, user)
})