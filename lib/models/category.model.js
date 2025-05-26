import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true }
}, { timestamps: true, versionKey: false })

export const categoryModel = mongoose.models.categories || mongoose.model("categories", categorySchema)