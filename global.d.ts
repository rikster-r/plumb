interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  active: string;
}

interface File {
  id?: number | string;
  url?: string;
  uri?: string;
}

interface Request {
  id: number;
  apartment: number;
  entrance: number;
  floor: number;
  house: string;

  applicant: string | null;
  applicant_phone: string | null;
  customer: string;
  customer_phone: string;

  arrival_time: string;     // e.g. "05.09.2025 11:58"
  complete_time: string;    // same format
  created_at: string;       // same format
  exist_time: string;       // same format

  category: string;         // e.g. "Водопровод", "Электрика"
  problem: string;
  problem_customer: string;
  work_done: string | null;

  intercom_code: string;
  is_copy: boolean;
  paid: boolean;
  priority: string;         // e.g. "Средний", "Низкий"
  status: string;           // e.g. "Принята"
  note: string;
  organization: string;

  files: File[];
  users: string[];
}
