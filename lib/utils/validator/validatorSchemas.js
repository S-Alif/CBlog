import { roles } from "@/lib/constants/roleConstants";
import Joi from "joi"

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    pass: Joi.string().min(8).max(20).required(),
    about: Joi.string().min(100).max(500).allow('', null),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    image: Joi.string().max(1000).uri().allow('', null),
    bannerImg: Joi.string().max(1000).uri().allow('', null),
    isVerified: Joi.boolean().default(false).optional(),
    isApproved: Joi.boolean().default(false).optional(),
    isBlocked: Joi.boolean().default(false).optional(),
    approveCreds: Joi.string().min(10).max(300).allow('', null),
    roles: Joi.array().items(Joi.number().valid(...Object.values(roles))).default([roles.USER])
})

export {
    userSchema
}