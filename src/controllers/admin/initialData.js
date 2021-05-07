const Category = require('../../models/Category');
const Product = require('../../models/Product');
const Order = require('../../models/Order');


function createCategories(categories, parentId = null) {
  const categoryList = []
  let category
  if (parentId == null) {
    category = categories.filter(cat => cat.parentId == undefined)
  } else {
    category = categories.filter(cat => cat.parentId == parentId)
  }

  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      categoryImage: cat.categoryImage,
      type: cat.type,
      children: createCategories(categories, cat._id)
    })
  }

  return categoryList
}


exports.initialData = async (req, res) => {
  const categories = await Category.find({}).exec();
  const products = await Product.find({}).populate({ path: 'category', select: '_id name' }).exec();
  const orders = await Order.find({}).exec();
  res.status(200).send({
    categories: createCategories(categories),
    products,
    orders
  })
}