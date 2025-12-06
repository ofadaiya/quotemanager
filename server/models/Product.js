import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    referenceCode: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    details: { type: String },
    price: { type: String, required: true },
    photos: { type: [String], default: [] },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
