import { NextResponse , NextRequest as Request } from "next/server";
import Movie from "../../model/movie_model";
import { connectDb } from "../../../../lib/db";
export async function DELETE(request: Request) {
    await connectDb();
    const data = await request.json();
    const id = data.id;

    const deleteData = await Movie.findByIdAndDelete(id);

    if (!deleteData) {
        return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Movie deleted successfully" }, { status: 200 });
}
