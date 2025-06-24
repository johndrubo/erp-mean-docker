const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware } = require('./auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Place new order
router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    let total = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      customer: req.user.userId,
      items: orderItems,
      total
    });

    await order.save();
    await order.populate(['customer', 'items.product']);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId })
      .populate('customer', 'name email')
      .populate('items.product', 'name sku price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders (admin/manager only)
router.get('/', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied. Admin or manager role required.' });
    }

    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product', 'name sku price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'name sku price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin/manager
    if (order.customer._id.toString() !== req.user.userId && 
        req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (admin/manager only)
router.patch('/:id/status', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied. Admin or manager role required.' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('customer', 'name email')
     .populate('items.product', 'name sku price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
