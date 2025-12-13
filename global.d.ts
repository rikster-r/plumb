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

  // Location details
  house: House | string | null;
  organization: string | null;
  entrance: number | null;
  floor: number | null;
  apartment: number | null;
  intercom_code: string | null;

  // People involved
  customer: string | null;
  customer_phone: string | null;
  applicant: string | null;
  applicant_phone: string | null;
  users: string[];

  // Timestamps (Format: "DD.MM.YYYY HH:MM")
  arrival_time: string; // e.g. "05.09.2025 11:58"
  complete_time: string; // same format
  created_at: string; // same format
  exist_time: string; // same format

  // Problem description
  problem: string | null;
  problem_customer: string | null;
  work_done: string | null;

  // Additional information
  note: string | null;
  paid: boolean;
  company_transport_id: number | null;

  // Request status and type
  status: string;
  priority: string;
  category: string | null;
  is_copy: boolean;

  files: File[];
}

interface House {
  id: number;
  city: string;
  street: string;
  number: string;
  full_address: string;

  // Optional address components
  region: string | null;
  area: string | null;
  complex: string | null;
  frame: string | null;
  building: string | null;

  // Building characteristics
  count_entrance: number | null;
  count_floor: number | null;
  count_apartment: number | null;
  square: string; // Stored as string in API (e.g., "799.30")

  // Access information
  intercom_code: string | null;
  key_location: string | null;

  // Maintenance schedule
  maintenance_from: string; // Format: "HH:MM"
  maintenance_to: string; // Format: "HH:MM"

  // Location coordinates
  lat: string; // Latitude as string
  long: string; // Longitude as string

  // References
  organization_id: number | null;
  address_type_id: number;

  // Property type
  commercial: boolean;

  // Metadata
  note: string | null;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  deleted_at: string | null; // ISO 8601 format or null
}

interface Organization {
  id: number;
  name: string;
}

interface OrganizationDetailed extends Organization {
  full_name: string | null;
  address: string | null;
  phones: string[];
  schedule_id: number;
  time_from: string; // Format: "HH:MM"
  time_end: string; // Format: "HH:MM"
  start_cooperation: string; // Format: "DD.MM.YYYY"
  end_cooperation: string | null; // Format: "DD.MM.YYYY"
  branch_id: number;
  note: string | null;
}
