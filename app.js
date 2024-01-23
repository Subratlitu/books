const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const {mongoose,connectToMongo} = require('./db/mongoConnection')
const route = require('./route/route')
const redisClient = require('./redisClient')
 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
connectToMongo()
redisClient.connect()
app.use('/',route)
 
app.listen( 3000, function () {
    console.log('Express app running on port ' + (  3000))
});