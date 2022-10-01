import { escape } from "mysql";
import { SuccessMessage } from "../models/interfaces/message";
import Certificate from "../models/classes/certificate";

export const getPdfDocumentByUuid = async (_uuid: string) => {
  try {
    const cert = new Certificate(_uuid);
    const stream = await cert.getDocumentById();
    return stream;
  } catch (error) {
    throw error;
  }
};

export const getListByQuery = async (_queryList: any) => {
  try {
    const queries: [string, string][] = Object.entries(_queryList);
    let page = 1;
    let size = 25;
    const cert = new Certificate();
    let list: any;
    if (queries.length > 0) {
      let filters = [];
      for (const item of queries) {
        switch (item[0]) {
          case "size":
            const length: number = Number(item[1]);
            if (!isNaN(length) && length > 0 && length <= 150) {
              size = length;
            }
            break;
          case "page":
            const pages: number = Number(item[1]);
            if (!isNaN(pages) && pages > 0) {
              page = pages;
            }
            break;
          case "documentCode":
            const documentCode: string = item[1];
            if (documentCode != "") {
              filters.push(`c.person_document_code =  ${escape(documentCode)}`);
            }
            break;
          default:
            break;
        }
      }
      const queryFilters = filters.join(" AND ");
      list = await cert.getListByQuery(page, size, queryFilters);
    } else {
      list = await cert.getListByQuery(page, size, "");
    }
    let rsp: SuccessMessage = {
      status: 200,
      msg: "Certificate List",
      data: list,
    };
    return rsp;
  } catch (error) {
    throw error;
  }
};
