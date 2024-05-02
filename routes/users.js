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
  const pattern = /#(\w+)/g; //check s'il y a des # dans le twitt

  if (pattern.test(req.body.twitt)){
    const newTwitt = new Twitt ({
      username: req.body.author,
      twitt: req.body.twitt,
      date: moment().format('MMM Do YY'),
    })
    newTwitt.save()

    const hashtags = req.body.twitt.match(pattern)
    for(let i=0; i < hashtags.length; i++){
      TwittWithHashtag.findOne({ hashtag : hashtags[i] })
      .then((data) => {
        if(data){
          res.json({ hash: hashtags, data: data, hashtag1: hashtags[i], reqBodyTwitt: req.body.twitt, dataTwitt: data.twitt })

          data.twitt.push(req.body)
          data.save();
        }else {
          const newTwittWithHashtag = new TwittWithHashtag ({
            hashtag: hashtags[i],
            twitt: [req.body],
          })
          newTwittWithHashtag.save()
          .then(()=> {})
        }
      })
    }

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