// toUTCString()
const {Router} = require('express')
const Review = require('../models/Review')
const cloudinary = require('../utils/cloudinary')

const router = Router()

router.post('/create', async (req, res) => {
  const {from, title, category, description, tags, ratingAuth, image} = req.body

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: reviewPhoto
    })

    const review = new Review({
      from, 
      title,
      category, 
      description, 
      tags, 
      ratingAuth,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      }
    })

    await review.save()

    res.json('Saved!')
  } catch (error) {
    console.error(error)
  }
})

 
module.exports = router