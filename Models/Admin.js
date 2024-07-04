const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  // Assuming basic details include phone and role
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please fill a valid phone number'],
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin'],
  },
}, { timestamps: true });

// Pre-save hook to hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

// Method to check the entered password against the hashed one
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;