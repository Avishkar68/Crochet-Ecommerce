import mongoose from 'mongoose';

const customOrderSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: String },
  deadline: { type: Date },
  referenceImage: { type: String },
  status: {
    type: String,
    enum: ['reviewing', 'approved', 'declined'],
    default: 'reviewing'
  },
  date: { type: Date, default: Date.now }
});

const CustomOrder = mongoose.model('CustomOrder', customOrderSchema);
export default CustomOrder;
