import CustomOrder from '../models/CustomOrder.js';
import cloudinary from '../config/cloudinary.js';

export async function createCustomOrder(req, res, next) {
  try {
    const { name, email, description, budget, deadline } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({ error: 'Name, email, and description are required' });
    }

    let referenceImageUrl = '';
    if (req.file) {
      // Check if credentials are placeholders
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD_NAME === 'placeholder_cloud'
      ) {
        console.warn('WARNING: Cloudinary credentials are not set in .env. Skipping upload.');
        referenceImageUrl = 'https://placehold.co/600x400?text=Cloudinary+Not+Configured';
      } else {
        // Convert file buffer to base64 DataURI
        const fileUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        // Upload to cloudinary
        const uploadRes = await cloudinary.uploader.upload(fileUri, {
          folder: 'crochet_custom_orders',
          resource_type: 'auto'
        });
        referenceImageUrl = uploadRes.secure_url;
      }
    }

    const requestId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRequest = new CustomOrder({
      requestId,
      name,
      email,
      description,
      budget,
      deadline: deadline ? new Date(deadline) : undefined,
      referenceImage: referenceImageUrl
    });

    await newRequest.save();

    res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    next(error);
  }
}

export async function getCustomOrders(req, res, next) {
  try {
    const requests = await CustomOrder.find({}).sort({ date: -1 }).lean();
    res.json(requests);
  } catch (error) {
    next(error);
  }
}

export async function updateCustomOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const request = await CustomOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
}
