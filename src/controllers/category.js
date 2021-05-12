const Category = require('../models/Category')
const slugify = require('slugify')
const { createPublicAccess } = require('../common-middleware')



exports.addCatagory = async (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name)
  }
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId
  }
  if (req.file) {
    console.log("resposnce from drive:", req.file)
    createPublicAccess(req.file.fileId)
    categoryObj.categoryImage = 'https://drive.google.com/uc?export=view&id=' + req.file.fileId
  }

  const cat = new Category(categoryObj)
  cat.save((error, category) => {
    if (error) {
      return res.status(400).send({ error: error })
    }
    if (category) {
      return res.status(201).send({ category })
    }
  })
}

exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).send({ error: error })
    if (categories) {
      const categoryList = createCategories(categories)
      return res.status(200).send(categoryList)
    }
  })
}

exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  const updatedCategories = []
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = { name: name[i], type: type[i] }
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }
      const updatedCategory = await Category.findByIdAndUpdate({ _id: _id[i] }, category, { new: true })
      updatedCategories.push(updatedCategory)
    }
    return res.status(201).send(updatedCategories)
  } else {
    const category = { name, type }
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCategory = await Category.findByIdAndUpdate({ _id }, category, { new: true })
    return res.status(201).send(updatedCategory)
  }
}

exports.deleteCategories = async (req, res) => {
  const { payload } = req.body;
  const deletedCat = []
  for (let i = 0; i < payload.length; i++) {
    const deleted = await Category.findByIdAndDelete({ _id: payload[i] })
    deletedCat.push(deleted)
  }
  if (deletedCat.length == payload.length)
    return res.status(200).send({ message: "All categories deleted successfully" })
  else
    return res.status(400).send({ message: "Something went wrong." })
}

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
      type: cat.type,
      categoryImage: cat.categoryImage,
      children: createCategories(categories, cat._id)
    })
  }

  return categoryList
}
