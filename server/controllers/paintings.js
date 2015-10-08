var express     =     require('express'),
    User        =     require('../models/user'),
    paintingsRouter  =  express.Router();

// paintingsRouter.get('/', function(req, res){
//   Painting.find({}, function(err, paintings){
//     res.json(paintings);
//   });
// });

paintingsRouter.post('/', function(req, res){
  User.findOne({token: req.headers.token}, function(err, user){
    user.paintings.push(req.body);
    user.save(function(){
      res.json(user);
    });
  });
});

paintingsRouter.put('/', function(req, res){
  User.findOne({token: req.headers.token}, function(err, user){
    User.findOneAndUpdate({_id: user._id}, { $pull: { paintings: { _id : req.body.id } } }, function(err, user){
      res.json(user);
    });
  });
});

module.exports = paintingsRouter;
