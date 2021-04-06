
const Cart = require('../models/Cart')
exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, existingCart) => {
    if (error) return res.status(500).send(error)
    if (existingCart) {
      let product = req.body.cartItems.product
      let item = existingCart.cartItems.find(item => item.product == product)
      if (item) {
        Cart.findOneAndUpdate({ "user": req.user._id, "cartItems.product": product }, {
          '$set': {
            "cartItems.$": {
              ...req.body.cartItems,
              quantity: item.quantity + req.body.cartItems.quantity,
              price: item.price + req.body.cartItems.price
            }
          }
        }, { new: true }).exec((error, updatedCart) => {
          if (error) return res.status(500).send(error)
          if (updatedCart) {
            return res.status(201).send(updatedCart)
          }
        })
      } else {
        Cart.findOneAndUpdate({ user: req.user._id }, { "$push": { "cartItems": [req.body.cartItems] } }, { new: true })
          .exec((error, updatedCart) => {
            if (error) return res.status(500).send(error)
            if (updatedCart) {
              return res.status(201).send(updatedCart)
            }
          })
      }
    } else {
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems
      })

      cart.save((error, newcart) => {
        if (error) return res.status(500).send(error)
        if (cart) {
          return res.status(201).send(cart)
        }
      })
    }
  })

}