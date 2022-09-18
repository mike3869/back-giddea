import { environment } from "./configs/config";
import express, { Application } from "express";
import * as http from "http";
import router from "./routes";
import { PATH_SLUG } from "./configs/const/constants";

const app: Application = express();
const setting = environment();
/**
 * Configuraciones
 */
app.set("port", setting.PORT);
app.use(`/${PATH_SLUG}`, router);
/**
 * Servidor
 */
let host = setting.HOST.toLowerCase();

export const run = (): void => {
  try {
    if (host.indexOf("localhost") > -1) {
      http.createServer(app).listen(app.get("port"), () => {
        console.log(
          `Modo ${setting.ENVIRONMENT}: ${setting.PROTOCOL} express server listening on port ${setting.PORT}`
        );
      });
    }
  } catch (error) {
    console.error(`Initialization failed ${new String(error)}`);
    return;
  }
};
