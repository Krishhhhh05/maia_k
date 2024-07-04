const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  mobileNumber: {
    countrycode: { type: String, required: true },
    number: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Please fill a valid mobile number'],
    },
    verified: { type: Boolean, default: false },
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    address: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'] },
    verified: { type: Boolean, default: false },
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  
  age: {
    type: Number,
    required: true,
  },
  location: {
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    city:    { type: String, required: true },
  },
  features: {

    previousTreatment: { type: String, enum: ['Yes', 'No', 'Not Sure'], default: 'Not Sure' },
    paths: { type: String, enum: ['Surgery', 'Medication', 'Therapy', 'None', 'Not Sure'], default: 'Not Sure' },
    knownProblems: { type: [String], default: [] },
  },
  
    consultation:{
    details: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Assuming time is stored as a string (e.g., "14:00"). Consider using Date if you need both date and time together.
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    consultationStatus: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    consultantAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant', required: true },
  },
  
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;