import mongoose from 'mongoose';
const schema = new mongoose.Schema({
referenceCode: { type: String, unique: true },
userId: String,
products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });
export default mongoose.model('Collection', schema);