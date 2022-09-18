import { SuccessMessage } from "../models/interfaces/message";
import Auth from "../models/classes/auth";

export const login = async(_user: string, _pass: string) => {
  try {
    const auth = new Auth(_user, _pass);
    const token = await auth.login();
    let rsp: SuccessMessage = {
        status: 200,
        msg: "User logged",
        data: token,
      };
    return rsp;
  } catch (error) {
    throw error;
  }
};
