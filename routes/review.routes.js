// toUTCString()
const {Router} = require('express')
const Review = require('../models/Review')
const mongoose = require('mongoose')

const router = Router()

router.post('/create', async (req, res) => {
  const {from, idFrom, title, category, description, tags, ratingAuth, randomId} = req.body

  try {
   const review = new Review({
    from, 
    idFrom,
    title,
    category, 
    description, 
    tags, 
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

router.get('/get/:id', async (req, res) => { 
  try { 
    const {id} = req.params || {}
    if(!id) throw new Error('Wrong params!')
    const reviews = await Review.find({ 'idFrom': { $in: id } })
    res.json(reviews)   
  } catch (e) { 
    console.log(e)
    res.status(400)
  }  
})

router.get('/:id', async (req, res) => { 
  try { 
    const {id} = req.params || {}
    if(!id) throw new Error('Wrong params!')
    const review = await Review.findById(id)
    res.json(review)   
  } catch (e) { 
    console.log(e)
    res.status(400)
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
    console.log(req.params)
    console.log(req.body)
    const {title, category, description, tags, ratingAuth} = req.body
    if(!id) throw new Error('Wrong params!')
    await Review.findByIdAndUpdate(id, { title: title, category: category, description: description, tags: tags, ratingAuth: ratingAuth},
      function (err, docs) {
        if (err){ 
        console.log(err)
        }
      })
  } catch (error) {
    console.log(error)
    res.status(400)
  }
})

 
module.exports = router