import { call, put, takeLatest } from "redux-saga/effects";

import { fetchCartItemsFailure, fetchCartItemsRequest, fetchCartItemsSuccess } from "../slices/cartSlice";
import type { SagaIterator } from "redux-saga";
import api from "@/services/api.service";




// Fetch cart items saga
function* fetchCartItemsSaga():SagaIterator {
    try {
      const response: any = yield call(api.get, '/cart');
      console.log(response.data.books);
      yield put(fetchCartItemsSuccess(response.data.books));
    } catch (error: any) {
      yield put(fetchCartItemsFailure(error.response?.data?.message || 'Lỗi khi tải giỏ hàng'));
    }
  }

  // Root cart saga
export function* cartSaga(): SagaIterator {
    yield takeLatest(fetchCartItemsRequest.type, fetchCartItemsSaga);

  } 