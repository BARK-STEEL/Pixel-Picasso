var express     =     require('express'),
    User        =     require('../models/user'),
    usersRouter =     express.Router();

// usersRouter.get('/:id', function(req, res){
//   var id = req.body.id;
//   User.findOne({_id: id}, function(err, results){
//     res.json(results);
//   });
// });

usersRouter.post('/', function(req, res){
  var user = new User(req.body);
  user.save(function(){
    res.json(user);
  });
});

usersRouter.post('/authentication_token', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username}, function(err, user){
    user.authenticate(password, function(isMatch){
      if(isMatch){
        user.generateToken();
        user.save(function(){
          res.json(user);
        });
      } else {
        res.json({status: 401, message: 'Access denied'});
      }
    });
  });
});

module.exports = usersRouter;
