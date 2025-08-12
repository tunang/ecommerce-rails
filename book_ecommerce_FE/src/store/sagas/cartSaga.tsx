import { call, put, takeLatest } from "redux-saga/effects";

import { addToCartSuccess, addToCartFailure, fetchCartItemsFailure, fetchCartItemsRequest, fetchCartItemsSuccess, addToCartRequest, removeFromCartSuccess, removeFromCartFailure, removeFromCartRequest, updateCartItemRequest, updateCartItemSuccess, updateCartItemFailure } from "../slices/cartSlice";
import type { SagaIterator } from "redux-saga";
import api from "@/services/api.service";
import type { PayloadAction } from "@reduxjs/toolkit";




// Fetch cart items saga
function* fetchCartItemsSaga():SagaIterator {
    try {
      const response: any = yield call(api.get, '/cart');
      yield put(fetchCartItemsSuccess(response.data.books));
    } catch (error: any) {
      yield put(fetchCartItemsFailure(error.response?.data?.message || 'Lỗi khi tải giỏ hàng'));
    }
  }

  function* addToCartSaga(action: PayloadAction<{ book_id: number; quantity: number }>):SagaIterator {
    try {
      const response: any = yield call(api.post, '/cart/add', action.payload);
      yield put(addToCartSuccess(response.data.item));
    } catch (error: any) {
      yield put(addToCartFailure(error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng'));
    }
  }

  function* updateCartItemSaga(action: PayloadAction<{ book_id: number; quantity: number }>):SagaIterator {
    try {
      const response: any = yield call(api.patch, `/cart/update`, action.payload);
      yield put(updateCartItemSuccess(response.data.item));
    } catch (error: any) {
      yield put(updateCartItemFailure(error.response?.data?.message || 'Lỗi khi cập nhật số lượng'));
    }
  }

  function* removeFromCartSaga(action: PayloadAction<{book_id: number}>):SagaIterator {
    try {
      const response: any = yield call(api.delete, `/cart/remove/${action.payload.book_id}`);
      yield put(removeFromCartSuccess(response.data.item));
    } catch (error: any) {
      yield put(removeFromCartFailure(error.response?.data?.message || 'Lỗi khi xóa khỏi giỏ hàng'));
    }
  }

  // Root cart saga
export function* cartSaga(): SagaIterator {
    yield takeLatest(fetchCartItemsRequest.type, fetchCartItemsSaga);
    yield takeLatest(addToCartRequest.type, addToCartSaga);
    yield takeLatest(removeFromCartRequest.type, removeFromCartSaga);
    yield takeLatest(updateCartItemRequest.type, updateCartItemSaga);
  } 