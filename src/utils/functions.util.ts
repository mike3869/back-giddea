import { Readable } from "stream";
export const excelDateToJSDate = (excelDate: number) => {
  return new Date((excelDate - (25567 + 1)) * 86400 * 1000);
  //   let utc_days = Math.floor(serial - 25569);
  //   let utc_value = utc_days * 86400;
  //   let date_info = new Date(utc_value * 1000);

  //   let fractional_day = serial - Math.floor(serial) + 0.0000001;

  //   let total_seconds = Math.floor(86400 * fractional_day);

  //   let seconds = total_seconds % 60;

  //   total_seconds -= seconds;

  //   let hours = Math.floor(total_seconds / (60 * 60));
  //   let minutes = Math.floor(total_seconds / 60) % 60;

  //   return new Date(
  //     date_info.getFullYear(),
  //     date_info.getMonth(),
  //     date_info.getDate(),
  //     hours,
  //     minutes,
  //     seconds
  //   );
};
export const bufferToStream = (buffer: any) => {
  var stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};
export const removeRouteExtension = (fileName: string) => {
  return fileName.split(".").shift();
};
