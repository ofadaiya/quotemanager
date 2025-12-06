import mongoose from 'mongoose';
const schema = new mongoose.Schema({
userWallet: String,
method: String,
productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
amount: Number,
txHash: String,
verified: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Donation', schema);