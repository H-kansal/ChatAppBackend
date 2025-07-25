import mongoose from "mongoose";

const ConnectDb=async()=>{
    try{
        const ConnectInstance=await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
        console.log(`your mongo connection is successful ${ConnectInstance.connection.host}`)
    }
    catch(error){
        console.log("Connection Failed !!!!");
    }
}

export default ConnectDb