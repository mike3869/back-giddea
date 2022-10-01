import { querySelect } from "../utils/sql-query.util";

export const getByUuid = async (_uuid: string) => {
  try {
    const query = `SELECT c.uuid, ct.name AS template, c.student_name,c.course_name,c.course_hours, c.course_score,c.start_date, c.end_date, c.print_date, c.course_list FROM certificate AS c INNER JOIN certificate_template AS ct ON c.certificate_template_id = ct.id WHERE c.uuid = ?`;
    const result = await querySelect(query, [_uuid]);
    return result;
  } catch (error) {
    throw error;
  }
};
export const getCertificateListPagination = async (
  _filters: string
) => {
  try {
    const query = `SELECT COUNT(*) as total FROM certificate AS c INNER JOIN certificate_type AS ct ON c.certificate_type_id = ct.id ${
      _filters != "" ? " WHERE " + _filters : ""
    };`;
    const result = await querySelect(query, []);
    return result;
  } catch (error) {
    throw error;
  }
};
export const getCertificateListByFilters = async (
  _page: number,
  _size: number,
  _filters: string
) => {
  try {
    const query = `SELECT c.uuid,c.certificate_type_id, ct.name AS certificate_type, c.certificate_template_id, c.person_identity_document_types_id, c.person_document_code, c.student_name,c.course_id,c.course_name,c.course_list, c.course_hours,c.course_score,c.start_date,c.end_date, c.print_date FROM certificate AS c INNER JOIN certificate_type AS ct ON c.certificate_type_id = ct.id ${
      _filters != "" ? " WHERE " + _filters : ""
    } ORDER BY c.print_date DESC LIMIT ?, ?;`;
    const result = await querySelect(query, [_page, _size]);
    return result;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
