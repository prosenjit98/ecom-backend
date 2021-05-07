const Order = require("../../models/order");

exports.updateOrders = (req, res) => {
  Order.updateOne({ user: req.body.userId, 'orderStatus.type': req.body.type },
    { $set: { "orderStatus.$": [{ type: req.body.type, date: new Date(), isComplete: true }] } }, { new: true })
    .exec((error, order) => {
      if (error) return res.status(400).send({ error });
      if (order) return res.status(201).status({ order })
    })
}