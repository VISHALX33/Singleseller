const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getStats = async (req, res, next) => {
  try {
    const [productCount, orderCount, usersCount, orders, revenueAgg] = await Promise.all([
      Product.countDocuments({}),
      Order.countDocuments({}),
      User.countDocuments({}),
      Order.find({}).sort({ createdAt: -1 }).limit(5).select('orderId total orderStatus createdAt').lean(),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, revenue: { $sum: '$total' } } }
      ])
    ]);

    const statusBreakdownAgg = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);
    const statusBreakdown = statusBreakdownAgg.reduce((acc, cur) => { acc[cur._id] = cur.count; return acc; }, {});

    res.json({ success: true, stats: {
      products: productCount,
      orders: orderCount,
      customers: usersCount,
      revenue: revenueAgg[0]?.revenue || 0,
      recentOrders: orders,
      statusBreakdown
    }});
  } catch (err) { next(err); }
};
