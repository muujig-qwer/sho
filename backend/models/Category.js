const categorySchema = new mongoose.Schema({
  name: String,
  slug: String, // шинэ талбар
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
}, { timestamps: true });
