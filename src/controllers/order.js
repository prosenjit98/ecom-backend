const Order = require("../models/Order");
const Cart = require('../models/Cart')

exports.addOrder = (req, res) => {
  req.body.user = req.user._id;
  req.body.orderStatus = [
    { type: 'ordered', date: new Date(), isComplete: true },
    { type: 'packed', isComplete: false },
    { type: 'shipped', isComplete: false },
    { type: 'delivered', isComplete: false }
  ]
  const order = new Order(req.body);
  order.save((error, newOrder) => {
    if (error) return res.status(400).json({ error });
    if (newOrder) {
      Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) return res.status(201).json({ order: newOrder })
      })
    }
  })
}

exports.getOrders = (req, res) => {
  Order.find({ user: req.user._id }).select("_id paymentStatus items")
    .populate("items.productId", "_id name productPictures")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders })
      }
    })
}