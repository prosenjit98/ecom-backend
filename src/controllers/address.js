const UserAddress = require('../models/Address');
const User = require('../models/User');

exports.addAddress = (req, res) => {
  const { payload } = req.body;
  console.log(payload);
  if (payload.address) {
    UserAddress.findOne({ user: req.user._id }).exec((error, ser_with_addess) => {
      if (error) return res.status(400).json({ error });
      if (ser_with_addess) {
        console.log(ser_with_addess)
        if (payload.address._id) {
          UserAddress.findOneAndUpdate({ user: req.user._id, "address._id": payload.address._id }, {
            '$set': {
              "address.$": payload.address
            }
          }, { new: true }).exec((error, address) => {
            if (error) return res.status(400).json({ error });
            if (address) return res.status(201).json({ address })
          })

        } else {
          UserAddress.findOneAndUpdate({ user: req.user._id }, {
            '$push': {
              "address": payload.address
            }
          }, { new: true, unsert: true }).exec((error, address) => {
            if (error) return res.status(400).json({ error });
            if (address) return res.status(201).json({ address })
          })
        }
      }
      else {
        // const user = await User.findOne({ _id: req.user._id })
        // console.log(user);
        const userAddress = new UserAddress({ address: payload.address, user: req.user._id })
        userAddress.save().then(data => {
          return res.status(201).json({ address: data })
        }).catch(err => {
          console.log(err)
          return res.status(400).json({ err });
        })
      }
    })


  } else {
    res.status(400).json({ error: "Params address required" })
  }
}

exports.getAddress = (req, res) => {
  UserAddress.findOne({ user: req.user._id })
    .exec((error, userAddress) => {
      console.log({ error, userAddress })
      if (error) return res.status(400).json({ error });
      if (userAddress) return res.status(200).json({ userAddress })
      if (!error && !userAddress) return res.status(400).json({ error: "No data base found" });
    })
}