import cryptoJS from "crypto";
import { authLogin } from "../../database/auth";
import { environment } from "../../configs/config";
import { sign } from "jsonwebtoken";
import * as jwtCrypto from "../../utils/crypto.util";
const setting = environment();

const SECRET_KEY = setting.JWT.API.SECRET;
const EXPIRES_IN = setting.JWT.API.EXPIRES_IN;

class Auth {
  _username: string;
  _password: string;
  constructor(username: string, password: string) {
    this._username = username;
    this._password = password;
  }
  private async encryptPassword(_pass: string) {
    try {
      const hash = cryptoJS.createHash("sha512");
      const data = await hash.update(_pass, "utf-8");
      const pwd = await data.digest("hex").substring(0, 100);
      return pwd;
    } catch (error) {
      throw error;
    }
  }
  async login() {
    try {
      const username = this._username;
      const password = this._password;

      const pass = await this.encryptPassword(password);
      const user: any = await authLogin(username, pass);
      if (user.length) {
        const payloadJwt = {
          user: {
            name: user[0].username,
          },
        };
        const cert = await jwtCrypto.sign(payloadJwt, SECRET_KEY);
        const token = sign({ ...payloadJwt, cert: cert }, SECRET_KEY, {
          expiresIn: EXPIRES_IN,
        });
        return {
          accessToken: token,
          tokenType: "Bearer",
        };
      } else {
        throw new Error("Invalid username and password");
      }
    } catch (error) {
      throw error;
    }
  }
}

export default Auth;
