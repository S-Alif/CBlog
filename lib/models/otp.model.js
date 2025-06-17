import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, index: { expires: 200 } }
}, { timestamps: true, versionKey: false  })

export const otpModel = mongoose.models.otps || mongoose.model("otps", otpSchema)