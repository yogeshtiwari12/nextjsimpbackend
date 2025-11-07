import { NextResponse , NextRequest as Request } from "next/server";
import Movie from "../../model/movie_model";
import { connect } from "../../../lib/route";



connect()
export async function DELETE(request: Request) {
    const data = await request.json();
    const id = data.id;

    const deleteData = await Movie.findByIdAndDelete(id);

    if (!deleteData) {
        return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Movie deleted successfully" }, { status: 200 });
}