const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: {type: String, require: true},
  email: {type: String, require: true, unique: true},
  likes: {type: Number, require: true, default: 0}
}, {versionKey: false})
 
module.exports = model('GoogleUser', schema)  