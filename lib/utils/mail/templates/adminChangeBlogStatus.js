import {CLIENT_URL} from "@/lib/constants/envImports";

export default function adminChangeBlogStatus (
    username,
    blogTitle,
    isBlocked,
    blockReason = "",
    isFeatured
) {
    
    const statusMessage = isBlocked
        ? `<p>Your blog post <strong>"${blogTitle}"</strong> has been <span style="color: #dc2626;">blocked</span> by an administrator.</p>
       <p><strong>Reason:</strong> ${blockReason}</p>`
        : `<p>Your blog post <strong>"${blogTitle}"</strong> has been reviewed.</p>`
    
    const featuredMessage = isFeatured
        ? `<p>🎉 Congratulations! Your blog has also been <span style="color: #16a34a;">featured</span> on our platform.</p>`
        : ""
    
    return `
        <!DOCTYPE html><html><head><meta charset="UTF-8"><title>Blog Status Update</title><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f7;margin:0;padding:0}.container{max-width:600px;margin:40px auto;background-color:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.05);overflow:hidden}.header{background-color:#4f46e5;color:#fff;padding:20px;text-align:center}.content{padding:30px;color:#333}.footer{padding:20px;text-align:center;font-size:13px;color:#777}</style></head><body><div class="container"><div class="header"><h2>Blog Status Update</h2></div><div class="content"><p>Hi<b>${username}</b>,</p>${statusMessage} ${featuredMessage}<p>If you have any questions, feel free to<a href="${CLIENT_URL}/contact" style="color:#4f46e5">contact support</a>.</p></div><div class="footer">&copy; ${new Date().getFullYear()} <a href="${CLIENT_URL}" target="_blank"><b>CBlog</b></a>. All rights reserved.</div></div></body></html>
    `
}