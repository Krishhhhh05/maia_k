const mongoose = require('mongoose');

var clinicSchema = mongoose.Schema({
  name: {
    type: String,
    required: true // Makes the name field mandatory
  },
  address: {
    street: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/ // Simple regex for phone number validation (assuming 10 digits)
  },
  servicesOffered: [{
    service: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor' 
  }]
}, {
  strict: true, 
});

module.exports = mongoose.model('Clinic', clinicSchema, 'clinics');