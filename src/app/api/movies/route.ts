import { findPackageJSON } from "module";
import { NextResponse,NextRequest as Request } from "next/server";
import Movie from "../model/movie_model";
import { connect } from "../../lib/route";



export async function GET() {
await connect();
    const moviedata  = await Movie.find();
    if (!moviedata) {
        return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json({ moviedata }, { status: 200 });

}

