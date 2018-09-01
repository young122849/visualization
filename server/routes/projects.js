var express = require('express')
var router = express.Router()

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }).then(msg => console.log('Successfully connected!'), err => console.error(err))
var projectModel = require('../models/projects').model

router.get('/', function (req, res, next) {
  projectModel.find({}, { create_at: 0, update_at: 0 }).exec().then(val => {

    res.json(val)
  })
})

router.post('/', function (req, res, next) {
  projectModel.create(req.body).then(val => res.json({ id: val.id, title: val.title, desc: val.desc, img: val.img }))
})

router.delete('/', function (req, res, next) {
  projectModel.deleteOne({ _id: req.query._id }).exec().then(val => res.json(val))
})

router.patch('/:id', function (req, res, next) {
  var id = req.params.id
  projectModel.findOneAndUpdate({ _id: id }, req.body, { new: true })
    .exec().then(val => res.json({
      title: val.title,
      img: val.img,
      desc: val.desc,
      _id: val._id
    }))
})

module.exports = router
