import express, { Router } from "express";
import helmet from "helmet";
import compression from "compression";

import auth from "../routes/auth.route";
import certificate from "../routes/certificate.route";
import { errorHandler, logErrors } from "../middlewares/error.middleware";
import { pathNotFound } from "../middlewares/pathNotFound.middleware";

const router: Router = Router();

router.use(helmet());
router.use(compression());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/**
 * Rutas
 */
router.use("/auth", auth);
router.use("/certificate", certificate);
router.use(logErrors);
router.use(errorHandler);
router.use(pathNotFound);
export default router;
