var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Twitt = require('../models/Twitt');
var TwittWithHashtag = require ('../models/TwittWithHashtag');
var moment = require('moment');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const { checkBody } = require('../modules/checkBody')

/* GET users listing. */
router.post('/signup', function(req, res) {

  if(!checkBody(req.body, ['firstname', 'username', 'password'])){
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
    const newUser = new User ({
      firstname: req.body.firstname,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      token: uid2(32),
    })
    newUser.save()
    .then((newUser) => res.json(newUser))
});

router.post('/signin', function(req,res) {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
    User.findOne({ username: req.body.username})
    .then((data) => {
      if(data && bcrypt.compareSync(req.body.password, data.password)){
        res.json({
          result: true,
          token: data.token,
        })
      }else {
        res.json({
          result: false,
          error: 'incorrect username or password',
        })
      }
    })
})

router.post('/twitt', function(req, res) {
  const pattern = /#(\w+)/g;

  if (pattern.test(req.body.twitt)){
    const newTwitt = new Twitt ({
      author: req.body.author,
      twitt: req.body.twitt,
      date: moment().format('MMM Do YY'),
    })
    newTwitt.save()

    const newTwittWithHashtag = new TwittWithHashtag ({
      author: req.body.author,
      twitt: req.body.twitt,
      hashtag: req.body.twitt.match(pattern),
      date: moment().format('MMM Do YY'),
    })
    newTwittWithHashtag.save()
    .then((data) => res.json(data))
    .catch(error => console.error(error))

  }else {
    const newTwitt = new Twitt ({
      author: req.body.author,
      twitt: req.body.twitt,
      date: moment().format('MMM Do YY'),
    })
    newTwitt.save()
    .then((dataa) => res.json(dataa))
    .catch(error => console.error(error))
  }
})

module.exports = router;