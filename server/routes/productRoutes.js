import express from 'express';
import { nanoid } from 'nanoid';
import Product from '../models/Product.js';
import { scrapeProductData } from '../utils/scraper.js';

const router = express.Router();

/**
 * @route   POST /api/product
 * @desc    Add a new product to a reference code
 * @body    { url: string, referenceCode?: string }
 */
router.post('/', async (req, res) => {
  try {
    const { url, referenceCode } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'Product URL is required' });
    }

    // Scrape product info
    const productData = await scrapeProductData(url);

    // Generate reference code if not provided
    const code = referenceCode || nanoid(8);

    // Save product
    const newProduct = new Product({
      referenceCode: code,
      name: productData.name,
      description: productData.description,
      details: productData.details,
      price: productData.price,
      photos: [productData.photo],
      url
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product saved successfully',
      referenceCode: code,
      product: newProduct
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/product/:referenceCode
 * @desc    Get all products for a reference code
 */
router.get('/:referenceCode', async (req, res) => {
  try {
    const { referenceCode } = req.params;

    const products = await Product.find({ referenceCode });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this reference code' });
    }

    res.json({ referenceCode, products });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
