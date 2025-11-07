import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema({

    blocks_name: {
        type: String,
        required: true,
        enum: ["Block A", "Block B", "Block C"],
        default:"Block C"
    },
    capacity: {
        type: Number,
        required: true,
        default:230
    },
    facilities: {
        type: [String],
        required: true,
        enum:['Ac','Non Ac']
    },
    contactNumber: {
        type: String,
        required: true,
    },

    movie:{type: mongoose.Schema.Types.ObjectId, ref: "Movie"},
})
const Theater = mongoose.models.Theater || mongoose.model("Theater", theaterSchema);
export default Theater