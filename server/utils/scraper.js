// utils/scraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes product data from a given product page URL.
 * @param {string} url
 * @returns {Object} { name, price, description, details, photo, photos, url }
 */
export async function scrapeProductData(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                      'Chrome/117.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const $ = cheerio.load(data);

    // --- NAME ---
    const name =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      'Unknown Product';

    // --- DESCRIPTION ---
    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('p').first().text() ||
      '';

    // --- PRICE ---
   let price =
        $('meta[property="product:price:amount"]').attr('content') ||
        $('[itemprop="price"]').attr('content') ||
        $('[class*="price"]').first().text() ||
        '0'; // <-- default value if price not found

        // Remove non-numeric characters
        price = price.replace(/[^0-9.,]/g, '').trim();

        // Optional: convert to Number if your schema uses Number type
        price = parseFloat(price.replace(',', '.')) || 0;

    // --- MAIN PHOTO ---
    const photo =
      $('meta[property="og:image"]').attr('content') ||
      $('img').first().attr('src') ||
      '';

    // --- ALL PHOTOS ---
    const photos = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !photos.includes(src)) photos.push(src);
    });
    if (photos.length === 0 && photo) photos.push(photo);

    // --- PRODUCT DETAILS / SPECIFICATIONS ---
    let details = $('#product-details, .product-details, [id*="specs"], [class*="specs"]').text().trim();

    if (!details) {
      // Look for headings like "Specifications" or "Product Details"
      $('h2, h3').each((i, el) => {
        const heading = $(el).text().toLowerCase();
        if (
          heading.includes('product details') ||
          heading.includes('specifications') ||
          heading.includes('specs')
        ) {
          const content = $(el).next('ul, div, table').text().trim();
          if (content) details = content;
        }
      });
    }

    // Clean up whitespace
    details = details.replace(/\s+/g, ' ');

    return {
      name,
      price,
      description,
      details,
      photo,
      photos,
      url,
    };
  } catch (err) {
    console.error('❌ Error scraping URL:', err.message);
    throw new Error('Failed to scrape product data');
  }
}
