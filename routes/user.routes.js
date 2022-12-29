const {Router} = require('express')
const User = require('../models/User')
const Review = require('../models/Review')
const router = Router()
const mongoose = require('mongoose')

router.get('/', async(req, res) => {
  try {
    const findUsers = await User.find({role: 'user'})
    res.json(findUsers)
  } catch (error) {
    console.log(error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params || {}
    const currentUser = await User.findById(id)
    const blocked = currentUser.blocked
    res.json({blocked})
  } catch (error) {
    console.log(error) 
  }
})

router.patch('/changeblock', async(req, res) => {
  console.log(req.body)
  try {
    const {blocked, id} = req.body
    const upId = id.map(i => new mongoose.Types.ObjectId(i) ) 
    await User.updateMany({_id: {$in: upId}}, {$set: {blocked}})
  } catch (error) {
    console.log(error)
  }
})

router.delete('/delete', async (req, res) => {
  try {
    const {id} = req.body
    const upId = id.map(i => new mongoose.Types.ObjectId(i))
    await User.deleteMany({_id: {$in: upId}})
    await Review.deleteMany({idFrom: {$in: upId}})
  } catch (error) {
    console.log(error) 
  } 
})

module.exports = router