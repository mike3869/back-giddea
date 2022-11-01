import { Router } from "express";


import cors from "../configs/origin";
import * as certificateMiddleware from "../middlewares/certificate.middleware";
import * as certificateController from "../controllers/certificate.controller";

const router: Router = Router();

router.get("/pdf/:uuid", certificateController.getPdfByUuid);
router.get(
  "/list",
  cors,
  certificateController.getListByQuery
);
router.post(
  "/template",
  cors,
  certificateMiddleware.uploadTemplate,
  certificateMiddleware.validateTemplate,
  certificateController.saveTemplate
);


export default router;
