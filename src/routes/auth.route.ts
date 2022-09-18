import { Router } from "express";
import cors from "../configs/origin";
import * as authController from '../controllers/auth.controller';

const router: Router = Router();
router.use(cors);
router.post('/', authController.login);

export default router;