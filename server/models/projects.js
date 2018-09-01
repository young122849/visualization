var mongoose = require('mongoose')
var Schema = mongoose.Schema
var projectSchema = new Schema({
  id: Number,
  title: String,
  desc: String,
  img: String
}, {
  versionKey: false,
    timestamps: { createdAt: 'create_at', updatedAt: 'update_at' }
  })
var projectModel = mongoose.model('Project', projectSchema)
module.exports = { model: projectModel }