const mongoose = require('mongoose');
var mongoConn = require('../Database/mongoConn');

// Define the Doctor schema with more structure
var doctorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  specialty: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/ 
  },
  clinics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic'
  }] 
});