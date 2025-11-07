import { NextResponse, NextRequest as Request } from "next/server";
import Movie from "../../../model/movie_model";
import { connect } from "../../../route";



connect()
export async function POST(request: Request, { params }: { params: { id: string } }) {

  const {id} = params;
 const data = await request.json();
 console.log(id, data);

  const updateData = await Movie.findByIdAndUpdate(id, data, { new: true });

  if (!updateData) {
    return NextResponse.json({ message: "Movie not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Movie updated successfully" },
    { status: 200 }
  );
}
