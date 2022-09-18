import { Request, Response, NextFunction } from "express";
import HttpException from "../models/classes/httpException";
import { ErrorMessage } from "../models/interfaces/message";

export const logErrors = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const today: number = new Date().valueOf();
  console.error("/******************INICIO***********************/")
  console.error(`LOG ERROR NAME (${today}) => `, err.name);
  console.error(`LOG ERROR MESSAGE (${today}) => `, err._message);
  console.error(`LOG ERROR STATUS (${today}) => `, err._status);
  console.error(`LOG ERROR STACK (${today}) => `, err.stack);
  console.error("/*******************FIN************************/")
  next(err);
};

export const errorHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err._status || 500;
  const message = err._message || "Something went wrong";
  const response: ErrorMessage = { status: status, msg: message };
  res.status(status).json({
    error: response,
  });
};




