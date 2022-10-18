export interface ICertificate {
  uuid: string;
  certificate_type_id: number;
  certificate_template_id: number;
  student_name: string;
  course_name: string;
  course_hours?: number | null;
  course_score?: number | null;
  start_date?: string;
  end_date?: string | null;
  print_date?: string;
  course_list?: string | null;
  person_identity_document_types_id?: number | null;
  person_document_code?: string | null;
  course_id?: number | null;
}
