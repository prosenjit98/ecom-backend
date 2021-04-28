const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, min: 3, max: 50 },
  mobileNumber: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  locality: { type: String, required: true, trim: true, min: 10, max: 100 },
  address: { type: String, required: true, trim: true, min: 10, max: 100 },
  cityDestrictTown: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  landmark: { type: String, min: 10, max: 100 },
  alternativePhone: { type: String },
  addressType: { type: String, required: true, enum: ['home', 'work'] }
})

const UserAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  address: [AddressSchema]
}, { timestamps: true })

module.exports = mongoose.model('UserAddress', UserAddressSchema);