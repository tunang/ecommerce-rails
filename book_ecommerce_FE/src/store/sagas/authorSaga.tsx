import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
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
} from '../slices/authorSlice';
import type { SagaIterator } from 'redux-saga';
import api from '@/services/api.service';

// Fetch authors saga
function* fetchAuthorsSaga(action: PayloadAction<{ page?: number; per_page?: number; search?: string }>): SagaIterator {
  try {
    const { page = 1, per_page = 10, search = '' } = action.payload;
    
    const response: any = yield call(api.get, '/authors', {
      params: {
        page,
        per_page,
        search,
      },
    });
    
    yield put(fetchAuthorsSuccess({
      authors: response.data.authors || response,
      total: response.total || response.length,
      page: response.page || page,
      per_page: response.per_page || per_page,
    }));
  } catch (error: any) {
    yield put(fetchAuthorsFailure(error.response?.data?.message || 'Lỗi khi tải danh sách tác giả'));
  }
}

// Fetch author by ID saga
function* fetchAuthorByIdSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const authorId = action.payload;
    
    const response: any = yield call(api.get, `/authors/${authorId}`);
    yield put(fetchAuthorByIdSuccess(response.data || response));
  } catch (error: any) {
    yield put(fetchAuthorByIdFailure(error.response?.data?.message || 'Lỗi khi tải thông tin tác giả'));
  }
}

// Create author saga
function* createAuthorSaga(action: PayloadAction<{ name: string; biography: string; nationality: string; photo?: File; birth_date: string }>): SagaIterator {
  try {
    const authorData = action.payload;
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('author[name]', authorData.name);
    formData.append('author[biography]', authorData.biography);
    formData.append('author[nationality]', authorData.nationality);
    formData.append('author[birth_date]', authorData.birth_date);
    
    if (authorData.photo) {
      formData.append('author[photo]', authorData.photo);
    }
    
    const response: any = yield call(api.post, '/authors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    yield put(createAuthorSuccess(response.data.author || response.data));
  } catch (error: any) {
    yield put(createAuthorFailure(error.response?.data?.message || 'Lỗi khi tạo tác giả'));
  }
}

// Update author saga
function* updateAuthorSaga(action: PayloadAction<{ id: number; author: { name: string; biography: string; nationality: string; photo?: File; birth_date: string } }>): SagaIterator {
  try {
    const { id, author } = action.payload;
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('author[name]', author.name);
    formData.append('author[biography]', author.biography);
    formData.append('author[nationality]', author.nationality);
    formData.append('author[birth_date]', author.birth_date);
    
    if (author.photo) {
      formData.append('author[photo]', author.photo);
    }
    
    const response: any = yield call(api.patch, `/authors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data.author);
    yield put(updateAuthorSuccess(response.data.author || response.data ));
  } catch (error: any) {
    yield put(updateAuthorFailure(error.response?.data?.message || 'Lỗi khi cập nhật tác giả'));
  }
}

// Delete author saga
function* deleteAuthorSaga(action: PayloadAction<{ authorId: number }>): SagaIterator {
  try {
    const { authorId } = action.payload;
    
    yield call(api.delete, `/authors/${authorId}`);
    yield put(deleteAuthorSuccess(authorId));
  } catch (error: any) {
    yield put(deleteAuthorFailure(error.response?.data?.message || 'Lỗi khi xóa tác giả'));
  }
}

// Root author saga
export function* authorSaga(): SagaIterator {
  yield takeLatest(fetchAuthorsRequest.type, fetchAuthorsSaga);
  yield takeLatest(fetchAuthorByIdRequest.type, fetchAuthorByIdSaga);
  yield takeLatest(createAuthorRequest.type, createAuthorSaga);
  yield takeLatest(updateAuthorRequest.type, updateAuthorSaga);
  yield takeLatest(deleteAuthorRequest.type, deleteAuthorSaga);
}
