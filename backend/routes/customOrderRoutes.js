import express from 'express';
import multer from 'multer';
import { createCustomOrder, getCustomOrders, updateCustomOrderStatus } from '../controllers/customOrderController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

router.post('/', upload.single('referenceImage'), createCustomOrder);
router.get('/', getCustomOrders);
router.put('/:id', updateCustomOrderStatus);

export default router;
