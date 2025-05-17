import mongoose from "mongoose"

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { timestamps: true, versionKey: false})

export const Tag = mongoose.models.Tag || mongoose.model("tags", tagSchema)