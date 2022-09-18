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
