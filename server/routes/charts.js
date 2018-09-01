var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }).then(msg => console.log('Successfully connected!'), err => console.error(err))
var chartModel = require('../models/charts').model

router.get('/', function (req, res, next) {
  chartModel.find({ type: req.query.type }, { _id: 0, type: 0 }).exec().then(val => res.json(val))
})

module.exports = router