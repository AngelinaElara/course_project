// toUTCString()
const {Router} = require('express')
const Review = require('../models/Review')
const cloudinary = require('../utils/cloudinary')

const router = Router()

router.post('/create', async (req, res) => {
  console.log(req.body)
  const {from, title, category, description, tags, ratingAuth} = req.body

  try {
   const review = new Review({
    from, 
    title,
    category, 
    description, 
    tags, 
    ratingAuth
  })

    await review.save()

    res.json('Saved!')
  } catch (error) {
    console.error(error)
  }
})

 
module.exports = router