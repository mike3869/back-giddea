import { NextFunction, Request, Response } from "express";
import { SuccessMessage } from "../models/interfaces/message";
import HttpException from "../models/classes/httpException";
import * as authService from "../services/auth.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const result: SuccessMessage = await authService.login(username, password);
    res.status(result.status).json(result);
  } catch (error: any) {
    if (error instanceof Error) {
      next(new HttpException(500, error.message));
    } else {
      next(new HttpException(error.code, error.msg));
    }
  }
};
