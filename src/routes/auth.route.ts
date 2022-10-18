import { Router } from "express";
import cors from "../configs/origin";
import * as authController from "../controllers/auth.controller";

const router: Router = Router();

router.options("/", cors);

router.post("/", cors, authController.login);

export default router;
