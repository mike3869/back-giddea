class HttpException extends Error {
    _status: number;
    _message: string;
    constructor(status: number, message: string){
        super(message);
        this._status = status;
        this._message = message;
    }
}

export default HttpException;