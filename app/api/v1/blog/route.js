import blogController from '@/lib/controllers/blog/blog.controller'

// for users
export const POST = blogController.saveBlog

// for public
export const GET = blogController.getAllBlogsForUsers