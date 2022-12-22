const express = require('express')
const passport = require('passport')
const { isUserAuthenticated } = require('../middlewares/auth')

const router = express.Router()

const successLoginUrl = 'http://5-180-180-221.cloud-xip.com:5000/login/success'
const errorLoginUrl = 'http://5-180-180-221.cloud-xip.com:5000/login/error'

router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureMessage: 'Cannot login to Google, please try again later!',
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
  }),
  (req, res) => {
    console.log('User: ', req.user)
    res.send('Thank you for signing in!')
  }
)

router.get('/auth/user', isUserAuthenticated, async (req, res) => {
  if(req.user) {
    res.json(req.user)
  }
})

module.exports = router