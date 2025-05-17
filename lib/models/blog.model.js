import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
    authorId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    name: { type: String, required: true },
    shortDesc: { type: String, required: true },
    tags: [{ type: mongoose.Types.ObjectId, ref: "tags", required: true }],
    categoryId: { type: mongoose.Types.ObjectId, ref: "categories", required: true },
    blogContent: { type: String, required: true },
    totalViews: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    blockReason: { type: String, maxLength: 1000 }
}, { timestamps: true })

export const Blog = mongoose.models.Blog || mongoose.model("blogs", blogSchema)