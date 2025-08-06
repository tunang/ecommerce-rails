export type Author = {
  id: number;
  name: string;
  biography: string;
  nationality: string;
  photo: string; // URL or file path
  birth_date: string; // ISO date string
  created_at: Date;
  updated_at: Date;
};