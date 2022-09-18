import { Request, Response, Router } from "express";
import fs from "fs";
import fileUpload from "express-fileupload";
import reader from "xlsx";
import { v4 as uuidv4 } from "uuid";

import * as certificateController from "../controllers/certificate.controller";
const router: Router = Router();

router.get("/:uuid", certificateController.getByUuid);

router.post(
  "/",
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
  async (req: Request, res: Response) => {
    try {
      let files: any = req.files;
      console.log("files", files);
      Object.keys(files).forEach((key) => {
        const buff = files[key].name;
        console.log("key", buff);

        // Requiring the module

        const ruta = files[key].tempFilePath;
        // Reading our test file
        const file = reader.readFile(ruta);

        let data: any[] = [];

        const sheets = file.SheetNames;

        for (let i = 0; i < sheets.length; i++) {
          const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]]
          );
          // console.log("temp", temp);
          temp.forEach((res: any) => {
            data.push({ ...res, uuid: uuidv4() });
          });
        }
        var jsonContent = JSON.stringify(data);
        fs.writeFile("output.json", jsonContent, "utf8", function (err) {
          if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
          }

          console.log("JSON file has been saved.");
        });
        // Printing data
        // console.log("data", data);
      });
      res.status(200).end("Listo");
    } catch (err) {
      console.log("error", err);
      res.status(500).end("Error creando PDF: " + err);
    }
  }
);

export default router;
