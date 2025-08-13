export interface Address {
  id: number;
  user_id?: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}