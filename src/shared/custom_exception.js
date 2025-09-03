export default class CustomException extends Error {
    /**
     * @param {Object} args
     * @param {string} args.title
     * @param {string} args.message
     * @param {number} [args.status=Status.internalServerError] 
     */

    constructor({ title, message, status = status.internalServerError }) {
        super(message);
        this.name = 'CustomException';
        this.title = title;
        this.status = status;
        this.code = code;
        this.meta = meta;
        // mantiene stack original
        if (Error.captureStackTrace) Error.captureStackTrace(this, CustomException);
    }

    toJSON() {
        return {
            title: this.title,
            message: this.message,
            code: this.code,
            // Por seguridad, no exponer stack en prod. Lo dejamos opcional:
            ...(process.env.NODE_ENV !== 'production' ? { stack: this.stack } : {}),
            ...(this.meta ? { meta: this.meta } : {})
        };
    }

    toJsonString() {
        return JSON.stringify(this.toJSON());
    }
}

