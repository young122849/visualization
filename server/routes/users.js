var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }).then(msg => console.log('Successfully connected!'), err => console.error(err))
var userModel = require('../models/users').model
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.post('/', function (req, res, next) {
  userModel.create(req.body, function (err, user) {
    if (err) {
      throw err
    }
    res.json({ success: true })
  })
})

module.exports = router;
