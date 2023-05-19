import {Response} from "express";

export const JsonResponse = (res:Response, message:string, success:boolean, data:any, statusCode:number ) => {
  res.status(statusCode).json({
    message,
    success,
    data
  })
}