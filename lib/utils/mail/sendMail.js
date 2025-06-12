import nodemailer from "nodemailer"
import {MAIL, MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_URL} from "@/lib/constants/envImports";

const sendEmail = async (mailto, mailText, mailSubject) => {
    try {
        let transporter = nodemailer.createTransport({
            host: `${MAIL_HOST}`,
            port: MAIL_PORT,
            secure: false,
            auth: {
                user: `${MAIL_URL}`,
                pass: `${MAIL_PASS}`
            },
            tls: {
                rejectUnauthorized: false
            }
        })
        
        let mailOption = {
            from: `Uni-Manager${MAIL}`,
            to: mailto,
            subject: mailSubject,
            text: mailText
        }
        await transporter.sendMail(mailOption)
    } catch (error) {
        return false
    }
}

export default sendEmail