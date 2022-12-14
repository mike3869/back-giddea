import cors, { CorsOptions } from "cors";
import HttpException from "../models/classes/httpException";

const whitelist: Array<string | undefined> = [
  "http://localhost:5000",
  "http://localhost:8080",
  "http://localhost:8081",
  "https://grupoiddea.com",
  "https://sig.giddea.com",
  "undefined",
  undefined,
];

const options: CorsOptions = {
  origin: (origin, callback) => {
    console.log("origin", origin);
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new HttpException(401, "Unauthorized resource"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  preflightContinue: true,
  allowedHeaders: [
    "Authorization",
    "authorization",
    "Content-Type",
    "content-type",
    "VtexIdclientAutCookie",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
export default cors(options);
