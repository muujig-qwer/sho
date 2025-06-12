import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController.js';

import upload from '../middleware/uploadMiddleware.js'

const router = express.Router();

router.post('/', upload.single('image'), createProduct)
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/category/:categoryId', getProductsByCategory)

export default router;
