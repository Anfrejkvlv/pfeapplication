import { Personne } from "./personne.interface";

export interface CustomHttpResponse{
    timeStamp:Date;
    httpStatusCode:  number,
    httpStatus: string,
    reason: string,
    message: string;
    data: {personnes: any[]};
}
