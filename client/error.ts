import { AxiosResponse } from "axios"

export class ClientError extends Error {
    data: any
    res: AxiosResponse
    constructor({
        msg,
        data,
        res
    }) {
        super(msg)
        
        this.name = "ClientApiError"
        this.res = res
        this.data = data;

    }
}
