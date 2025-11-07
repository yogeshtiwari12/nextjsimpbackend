import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../model/user";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../route";
import { authOptions } from "../../lib/auth";

connect();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  return NextResponse.json({ 
    authenticated: !!session,
    user: session?.user 
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // NextAuth will handle the actual authentication via authOptions
    const session = await getServerSession(authOptions);

    return NextResponse.json({
      success: true,
      user: session?.user
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
