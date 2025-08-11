import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '@/types/category.type';

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  totalCategories: number;
  currentPage: number;
  pageSize: number;
}

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
  totalCategories: 0,
  currentPage: 1,
  pageSize: 10,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Fetch categories actions
    fetchCategoriesRequest: (state, _action: PayloadAction<{ page?: number; per_page?: number; search?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<{ categories: Category[]; total: number; page: number; per_page: number }>) => {
      state.isLoading = false;
      state.categories = action.payload.categories;
      state.totalCategories = action.payload.total;
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.per_page;
      state.error = null;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch neatest categories actions
    fetchNeatestCategoriesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchNeatestCategoriesSuccess: (state, action: PayloadAction<{ categories: Category[] }>) => {
      state.isLoading = false;
      state.categories = action.payload.categories;
      state.error = null;
    },

    fetchNeatestCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch single category actions
    fetchCategoryByIdRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoryByIdSuccess: (state, action: PayloadAction<Category>) => {
      state.isLoading = false;
      state.currentCategory = action.payload;
      state.error = null;
    },
    fetchCategoryByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create category actions
    createCategoryRequest: (state, _action: PayloadAction<{ name: string; description?: string; parent_id?: number | null; active?: boolean }>) => {
      state.isLoading = true;
      state.error = null;
    },
    createCategorySuccess: (state, action: PayloadAction<Category>) => {
      state.isLoading = false;
      state.categories.unshift(action.payload);
      state.totalCategories += 1;
      state.error = null;
    },
    createCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update category actions
    updateCategoryRequest: (state, _action: PayloadAction<{ id: number; category: { name: string; description?: string; parent_id?: number | null; active?: boolean } }>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateCategorySuccess: (state, action: PayloadAction<Category>) => {
      console.log(action.payload);
      state.isLoading = false;
      const index = state.categories.findIndex(category => category.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      if (state.currentCategory?.id === action.payload.id) {
        state.currentCategory = action.payload;
      }
      state.error = null;
    },
    updateCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete category actions
    deleteCategoryRequest: (state, _action: PayloadAction<{ categoryId: number }>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteCategorySuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.categories = state.categories.filter(category => category.id !== action.payload);
      state.totalCategories -= 1;
      if (state.currentCategory?.id === action.payload) {
        state.currentCategory = null;
      }
      state.error = null;
    },
    deleteCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current category
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
});

export const {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchNeatestCategoriesRequest,
  fetchNeatestCategoriesSuccess,
  fetchNeatestCategoriesFailure,
  fetchCategoryByIdRequest,
  fetchCategoryByIdSuccess,
  fetchCategoryByIdFailure,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure,
  clearError,
  clearCurrentCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
