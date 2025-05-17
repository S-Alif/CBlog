export class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.code = statusCode
        this.message = message
        this.success = "failed"

        if (process.env.NODE_ENV !== "production") {
            this.errors = errors
            if (stack) {
                this.stack = stack
            }
        }

        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}