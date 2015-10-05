var mongoose = require('mongoose');

var PaintingSchema = new mongoose.Schema({
  colors: {type: String}
});

var Painting = mongoose.model('painting', PaintingSchema);

module.exports = Painting;
