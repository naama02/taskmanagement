const Category = require("../models/Category");
const { ObjectId } = require('mongodb');

const createCategory = async (req, res) => {
    // check for unique category
    const categoryExists = await Category.findOne({ name: req.body.name });
    if (categoryExists) {
        return res.send({ status: "error", message: "Category already exists" });
    }

    const categoryData = {
        name: req.body.name,
        user: req.user._id,
    }

    try {
        const category = await Category.create(categoryData);

        return res.send({ status: "success", message: "Category successfully created", data: category })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const categoryListView = async (req, res) => {
    const categories = await Category.find().populate({
        path: 'user',
        select: {
            _id: 1, firstName: 1, lastName: 1,
        },
    });
    return res.render('categoryList', { 'status': '', curPath: req.path, categories: categories })
}

const categoryDelete = async (req, res) => {
    const { categoryId } = req.body;
    try {
        await Category.deleteOne({ _id: new ObjectId(categoryId) });
        return res.send({ status: "success", message: "Category data deleted successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
}

const categoryUpdateView = async (req, res) => {

    const category = await Category.findById(req.params.categoryId);
    return res.render('editCategory', {
        status: '',
        category: category,
        curPath: req.path,
    });
}

const updateCategory = async (req, res) => {
    const categoryData = {
        name: req.body.name
    };

    try {
        await Category.findOneAndUpdate({ _id: req.params.categoryId }, categoryData, { upsert: true, new: true });

        return res.send({ status: "success", message: "Category successfully updated" })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

module.exports = {
    createCategory,
    categoryDelete,
    categoryListView,
    categoryUpdateView,
    updateCategory,
}
