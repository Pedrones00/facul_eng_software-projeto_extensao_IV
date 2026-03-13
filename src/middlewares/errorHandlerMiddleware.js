class ErrorHandlerMiddleware {
    static captureError() {

        return (error, request, response, next) => {

                return response.status(error.statusCode || 500).json({
                    message: error.statusCode? error.message : 'Internal server error'
                });

        }

    }

}

export default ErrorHandlerMiddleware;