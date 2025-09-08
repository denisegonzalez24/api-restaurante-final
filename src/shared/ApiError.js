import Status from "./status.js";

export class ApiError extends Error {
    constructor({ message, status = Status.internalServerError }) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }

    toJSON() {
        return { message: this.message ?? "Error" };
    }
}

