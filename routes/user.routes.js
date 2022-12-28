const {Router} = require('express')
const User = require('../models/User')
const router = Router()

router.get('/', async(req, res) => {
  try {
    const findUsers = await User.find({role: 'user'})
    res.json(findUsers)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router