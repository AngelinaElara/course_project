const {Router} = require('express')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()

router.post(
  '/register',
    [
      check('email', 'Invalid email').isEmail()
    ],
   async (req ,res) => {
  try {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message : 'Incorrect registration data'
      })
    }

    const {name, email, password} = req.body

    const candidate = await User.findOne({email: email})

    if (candidate) {
      return res.status(400).json({message: 'User with this email exists'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({name, email, password: hashedPassword})

    await user.save()

    const token = jwt.sign(
      {userId: user.id}, 
      config.jwtSecret,
      {expiresIn: '1h'}
    )

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 86400, 
    })

    res.json({UserId: user.id, name, role: user.role})
  } catch (e) {
    console.log(e)
    res.status(500).json({message: 'Oooops. Something went wrong...'})
  }
})

router.post('/login', 
  [
    check('email', 'Enter correct email').normalizeEmail().isEmail(),
    check('password', 'Enter correct password').exists()
  ],
   async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await User.findOne({email})
    
    if(!user) {
      return res.status(400).json({message: 'User was not find. You need to register.'})
    }

    const isMatch = await bcrypt.compare(password, user.password) 
    if(!isMatch) {
      return res.status(400).json({message: 'Invalid password'})
    }

    const token = jwt.sign(
      {userId: user.id},
      config.jwtSecret,
      {expiresIn: '1h'}
    )

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 86400, 
    })
    return res.status(200).json({UserId: user.id, name: user.name, role: user.role})
  } catch (e) {
    console.log(e)
    res.status(500).json({message: 'Something went wrong!'})
  }
})

router.get('/logout', function(req, res, next) {
  try {
    req.session = null 
    res.clearCookie('session', 'jwt')
    res.end()
    req.logout(function(err) {
      if (err) { return next(err) }
      console.log(req.logout)
      res.redirect('/')
    })
  } catch (e) {
    console.log(e)
  }
}) 

module.exports = router