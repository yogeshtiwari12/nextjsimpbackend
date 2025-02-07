import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../model/route";
import { NextRequest,NextResponse } from "next/server";
import { connect } from "../route";
import jwt from "jsonwebtoken"
const secret = "iffhkjjfhgklkjbhvnl";

connect()

export async function POST(request) {
    const reqbody = await request.json();
    const { email, password } = reqbody;
    try {
        const user = await User.findOne({email});
        if(!user){
            return  NextResponse.json({message: "User Not Found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return NextResponse.status(200).json({message: "Invalid Credentials"});
        }
        const tokendata = {
            id: user._id,
            email: user.email,
        }
        const token = jwt.sign(tokendata, secret, {expiresIn: '1d'});

        const response = NextResponse.json({
            message: "Logged In Successfully",
            token: token,
        })

        response.cookies.set("token", token, {
            httpOnly: true, 
            
        })
          
        return response;

}
    catch (error) {
        console.error(error);
        return NextResponse.json({message: error.message});
    }
}