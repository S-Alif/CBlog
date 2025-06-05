import { roles } from "@/lib/constants/roleConstants";
import Joi from "joi"
import mongoose from 'mongoose'

const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid")
    }
    return value;
}, "ObjectId Validation")

// user schema
const userSchema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().email().required(),
    pass: Joi.string().min(8).max(20).required(),
    about: Joi.string().min(100).max(500).allow('', null),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    image: Joi.string().max(1000).uri().allow('', null),
    bannerImg: Joi.string().max(1000).uri().allow('', null),
    approveCreds: Joi.string().min(10).max(300).required(),
})

// user schema - for update by user
const userUpdateByAdminAndModeratorSchema = Joi.object({
    isApproved: Joi.boolean().default(false).optional(),
    isBlocked: Joi.boolean().default(false).optional(),
    approveCreds: Joi.string().min(10).max(300).required(),
    roles: Joi.array().items(Joi.number().valid(roles.MODERATOR, roles.USER)).default([roles.USER])
})

// reset password schema
const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    pass: Joi.string().min(8).max(20).required(),
    confirmPass: Joi.string()
        .valid(Joi.ref('pass'))
        .required()
        .messages({ 'any.only': 'Passwords must match' }),
})

// category schema
const categorySchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    image: Joi.string().max(1000).uri().required(),
})

// tag schema
const tagSchema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
})

// blog schema
const blogSchema = Joi.object({
    name: Joi.string().min(10).max(120).required(),
    image: Joi.string().max(1000).uri().required(),
    shortDesc: Joi.string().min(10).max(250).required(),
    blogContent: Joi.string().required(),
    categoryId: objectId.required(),
    tags: Joi.array().items(objectId).min(1).max(3).required(),
    isPublished: Joi.boolean().optional()
})

// blog schema for admin
const blogAdminSchema = Joi.object({
    isBlocked: Joi.boolean().required(),
    blockReason: Joi.when('isBlocked', {
        is: true,
        then: Joi.string().max(1000).required(),
        otherwise: Joi.string().optional().allow('')
    }),
    isFeatured: Joi.boolean().optional()
})

export {
    userSchema,
    userUpdateByAdminAndModeratorSchema,
    resetPasswordSchema,
    categorySchema,
    tagSchema,
    blogSchema,
    blogAdminSchema,
}