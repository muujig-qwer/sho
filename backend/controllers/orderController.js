import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const order = new Order({
      user: req.user._id,
      products: req.body.products,
      totalPrice: req.body.totalPrice,
    })
    await order.save()
    res.status(201).json(order)
  } catch (err) {
    console.error(err) // Алдааг терминалдаа харна уу!
    res.status(500).json({ message: 'Захиалга үүсгэхэд алдаа гарлаа' })
  }
};

export const getOrders = async (req, res) => {
  try {
    let orders
    if (req.user.role === 'admin') {
      orders = await Order.find().populate('products.product')
    } else {
      orders = await Order.find({ user: req.user._id }).populate('products.product')
    }
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Захиалга авахад алдаа гарлаа' })
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
