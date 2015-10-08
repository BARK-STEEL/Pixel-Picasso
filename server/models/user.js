var mongoose      =     require('mongoose'),
    bcrypt        =     require('bcrypt-nodejs'),
    randToken     =     require('rand-token');

var UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  token:    { type: String },
  paintings:[
    {
      title:  { type: String },
      colors: { type: String },
      url:    { type: String },
      img:    { type: String }
    }
  ]
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
  }

  next();
});

UserSchema.methods.generateToken = function(password){
  var user = this;
  user.token = randToken.generate(16);
};

UserSchema.methods.authenticate = function(password, next){
  var user = this;
  bcrypt.compare(password, user.password, function(err, isMatch){
    next(isMatch);
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
