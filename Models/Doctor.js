const mongoose = require('mongoose');
var mongoConn = require('../Database/mongoConn');

// Define the Doctor schema with more structure
var doctorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true // Makes the name field mandatory
  },
  specialty: {
    type: String,
    required: true // Makes the specialty field mandatory
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/ // Simple regex for email validation
  },
  phone: {
    type: String,
    required: false // Phone number is optional
  }
}, {
  strict: true, // Only the fields defined in the schema are allowed
});

module.exports = mongoose.model('Doctor', doctorSchema, 'doctors');