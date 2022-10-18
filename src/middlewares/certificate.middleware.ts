import { Request, Response, NextFunction } from "express";
import fileUpload from "express-fileupload";
import HttpException from "../models/classes/httpException";

export const uploadTemplate = fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: "/tmp/",
});

export const validateTemplate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files: any = req.files;
    const template: any = files["file"];

    // Array of allowed files
    const array_of_allowed_files = ["xls", "xlsx"];
    const array_of_allowed_file_types = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    // Allowed file size in mb
    const allowed_file_size = 2;

    // Get the extension of the uploaded file
    const file_extension = template.name.slice(
      ((template.name.lastIndexOf(".") - 1) >>> 0) + 2
    );

    // Check if the uploaded file is allowed
    if (
      !array_of_allowed_files.includes(file_extension) ||
      !array_of_allowed_file_types.includes(template.mimetype)
    ) {
      throw new HttpException(500, "Invalid file");
    }
    if (template.size / (1024 * 1024) > allowed_file_size) {
      throw new HttpException(500, "File too large");
    }
    next();
  } catch (error) {
    throw error;
  }
};
