import { environment } from "./configs/config";
import express, { Application, Response } from "express";
import * as http from "http";
import router from "./routes";
import { PATH_SLUG } from "./configs/const/constants";

const app: Application = express();
const setting = environment();
/**
 * Configuraciones
 */
app.set("port", setting.PORT);
app.get("/", (req, res: Response) => {
  res.status(200).json({
    msg: "!Bienvenido al proyecto Grupo Iddea!",
  });
});
app.use(`/${PATH_SLUG}`, router);
/**
 * Servidor
 */
let host = setting.HOST.toLowerCase();
console.log('host', host)
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
