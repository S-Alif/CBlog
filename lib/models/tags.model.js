import mongoose from "mongoose"

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { timestamps: true, versionKey: false})

export const tagModel = mongoose.models.tags || mongoose.model("tags", tagSchema)