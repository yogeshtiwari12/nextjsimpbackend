import { NextResponse } from "next/server";
import User from "../model/route";
import { connect } from "../route";
import verifytoken from "../auth/route";

connect();

export async function GET(request) {
  const user = await verifytoken(request);
  console.log("sds",user)
  try {
    if (!user) {
      return NextResponse.json({ message: "User not Found" });
    }
    return NextResponse.json({ message: "User authenticated", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
