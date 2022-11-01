import express, { Application, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import * as http from "http";
import { environment } from "./configs/config";
import router from "./routes";
import { errorHandler, logErrors } from "./middlewares/error.middleware";
import { pathNotFound } from "./middlewares/pathNotFound.middleware";
import { PATH_SLUG } from "./configs/const/constants";

const app: Application = express();
const setting = environment();
/**
 * Configuraciones
 */
app.set("port", setting.PORT);

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(`/${PATH_SLUG}`, router);
app.get("/", (req, res: Response) => {
  res.status(200).json({
    msg: "!Bienvenido al proyecto Grupo Iddea!",
  });
});
app.use(logErrors);
app.use(errorHandler);
app.use(pathNotFound);

/**
 * Servidor
 */
let host = setting.HOST.toLowerCase();
console.log("host", host);
export const run = (): void => {
  try {
    http.createServer(app).listen(app.get("port"), () => {
      console.log(
        `Modo ${setting.ENVIRONMENT}: ${setting.PROTOCOL} express server listening on port ${setting.PORT}`
      );
    });
  } catch (error) {
    console.error(`Initialization failed ${new String(error)}`);
    return;
  }
};
