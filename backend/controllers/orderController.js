import Order from '../models/Order.js';

export async function createOrder(req, res, next) {
  try {
    const { name, email, mobileNumber, address, items, total } = req.body;

    if (!name || !email || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Missing required checkout information' });
    }

    const orderId = `SB-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const mappedItems = items.map(item => ({
      id: item.id,
      _id: item._id || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      img: item.img
    }));

    const newOrder = new Order({
      orderId,
      name,
      email,
      mobileNumber,
      address,
      items: mappedItems,
      total
    });

    await newOrder.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    const orders = await Order.find({}).sort({ date: -1 }).lean();
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}
