import {CLIENT_URL} from "@/lib/constants/envImports";

export default function blogRemovalTemplate(
    username,
    blogTitle,
    removedBy = "user",
    deleteReason = ""
) {
    const isAdmin = removedBy === "admin"
    
    const adminMessage = `
    <p>We wanted to let you know that your blog post <strong>"${blogTitle}"</strong> has been <span style="color: #dc2626;">removed</span> by an administrator for violating our guidelines.</p>
    ${deleteReason
        ? `<p><strong>Reason:</strong> ${deleteReason}</p>`
        : ""}
    <p>If you believe this was a mistake, you can <a href="https://yourdomain.com/support" style="color:#4f46e5;">contact support</a> for more details.</p>
  `
    
    const userMessage = `
    <p>Your blog post <strong>"${blogTitle}"</strong> has been successfully <span style="color: #dc2626;">removed</span> from our platform as per your request.</p>
    <p>If this was unintentional, please reach out to <a href="https://yourdomain.com/support" style="color:#4f46e5;">support</a> to see if recovery is possible.</p>
  `
    
    return `
        <!DOCTYPE html><html><head><meta charset="UTF-8"><title>Blog Removed</title><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f7;margin:0;padding:0}.container{max-width:600px;margin:40px auto;background-color:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.05);overflow:hidden}.header{background-color:#dc2626;color:#fff;padding:20px;text-align:center}.content{padding:30px;color:#333}.footer{padding:20px;text-align:center;font-size:13px;color:#777}</style></head><body><div class="container"><div class="header"><h2>Blog Removed</h2></div><div class="content"><p>Hi ${username},</p>${isAdmin ? adminMessage : userMessage}</div><div class="footer">&copy; ${new Date().getFullYear()} <a href="${CLIENT_URL}" target="_blank"><b>CBlog</b></a>. All rights reserved.</div></div></body></html>
    `
}
