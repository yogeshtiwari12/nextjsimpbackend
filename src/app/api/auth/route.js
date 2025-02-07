import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../model/route"; 
import { NextRequest ,NextResponse} from "next/server";


const secret = "iffhkjjfhgklkjbhvnl";
const verifytoken = async(request) => {
    try {
      const token = request.cookies.get("token").value;

    if (!token) {

      return NextResponse.json({ error: "No token found" }, { status: 403 });
      
    }
    const decoded = jwt.verify(token, secret);
 
    const user = await User.findById({ _id: decoded.id });

    // console.log("User:", user);
    return user;

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
    
  }
};
export default verifytoken;