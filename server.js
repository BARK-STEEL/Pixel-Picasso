var express       =       require('express'),
    bodyParser    =       require('body-parser'),
    mongoose      =       require('mongoose');

mongoose.connect('mongodb://localhost/pixlArt');

var Painting = require('./server/models/painting');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/client"));

app.get('/', function(res, req){
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/api/paintings', function(req, res){
  Painting.find({}, function(err, paintings){
    res.json(paintings);
  });
});

app.post('/api/paintings', function(req, res){

  var painting = new Painting(req.body);
  painting.save(function(err, painting){
    res.json(painting);
  });
});

app.delete('/api/paintings/:id', function(req, res){
  Painting.findByIdAndRemove(req.params.id, function(){
    res.json({status: 202, message: 'Success'});
  });
});

app.listen('8080', function(){
  console.log('...listening');
});
