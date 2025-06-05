import blogController from '@/lib/controllers/blog/blog.controller'

// for users
export const PATCH = blogController.saveBlog
// for users and admin
export const DELETE = blogController.removeBlog

// for public
export const GET = blogController.getBlogById
export const PUT = blogController.incrementViewCount
export const POST = blogController.searchBlogs