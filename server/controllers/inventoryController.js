const Product = require('../models/Product');
const logActivity = require('../utils/activityLogger');

// @desc    Get inventory list (all products, with search/filter)
// @route   GET /api/inventory
const getInventory = async (req, res, next) => {
  try {
    const { sku, status } = req.query;
    const query = {};
    if (sku) query.sku = { $regex: sku, $options: 'i' };

    let products = await Product.find(query).populate('category', 'name').sort({ updatedAt: -1 });

    if (status === 'low') products = products.filter((p) => p.stock > 0 && p.stock <= 10);
    if (status === 'out') products = products.filter((p) => p.stock === 0);
    if (status === 'in') products = products.filter((p) => p.stock > 10);

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock for a product (set, increase, or decrease)
// @route   PUT /api/inventory/:id
const updateStock = async (req, res, next) => {
  try {
    const { mode, amount } = req.body; // mode: 'set' | 'increase' | 'decrease'
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const value = Number(amount);
    if (mode === 'increase') {
      product.stock += value;
    } else if (mode === 'decrease') {
      product.stock = Math.max(0, product.stock - value);
    } else {
      product.stock = Math.max(0, value);
    }

    await product.save();
    await logActivity(req.user, `Updated stock (${mode})`, 'Inventory', product.name, `New stock: ${product.stock}`);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = { getInventory, updateStock };
