class ApiResponse {
    constructor(status, data = null, message = 'sucess') {
        this.statusCode = this.statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse };