import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  images: [String], 
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  comments: [
    {
      author: String,
      comment: String,
      rating: Number,
      date: { type: Date, default: Date.now },
    },
  ],
  sizes: [String],
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
