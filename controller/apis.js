const bookSchema = require('../model/bookSchema')
const client = require('../redisClient')

 
 // The filterBooks API is designed to efficiently filter and retrieve tabular data with support for pagination using offset and limit.

const filterBooks = async (req, res) => {
 try {
    // Extract filter parameters from the request body
    const { authorName, minAge, maxAge, minPrice, maxPrice, minPages, maxPages, offset, limit } = req.body;

    // Generate a unique key for this specific filter combination
    const cacheKey = JSON.stringify({ authorName, minAge, maxAge, minPrice, maxPrice, minPages, maxPages, offset, limit });
     // Check if the result is already in the cache
    const cachedResult = await client.retrieve(cacheKey);
     if (cachedResult) {
       // If cached result exists, return it directly
      return res.status(200).json(JSON.parse(cachedResult));
    }

   const filter = {};
   // Apply the author name filter if provided
   if (authorName) {
     filter['author.name'] = authorName;
   }

   // Apply the author age range filter if provided
   if (minAge || maxAge) {
     filter['author.age'] = {};
     if (minAge) filter['author.age'].$gte = parseInt(minAge);
     if (maxAge) filter['author.age'].$lte = parseInt(maxAge);
   }

   // Apply the book price range filter if provided
   if (minPrice || maxPrice) {
     filter['price'] = {};
     if (minPrice) filter['price'].$gte = parseInt(minPrice);
     if (maxPrice) filter['price'].$lte = parseInt(maxPrice);
   }

   // Apply the book pages range filter if provided
   if (minPages || maxPages) {
     filter['pages'] = {};
     if (minPages) filter['pages'].$gte = parseInt(minPages);
     if (maxPages) filter['pages'].$lte = parseInt(maxPages);
   }

   // Perform the MongoDB query with offset and limit for efficient pagination
   let result = []
    result = await bookSchema.find(filter).skip(parseInt(offset || 0)).limit(parseInt(limit || 10));

   // Store the result in Redis cache with an expiration time (e.g==> 20 mins)
   await client.store(cacheKey, JSON.stringify(result),60);
 
   return res.status(200).json(result);
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};




// const insertBooks = async (req, res) => {
//     try {
//        
//      const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

//     // Array of colors
//     const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];

//     for (let i = 1; i <= 10000; i++) {
//        const newData = {
//         bookname: `Book ${i}`,
//         author: {
//           name: `Author ${i}`,
//           age: getRandomNumber(10, 100),
//           gender: getRandomNumber(0, 1) === 0 ? 'Male' : 'Female',
//         },
//         pages: getRandomNumber(10, 1000),
//         price: getRandomNumber(10, 1000),
//         color: colors[getRandomNumber(0, colors.length - 1)],
//       };

//       await bookSchema.create(newData);
//     }

//     res.status(200).json({ message: 'Data inserted successfully!' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };


module.exports = { filterBooks };