const Order = require("../../models/Order");

exports.updateOrders = (req, res) => {
  console.log(req.body)
  Order.updateOne({ _id: req.body.orderId, 'orderStatus.type': req.body.type },
    { $set: { "orderStatus.$": [{ type: req.body.type, date: new Date(), isComplete: true }] } }, { new: true })
    .exec((error, order) => {
      if (error) return res.status(400).send({ error });
      if (order) return res.status(201).send({ order })
    })
}