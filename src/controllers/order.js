const Order = require("../models/Order");

exports.addOrder = (req, res) => {
  req.body.user = req.user._id;
  console.log(req.body);
  const order = new Order(req.body);
  order.save((error, newOrder) => {
    if (error) return res.status(400).json({ error });
    if (newOrder) return res.status(201).json({ order: newOrder })
  })
}

exports.getOrders = (req, res) => {
  Order.find({ user: req.user._id }).select("_id paymentStatus items")
    .populate("items.productId", "_id, name, productPictures")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders })
      }
    })
}