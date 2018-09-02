var mongoose = require('mongoose')
var Schema = mongoose.Schema
var privilegeSchema = new Schema({
  role: String,
  menus: Array
})
var privilegeModel = mongoose.model('Privilege', privilegeSchema)
module.exports = { model: privilegeModel }