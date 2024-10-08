const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const theaterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
  address: String,
  city: {
    type: String,
    enum: ['Hanoi', 'HCMC', 'Da Nang'],
    required: true,
  },
});

const Theater = mongoose.model('Theater', theaterSchema);
module.exports = Theater;
