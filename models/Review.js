const {Schema, model} = require('mongoose')

const schema = new Schema({
  from: {type: String, required: true},
  idFrom: {type: String, required: true},
  title: {type: String, required: true},
  category: {type: String, required: true},
  description: {type: String, required: true},
  tags: {type: Array, required: true},
  img: {type: Boolean, default: false},
  ratingAuth: {type: Number, required: true, default: 0},
  ratingUsers: {type: Number, required: true, default: 0},
  randomId: {type: String, required: true},
  publishDate: {type: Date, required: true, default: Date.now}
}, {versionKey: false}) 
 
module.exports = model('Review', schema)   