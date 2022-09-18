export interface Customer {
  email: string;
  firstname: string;
  lastname: string;
  document_number: string | number;
  phone: string | number;
  want_information?: string | boolean;
  created_by: string;
  lifecyclestage: string;
}
