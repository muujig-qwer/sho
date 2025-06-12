import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProductsBySlugs = async (req, res) => {
  try {
    const { parentSlug, childSlug } = req.params;

    const parent = await Category.findOne({ slug: parentSlug });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const child = await Category.findOne({ slug: childSlug, parent: parent._id });
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const products = await Product.find({ category: child._id }).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category } = req.body;
    const product = await Product.create({ name, price, description, image, category });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name')
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('category', 'name')
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
