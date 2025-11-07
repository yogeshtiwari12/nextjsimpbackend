import { NextResponse, NextRequest as Request } from "next/server";
import Movie from "../../../model/movie_model";
import { connectDb } from "../../../../../lib/db";


await connectDb()

export async function POST(request: Request, context: any) {
  try {
    const { id } = (context?.params || {}) as { id: string };
    if (!id) {
      return NextResponse.json({ message: "Missing id param" }, { status: 400 });
    }

    const data = await request.json();

    const updateData = await Movie.findByIdAndUpdate(id, data, { new: true });

    if (!updateData) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Movie updated successfully", moviedata: updateData },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
