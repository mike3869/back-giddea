import env from "dotenv";
import path from "path";
import config from "./config.json";

const setting: any = config;

env.config({
  path: path.join(__dirname, ".env"),
});

interface Environment {
  ENVIRONMENT: string;
  HOST: string;
  PROTOCOL: string;
  PORT: number;
  CREDENTIALS: any;
  DB: any;
  JWT: any;
}

export const environment = (): Environment => {
  const environment: string = process.env.NODE_ENV
    ? String(process.env.NODE_ENV).trim()
    : "DEVELOPMENT";
  return setting[environment];
};
