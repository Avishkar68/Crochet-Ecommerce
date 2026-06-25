import Cart from '../models/Cart.js';

// Get cart by mobile number
export async function getCart(req, res, next) {
  try {
    const { mobileNumber } = req.params;
    if (!mobileNumber) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const cart = await Cart.findOne({ mobileNumber }).lean();
    if (!cart) {
      return res.json({ success: true, mobileNumber, items: [] });
    }

    res.json({ success: true, mobileNumber: cart.mobileNumber, items: cart.items });
  } catch (error) {
    next(error);
  }
}

// Update or create cart by mobile number
export async function updateCart(req, res, next) {
  try {
    const { mobileNumber, items } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    if (!items) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    // Find and update, or create a new cart
    const cart = await Cart.findOneAndUpdate(
      { mobileNumber },
      { items },
      { new: true, upsert: true }
    );

    res.json({ success: true, mobileNumber: cart.mobileNumber, items: cart.items });
  } catch (error) {
    next(error);
  }
}
