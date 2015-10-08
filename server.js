var express       =       require('express'),
    bodyParser    =       require('body-parser'),
    mongoose      =       require('mongoose'),
    morgan        =       require('morgan');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/pixlArt');

// var Painting = require('./server/models/painting');

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(__dirname + "/client"));

app.use(morgan('dev'));

app.get('/', function(res, req){
  res.sendFile(__dirname + '/client/index.html');
});

var UsersController = require('./server/controllers/users');
app.use('/api/users', UsersController);

var PaintingsController = require('./server/controllers/paintings');
app.use('/api/paintings', PaintingsController);

var port = process.env.PORT || '8080';
app.listen(port, function(){
  console.log('...listening');
});
