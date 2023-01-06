const {Router} = require('express')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const crypto = require('node:crypto')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()
const nodemailer = require('nodemailer')
const path = require('path')

let transporter = nodemailer.createTransport({
  host: config.get('HOST'),
  port: config.get('PORT'),
  secure: false,
  auth: {
    user: config.get('USER'),
    pass: config.get('PASSWORD')
  },
  tls: {rejectUnauthorized: false}
})

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
    const emailToken = crypto.randomBytes(64).toString('hex')
    const user = new User({name, email, password: hashedPassword, emailToken})

    await user.save()

    let mailDetails = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your Email',
      html: `
        <h1>${name}! Thank you for your registration</h1>
        <p>Please confirm your Email</p>
        <a href='http://5-180-180-221.cloud-xip.com:5000/verify?token=${emailToken}/'>Verify your Email</a>
      `
    }

    transporter.sendMail(mailDetails, function(error, info){
      if (error) {
      console.log(error)
      } else {
      console.log('Message sended ' + info.response)
      }
    })
    res.status(200).json({message: 'A confirmation email has been sent to your email'})
  } catch (e) {
    console.log(e)
    res.status(500).json({message: 'Register error'})
  }
})

router.post('/verify', async (req, res) => {
  try {
    const {token} = req.body
    const newToken = token.substring(0, token.length - 1)
    const user = await User.findOne({emailToken: newToken})
    if(user) {
      user.emailToken = null
      user.confirmed = true
      await user.save()
      const jwtToken = jwt.sign(
        {userId: user.id}, 
        config.jwtSecret,
        {expiresIn: '1h'}
      )
      res.cookie('jwt', jwtToken, { 
        httpOnly: true, 
        maxAge: 86400, 
      })
      res.json({UserId: user.id, name: user.name, role: user.role})
    } else {
      return res.status(400).json({message: 'Confirmed error'})
    }
  } catch(error) {
    console.log(error)
  }
})

router.post('/login', 
  [
    check('email', 'Enter correct email').normalizeEmail({'gmail_remove_dots': false }).isEmail(),
    check('password', 'Enter correct password').exists()
  ],
   async (req, res) => {
  try {
    const {email, password} = req.body
    console.log(email)
    const user = await User.findOne({email})
    console.log(user)
    
    if(!user) {
      return res.status(400).json({message: 'User was not find. You need to register.'})
    }

    if(!user.confirmed) {
      return res.status(400).json({message: 'You have not verified your email'})
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