import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

export async function getProducts(req, res, next) {
  try {
    const products = await Product.find({}).lean();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, price, rating, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    let imgUrl = '';
    if (req.file) {
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD_NAME === 'placeholder_cloud'
      ) {
        console.warn('WARNING: Cloudinary credentials are not set in .env. Skipping upload.');
        imgUrl = 'https://placehold.co/600x600?text=Cloudinary+Not+Configured';
      } else {
        const fileUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const uploadRes = await cloudinary.uploader.upload(fileUri, {
          folder: 'crochet_products',
          resource_type: 'auto'
        });
        imgUrl = uploadRes.secure_url;
      }
    } else {
      return res.status(400).json({ error: 'Product image is required' });
    }

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      rating: parseFloat(rating) || 0,
      category,
      img: imgUrl
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
}
