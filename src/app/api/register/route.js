import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../model/route";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../route";

connect();

export async function POST(request) {
    const reqbody = await request.json();
  const { name, email, password, role } = reqbody;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    return NextResponse.json({ message: "User registered" });

  } catch (error) {
    console.error(error);
    return NextResponse.status(500).json({ message: "Server Error" });
  }
}
