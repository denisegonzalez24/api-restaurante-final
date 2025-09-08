import Status from "./status.js";

export class ApiError extends Error {
    constructor({ message, status = Status.internalServerError, stack }) {
        super(message);

        this.title = "ApiError";
        this.status = status;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace?.(this, ApiError);
        }
    }

    toJSON() {
        return {
            message: this.message ?? "Error",
            status: this.status,
            stack: this.stack
        };
    }
}
