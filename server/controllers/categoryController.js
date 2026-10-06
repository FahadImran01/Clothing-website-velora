const Category = require('../models/Category');
const logActivity = require('../utils/activityLogger');

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, parent, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const category = await Category.create({ name, slug: slugify(name), parent: parent || null, description });
    await logActivity(req.user, 'Created category', 'Category', category.name);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (req.body.name) {
      category.name = req.body.name;
      category.slug = slugify(req.body.name);
    }
    if (req.body.description !== undefined) category.description = req.body.description;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive;

    const updated = await category.save();
    await logActivity(req.user, 'Updated category', 'Category', updated.name);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const categoryName = category.name;
    await category.deleteOne();
    await logActivity(req.user, 'Deleted category', 'Category', categoryName);
    res.json({ message: 'Category removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
