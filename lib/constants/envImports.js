// importing env variables

const DB_NAME = process.env.DB_NAME
const DB_URL = process.env.DB_URL
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

const MAIL_URL = process.env.MAIL_URL
const MAIL_PASS = process.env.MAIL_PASS
const MAIL = process.env.MAIL
const MAIL_HOST = process.env.MAIL_HOST
const MAIL_PORT = process.env.MAIL_PORT

const NODE_ENV = process.env.NODE_ENV

const CLIENT_URL = process.env.CLIENT_URL

const TOKEN_SECRET = process.env.TOKEN_SECRET

export {
    DB_NAME,
    DB_URL,
    DB_USER,
    DB_PASS,
    MAIL_URL,
    MAIL_PASS,
    MAIL,
    MAIL_HOST,
    MAIL_PORT,
    NODE_ENV,
    TOKEN_SECRET,
    CLIENT_URL,
}