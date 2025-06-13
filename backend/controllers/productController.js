import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose'

export const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params
    console.log('Ирсэн categoryId:', categoryId)

    const products = await Product.find({
      category: new mongoose.Types.ObjectId(categoryId),
    })

    console.log('Олдсон products:', products)

    res.json(products)
  } catch (err) {
    console.error('Сервер алдаа:', err.message)
    res.status(500).json({ message: 'Алдаа гарлаа', error: err.message })
  }
}




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

