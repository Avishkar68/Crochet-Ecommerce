import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String },
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  img: { type: String }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'shipped', 'cancelled'],
    default: 'pending'
  },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
