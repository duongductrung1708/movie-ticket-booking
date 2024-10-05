const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const theaterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
  address: String,
  city: String,
});

const Theater = mongoose.model('Theater', theaterSchema);
module.exports = Theater;
