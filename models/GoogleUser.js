const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  likes: {type: Number, required: true, default: 0}
}, {versionKey: false})
 
module.exports = model('GoogleUser', schema)  