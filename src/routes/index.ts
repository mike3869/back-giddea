import { Router } from "express";
import fs from "fs";
import { removeRouteExtension } from "../utils/functions.util";
const router: Router = Router();
/**
 * Rutas
 */
const PATH_ROUTES = __dirname;
fs.readdirSync(PATH_ROUTES).filter((file) => {
  const name = removeRouteExtension(file);
  if (name !== "index") {
    import(`./${file}`).then((routeFile) => {
      router.use(`/${name}`, routeFile.default);
    });
  }
});

export default router;
