import express from 'express';
import Collection from '../models/Collection.js';
import Product from '../models/Product.js';
import { nanoid } from 'nanoid';


const router = express.Router();


// POST /api/collection -> create { optional userId }
router.post('/', async (req, res)=>{
try{
let referenceCode = 'REC-' + nanoid(6).toUpperCase();
const c = await Collection.create({ referenceCode, userId: req.body.userId || null });
return res.json({ success: true, collection: c });
}catch(err){
console.error(err);
return res.status(500).json({ success: false });
}
});


// GET /api/collection/:ref
router.get('/:ref', async (req, res)=>{
try{
const c = await Collection.findOne({ referenceCode: req.params.ref }).populate('products');
if(!c) return res.status(404).json({ success: false, message: 'Not found' });
return res.json({ success: true, collection: c });
}catch(err){
console.error(err);
return res.status(500).json({ success: false });
}
});


export default router;