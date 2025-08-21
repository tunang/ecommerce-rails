import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchUserOrdersRequest,
  fetchUserOrdersSuccess,
  fetchUserOrdersFailure,
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderByIdRequest,
  fetchOrderByIdSuccess,
  fetchOrderByIdFailure,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
} from '../slices/orderSlice';
import type { SagaIterator } from 'redux-saga';
import type { OrderUpdateData } from '@/types/order.type';
import api from '@/services/api.service';
import type { PaginationParams } from '@/types';

// Fetch user orders saga
function* fetchUserOrdersSaga(action: PayloadAction<PaginationParams>): SagaIterator {
  try {
    const { page = 1, per_page = 10, search = '' } = action.payload;
    
    const response: any = yield call(api.get, '/orders', {
      params: {
        page,
        per_page,
        search,
      },
    });
    
    const orders = response.data.orders || [];
    // API có thể trả về meta hoặc pagination
    const meta = response.data.meta || response.data.pagination || {};
    
    yield put(fetchUserOrdersSuccess({
      orders,
      total: meta.total_count || orders.length,
      page: meta.current_page || page,
      pagination: {
        current_page: meta.current_page || page,
        next_page: meta.next_page,
        prev_page: meta.prev_page,
        total_pages: meta.total_pages || 1,
        total_count: meta.total_count || orders.length,
      },
    }));
  } catch (error: any) {
    yield put(fetchUserOrdersFailure(error.response?.data?.message || 'Lỗi khi tải danh sách đơn hàng'));
  }
}

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
    
    const orders = response.data.orders || [];
    // API có thể trả về meta hoặc pagination hoặc cấu trúc cũ
    const meta = response.data.meta || response.data.pagination || {
      current_page: response.data.page || page,
      total_count: response.data.total || orders.length
    };
    
    yield put(fetchOrdersSuccess({
      orders,
      total: meta.total_count || orders.length,
      page: meta.current_page || page,
      pagination: {
        current_page: meta.current_page || page,
        next_page: meta.next_page,
        prev_page: meta.prev_page,
        total_pages: meta.total_pages || 1,
        total_count: meta.total_count || orders.length,
      },
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

// Create order saga
function* createOrderSaga(action: PayloadAction<{ shipping_address_id: number; payment_method: string; note?: string }>): SagaIterator {
  try {
    const response: any = yield call(api.post, '/orders', action.payload);
    
    yield put(createOrderSuccess({
      order: response.data.order || response.order,
      payment_url: response.data.payment_url || response.payment_url,
    }));
  } catch (error: any) {
    yield put(createOrderFailure(error.response?.data?.message || 'Lỗi khi tạo đơn hàng'));
  }
}

// Root order saga
export function* orderSaga(): SagaIterator {
  yield takeLatest(fetchUserOrdersRequest.type, fetchUserOrdersSaga);
  yield takeLatest(fetchOrdersRequest.type, fetchOrdersSaga);
  yield takeLatest(fetchOrderByIdRequest.type, fetchOrderByIdSaga);
  yield takeLatest(updateOrderStatusRequest.type, updateOrderStatusSaga);
  yield takeLatest(createOrderRequest.type, createOrderSaga);
}