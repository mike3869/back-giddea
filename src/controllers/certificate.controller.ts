import { NextFunction, Request, Response } from "express";
import { SuccessMessage } from "../models/interfaces/message";
import HttpException from "../models/classes/httpException";
import * as certificateService from "../services/certificate.service";

export const getPdfByUuid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uuid } = req.params;
    const result: any = await certificateService.getPdfDocumentByUuid(uuid);
    if (result) {
      res.setHeader("Content-Type", "application/pdf");
      result.pipe(res);
    } else {
      throw new Error("Document 'stream' was not returned");
    }
  } catch (error: any) {
    if (error instanceof Error) {
      next(new HttpException(500, error.message));
    } else {
      next(new HttpException(error.code, error.msg));
    }
  }
};

export const getListByQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryList: any = req.query;
    const result: SuccessMessage = await certificateService.getListByQuery(
      queryList
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    if (error instanceof Error) {
      next(new HttpException(500, error.message));
    } else {
      next(new HttpException(error.code, error.msg));
    }
  }
};

export const saveTemplate= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file: any = req.files;
    const template = file["file"];
    const result: SuccessMessage = await certificateService.saveTemplate(
      template
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    if (error instanceof Error) {
      next(new HttpException(500, error.message));
    } else {
      next(new HttpException(error.code, error.msg));
    }
  }
};