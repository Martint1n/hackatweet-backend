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
          username: data.username,
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


router.post('/twitt/:username', function(req, res) {
  const pattern = /#(\w+)/g; //check s'il y a des # dans le twitt

  if (pattern.test(req.body.twitt)){ //s'il y en à alors => 
    const newTwitt = new Twitt ({
      username: req.params.username,
      avatar: req.body.avatar,
      firstname: req.body.firstname,
      twitt: req.body.twitt,
      hashtag: req.body.twitt.match(pattern),
      date: moment().format('MMM Do YY'),
    })
    newTwitt.save()
    .then((data) => {
    const _idTwitt = data._id
    User.findOne({ username: req.params.username })
    .then((data) => {
      if(data)
      console.log(data)
      data.twitts.push(_idTwitt) 
    })
  }) //ajoute le twitt dans la collection users
    const hashtags = req.body.twitt.match(pattern) //ajoute les # dans un tableau
    for(let i=0; i < hashtags.length; i++){
      TwittWithHashtag.findOne({ hashtag : hashtags[i] }) //pour chaque #, cherche les documents correspondant
      .then((data) => {
        if(data){ //si le # existe alors => 
          console.log(data)
          res.json({ hash: hashtags, data: data, hashtag1: hashtags[i], reqBodyTwitt: req.body.twitt, dataTwitt: data.twitt })

          data.twitt.push(req.body._id) //ajoute le contenu du document twitt dans le document hashtag changee pour clé étrangère
          data.save(); //addtoset
        }else { //s'il n'a pas trouver de hashtag deja existant
          const newTwittWithHashtag = new TwittWithHashtag ({
            hashtag: hashtags[i],
            twitt: [req.body._id], //changer pour chopper la clé étrangère
          })
          newTwittWithHashtag.save() //créeer un document avec le # et le contenu du twitt
          .then(()=> {})
        }
      })
    }

  }else { //S'il n'y a pas de # dans le contenu du twitt alors => 
    const newTwitt = new Twitt ({
      author: req.params.username,
      twitt: req.body.twitt,
      date: moment().format('MMM Do YY'),
    })
    newTwitt.save()
    .then((data) => res.json(data))
    .catch(error => console.error(error))
  }
})

router.get('/twitt', function (req, res) {
  Twitt.find()
  .then(data => res.json(data))
})


router.get('/hashtag', function (req, res) { //cherche tous les hashtag
  TwittWithHashtag.find()
  .populate()
  .then(data => res.json(data))
})

router.post('/like', function (req, res) {
  Twitt.findOne({ _id: req.body._id }) //A voir si on utilise pas un tokenTwitt
  .then((data) => {
    console.log('data ',data)
    data.likedBy.push(req.body.username)
    data.save()
  })
})

router.delete('/like', function(req, res) {
  Twitt.findOne({ _id: req.body._id })
  .then((data) => {
    if(!data){
      return;
    }else {
    data.likedBy.filter((user) => user !== data.username)
    res.json({ result: true, data })
    }
  })
})

router.delete('/twitt', function(req, res) {
  Twitt.deleteOne({ _id: req.body._id })
  .then((data) => {
    if(deletedCount === 0){
      return;
    }else {
      data.remove()
      res.json({ result: true, response: 'your twitt has been deleted successfully'})
    }
  })
})

module.exports = router;