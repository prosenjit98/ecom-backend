const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  offer: Number,
  quantity: { type: Number, required: true },
  productPictures: [
    { img: { type: String } }
  ],
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      review: String
    }
  ],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedAt: Date,

}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)