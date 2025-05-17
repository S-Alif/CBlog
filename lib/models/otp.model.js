import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, index: { expires: 300 } }
}, { timestamps: true, versionKey: false  })

export const Otp = mongoose.models.Otp || mongoose.model("otps", otpSchema)