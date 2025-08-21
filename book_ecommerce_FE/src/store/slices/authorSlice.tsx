import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Author } from '@/types/author.type';

interface AuthorState {
  authors: Author[];
  currentAuthor: Author | null;
  isLoading: boolean;
  error: string | null;
  totalAuthors: number;
  currentPage: number;
  pageSize: number;
  // Pagination từ API response
  pagination: {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
  };
}

const initialState: AuthorState = {
  authors: [],
  currentAuthor: null,
  isLoading: false,
  error: null,
  totalAuthors: 0,
  currentPage: 1,
  pageSize: 10,
  pagination: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 0,
  },
};

const authorSlice = createSlice({
  name: 'author',
  initialState,
  reducers: {
    // Fetch authors actions
    fetchAuthorsRequest: (state, _action: PayloadAction<{ page?: number; per_page?: number; search?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAuthorsSuccess: (state, action: PayloadAction<{ 
      authors: Author[]; 
      total: number; 
      page: number; 
      per_page: number;
      pagination?: {
        current_page: number;
        next_page: number | null;
        prev_page: number | null;
        total_pages: number;
        total_count: number;
      }
    }>) => {
      state.isLoading = false;
      state.authors = action.payload.authors;
      state.totalAuthors = action.payload.total;
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.per_page;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
      state.error = null;
    },
    fetchAuthorsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch single author actions
    fetchAuthorByIdRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAuthorByIdSuccess: (state, action: PayloadAction<Author>) => {
      state.isLoading = false;
      state.currentAuthor = action.payload;
      state.error = null;
    },
    fetchAuthorByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create author actions
    createAuthorRequest: (state, _action: PayloadAction<{ name: string; biography: string; nationality: string; photo?: File; birth_date: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    createAuthorSuccess: (state, action: PayloadAction<Author>) => {
      state.isLoading = false;
      state.authors.unshift(action.payload);
      state.totalAuthors += 1;
      state.error = null;
    },
    createAuthorFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update author actions
    updateAuthorRequest: (state, _action: PayloadAction<{ id: number; author: { name: string; biography: string; nationality: string; photo?: File; birth_date: string } }>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateAuthorSuccess: (state, action: PayloadAction<Author>) => {
      state.isLoading = false;
      const index = state.authors.findIndex(author => author.id === action.payload.id);
      if (index !== -1) {
        state.authors[index] = action.payload;
      }
      if (state.currentAuthor?.id === action.payload.id) {
        state.currentAuthor = action.payload;
      }
      state.error = null;
    },
    updateAuthorFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete author actions
    deleteAuthorRequest: (state, _action: PayloadAction<{ authorId: number }>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteAuthorSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.authors = state.authors.filter(author => author.id !== action.payload);
      state.totalAuthors -= 1;
      if (state.currentAuthor?.id === action.payload) {
        state.currentAuthor = null;
      }
      state.error = null;
    },
    deleteAuthorFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current author
    clearCurrentAuthor: (state) => {
      state.currentAuthor = null;
    },
  },
});

export const {
  fetchAuthorsRequest,
  fetchAuthorsSuccess,
  fetchAuthorsFailure,
  fetchAuthorByIdRequest,
  fetchAuthorByIdSuccess,
  fetchAuthorByIdFailure,
  createAuthorRequest,
  createAuthorSuccess,
  createAuthorFailure,
  updateAuthorRequest,
  updateAuthorSuccess,
  updateAuthorFailure,
  deleteAuthorRequest,
  deleteAuthorSuccess,
  deleteAuthorFailure,
  clearError,
  clearCurrentAuthor,
} = authorSlice.actions;

export default authorSlice.reducer;
