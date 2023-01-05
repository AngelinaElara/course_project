const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String},
  likes: {type: Number, required: true, default: 0},
  role: {type: String, required: true, default: 'user'},
  blocked: {type: Boolean, required: true, default: false},
  confirmed: {type: Boolean, required: true, default: false},
  emailToken: {type: String}
}, {versionKey: false})
 
module.exports = model('User', schema)  