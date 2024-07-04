const mongoose = require('mongoose');

const consultantSchema = new mongoose.Schema({
  basicDetails: {
    name: { type: String, required: true },
    
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please fill a valid phone number'],
    },
  },
  speciality: {
    type: String,
    required: true,
  },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  patientsAssigned: [{
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    status: { type: String, enum: ['Active', 'Completed', 'Pending'], default: 'Pending' },
  }],
  consultancy: [{
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    status: { type: String, enum: ['Planned', 'Completed', 'Cancelled'], default: 'Planned' },
    date: { type: Date, required: true },
  }],
}, { timestamps: true });

const Consultant = mongoose.model('Consultant', consultantSchema);

module.exports = Consultant;