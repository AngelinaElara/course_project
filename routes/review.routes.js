const {Router} = require('express')
const Review = require('../models/Review')
const User = require('../models/User')
const mongoose = require('mongoose')

const router = Router()

router.post('/create', async (req, res) => {
  const {from, idFrom, title, category, description, tags, img, ratingAuth, randomId} = req.body

  try {
   const review = new Review({
    from, 
    idFrom,
    title,
    category, 
    description, 
    tags,
    img,
    ratingAuth,
    randomId
  })

    await review.save()

    res.json('Saved!')
  } catch (error) {
    console.log(error)
    res.status(400)
  }
})

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
    res.json(reviews)
  } catch (error) {
    console.log(error)
  }
})
 
router.delete('/', async (req, res) => {
  try { 
    const {id} = req.body
    const upReview = id.map(i => new mongoose.Types.ObjectId(i))
    const reviews = await Review.deleteMany({_id: {$in: upReview}})  
  } catch (e) { 
    console.log(e)
    res.status(400)
  }  
})   

router.patch('/change/:id', async (req, res) => {
  try {
    const {id} = req.params || {}
    const {title, category, description, tags, img, ratingAuth} = req.body
    if(!id) throw new Error('Wrong params!')
    await Review.findByIdAndUpdate(id, { title: title, category: category, description: description, tags: tags, img: img, ratingAuth: ratingAuth},
      function (err, docs) {
        if (err){ 
        console.log(err)
        }
      }).clone()
  } catch (error) {
    console.log(error)
    res.status(400)
  }
})

router.patch('/comment/:id', async (req, res) => {
  try {
    const {id} = req.params || {}
    const review = await Review.findById(id)
    review.comments.push(req.body)
    await review.save()
    res.json(review)
  } catch (error) {
    console.log(error)
  }
})

router.get('/comment/:id', async (req, res) => {
  try {
    const {id} = req.params || {}
    const review = await Review.findById(id)
    res.json(review.comments)
  } catch (error) {
    console.log(error)
  }
})

router.patch('/like/:id', async (req, res) => {
  try {
    const {id} = req.params || {}
    const {userId, authorId} = req.body
    const review = await Review.findById(id)
    review.liked.push(userId)
    await review.save()
    await User.updateOne({_id : authorId}, {$inc: {likes : 1}})
  } catch (error) {
    console.log(error) 
  }
})

router.get('/authlikes/:id', async (req, res) => {
  try {
    const {id} = req.params || {}
    const user = await User.findById(id)
    const likes = user.likes
    res.json(likes)
  } catch {

  }
})

router.patch('/userrating/:id', async (req, res) => {
  try {
    const {id} = req.params || {}
    const review = await Review.findById(id)
    review.ratingUsers.push(req.body)
    console.log(req.body)
    console.log(review.ratingUsers)
    if(review.ratingUsers.length) {
      const allRatingUsers = review.ratingUsers.reduce((acc, value) => {
        return acc + value.rating
      }, 0)
      const evaluatorsQuantity = review.ratingUsers.length
      const finalRating = (allRatingUsers/evaluatorsQuantity).toFixed(1)
      await Review.findByIdAndUpdate( id ,{finalRating : finalRating},
        function (err, docs) {
          if (err){ 
          console.log(err)
          }
        }
      ).clone()
    }
    await review.save()
  } catch (error) {
    console.log(error)
  }
})

router.patch('/finalrating/:id', async (req, res) => {
  try {
    const {id} = req.params || {}
    const {finalRating} = req.body
    await Review.updateOne({_id : id}, {$inc: {finalRating : finalRating}})
  } catch(error) {

  }
})

router.get('/tag/:tag', async (req, res) => {
  try {
    const {tag} = req.params || {}
    const findtags = await Review.find({ 'tags': { $elemMatch: {'value' : tag}} })
    res.json(findtags)
  } catch (error) {
    console.log(error)
  }
})

router.patch('/tag/:tag', async (req, res) => {
  try {
    const {tag} = req.params || {}
    const foundReviews = await Review.find({ 'tags': { $elemMatch: {'value' : tag}} })
    for(const review of foundReviews){
      review.tags.find(i => i.value === tag).count++
      review.markModified('tags')
      await review.save()
    }
  } catch (error) {
    console.log(error)
  }
})
 
module.exports = router