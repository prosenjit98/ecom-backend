const Page = require("../../models/Page");
const { createPublicAccess } = require('../../common-middleware')

exports.createPage = (req, res) => {
  const { banners, products } = req.files;
  if (banners.length > 0) {
    req.body.banner = banners.map((banner, index) => {
      createPublicAccess(banner.fileId)
      return {
        img: `https://drive.google.com/uc?export=view&id=${banner.fileId}`,
        navigateTo: `bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`
      }
    })
  }
  if (products.length > 0) {
    req.body.products = products.map((product, index) => {
      createPublicAccess(product.fileId)
      return {
        img: `https://drive.google.com/uc?export=view&id=${product.fileId}`,
        navigateTo: `productClicked?categoryId=${req.body.category}&type=${req.body.type}`
      }
    })
  }

  req.body.createdBy = req.user._id
  Page.findOne({ category: req.body.category }).exec((error, page) => {
    if (error) return res.status(400).send(error);
    if (page) {
      Page.findOneAndUpdate({ category: req.body.category }, req.body)
        .exec((error, updatedPage) => {
          if (error) return res.status(400).send(error);
          if (updatedPage) {
            return res.status(201).send(updatedPage);
          }
        })
    } else {
      const page = new Page(req.body)
      page.save((error, page) => {
        if (error) return res.status(400).send(error);
        if (page) {
          return res.status(201).send(page);
        }
      })
    }
  })
}

exports.getPage = (req, res) => {
  const { category, type } = req.params;
  if (type == 'page') {
    Page.findOne({ category: category }).exec((error, page) => {
      if (error) return res.status(400).send(error);
      if (page) {
        return res.status(200).send(page);
      }
    })
  }
}