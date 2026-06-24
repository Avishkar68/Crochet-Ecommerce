import Newsletter from '../models/Newsletter.js';

export async function subscribeNewsletter(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email is already subscribed' });
    }

    const newSub = new Newsletter({ email });
    await newSub.save();

    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    next(error);
  }
}

export async function getSubscribers(req, res, next) {
  try {
    const subscribers = await Newsletter.find({}).sort({ date: -1 }).lean();
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
}
