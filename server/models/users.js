var mongoose = require('mongoose')
var Schema = mongoose.Schema
var userSchema = new Schema({
  username: { type: String },
  password: String,
  token: String
}, {
    versionKey: false,
    timestamps: { createdAt: 'create_at', updatedAt: 'update_at' }
  })
var userModel = mongoose.model('User', userSchema)
module.exports = { model: userModel }