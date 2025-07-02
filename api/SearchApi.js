import express from 'express';
import Product from '../models/Product.js'; // Assuming you have a Product model
import { mongoose } from 'mongoose';

const router = express.Router();

// Main search endpoint
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const category = req.query.category;
    const sortBy = req.query.sortBy || 'relevance';

    // Build the aggregation pipeline
    const pipeline = [];

    // Match stage - search term and filters
    const matchStage = {
      $match: {
        $and: [
          {
            $or: [
              { name: { $regex: searchTerm, $options: 'i' } },
              { description: { $regex: searchTerm, $options: 'i' } },
              { category: { $regex: searchTerm, $options: 'i' } },
              { 'variants.sku': { $regex: searchTerm, $options: 'i' } }
            ]
          }
        ]
      }
    };

    // Add price filters if provided
    if (!isNaN(minPrice)) {
      matchStage.$match.$and.push({ price: { $gte: minPrice } });
    }
    if (!isNaN(maxPrice)) {
      matchStage.$match.$and.push({ price: { $lte: maxPrice } });
    }

    // Add category filter if provided
    if (category) {
      matchStage.$match.$and.push({ category: category });
    }

    pipeline.push(matchStage);

    // Add relevance scoring
    pipeline.push({
      $addFields: {
        relevanceScore: {
          $sum: [
            { $cond: [{ $regexMatch: { input: "$name", regex: searchTerm, options: "i" } }, 10, 0] },
            { $cond: [{ $regexMatch: { input: "$description", regex: searchTerm, options: "i" } }, 5, 0] },
            { $cond: [{ $regexMatch: { input: "$category", regex: searchTerm, options: "i" } }, 3, 0] },
            { $cond: [{ $regexMatch: { input: "$brand", regex: searchTerm, options: "i" } }, 2, 0] }
          ]
        },
        exactMatch: {
          $cond: [{ $eq: ["$name", searchTerm] }, 1, 0]
        }
      }
    });

    // Sorting
    let sortStage = {};
    switch (sortBy) {
      case 'price-asc':
        sortStage = { $sort: { price: 1 } };
        break;
      case 'price-desc':
        sortStage = { $sort: { price: -1 } };
        break;
      case 'newest':
        sortStage = { $sort: { createdAt: -1 } };
        break;
      case 'rating':
        sortStage = { $sort: { averageRating: -1 } };
        break;
      default: // relevance
        sortStage = { $sort: { exactMatch: -1, relevanceScore: -1 } };
    }
    pipeline.push(sortStage);

    // Facet for pagination and counts
    pipeline.push({
      $facet: {
        results: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $project: { 
            name: 1,
            price: 1,
            images: 1,
            category: 1,
            brand: 1,
            averageRating: 1,
            slug: 1,
            relevanceScore: 1
          }}
        ],
        totalCount: [
          { $count: 'count' }
        ],
        categories: [
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        priceRange: [
          { 
            $bucket: {
              groupBy: "$price",
              boundaries: [0, 25, 50, 100, 250, 500, 1000],
              default: "Other",
              output: {
                count: { $sum: 1 }
              }
            }
          }
        ]
      }
    });

    const results = await Product.aggregate(pipeline);

    // Format the response
    const response = {
      products: results[0].results,
      total: results[0].totalCount[0]?.count || 0,
      categories: results[0].categories,
      priceRange: results[0].priceRange,
      page,
      totalPages: Math.ceil((results[0].totalCount[0]?.count || 0) / limit)
    };

    res.json(response);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Autocomplete suggestions endpoint
router.get('/suggestions', async (req, res) => {
  try {
    const searchTerm = req.query.q || '';
    
    if (searchTerm.length < 2) {
      return res.json([]);
    }

    const results = await Product.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: `^${searchTerm}`, $options: 'i' } },
            { name: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: `^${searchTerm}`, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          score: {
            $cond: [
              { $regexMatch: { input: "$name", regex: `^${searchTerm}`, options: "i" } },
              2,
              1
            ]
          }
        }
      },
      { $sort: { score: -1, name: 1 } },
      { $limit: 10 }
    ]);

    res.json(results);
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;