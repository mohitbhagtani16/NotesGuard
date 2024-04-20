const {mongoose, MongoClient,ServerApiVersion}  =require('mongoose');
const url="mongodb://0.0.0.0:27017/inoebook"
const mongooseconnect=async()=>{
    try{
        let connect =await mongoose.connect(url);
        console.log(connect)
            return connect
    }
    catch(e){
        console.log(e)
    }
}
module.exports=mongooseconnect