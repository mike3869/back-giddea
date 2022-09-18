import { Request, Response, NextFunction } from "express";
import { ErrorMessage } from "../models/interfaces/message";
export const pathNotFound = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const status = 404;
    const message = "Resource not found";
    const response: ErrorMessage = { status: status, msg: message };
    res.status(status).json({
      error: response,
    });
  };