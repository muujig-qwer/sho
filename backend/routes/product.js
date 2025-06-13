import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategoryId,
} from '../controllers/productController.js';

import upload from '../middleware/uploadMiddleware.js'

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: req.file.filename }); 
});

router.post('/', upload.single('image'), createProduct);
router.get('/category/id/:categoryId', getProductsByCategoryId)
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
