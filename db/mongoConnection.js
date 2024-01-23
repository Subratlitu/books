const mongoose = require('mongoose')
process.env.MONGODB_URI

async function connectToMongo(){
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser:true
    })
    console.log('Mongodb connected ..');
    }
    catch(err){
       console.log('Error in connecting mongo',err)
    }
} 
module.exports = {mongoose,connectToMongo}
 