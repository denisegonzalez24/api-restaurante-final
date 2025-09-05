import Status from "./status.js";



export class CustomException extends Error {
    constructor({ message, status = Status.internalServerError }) {
        super(message);
        this.name = "CustomException";
        this.status = status;
        if (Error.captureStackTrace) Error.captureStackTrace(this, CustomException);
    }

    toJSON() {
        return { message: this.message ?? "Error" };
    }
}

