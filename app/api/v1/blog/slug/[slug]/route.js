import blogController from "@/lib/controllers/blog/blog.controller";

// for public - this controller also accepts slugs
export const GET = blogController.getBlogById