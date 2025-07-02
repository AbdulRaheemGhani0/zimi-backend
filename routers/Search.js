const express = require('express');
const router = express.Router();
const Product = require('../models/Products.js');

// Search endpoint
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Search query required' });

    const results = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(50);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Suggestions endpoint
router.get('/suggestions', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 3) return res.json([]);

    const suggestions = await Product.find(
      { name: { $regex: query, $options: 'i' } },
      { _id: 1, name: 1, image: 1 }
    ).limit(10);

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// // Example Express routes
// router.get('/products/search', async (req, res) => {
//   try {
//     const query = req.query.q;
//     if (!query) {
//       return res.status(400).json({ error: 'Search query required' });
//     }

//     // Perform search with case-insensitive regex
//     const results = await Product.find({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } },
//         { category: { $regex: query, $options: 'i' } }
//       ]
//     }).limit(50);

//     res.json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// router.get('/products/suggestions', async (req, res) => {
//   try {
//     const query = req.query.q;
//     if (!query || query.length < 3) {
//       return res.json([]);
//     }

//     const suggestions = await Product.find(
//       { name: { $regex: query, $options: 'i' } },
//       { _id: 1, name: 1, image: 1 }
//     ).limit(10);

//     res.json(suggestions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });







// // SEARCH products with advanced filtering and aggregation
// router.get("/search", async (req, res) => {
//   try {
//     const {
//       q = "", // search query
//       category = "",
//       country = "",
//       minPrice = 0,
//       maxPrice = Number.MAX_SAFE_INTEGER,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//       page = 1,
//       limit = 10,
//       minLikes = 0,
//       minSaves = 0
//     } = req.query;

//     // Build the match stage for filtering
//     const matchStage = {
//       $match: {
//         $and: [
//           // Text search across name and description
//           {
//             $or: [
//               { name: { $regex: q, $options: "i" } },
//               { description: { $regex: q, $options: "i" } }
//             ]
//           },
//           // Category filter (accepts multiple categories comma-separated)
//           category ? { category: { $in: category.split(",") } } : {},
//           // Country filter (accepts multiple countries comma-separated)
//           country ? { country: { $in: country.split(",") } } : {},
//           // Price range filter
//           { price: { $gte: Number(minPrice), $lte: Number(maxPrice) } },
//           // Minimum likes filter
//           { likes: { $gte: Number(minLikes) } },
//           // Minimum saves filter
//           { saves: { $gte: Number(minSaves) } }
//         ].filter(condition => Object.keys(condition).length > 0) // Remove empty conditions
//       }
//     };

//     // Build the sort stage
//     const sortStage = {
//       $sort: {
//         [sortBy]: sortOrder === "asc" ? 1 : -1,
//         // Secondary sort by createdAt for consistent pagination
//         createdAt: -1
//       }
//     };

//     // Facet for results and aggregations
//     const facetStage = {
//       $facet: {
//         results: [
//           { $skip: (Number(page) - 1) * Number(limit) },
//           { $limit: Number(limit) },
//           {
//             $project: {
//               name: 1,
//               description: 1,
//               price: 1,
//               category: 1,
//               image: 1,
//               likes: 1,
//               saves: 1,
//               country: 1,
//               createdAt: 1
//             }
//           }
//         ],
//         metadata: [
//           { $count: "total" },
//           { $addFields: { page: Number(page), limit: Number(limit) } }
//         ],
//         categories: [
//           { $group: { _id: "$category", count: { $sum: 1 } } },
//           { $project: { name: "$_id", count: 1, _id: 0 } }
//         ],
//         countries: [
//           { $group: { _id: "$country", count: { $sum: 1 } } },
//           { $project: { name: "$_id", count: 1, _id: 0 } }
//         ],
//         priceRange: [
//           { 
//             $bucket: {
//               groupBy: "$price",
//               boundaries: [0, 50, 100, 200, 500, 1000],
//               default: "1000+",
//               output: {
//                 count: { $sum: 1 },
//                 minPrice: { $min: "$price" },
//                 maxPrice: { $max: "$price" }
//               }
//             }
//           }
//         ]
//       }
//     };

//     const aggregationPipeline = [matchStage, sortStage, facetStage];
//     const results = await Product.aggregate(aggregationPipeline);

//     const response = {
//       success: true,
//       results: results[0].results,
//       total: results[0].metadata[0]?.total || 0,
//       page: results[0].metadata[0]?.page || 1,
//       limit: results[0].metadata[0]?.limit || 10,
//       filters: {
//         categories: results[0].categories,
//         countries: results[0].countries,
//         priceRange: results[0].priceRange
//       }
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error("Error in search:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error performing search",
//       error: error.message
//     });
//   }
// });