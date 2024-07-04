const mongoose = require('mongoose');
var mongoConn = require('../Database/mongoConn');

// Define the Clinic schema with structured fields
var clinicSchema = mongoose.Schema({
  name: {
    type: String,
    required: true // Makes the name field mandatory
  },
  address: {
    type: String,
    required: true // Makes the address field mandatory
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/ // Simple regex for phone number validation (assuming 10 digits)
  },
  servicesOffered: [{
    type: String,
    required: true // Makes each service in the array mandatory
  }]
}, {
  strict: true, // Only the fields defined in the schema are allowed
});

module.exports = mongoose.model('Clinic', clinicSchema, 'clinics');