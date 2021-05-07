const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress.address', required: true },
  totalAmount: { type: Number, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      payablePrice: { type: Number, require: true },
      purchasedQty: { type: Number, require: true },
    }
  ],
  paymentType: { type: String, require: true, enum: ['cod', 'card'] },
  orderStatus: [{
    type: { type: String, enum: ['ordered', 'packed', 'shipped', "delivered"], default: 'ordered' },
    date: { type: Date },
    isComplete: { type: Boolean, default: false }
  }],
  paymentStatus: {
    type: String, enum: ["pending", "complete", "cancelled", "refund"], required: true
  }
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)