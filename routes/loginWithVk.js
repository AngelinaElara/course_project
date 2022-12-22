const express = require('express')
const passport = require('passport')

const router = express.Router()

const successLoginUrl = 'http://5-180-180-221.cloud-xip.com:5000/login/success'
const errorLoginUrl = 'http://5-180-180-221.cloud-xip.com:5000/login/error'

const isLogin = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next()
  }
}

router.get(
  '/login/vk',
  passport.authenticate('vkontakte', {
    scope: ['email', 'profile'],
  })
)

router.get(
  '/vk/callback',
  passport.authenticate('vkontakte', {
    failureMessage: 'Cannot login to vkontakte, please try again later!',
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
  }),
  (req, res) => {
    console.log('User: ', req.user)
    res.send('Thank you for signing in!')
  }
)

router.get('/auth/user', isLogin, async (req, res) => {
  if(req.user) {
    res.json(req.user)
  }
})

module.exports = router