import express from 'express';
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.put('/:id', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
