class ThrowError {
    static throwError(statusCode, message) {
        const error = new Error(message || 'Something went wrong');

        error.statusCode = statusCode || 500;

        throw error;

    }
}

export default ThrowError;