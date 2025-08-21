export const Role = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = typeof Role[keyof typeof Role];


export type PaginationParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type ApiResponse<T> = {
  data:  T;
  status: {
    code: number;
    message: string;
  };
  meta: {
    current_page: number;
    next_page: number;
    prev_page: number;
    total_pages: number;
    total_count: number;
  };
};