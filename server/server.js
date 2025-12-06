import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';


dotenv.config();
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));


// connect DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connect error', err));


// routes
import productRoutes from './routes/productRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


app.use('/api/product', productRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/payment', paymentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));