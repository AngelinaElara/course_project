const {Router} = require('express')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/GoogleUser')

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const {email, name} = req.body

    const user = await User.findOne({email})

    if (user) {
      const token = jwt.sign(
        {userId: user.id},
        config.jwtSecret,
        {expiresIn: '1h'}
      )

      res.json({token, UserId: user.id, name})
    } else {
      const user = new User({name, email})

      await user.save()

      const token = jwt.sign(
        {userId: user.id},
        config.jwtSecret,
        {expiresIn: '1h'}
      )

      res.json({token, UserId: user.id, name})
    }

  } catch (error) {
    console.log(error)
  }
})

module.exports = router