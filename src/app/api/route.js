import mongoose from "mongoose";


export async function connect(){
try {
    console.log(process.env.MONGODB_URI);
     await mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connected to MongoDB");
    }).catch(()=>{
        console.log("Error connecting to MongoDB");
    })
    
} catch (error) {
console.error(error);
}
}