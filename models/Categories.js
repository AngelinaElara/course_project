const {Schema, model} = require('mongoose')

const schema = new Schema({
  category: {type: String, required: true}
}, {versionKey: false})
 
module.exports = model('Category', schema) 