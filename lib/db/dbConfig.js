import mongoose from "mongoose"
import { DB_URL, DB_NAME } from "../constants/envImports"

const MONGODB_URI = `${DB_URL}/${DB_NAME}`

if (!MONGODB_URI) {
    throw new Error('Please define the DB_URL and DB_NAME environment variables.')
}

// Global caching for development (Next.js hot reload)
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((mongoose) => {
                console.log(
                    `%cMongoDB Connected ✅ DB_HOST: ${mongoose.connection.host}`,
                    'color: green; font-weight: bold;'
                )
                return mongoose
            })
            .catch((err) => {
                console.error('MongoDB connection error:', err)
                throw err
            })
    }

    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB