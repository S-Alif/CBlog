import mongoose from "mongoose";
import { roles } from "../constants/roleConstants";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    pass: { type: String, required: true },
    about: { type: String, maxLength: 500 },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    image: { type: String, maxLength: 1000 },
    bannerImg: { type: String, maxLength: 1000 },
    isVerified: { type: Boolean, required: true, default: false },
    isApproved: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
    approveCreds: { type: String, maxLength: 300 },
    roles: {
        type: [Number],
        enum: [...Object.values(roles)],
        default: [roles.USER]
    }
},
{ timestamps: true, versionKey: false })


// encrypt passwords
userSchema.pre("save", async function (next) {
    console.log(this.pass);
    if (!this.isModified("pass")) return next()
    const salt = await bcrypt.genSalt(10)
    this.pass = await bcrypt.hash(this.pass, salt)
    next()
})

// decrypt password
userSchema.methods.verifyPass = async function (pass) {
    return await bcrypt.compare(pass, this.pass)
}

export const userModel = mongoose.models.users || mongoose.model("users", userSchema)