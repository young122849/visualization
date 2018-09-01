var mongoose = require('mongoose')
var Schema = mongoose.Schema
var chartSchema = new Schema({
  name: String,
  cylinders: Number,
  year: Number
}, {
    versionKey: false,
    timestamps: { createdAt: 'create_at', updatedAt: 'update_at' }
  })
var chartModel = mongoose.model('Chart', chartSchema)
module.exports = { model: chartModel }