import mongoose from "mongoose"

export const connectDb = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo Connected :${conn.connection.host}`)
    }catch(err){
        console.log("Error in connecting to MongoDb", err);
        process.exit(1); //means failure
    }
}