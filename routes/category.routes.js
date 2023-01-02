const Category = require('../models/Categories')
const {Router} = require('express')
const router = Router()

router.post('/new', async (req, res) => {
  try {
    const {categoryInputValue} = req.body
    const duplicate = await Category.findOne({category: categoryInputValue})
    console.log(duplicate)
    if (duplicate) {
      return res.status(400).json({message: 'This category is exist!'})
    }
    const newCategory = new Category({category: categoryInputValue})
    await newCategory.save()
  } catch (error) {
    console.log(error)
  }
})

router.get('/all', async (req, res) => {
  try {
    const allCategories = await Category.find()
    res.json(allCategories)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router