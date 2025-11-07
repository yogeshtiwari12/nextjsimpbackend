import jwt from "jsonwebtoken";
import User from "../model/user"; 
import { NextRequest as Request ,NextResponse} from "next/server";


const secret = "iffhkjjfhgklkjbhvnl";

const verifytoken = async(request:Request) => {
    try {
      const token = request.cookies.get("token").value;
    if (!token) {

      return NextResponse.json({ error: "No token found" }, { status: 403 });
      
    }
    const decoded = jwt.verify(token, secret) as { id : string };
 
    const user = await User.findById({ _id: decoded.id }).select("-password -role");

    return user;

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
    
  }
};
export default verifytoken;