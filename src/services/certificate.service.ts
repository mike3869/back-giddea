import { escape } from "mysql";
import XLSX, { WritingOptions } from "xlsx";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { SuccessMessage } from "../models/interfaces/message";
import { ICertificate } from "../models/interfaces/certificate";
import Certificate from "../models/classes/certificate";
import { excelDateToJSDate, bufferToStream } from "../utils/functions.util";

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

export const saveTemplate = async (_template: any) => {
  try {
    const path: string = _template.tempFilePath;
    const file: any = XLSX.readFile(path);
    let data: any[] = [];
    const sheet = file.Sheets["Certificates"];
    const rows = XLSX.utils.sheet_to_json(sheet);
    rows.forEach((item: any) => {
      const row: ICertificate = {
        uuid: item["CODIGO"] ? String(item["CODIGO"]).trim() : uuidv4(),
        certificate_type_id: Number(
          String(item["TIPO CERTIFICADO"].split("|")[1]).trim()
        ).valueOf(),
        certificate_template_id: Number(
          String(item["PLANTILLA"].split("|")[1]).trim()
        ).valueOf(),
        student_name: String(item["ALUMNO"]).trim(),
        course_name: String(item["CURSO"].split("|")[0]).trim(),
        course_id: Number(String(item["CURSO"].split("|")[1]).trim()).valueOf(),
        course_hours: item["HORAS CURSO"]
          ? Number(item["HORAS CURSO"]).valueOf()
          : null,
        course_score: item["NOTA CURSO"]
          ? Number(item["NOTA CURSO"]).valueOf()
          : null,
        start_date: moment(
          excelDateToJSDate(Number(item["FECHA INICIO"]).valueOf())
        ).format("YYYY-MM-DD"),
        end_date: item["FECHA FIN"]
          ? moment(
              excelDateToJSDate(Number(item["FECHA FIN"]).valueOf())
            ).format("YYYY-MM-DD")
          : null,
        person_identity_document_types_id: item["TIPO DOCUMENTO"]
          ? Number(
              String(item["TIPO DOCUMENTO"].split("|")[1]).trim()
            ).valueOf()
          : null,
        person_document_code: item["NUMERO DOCUMENTO"]
          ? String(item["NUMERO DOCUMENTO"]).trim()
          : null,
        course_list: item["LISTA CURSOS"]
          ? String(item["LISTA CURSOS"]).trim()
          : "",
      };
      data.push(row);
    });
    const cert = new Certificate();
    const saveExcelFile: any = await cert.saveExcelFile(data);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(saveExcelFile);
    XLSX.utils.book_append_sheet(wb, ws, "Certificates");
    const wb_opts: WritingOptions = { bookType: "xlsx", type: "buffer" };
    const streamFile = XLSX.write(wb, wb_opts);
    const stream = bufferToStream(streamFile);
    return stream;
  } catch (error) {
    throw error;
  }
};
