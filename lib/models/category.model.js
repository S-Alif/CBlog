import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }
}, { timestamps: true, versionKey: false })

export const Category = mongoose.models.Category || mongoose.model("categories", categorySchema)