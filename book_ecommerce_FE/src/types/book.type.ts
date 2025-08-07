export type Book = {
  id: number;
  title: string;
  description: string;
  price: string;
  discount_percentage: string;
  stock_quantity: number;
  cover_image_url: string;
  sample_page_urls: string[];
  authors: Author[];
  categories: Category[];
  created_at: string;
  updated_at: string;
};

export type Author = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
};

export type BookFormData = {
  title: string;
  description: string;
  price: number;
  discount_percentage: number;
  stock_quantity: number;
  cover_image?: File;
  sample_pages?: FileList | File[];
  author_ids: number[];
  category_ids: number[];
  featured: boolean;
  active: boolean;
  sold_count: number;
  cost_price: number;
};
