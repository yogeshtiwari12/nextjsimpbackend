import { NextResponse, NextRequest as Request } from "next/server";
import Movie from "../../model/movie_model";
import { connect } from "../../route";

await connect();

export async function POST(request: Request) {
  const data = await request.json();
  const {
    movie_name,
    genre,
    releaseDate,
    director,
    rating,
    duration,
    language,
  } = data;

  const existingMovie = await Movie.findOne({ movie_name });
  if (existingMovie) {
    return NextResponse.json(
      { message: "Movie already exists" },
      { status: 400 }
    );
  }

  const moviedata = new Movie({
    movie_name,
    genre,
    releaseDate,
    director,
    rating,
    duration,
    language,
  });

  await moviedata.save();
  return NextResponse.json(
    { message: "Movie added successfully", moviedata },
    { status: 201 }
  );
}
