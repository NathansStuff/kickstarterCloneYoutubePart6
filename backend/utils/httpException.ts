export default class HttpException extends Error {
    status?: number;
    message: string;
    error: string | null;

    constructor(message: string, status: number, error?: string | null) {
        super(message);
        this.status = status;
        this.message = message;
        this.error = error ?? null;
    }
}

export function ErrorHandler(error: unknown): HttpException {
    if (error instanceof HttpException) {
        throw new HttpException(`Failed to create user: ${error.message}`, 400);
    } else {
        console.log(error);
        throw new HttpException('Unknown error occurred', 500);
    }
}
