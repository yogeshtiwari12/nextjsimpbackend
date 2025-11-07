import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  seat: [String],
  theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater" },
  amount: {
    type: Number,
  },
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export default Booking;
