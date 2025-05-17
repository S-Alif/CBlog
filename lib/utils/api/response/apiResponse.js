export class ApiResponse {
    constructor(statusCode, data = {}, message) {
        this.code = statusCode
        this.status = statusCode < 400 ? "success" : "failed"
        this.message = message || "No message provided"
        this.data = data
    }
}