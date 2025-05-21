import { TOKEN_SECRET } from "@/lib/constants/envImports"
import jwt from "jsonwebtoken"

const issueToken = async (payload, time = "6h") => {
    const token = await jwt.sign(payload, TOKEN_SECRET, { expiresIn: time })
    return token
}

const verifyToken = async (token) => {
    const decoded = await jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return false
        }
        return decoded
    })

    return decoded
}

export { issueToken, verifyToken }