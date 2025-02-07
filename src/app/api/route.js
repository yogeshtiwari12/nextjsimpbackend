import mongoose from "mongoose";


export async function connect(){
try {
    mongoose.connect("mongodb://localhost:27017/nextjs").then(()=>{
        console.log("Connected to MongoDB");
    }).catch(()=>{
        console.log("Error connecting to MongoDB");
    })
    
} catch (error) {
console.error(error);
}
}