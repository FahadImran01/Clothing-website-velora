const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ReturnRequest = require('../models/ReturnRequest');

// @desc    Get admin dashboard overview stats + chart data
// @route   GET /api/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalCustomers, orders, pendingReturns] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find(),
      ReturnRequest.countDocuments({ status: 'Pending' }),
    ]);

    const totalSales = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // Sales overview for last 7 days
    const salesByDay = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      salesByDay[key] = { date: key, sales: 0, orders: 0 };
    }
    orders.forEach((o) => {
      const key = o.createdAt.toISOString().slice(0, 10);
      if (salesByDay[key]) {
        salesByDay[key].sales += o.total;
        salesByDay[key].orders += 1;
      }
    });

    // Top performing products by units sold
    const productSales = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const key = item.name;
        productSales[key] = (productSales[key] || 0) + item.quantity;
      });
    });
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, units]) => ({ name, units }));

    res.json({
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers,
      lowStockProducts,
      outOfStockProducts,
      pendingReturns,
      salesOverview: Object.values(salesByDay),
      topProducts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
