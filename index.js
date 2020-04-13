const express = require('express'),

  bodyparse = require('body-parser'),
  uuid = require('uuid'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  passport = require('passport'),
  _ = require('lodash'),
  {check, validationResult } = require('express-validator'),
  cors = require('cors');
  require('./passport');
  const path = require("path");
  
app = express();


//remote database IP
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//

app.use(morgan('common'));
app.use(express.static('public'));
app.use("/client", express.static(path.join(__dirname, "client", "dist")));
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(bodyparse.json());


var allowedOrigins = ['https://opgamesapi.herokuapp.com/client/'];



const Games = Models.game;
const Users = Models.user;
const Genres = Models.genre;
const Studios = Models.studio;
const Ratings = Models.rating;




app.use(cors({
  origin: function(origin, callback){
    if(allowedOrigins.indexOf(origin) === -1){
      var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

app.use(function(err, req, res, next) {
  console.log(err.stack)
  res.status(500).send('Unspecified server error! Sorry!')
})


//login endpoint CHECK
var auth = require('./auth')(app);

//CHECK = checked endpoint
//base url redirects to games CHECK
app.get('/', function (req, res) {
  console.log(req.headers.origin);
  res.redirect('/client');
});

//Beautiful, Beautiful!!! REDIRECTS!!!!
app.get('/documentation', function (req, res) {
  res.redirect('/documentation.html');
});

app.get('/users', function (req, res) {
  res.redirect('/users/info');
});
app.get('/user', function (req, res) {
  res.redirect('/users/info');
});
app.get('/admin/studios', function (req, res) {
  res.redirect('/studios');
});
app.get('/admin/genres', function (req, res) {
  res.redirect('/genres');
});
app.get('/admin/games', function (req, res) {
  res.redirect('/games');
});

//Unregistered Functions 

//get all games CHECK
app.get('/games', function(req, res) {
  Games.find()
    .populate('Genre')
    .populate('Studio')
    .then(function(games) {
      res.status(201).json(games)
    })
    .catch(function(err) {
      res.status(500).send(err)
    })
})

//get all genres
app.get('/genres', function(req, res) {
  Genres.find()
  .then(function(genre) {
    res.status(201).json(genre)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
});

//get all studios
app.get('/studios', function(req, res) {
  Studios.find()
  .then(function(studios) {
    res.status(201).json(studios)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
});

//get single game Added more details, replacing genre&studio IDs with their names. CHECK
app.get('/games/:Name', function(req,res){
  Games.findOne({ Name : req.params.Name })
    .populate('Genre')
    .populate('Studio')
    .then(function(game){
      res.status(200).json(game);
  })
})
//Register user CHECK
app.post('/users',
[check('Username', 'Username is required and must be longer then 3 characters!').isLength({min: 3}),
check('Username', 'Username contains non-alphanumeric characters').isAlphanumeric(),
check('Password', 'Password is required').isLength({ min: 4, max:15 }).not().isEmpty(),
check('Email', 'Email is not valid').isEmail()
],(req, res) => {
  var errors = validationResult(req);
  var cusErrors = []

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

    var hashedPassword = Users.hashPassword(req.body.Password);

    new Promise(function(resolve){
    Users.findOne({ Username : req.body.Username })
    .then(function(user) {
      
      if (user) {
        var newError = {
          value: req.body.Username,
          msg: 'User already exists!',
          param: 'Username',
          location: 'body'
          }
          cusErrors.push(newError)
          
      }
    

    Users.findOne({ Email : req.body.Email})
    .then(function(email){

      if (email) {
        var newError = {
          value: req.body.Email,
          msg: 'Email already exists!',
          param: 'Email',
          location: 'body'
          }
          cusErrors.push(newError)
          
      }

      
    
        if (!user && !email) {
          resolve(true)
        }
        else {
          resolve(false)
        }

      })
    })
  }).then(function(resolve){
    if (!resolve) {
      return res.status(400).json({errors: cusErrors});
    }
    else {
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
        Access: 1
      })
      .then(function(user) {
        res.status(201).json(user) 
      })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      })
    }

  })

    
})


//Registered Functions

//get user info CHECK
app.get('/users/info',passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOne({ Username : req.user.Username })
  .populate('Favorites', 'Name')
  .then(function(user) {
    res.json(user)
  })
  .catch(function(err) {
    console.error(err);
    res.status(404).send("User not found! Error=>" + err);
  });
});
//get game rating
app.get('/ratings/:game',
passport.authenticate('jwt', { session: false }), function(req,res) {
  Ratings.find({GameID : req.params.game})
  .then(function(rating){
    var ratingArr = []
    var ratingsTotal = 0

    _.forEach(rating, (value, index) => {
      ratingArr.push(value.UserRating)
      ratingsTotal++
    })

    returnRating = {
      Rating: _.sum(ratingArr),
      TotalRated: ratingsTotal
    }
    res.status(200).json(returnRating);
  })
  .catch(function(err){
    res.status(404).json(err)
  })
})

//get user rating
app.get('/user/ratings/:game',
passport.authenticate('jwt', { session: false }), function(req,res) {
  Ratings.find({UserID : req.user._id, GameID : req.params.game})
  .populate('GameID')
  .then(function(rating){
    res.status(200).json(rating);
  })
  .catch(function(err){
    res.status(404).json(err)
  })
})
//add user rating per game
app.post('/ratings/:game',
  passport.authenticate('jwt', { session: false }), function(req,res) {

  var userSearch = new Promise(function(user) { //this is mostly just a failsafe
    Users.findOne({_id : req.user._id})
      .then(function(found){
        if (found) {
          user(true) 
        } 
        else {
          user(false)
        }
      })
      .catch(function(err){
        user(false)
      })
  })
  var gameSearch = new Promise(function(games) { //verifies game exist
    Games.findOne({_id : req.params.game})
      .then(function(found){
        if (found) {
          games(true) 
        } 
        else {
          games(false)
        }
      })
      .catch(function(err){
        games(false)
      })
  })

  Promise.all([gameSearch, userSearch]).then(function(values){
    if (!values[0] || !values[1] ) {
      return res.status(404).json({errors: 'Game not found'});
    }
    else {
    Ratings.find({UserID : req.user._id, GameID : req.params.game})
      .then(function(found) {
        if (found.length) {
          Ratings.findByIdAndUpdate({_id: found[0]._id}, //this may be bad form to use [0]. but there should NEVER be more then one result
            {$set : { 
              GameID: found[0].GameID,
              UserRating: req.body.rating,
              UserID: found[0].UserID
            }},
            { upsert: true,
              new: true,
              runValidators: true,
              setDefaultsOnInsert: true}, 
            function(err, update) {
              if(err) {
                res.status(500).send(err);
              }
              else {
                res.json(update);
              }
            })
        }
        else {
          Ratings
            .create({
              GameID: req.params.game,
              UserRating: req.body.rating,
              UserID: req.user._id
              })
              .then(function(rating) {
                res.status(201).json(rating) 
              })
              .catch(function(error) {
                res.status(500).send("Error: " + error);
              })
        }
      })
    }
  })
})
  
//add favorites CHECK
app.post('/users/info/games/:GameID',
passport.authenticate('jwt', { session: false }), function(req,res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }


  Games.findOne({_id : req.params.GameID}).then(function(found){
    if(!found) {
      return res.status(404).send('Game not found!');
    }
    else {
      Users.findOneAndUpdate({ Username : req.user.Username}, 
        {$push : { 
          Favorites: req.params.GameID 
        }},
        { upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true}, 
        function(err, update) {
          if(err) {
            res.status(500).send(err);
          }
          else {
            res.json(update);
          }
        })
    }
  })
});

//remove favorites CHECK
app.delete('/users/info/games/:GameID',
passport.authenticate('jwt', { session: false }), function(req,res) {
  Users.findOneAndUpdate({ Username : req.user.Username}, 
    {$pull : { 
      Favorites: req.params.GameID 
    }},
    { upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true}, 
    function(err, update) {
      if(err) {
        res.status(500).send(err);
      }
      else {
        res.json(update);
      }
  })
})

//update user CHECK
function checkUser(req, resolve) { 
  if (req.user.Username != req.body.Username) { //checks if username is being changed
    Users.findOne({Username: req.body.Username}).then(function(found) { //if so, checks if username already exist in database
      if (found) {
        resolve(true) //resolved true if user exist, erroring out the update request.
      }
      else {
        resolve(false)
      }
      
    })
  }
  else {
    resolve(false)
  }
}

function checkEmail(req, resolve) { 
  if (req.user.Email != req.body.Email) { //checks if email is being changed
    Users.findOne({Email: req.body.Email}).then(function(found) { //if so, checks if email already exist in database
      if (found) {
        resolve(true) //resolved true if email exist, erroring out the update request.
      }
      else {
        resolve(false)
      }
    })
  }
  else {
    resolve(false)
  }
}
//actual update user section. We dont want people able to update to existing usernames or emails.
app.put('/users/info',
[check('Username', 'Username is required and must be longer then 3 characters!').isLength({min: 3}),
check('Username', 'Username contains non-alphanumeric characters').isAlphanumeric(),
check('Password', 'Password is required').isLength({ min: 4, max:15 }).not().isEmpty(),
check('Email', 'Email is not valid').isEmail()
],passport.authenticate('jwt', { session: false }), function(req,res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  var UserPromise = new Promise(function(resolve){
    checkUser(req, resolve);
  }).then(function(result) {
    var userCheck = result
    var EmailPromise = new Promise(function(resolve) {

    checkEmail(req, resolve);
      }).then(function(result1){

      var emailCheck = result1

      if (userCheck || emailCheck) {
        var errorArr = []
        if (userCheck) {
          errorArr.push(' User already Exist')
        }
        if (emailCheck) {
          errorArr.push(' Email already Exist')
        }
        return res.status(409).send(errorArr)
      }
      else {
        var hashedPassword = Users.hashPassword(req.body.Password);
    

        Users.findOneAndUpdate({ Username : req.user.Username}, 
          {$set : { 
            Username :  req.body.Username,
            Password: hashedPassword,
            Email : req.body.Email,
            Birthday : req.body.Birthday
          }},
          { upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true}, 
          function(err, update) {
            if(err) {
              res.status(500).send(err);
            }
            else {
              res.json(update);
            }
        })
      }
    }).catch(function() {
      return res.status(500).send('Unspecified server error! Sorry!');
    })
  })
})

//delete user CHECK
app.delete('/users/info',passport.authenticate('jwt', { session: false }), function(req,res) {
  Users.findOne({ Username : req.user.Username})
  .then(function(user){
    if (user) {
      Ratings.find({UserID : req.user._id})
        .then(function(rating){
          new Promise(function() {
            var aftersearch = _.after((rating.length), function() {
              Users.findOneAndRemove({ Username : req.user.Username})
                .then(function() {
                  res.status(200).json(req.user.Username + ' was deleted');
                })
                .catch(function(err){
                  res.status(500).send(err)
                })
              })
              _.forEach(rating, (value, index) => { 
                Ratings.findOneAndRemove({_id : value._id})
                .then(function() {
                  aftersearch()
                })
                .catch(function(err){
                  res.status(500).send(err)
                })
                  
                
            }) 
          })
        })
        .catch(function(err) {
            res.status(500).send(err);
        })
    }
    else {
      res.status(400).send(req.user.Username + ' was not found!');
    }
  })
  .catch(function(err){
    res.status(404).json(err)
  })  
})
  

//Admin Functions

//add game CHECK
app.post('/admin/games/',
[check('Name', 'Game name cannot be empty and must be longer then 3 characters!').isLength({min: 3}),
check('Description', 'Description cannot be empty').not().isEmpty().trim().escape(),
check('Players', 'Players cannot be empty & must be a number').isNumeric().not().isEmpty()
],passport.authenticate('jwt', { session: false }), function(req, res){
  if (req.user.Access === 3) { 
    var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  var checks = []
  var cusErrors = []
      var genreSearch = new Promise(function(genre) {
        var genreArr= []
        var aftersearch = _.after((req.body.Genre.length), function() {
          if (cusErrors.length) {
            genre(false)
          }
          else {
            checks.push({Genres: genreArr})
            genre(true)
          }
        })
        _.forEach(req.body.Genre, (value, index) => { 
          
          Genres.findOne({Name: value})
          .then(function(Genre) {
              if (!Genre) {
                var newError = {
                  value: value,
                  msg: 'Genre doesnt exist!',
                  param: 'Genre',
                  location: 'body'
                  }
                  cusErrors.push(newError)
              }
              else {
                genreArr.push(Genre._id) 
              }
              aftersearch()
          })
        }) 
      })
      var studioSearch = new Promise(function(studio) {
        Studios.findOne({Name: req.body.Studio})
        .then(function(Studio){

          if (!Studio) {
            var newError = {
              value: req.body.Studio,
              msg: 'Studio doesnt exist!',
              param: 'Studio',
              location: 'body'
              }
              cusErrors.push(newError)
              studio(false)
          }
        checks.push({Studios: Studio._id})
        studio(true)
      })
    })

    var gameSearch = new Promise(function(game) {
      Games.findOne({Name: req.body.Name})
      .then(function(Game){

        if (Game) {
          var newError = {
            value: req.body.Name,
            msg: 'Game already exists!',
            param: 'Studio',
            location: 'body'
            }
            cusErrors.push(newError)
            game(false)
        }
        game(true)
      })

  })

  Promise.all([gameSearch, studioSearch, genreSearch]).then(function(values){
    if (!values[0] || !values[1] || !values[2] ) {
      return res.status(400).json({errors: cusErrors});
    }
    else {
      var g = _.filter(checks, 'Genres', (value) => {return value})
      var s = _.filter(checks, 'Studios', (value) => { return value})
      Games
      .create({
        Name: req.body.Name,
        Description: req.body.Description,
        Genre: g[0].Genres,
        Studio: s[0].Studios,
        Players: req.body.Players,
        Img: req.body.Img
      })
      .then(function(user) {
        res.status(201).json(user)
      })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      })
    }

  })
  .catch(function(values){
    var newError = {
      value: values,
      msg: 'Unable to post to database',
      param: 'POST',
      location: 'body'
      }
      cusErrors.push(newError)
      return res.status(400).json({errors: cusErrors});

  })
  }
  else {
    res.status(401).send('Not Authorized for this task!');
  }
})

//update game CHECK
app.put('/admin/games/:Name',
[check('Name', 'Game name cannot be empty and must be longer then 3 characters!').isLength({min: 3}),
check('Description', 'Description cannot be empty').not().isEmpty().trim().escape(),
check('Players', 'Players cannot be empty & must be a number').isNumeric().not().isEmpty()
],passport.authenticate('jwt', { session: false }), function(req, res){
  if (req.user.Access === 3) { 
    var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  var checks = []
  var cusErrors = []
      var genreSearch = new Promise(function(genre) {
        var genreArr= []
        var aftersearch = _.after((req.body.Genre.length), function() {
          if (cusErrors.length) {
            genre(false)
          }
          else {
            checks.push({Genres: genreArr})
            genre(true)
          }
        })
        
        _.forEach(req.body.Genre, (value, index) => { 

          Genres.findOne({Name: value})
          .then(function(Genre) {
              if (!Genre) {
                var newError = {
                  value: value,
                  msg: 'Genre doesnt exist!',
                  param: 'Genre',
                  location: 'body'
                  }
                  cusErrors.push(newError)
              }
              else {
                genreArr.push(Genre._id) 
              }
              aftersearch()
          })
        }) 
      })
      var studioSearch = new Promise(function(studio) {
        Studios.findOne({Name: req.body.Studio})
        .then(function(Studio){

          if (!Studio) {
            var newError = {
              value: req.body.Studio,
              msg: 'Studio doesnt exist!',
              param: 'Studio',
              location: 'body'
              }
              cusErrors.push(newError)
              studio(false)
          }
          else {
            checks.push({Studios: Studio._id})
            studio(true)
      }
      })
    })

    var gameSearch = new Promise(function(game) {
      Games.findOne({Name: req.body.Name})
      .then(function(Game){

        if (Game && req.params.Name != req.body.Name) {
          var newError = {
            value: req.body.Name,
            msg: 'Game already exist!',
            param: 'Studio',
            location: 'body'
            }
            cusErrors.push(newError)
            game(false)
        }
        else{
          game(true)
        }
      })

  })

  Promise.all([gameSearch, studioSearch, genreSearch]).then(function(values){
    if (!values[0] || !values[1] || !values[2] ) {
      return res.status(400).json({errors: cusErrors});
    }
    else {
      var g = _.filter(checks, 'Genres', (value) => {return value})
      var s = _.filter(checks, 'Studios', (value) => { return value})

      Games.findOneAndUpdate({ Name : req.params.Name}, 
        {$set : { 
          Name: req.body.Name,
          Description: req.body.Description,
          Genre: g[0].Genres,
          Studio: s[0].Studios,
          Players: req.body.Players,
          Img: req.body.Img
        }},
        { upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true}, 
        function(err, update) {
          if(err) {
            res.status(500).send('error: ' + err);
          }
          else {
            res.json(update);
          }
        }
      )}
    })
  .catch(function(values){s
    var newError = {
      value: values,
      msg: 'Unable to post to database',
      param: 'POST',
      location: 'body'
      }
      cusErrors.push(newError)
      return res.status(400).json({errors: cusErrors});

    })
  }
  else {
    res.status(401).send('Not Authorized for this task!');
  }
})

//delete game CHECK
app.delete('/admin/games/:GameID',passport.authenticate('jwt', { session: false }), function(req, res) {
  if (req.user.Access === 3) {
    Games.findOneAndRemove({ _id : req.params.GameID})
    .then(function(game){
      if (!game) {
        res.status(400).send(game.Name + ' was not found!');
      }
      else {
        res.status(200).send(game.Name + ' was deleted!');
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    })
  }
  else {
    res.status(401).send('Cannot DELETE to /games NOT AUTHORIZED');
  }
});

//add studio CHECK
app.post('/admin/studios/',
[check('Name', 'Studio name cannot be empty and must be longer then 3 characters!').isLength({min: 3}),
check('Description', 'Description cannot be empty').not().isEmpty().trim().escape(),
check('Founded', 'Founded date cannot be empty & must be a number').isNumeric().not().isEmpty(),
check('StillAlive', 'is studio still alive? true|false').isBoolean()
],passport.authenticate('jwt', { session: false }), function(req, res){
  if (req.user.Access === 3) {
    var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

    Studios.findOne({Name: req.body.Name})
      .then(function(studio) {
        if (studio) {
          res.status(400).send(req.body.Name + ' already exist.')
        }
        else {
          Studios
          .create({
            Name: req.body.Name,
            Description: req.body.Description,
            Founded: req.body.Founded,
            StillAlive: req.body.StillAlive
          })
          .then(function(user) {res.status(201).json(user) })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Error: " + error);
          })
        }
      })
  }
  else {
    res.status(401).send('Not Authorized for this task!');
  }
})

//update studio CHECK
app.put('/admin/studios/:Name',
[check('Name', 'Studio name cannot be empty and must be longer then 3 characters!').isLength({min: 3}),
check('Description', 'Description cannot be empty').not().isEmpty().trim().escape(),
check('Founded', 'Founded date cannot be empty & must be a number').isNumeric().not().isEmpty(),
check('StillAlive', 'is studio still alive? true|false').isBoolean()
],passport.authenticate('jwt', { session: false }), function(req,res) {
  if (req.user.Access === 3) {
    var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

    Studios.findOneAndUpdate({ Name : req.params.Name}, 
      {$set : { 
        Name: req.body.Name,
        Description: req.body.Description,
        Founded: req.body.Founded,
        StillAlive: req.body.StillAlive
      }},
      { upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true}, 
      function(err, update) {
        if(err) {
          res.status(500).send(err);
        }
        else {
          res.json(update);
        }
      })
  }
  else {
    res.status(401).send('Cannot PUT to /studios NOT AUTHORIZED');
  }
  });

//delete studio CHECK
app.delete('/admin/studios/:Name',passport.authenticate('jwt', { session: false }), function(req, res) {
  if (req.user.Access === 3) {
    Studios.findOneAndRemove({ Name : req.params.Name})
    .then(function(studio){
      if (!studio) {
        res.status(400).send(req.params.Name + ' was not found!');
      }
      else {
        res.status(200).send(req.params.Name + ' was deleted!');
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    })
  }
  else {
    res.status(401).send('Cannot DELETE to /studios NOT AUTHORIZED');
  }
});
//add genre CHECK
app.post('/admin/genres/',
[check('Name', 'Genre name cannot be empty and must be longer then 3 characters!').isLength({min: 3}),
check('Description', 'Description cannot be empty').not().isEmpty().trim().escape(),
],passport.authenticate('jwt', { session: false }), function(req, res){
  if (req.user.Access === 3) {
    var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

    Genres.findOne({Name: req.body.Name})
      .then(function(genre) {
        if (genre) {
          res.status(400).send(req.body.Name + ' already exist.')
        }
        else {
          Genres
          .create({
            Name: req.body.Name,
            Description: req.body.Description,

          })
          .then(function(user) {res.status(201).json(user) })
          .catch(function(error) {
            console.error(error);
            res.status(500).send("Error: " + error);
          })
        }
      })
  }
  else {
    res.status(401).send('Not Authorized for this task!');
  }
})

//update genre CHECK
app.put('/admin/genres/:Name',
[check('Name', 'Genre name cannot be empty and must be longer then 3 characters!').isLength({min: 3}),
check('Description', 'Description cannot be empty').not().isEmpty().trim().escape(),
],passport.authenticate('jwt', { session: false }), function(req,res) {
  if (req.user.Access === 3) {
    var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

    Genres.findOneAndUpdate({ Name : req.params.Name}, 
      {$set : { 
        Name: req.body.Name,
        Description: req.body.Description,
      }},
      { upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true}, 
      function(err, update) {
        if(err) {
          res.status(500).send(err);
        }
        else {
          res.json(update);
        }
      })
  }
  else {
    res.status(401).send('Cannot PUT to /studios NOT AUTHORIZED');
  }
  });

//delete genre CHECK
app.delete('/admin/genres/:Name',passport.authenticate('jwt', { session: false }), function(req, res) {
  if (req.user.Access === 3) {
    Genres.findOneAndRemove({ Name : req.params.Name})
    .then(function(genre){
      if (!genre) {
        res.status(400).send(req.params.Name + ' was not found!');
      }
      else {
        res.status(200).send(req.params.Name + ' was deleted!');
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    })
  }
  else {
    res.status(401).send('Cannot DELETE to /studios NOT AUTHORIZED');
  }
});

//get all users CHECK
app.get('/admin/users/',passport.authenticate('jwt', { session: false }), function(req, res) {
  if (req.user.Access === 3) {
    Users.find()
    .then(function(users) {
      res.status(201).json(users)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send(err);
    });
  }
  else {
    res.status(401).send('Cannot GET to /admin NOT AUTHORIZED');
  }
});



//delete user CHECK
app.delete('/admin/users/:Username',passport.authenticate('jwt', { session: false }), function(req,res) {
  if (req.user.Access === 3) {
    Users.findOneAndRemove({ Username : req.params.Username})
    .then(function(user){
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found!');
      }
      else {
        res.status(200).send(req.params.Username + ' was deleted!');
      }
    })
    .catch(function(err) {
      res.status(500).send(err);
    })
  }
  else {
    res.status(401).send("Not Authorized for this task");
  }
})

var port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", function() {
  console.log(`Your app is listening on port ${port}`);
});
