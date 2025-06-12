import {CLIENT_URL} from "@/lib/constants/envImports";

export default function accountUpdateTemplate(name, task = "accountUpdate") {
    const isPasswordReset = task === "resetPassword"
    
    const heading = isPasswordReset
        ? "Password Changed Successfully"
        : "Your Account Was Updated"
    
    const message = isPasswordReset
        ? "We're letting you know that your account password was successfully changed."
        : "Your account details were recently updated."
    
    const suggestion = isPasswordReset
        ? `If you didn’t perform this action, please <a href="${CLIENT_URL}/auth/send-otp" style="color:#4f46e5;">reset your password</a> immediately or <a href="${CLIENT_URL}/contact" style="color:#4f46e5;">contact support</a>.`
        : `If you didn’t make these changes, please <a href="${CLIENT_URL}/contact" style="color:#4f46e5;">review your account</a> or <a href="https://yourdomain.com/support" style="color:#4f46e5;">contact support</a>.`
    
    
    return `
    <!DOCTYPE html><html><head><meta charset="UTF-8"><title>${heading}</title><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f7;margin:0;padding:0}.container{max-width:600px;margin:40px auto;background-color:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.05);overflow:hidden}.header{background-color:#4f46e5;color:#fff;padding:20px;text-align:center}.header h1{margin:0;font-size:24px}.content{padding:30px;color:#333}.content h2{margin-top:0;color:#4f46e5}.content p{line-height:1.6}.footer{padding:20px;text-align:center;font-size:13px;color:#777}</style></head><body><div class="container"><div class="header"><h1>${heading}</h1></div><div class="content"><h2>Hi ${name},</h2><p>${message}</p><p>${suggestion}</p></div><div class="footer">&copy; ${new Date.getFullYear()}<a href="${CLIENT_URL}" target="_blank"><b>CBlog</b></a>. All rights reserved.</div></div></body></html>
  `
}
