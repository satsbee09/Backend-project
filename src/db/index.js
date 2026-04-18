import mongoose from "mongoose";
import dns from "dns";
import { DB_NAME } from "../constants.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB= async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
            console.log(`\nMongoDB connected: ${connectionInstance.connection.host}`);
    }catch(error){
        console.log("Error:",error);
        process.exit(1);
    }
}
export default connectDB;