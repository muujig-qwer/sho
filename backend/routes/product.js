import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySlugs
} from '../controllers/productController.js';

import upload from '../middleware/uploadMiddleware.js'

const router = express.Router();

// Зураг upload хийх тусгай endpoint нэмэх
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: req.file.filename }); // зөвхөн filename-г буцаана
});

router.post('/', upload.single('image'), createProduct);

// !!! ROUTE-ИЙН ДАРААЛЛЫГ ЗӨВ БОЛГОНО !!!
router.get('/category/:parentSlug/:childSlug', getProductsBySlugs);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
