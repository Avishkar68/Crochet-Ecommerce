import express from 'express';
import multer from 'multer';
import { getProducts, getProductById, createProduct, deleteProduct } from '../controllers/productController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('img'), createProduct);
router.delete('/:id', deleteProduct);

export default router;
