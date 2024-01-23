const express = require('express')
const route = express.Router()
const apis = require('../controller/apis')
 
// route.post('/insert-books',apis.insertBooks)
route.get('/filter-books',apis.filterBooks)
 


module.exports = route