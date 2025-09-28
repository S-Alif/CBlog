import { z } from 'zod';

// signup schema - used for user registration request
const signupSchema = z.object({
    name: z.string()
        .min(5, { message: "Name must be at least 5 characters" })
        .max(100, { message: "Name must be at most 100 characters" }),

    email: z.string()
        .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
            message: "Only valid Gmail addresses are allowed",
        }),
    phone: z.string()
        .regex(/^01\d{9}$/, { message: "Phone number must be 11 digits and start with 01" }),

    pass: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(20, { message: "Password must be at most 20 characters" }),

    confirmPass: z.string(),

    gender: z.enum(["male", "female", "other"]).default("other"),

    approveCreds: z.string()
        .min(10, { message: "Credentials must be at least 10 characters" })
        .max(150, { message: "Credentials must be at most 150 characters" }),
}).refine((data) => data.pass === data.confirmPass, {
    path: ["confirmPass"], // the error will show up on confirmPass field
    message: "Passwords do not match",
})




export {
    signupSchema
}