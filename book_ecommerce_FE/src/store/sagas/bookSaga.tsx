import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchBooksRequest,
  fetchBooksSuccess,
  fetchBooksFailure,
  fetchBookByIdRequest,
  fetchBookByIdSuccess,
  fetchBookByIdFailure,
  createBookRequest,
  createBookSuccess,
  createBookFailure,
  updateBookRequest,
  updateBookSuccess,
  updateBookFailure,
  deleteBookRequest,
  deleteBookSuccess,
  deleteBookFailure,
  fetchBooksByGenreRequest,
  fetchBooksByGenreSuccess,
  fetchBooksByGenreFailure,
} from '../slices/bookSlice';
import type { SagaIterator } from 'redux-saga';
import type { BookFormData } from '@/types/book.type';
import api from '@/services/api.service';

// Fetch books saga
function* fetchBooksSaga(action: PayloadAction<{ page?: number; per_page?: number; search?: string }>): SagaIterator {
  try {
    const { page = 1, per_page = 10, search = '' } = action.payload;
    
    const response: any = yield call(api.get, '/books', {
      params: {
        page,
        per_page,
        search,
      },
    });
    
    yield put(fetchBooksSuccess({
      books: response.data.books || response.books || [],
      total: response.data.total || response.books?.length || 0,
      page: response.data.page || page,
    }));
  } catch (error: any) {
    yield put(fetchBooksFailure(error.response?.data?.message || 'Lỗi khi tải danh sách sách'));
  }
}

// Fetch book by ID saga
function* fetchBookByIdSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const bookId = action.payload;
    
    const response: any = yield call(api.get, `/books/${bookId}`);
    yield put(fetchBookByIdSuccess(response.data.book || response.data));
  } catch (error: any) {
    yield put(fetchBookByIdFailure(error.response?.data?.message || 'Lỗi khi tải thông tin sách'));
  }
}

// Fetch books by genre saga
function* fetchBooksByGenreSaga(action: PayloadAction<{ genreId: number }>): SagaIterator {
  try {
    const { genreId } = action.payload;
    
    const response: any = yield call(api.get, `/books?genre_id=${genreId}`);
    yield put(fetchBooksByGenreSuccess(response.data.books || response.books || []));
  } catch (error: any) {
    yield put(fetchBooksByGenreFailure(error.response?.data?.message || 'Lỗi khi tải sách theo thể loại'));
  }
}

// Create book saga
function* createBookSaga(action: PayloadAction<BookFormData>): SagaIterator {
  try {
    const bookData = action.payload;
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('book[title]', bookData.title);
    formData.append('book[description]', bookData.description);
    formData.append('book[price]', bookData.price.toString());
    formData.append('book[stock_quantity]', bookData.stock_quantity.toString());
    formData.append('book[featured]', bookData.featured ? 'true' : 'false');
    formData.append('book[active]', bookData.active ? 'true' : 'false');
    formData.append('book[sold_count]', bookData.sold_count.toString());
    formData.append('book[cost_price]', bookData.cost_price.toString());
    formData.append('book[discount_percentage]', bookData.discount_percentage.toString());
    
    // Add cover image
    if (bookData.cover_image) {
      formData.append('book[cover_image]', bookData.cover_image);
    }
    
    // Add sample pages
    if (bookData.sample_pages) {
      const files = Array.isArray(bookData.sample_pages) ? bookData.sample_pages : Array.from(bookData.sample_pages);
      files.forEach((file) => {
        formData.append('book[sample_pages][]', file);
      });
    }
    
    // Add author and category IDs
    bookData.author_ids.forEach((id) => {
      formData.append('book[author_ids][]', id.toString());
    });
    
    bookData.category_ids.forEach((id) => {
      formData.append('book[category_ids][]', id.toString());
    });
    
    const response: any = yield call(api.post, '/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    yield put(createBookSuccess(response.data.book || response.data));
  } catch (error: any) {
    yield put(createBookFailure(error.response?.data?.message || 'Lỗi khi tạo sách'));
  }
}

// Update book saga
function* updateBookSaga(action: PayloadAction<{ id: number; book: BookFormData }>): SagaIterator {
  try {
    const { id, book } = action.payload;
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('book[title]', book.title);
    formData.append('book[description]', book.description);
    formData.append('book[price]', book.price.toString());
    formData.append('book[stock_quantity]', book.stock_quantity.toString());
    formData.append('book[featured]', book.featured ? 'true' : 'false');
    formData.append('book[active]', book.active ? 'true' : 'false');
    formData.append('book[sold_count]', book.sold_count.toString());
    formData.append('book[cost_price]', book.cost_price.toString());
    formData.append('book[discount_percentage]', book.discount_percentage.toString());
    
    // Add cover image if provided
    if (book.cover_image) {
      formData.append('book[cover_image]', book.cover_image);
    }
    
    // Add sample pages if provided
    if (book.sample_pages) {
      const files = Array.isArray(book.sample_pages) ? book.sample_pages : Array.from(book.sample_pages);
      files.forEach((file) => {
        formData.append('book[sample_pages][]', file);
      });
    }
    
    // Add author and category IDs
    book.author_ids.forEach((authorId) => {
      formData.append('book[author_ids][]', authorId.toString());
    });
    
    book.category_ids.forEach((categoryId) => {
      formData.append('book[category_ids][]', categoryId.toString());
    });
    
    const response: any = yield call(api.patch, `/books/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    yield put(updateBookSuccess(response.data.book || response.data));
  } catch (error: any) {
    yield put(updateBookFailure(error.response?.data?.message || 'Lỗi khi cập nhật sách'));
  }
}

// Delete book saga
function* deleteBookSaga(action: PayloadAction<{ bookId: number }>): SagaIterator {
  try {
    const { bookId } = action.payload;
    
    yield call(api.delete, `/books/${bookId}`);
    yield put(deleteBookSuccess(bookId));
  } catch (error: any) {
    yield put(deleteBookFailure(error.response?.data?.message || 'Lỗi khi xóa sách'));
  }
}

// Root book saga
export function* bookSaga(): SagaIterator {
  yield takeLatest(fetchBooksRequest.type, fetchBooksSaga);
  yield takeLatest(fetchBookByIdRequest.type, fetchBookByIdSaga);
  yield takeLatest(fetchBooksByGenreRequest.type, fetchBooksByGenreSaga);
  yield takeLatest(createBookRequest.type, createBookSaga);
  yield takeLatest(updateBookRequest.type, updateBookSaga);
  yield takeLatest(deleteBookRequest.type, deleteBookSaga);
}
