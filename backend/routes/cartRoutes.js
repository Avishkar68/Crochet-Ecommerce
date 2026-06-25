import express from 'express';
import { getCart, updateCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/:mobileNumber', getCart);
router.post('/', updateCart);

export default router;
