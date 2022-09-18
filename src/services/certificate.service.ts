import { SuccessMessage } from "../models/interfaces/message";
import Certificate from "../models/classes/certificate";

export const getDocumentByUuid = async (_uuid: string) => {
  try {
    const cert = new Certificate(_uuid);
    const stream = await cert.getDocumentById();
    return stream;
  } catch (error) {
    throw error;
  }
};
