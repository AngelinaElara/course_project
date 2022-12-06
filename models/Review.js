const {Schema, model} = require('mongoose')

const schema = new Schema({
  from: {type: String, require: true},
  title: {type: String, require: true},
  category: {type: String, require: true},
  description: {type: String, require: true},
  tags: {type: String, require: true},
  ratingAuth: {type: Number, require: true, default: 0},
  ratingUsers: {type: Number, require: true, default: 0},
  image: {
    public_id: {type: String, require: true},
    url: {type: String, require: true},
  },
  publishDate: {type: Date, require: true, default: Date.now}
}, {versionKey: false})
 
module.exports = model('Review', schema)  