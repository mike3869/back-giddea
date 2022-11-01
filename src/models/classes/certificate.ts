import pdf from "html-pdf";
import fs from "fs";
import path from "path";
import qrcode from "qrcode";
import moment from "moment";

import {
  getByUuid,
  getCertificateListPagination,
  getCertificateListByFilters,
  bulkInsertCertificates,
} from "../../database/certificate";
import { PATH_SLUG } from "../../configs/const/constants";
import { ICertificate } from "../../models/interfaces/certificate";

const OPTIONS_TYPE: any = {
  portrait: {
    format: "A4",
    header: { height: "0.5mm" },
    orientation: "portrait",
    border: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
  },
  landscape: {
    format: "A4",
    header: { height: "0.5mm" },
    orientation: "landscape",
    border: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
  },
};
const CONFIG_TYPES: any = {
  tipo_1: { ...OPTIONS_TYPE.landscape },
  tipo_2: { ...OPTIONS_TYPE.landscape },
  tipo_3: { ...OPTIONS_TYPE.portrait },
  tipo_4: { ...OPTIONS_TYPE.landscape },
  tipo_5: { ...OPTIONS_TYPE.landscape },
  tipo_6: { ...OPTIONS_TYPE.landscape },
};

class Certificate {
  _uuid: string | undefined;
  constructor(uuid?: string) {
    this._uuid = uuid;
  }
  private getMonthName(_num: number) {
    const num = _num + 1;
    let name = "";
    switch (num) {
      case 1:
        name = "Enero";
        break;
      case 2:
        name = "Febrero";
        break;
      case 3:
        name = "Marzo";
        break;
      case 4:
        name = "Abril";
        break;
      case 5:
        name = "Mayo";
        break;
      case 6:
        name = "Junio";
        break;
      case 7:
        name = "Julio";
        break;
      case 8:
        name = "Agosto";
        break;
      case 9:
        name = "Septiembre";
        break;
      case 10:
        name = "Octubre";
        break;
      case 11:
        name = "Noviembre";
        break;
      case 12:
        name = "Diciembre";
        break;
      default:
        break;
    }
    return name;
  }
  private modifyTemplateForDates(
    _temp: string,
    _start_date: string,
    _end_date: string
  ) {
    let temp = _temp;
    const start_date = moment(_start_date);
    const end_date = moment(_end_date);
    const diff = start_date.diff(end_date, "days");
    const sd_day = start_date.date();
    const sd_month = this.getMonthName(start_date.month());
    const sd_year = start_date.year();
    const ed_day = end_date.date();
    const ed_month = this.getMonthName(end_date.month());
    const ed_year = end_date.year();
    if (diff == 0 || _end_date == null || !_end_date) {
      temp = temp.replace("{{END-DATE}}", ``);
      temp = temp.replace(
        "{{START-DATE}}",
        `el ${sd_day} de ${sd_month.toLowerCase()} del ${sd_year}`
      );
    } else {
      const sd_text =
        sd_year == ed_year
          ? `desde el ${sd_day} de ${sd_month.toLowerCase()}`
          : `desde el ${sd_day} de ${sd_month.toLowerCase()} del ${sd_year}`;
      temp = temp.replace("{{START-DATE}}", sd_text);
      temp = temp.replace(
        "{{END-DATE}}",
        `hasta el ${ed_day} de ${ed_month.toLowerCase()} del ${ed_year}`
      );
    }
    return temp;
  }
  private modifyTemplateFields(
    _temp: string,
    _student: string,
    _course: string,
    _hours: number | string,
    _uuid: string,
    _print_date: string
  ) {
    let temp = _temp;
    const student_name = _student;
    const course_name = _course;
    const course_hours = _hours;
    const uuid = _uuid;
    const print_date = moment(_print_date);
    temp = temp.replace("{{STUDENT-NAME}}", `${student_name.toUpperCase()}`);
    temp = temp.replace("{{COURSE-NAME}}", `${course_name.toUpperCase()}`);
    temp = temp.replace("{{COURSE-HOURS}}", `${course_hours}`);
    temp = temp.replace("{{DOCUMENT-UUID}}", `${uuid}`);
    const pd_month = this.getMonthName(print_date.month());
    const pd_year = print_date.year();
    temp = temp.replace("{{PRINT-DATE}}", `${pd_month} ${pd_year}`);
    return temp;
  }
  async getById() {
    try {
      const uuid = this._uuid;
      if (uuid) {
        const document: any = await getByUuid(uuid);
        return document[0];
      } else {
        throw new Error("The id is not recognized");
      }
    } catch (error) {
      throw error;
    }
  }
  async getListByQuery(
    _page: number = 1,
    _size: number = 25,
    _filters: string = ""
  ) {
    try {
      const page = _page < 0 ? 0 : _page;
      const size = _size < 0 ? 0 : _size;
      const init = (page - 1) * _size;
      const list = await getCertificateListByFilters(init, size, _filters);
      const pages: any = await getCertificateListPagination(_filters);
      return {
        list: list,
        pagination: {
          ...pages[0],
          limit: size,
          page: page,
          total_page: Math.ceil(pages[0].total / size),
        },
      };
    } catch (error) {
      throw error;
    }
  }
  getDocumentById() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const uuid = this._uuid;
        if (uuid) {
          const document: any = await getByUuid(uuid);
          const type = document[0].template.toLowerCase().replace(" ", "_");
          const pathFile = path.resolve(
            __dirname,
            "../../templates/certificate/"
          );
          const html = fs.readFileSync(`${pathFile}/${type}.html`, "utf-8");
          const background = fs.readFileSync(
            `${pathFile}/images/${type}.png`,
            "base64"
          );
          const qr = await qrcode.toDataURL(
            `https://grupoiddea.com/${PATH_SLUG}/certificate/${uuid}`
          );
          let temp = html.replace(
            "{{BACKGROUND_CERTIFICATE}}",
            `data:image/png;base64,${background}`
          );
          temp = temp.replace("{{QR_IMAGE}}", `${qr}`);

          switch (type) {
            case "tipo_1":
              temp = this.modifyTemplateFields(
                temp,
                document[0].student_name,
                document[0].course_name,
                document[0].course_hours,
                document[0].uuid,
                document[0].print_date
              );
              temp = this.modifyTemplateForDates(
                temp,
                document[0].start_date,
                document[0].end_date
              );
              break;
            case "tipo_2":
              temp = this.modifyTemplateFields(
                temp,
                document[0].student_name,
                document[0].course_name,
                document[0].course_hours,
                document[0].uuid,
                document[0].print_date
              );
              temp = this.modifyTemplateForDates(
                temp,
                document[0].start_date,
                document[0].end_date
              );
              temp = temp.replace(
                "{{COURSE-SCORE}}",
                `${Number(document[0].course_score).toFixed(2)}`
              );
              break;
            case "tipo_3":
              temp = this.modifyTemplateFields(
                temp,
                document[0].student_name,
                document[0].course_name,
                document[0].course_hours,
                document[0].uuid,
                document[0].print_date
              );
              temp = this.modifyTemplateForDates(
                temp,
                document[0].start_date,
                document[0].end_date
              );
              const list = document[0].course_list.split("|");
              let listHtml = "";
              list.forEach((item: any, index: number) => {
                if (index == 0) listHtml += "<ul>";
                listHtml += `<li>${item}</li>`;
                if (index == list.length - 1) listHtml += "</ul>";
              });
              temp = temp.replace("{{COURSE-LIST}}", `${listHtml}`);
              break;
            case "tipo_4":
              temp = this.modifyTemplateFields(
                temp,
                document[0].student_name,
                document[0].course_name,
                document[0].course_hours,
                document[0].uuid,
                document[0].print_date
              );
              temp = this.modifyTemplateForDates(
                temp,
                document[0].start_date,
                document[0].end_date
              );
              break;
            case "tipo_5":
              temp = this.modifyTemplateFields(
                temp,
                document[0].student_name,
                document[0].course_name,
                document[0].course_hours,
                document[0].uuid,
                document[0].print_date
              );
              temp = this.modifyTemplateForDates(
                temp,
                document[0].start_date,
                document[0].end_date
              );
              break;
            case "tipo_6":
              temp = this.modifyTemplateFields(
                temp,
                document[0].student_name,
                document[0].course_name,
                document[0].course_hours,
                document[0].uuid,
                document[0].print_date
              );
              temp = this.modifyTemplateForDates(
                temp,
                document[0].start_date,
                document[0].end_date
              );
              break;
            default:
              break;
          }

          const options = { ...CONFIG_TYPES[type] };
          pdf.create(temp, options).toStream((err, stream) => {
            if (err) {
              reject(new Error(err.stack));
            } else {
              resolve(stream);
            }
          });
        } else {
          reject(new Error("The id is not recognized"));
        }
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
  saveExcelFile(_rows: ICertificate[]) {
    return new Promise(async (resolve, reject) => {
      try {
        const numRows = 1000;
        let errors: any[] = [];
        let successes: any[] = [];
        for (let i = 0; i < _rows.length; i += numRows) {
          let errorsTemp: any[] = [];
          try {
            const temp: ICertificate[] = _rows.slice(i, i + numRows);
            errorsTemp = temp;
            await bulkInsertCertificates(temp);
            const newData = errorsTemp.map((obj) => {
              return { ...obj, message: "created" };
            });
            successes.push(...newData);
            errorsTemp = [];
          } catch (err) {
            const newData = errorsTemp.map((obj) => {
              return { ...obj, message: String(err) };
            });
            successes.push(...newData);
            errorsTemp = [];
          }
        }
        if (errors.length > 0) {
          reject({
            code: 449,
            msg: JSON.stringify([...successes, ...errors]),
          });
        }
        resolve(successes);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Certificate;
