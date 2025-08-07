import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderByIdRequest,
  fetchOrderByIdSuccess,
  fetchOrderByIdFailure,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
} from '../slices/orderSlice';
import type { SagaIterator } from 'redux-saga';
import type { OrderUpdateData } from '@/types/order.type';
import api from '@/services/api.service';

// Fetch orders saga
function* fetchOrdersSaga(action: PayloadAction<{ page?: number; per_page?: number; search?: string }>): SagaIterator {
  try {
    const { page = 1, per_page = 10, search = '' } = action.payload;
    
    const response: any = yield call(api.get, '/orders/admin/get_all', {
      params: {
        page,
        per_page,
        search,
      },
    });
    
    yield put(fetchOrdersSuccess({
      orders: response.data.orders || response.orders || [],
      total: response.data.total || response.orders?.length || 0,
      page: response.data.page || page,
    }));
  } catch (error: any) {
    yield put(fetchOrdersFailure(error.response?.data?.message || 'Lỗi khi tải danh sách đơn hàng'));
  }
}

// Fetch order by ID saga
function* fetchOrderByIdSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const orderId = action.payload;
    
    const response: any = yield call(api.get, `/orders/${orderId}`);
    yield put(fetchOrderByIdSuccess(response.data.order || response.data));
  } catch (error: any) {
    yield put(fetchOrderByIdFailure(error.response?.data?.message || 'Lỗi khi tải thông tin đơn hàng'));
  }
}

// Update order status saga
function* updateOrderStatusSaga(action: PayloadAction<{ id: number; orderData: OrderUpdateData }>): SagaIterator {
  try {
    const { id, orderData } = action.payload;
    
    const response: any = yield call(api.patch, `/orders/${id}`, {
      order: orderData,
    });
    
    yield put(updateOrderStatusSuccess(response.data.order || response.data));
  } catch (error: any) {
    yield put(updateOrderStatusFailure(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái đơn hàng'));
  }
}

// Root order saga
export function* orderSaga(): SagaIterator {
  yield takeLatest(fetchOrdersRequest.type, fetchOrdersSaga);
  yield takeLatest(fetchOrderByIdRequest.type, fetchOrderByIdSaga);
  yield takeLatest(updateOrderStatusRequest.type, updateOrderStatusSaga);
}