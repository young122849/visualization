var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }).then(msg => console.log('Successfully connected!'), err => console.error(err))
var userModel = require('../models/users').model
var privilegeModel = require('../models/priviliges').model
var jwt = require('jsonwebtoken')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res, next) {
  var user = new userModel(req.body)
  user.save().then(val => res.json({ success: true }))
})

// router.post('/login', function (req, res, next) {
//   userModel.findOne(req.body, { username: 1 }).exec().then(val => {
//     if (val) {
//       res.json({
//         status: true,
//         token: jwt.sign({ user: val.username }, 'Hahaha', {
//           expiresIn: 60 * 60 * 24
//         }),
//         user: val.username
//       })
//     }
//   }, err => console.error(err))
// })

router.post('/session', function (req, res, next) {
  let token = req.headers.authorization
  if (token == null) {
    // 用户初次登录,并无令牌
    userModel.findOneAndUpdate({ username: req.body.username, password: req.body.password }, {
      token: jwt.sign({ username: req.body.username }, 'This is a Secreat Key!', { expiresIn: 60 })
    }, { new: true }).exec().then(val => {
      if (val == null) {
        // 没有找到用户
        res.json({ success: false, message: '用户名或密码错误', data: {} })
      } else {
        res.json({ success: true, message: '登录成功,请使用您的令牌', data: { username: val.username, token: val.token } })
      }
    })
  } else {
    token = token.replace(/JWT /, '')
    var result = jwt.decode(token, 'This is a Secreat Key!')
    if (result == null) {
      res.json({ success: false, message: '令牌错误,请重新准备', data: {} })
    } else {
      res.json({ success: true, message: '登录成功,请使用您的令牌', data: { username: result.username, token: token } })
    }
  }
})

module.exports = router;
