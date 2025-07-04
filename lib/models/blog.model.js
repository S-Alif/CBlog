import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
    authorId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    name: {
        type: String,
        required: true,
        maxLength: 120,
        minLength: 10,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        maxLength: 100,
    },
    image: { type: String, maxLength: 1000, required: true },
    shortDesc: { type: String, required: true, minLength: 10, maxLength: 250 },
    tags: [{ type: mongoose.Types.ObjectId, ref: "tags", required: true }],
    categoryId: { type: mongoose.Types.ObjectId, ref: "categories", required: true },
    blogContent: { type: String, required: true },
    totalViews: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    blockReason: { type: String, maxLength: 1000 }
}, { timestamps: true, versionKey: false })

export const blogModel = mongoose.models.blogs || mongoose.model("blogs", blogSchema)