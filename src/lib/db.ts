import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

// Use global cache to prevent multiple connections in dev
let cached = (global as any)._mongooseCached as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = (global as any)._mongooseCached = { conn: null, promise: null };
}

export async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // ...you can pass mongoose options here if needed...
    } as any);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
