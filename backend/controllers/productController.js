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
    const { name, price, description, category, discount } = req.body; // discountPrice-г эндээс авалгүй!
    let images = [];

    // Файлаар upload хийсэн зургууд
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    // URL-аар ирсэн зургууд
    if (req.body.imageUrls) {
      // imageUrls нэг ширхэг string эсвэл массив байж болно
      if (Array.isArray(req.body.imageUrls)) {
        images = images.concat(req.body.imageUrls);
      } else if (typeof req.body.imageUrls === 'string') {
        images.push(req.body.imageUrls);
      }
    }

    let sizes = [];
    if (req.body.sizes) {
      if (Array.isArray(req.body.sizes)) sizes = req.body.sizes;
      else sizes = [req.body.sizes];
    }

    const discountValue = Number(discount) || 0;
    const priceValue = Number(price) || 0;
    const discountPrice = discountValue > 0 ? Math.round(priceValue * (1 - discountValue / 100)) : priceValue;

    const product = await Product.create({
      name,
      price: priceValue,
      description,
      category,
      images,
      sizes,
      discount: discountValue,
      discountPrice,
    });
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
    const { name, price, description, category, discount, discountPrice } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }
    let sizes = [];
    if (req.body.sizes) {
      if (Array.isArray(req.body.sizes)) sizes = req.body.sizes;
      else sizes = [req.body.sizes];
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        category,
        ...(images.length > 0 && { images }),
        sizes,
        discount,        // нэмэгдсэн
        discountPrice,   // нэмэгдсэн
      },
      { new: true }
    );
    res.status(200).json(product);
  } catch (err) {
    console.error('Product update error:', err);
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

// Сэтгэгдэл авах
export const getProductComments = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, 'comments');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product.comments || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Сэтгэгдэл нэмэх
export const addProductComment = async (req, res) => {
  try {
    const { author, comment, rating, date } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newComment = { author, comment, rating, date: date || new Date() };
    product.comments.push(newComment);
    await product.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

