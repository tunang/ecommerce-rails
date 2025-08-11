import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
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
} from '../slices/categorySlice';
import type { SagaIterator } from 'redux-saga';
import api from '@/services/api.service';

// Fetch categories saga
function* fetchCategoriesSaga(action: PayloadAction<{ page?: number; per_page?: number; search?: string }>): SagaIterator {
  try {
    const { page = 1, per_page = 10, search = '' } = action.payload;
    
    const response: any = yield call(api.get, '/categories', {
      params: {
        page,
        per_page,
        search,
      },
    });
    yield put(fetchCategoriesSuccess({
      categories: response.data.categories || response,
      total: response.total || response.length,
      page: response.page || page,
      per_page: response.per_page || per_page,
    }));
  } catch (error: any) {
    yield put(fetchCategoriesFailure(error.response?.data?.message || 'Lỗi khi tải danh sách thể loại'));
  }
}

// Fetch neatest categories saga
function* fetchNeatestCategoriesSaga(): SagaIterator {
  try {

    const response: any = yield call(api.get, '/categories/user/get_nested_category');

    yield put(fetchNeatestCategoriesSuccess({
      categories: response.data.categories || response,
    }));
  } catch (error: any) {
    yield put(fetchNeatestCategoriesFailure(error.response?.data?.message || 'Lỗi khi tải danh sách thể loại'));
  }
}

// Fetch category by ID saga
function* fetchCategoryByIdSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const categoryId = action.payload;
    
    const response: any = yield call(api.get, `/categories/${categoryId}`);
    yield put(fetchCategoryByIdSuccess(response.data || response));
  } catch (error: any) {
    yield put(fetchCategoryByIdFailure(error.response?.data?.message || 'Lỗi khi tải thông tin thể loại'));
  }
}

// Create category saga
function* createCategorySaga(action: PayloadAction<{ name: string; description?: string; parent_id?: number | null; active?: boolean }>): SagaIterator {
  try {
    const categoryData = action.payload;
    
    const response: any = yield call(api.post, '/categories', { category: categoryData });
    yield put(createCategorySuccess(response.data.category || response.data));
  } catch (error: any) {
    yield put(createCategoryFailure(error.response?.data?.message || 'Lỗi khi tạo thể loại'));
  }
}

// Update category saga
function* updateCategorySaga(action: PayloadAction<{ id: number; category: { name: string; description?: string; parent_id?: number | null; active?: boolean } }>): SagaIterator {
  try {
    const { id, category } = action.payload;
    
    const response: any = yield call(api.patch, `/categories/${id}`, { category });
    yield put(updateCategorySuccess(response.data.category || response.data));
  } catch (error: any) {
    yield put(updateCategoryFailure(error.response?.data?.message || 'Lỗi khi cập nhật thể loại'));
  }
}

// Delete category saga
function* deleteCategorySaga(action: PayloadAction<{ categoryId: number }>): SagaIterator {
  try {
    const { categoryId } = action.payload;
    
    yield call(api.delete, `/categories/${categoryId}`);
    yield put(deleteCategorySuccess(categoryId));
  } catch (error: any) {
    yield put(deleteCategoryFailure(error.response?.data?.message || 'Lỗi khi xóa thể loại'));
  }
}

// Root category saga
export function* categorySaga(): SagaIterator {
  yield takeLatest(fetchCategoriesRequest.type, fetchCategoriesSaga);
  yield takeLatest(fetchNeatestCategoriesRequest.type, fetchNeatestCategoriesSaga);
  yield takeLatest(fetchCategoryByIdRequest.type, fetchCategoryByIdSaga);
  yield takeLatest(createCategoryRequest.type, createCategorySaga);
  yield takeLatest(updateCategoryRequest.type, updateCategorySaga);
  yield takeLatest(deleteCategoryRequest.type, deleteCategorySaga);
}
