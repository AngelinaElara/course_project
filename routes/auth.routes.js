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
    console.log(req.body)
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

    res.json({token, UserId: user.id, name})
  } catch (e) {
    res.status(500).json({message: 'Oooops. Something went wrong...'})
  }
})

router.post(
  '/login',
  [
    check('email', 'Enter correct email').normalizeEmail().isEmail(),
    check('password', 'Enter correct password').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message : 'Invalid login details'
      })
    }
    
    const {email, password} = req.body
    console.log(req.body)

    const user = await User.findOne({email})

    if(!user) {
      return res.result(400).json({message: 'User was not find'})
    }

    const candidate = await User.findOne({email: email})

    if (!candidate) {
      return res.status(400).json({message: 'You account was disabled'})
    }

    const isMatch = bcrypt.compare(password, user.password) 

    if(!isMatch) {
      return res.status(400).json({message: 'Invalid password'})
    }
 
    const token = jwt.sign(
      {userId: user.id},
      config.jwtSecret,
      {expiresIn: '1h'}
    )

    res.json({token, UserId: user.id, name})
  } catch (e) {
    res.status(500).json({message: 'Oooops. Something went wrong...'})
  }
})

module.exports = router