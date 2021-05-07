const jwt = require('jsonwebtoken')
const Product = require('../models/Product')
const shortid = require('shortid')
const slugify = require('slugify')
const Category = require('../models/Category')

exports.createProduct = (req, res) => {
  const token = req.headers.authorization.split(" ")[1]
  const user = jwt.verify(token, process.env.SECREATE_KEY);
  const { name, price, description, offer, category, reviews, quantity } = req.body
  // res.status(200).json({ file: req.files, body: req.body })
  let productPictures = []
  if (req.files.length > 0) {
    productPictures = req.files.map(file => { return { img: file.filename } })
  }
  console.log(req)
  const product = new Product({
    name: name,
    slug: slugify(name),
    description,
    price,
    offer,
    quantity,
    productPictures,
    reviews,
    category,
    createdBy: user._id
  })
  console.log(product)
  product.save(
    (error, newProduct) => {
      if (error) return res.status(500).send(error)
      if (newProduct) {
        res.status(201).send(newProduct)
      }
    })
  // res.status(200).send({ files: req.files, body: req.body })
}

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  Category.findOne({ slug: slug }).select('_id type').exec((error, category) => {
    if (error) {
      return res.status(500).send(error)
    }
    if (category) {
      Product.find({ category: category._id }).exec((error, products) => {
        if (error) {
          return res.status(500).send(error)
        }
        console.log(category)
        if (category.type && products.length > 0) {
          res.status(200).send({
            products,
            productByPrice: {
              under5K: products.filter(product => product.price <= 5000),
              under10K: products.filter(product => product.price > 5000 && product.price <= 10000),
              under15K: products.filter(product => product.price > 10000 && product.price <= 15000),
              under20K: products.filter(product => product.price > 15000 && product.price <= 20000)
            }
          })
        } else {
          res.status(200).json({ products })
        }


      })
    }
  })
}

exports.getProductById = (req, res) => {
  const { productId } = req.params;
  console.log(productId);
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) {
        return res.status(500).send(error)
      }
      if (product) {
        return res.status(200).send(product)
      }
    })
  } else {
    return res.status(500).send({ error: 'Params require' })
  }

}