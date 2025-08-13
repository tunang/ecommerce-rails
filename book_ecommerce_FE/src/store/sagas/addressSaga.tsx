import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchAddressesRequest,
  fetchAddressesSuccess,
  fetchAddressesFailure,
  fetchAddressByIdRequest,
  fetchAddressByIdSuccess,
  fetchAddressByIdFailure,
  createAddressRequest,
  createAddressSuccess,
  createAddressFailure,
  updateAddressRequest,
  updateAddressSuccess,
  updateAddressFailure,
  deleteAddressRequest,
  deleteAddressSuccess,
  deleteAddressFailure,
} from '../slices/addressSlice';
import type { SagaIterator } from 'redux-saga';
import api from '@/services/api.service';

// Fetch addresses saga
function* fetchAddressesSaga(): SagaIterator {
  try {
    const response: any = yield call(api.get, '/addresses');
    
    yield put(fetchAddressesSuccess({
      addresses: response.data.authors || response.data || response,
    }));
  } catch (error: any) {
    yield put(fetchAddressesFailure(error.response?.data?.message || 'Lỗi khi tải danh sách địa chỉ'));
  }
}

// Fetch address by ID saga
function* fetchAddressByIdSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const addressId = action.payload;
    
    const response: any = yield call(api.get, `/addresses/${addressId}`);
    yield put(fetchAddressByIdSuccess(response.data || response));
  } catch (error: any) {
    yield put(fetchAddressByIdFailure(error.response?.data?.message || 'Lỗi khi tải thông tin địa chỉ'));
  }
}

// Create address saga
function* createAddressSaga(action: PayloadAction<{
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}>): SagaIterator {
  try {
    const addressData = action.payload;
    
    const response: any = yield call(api.post, '/addresses', {
      address: addressData
    });
    yield put(createAddressSuccess(response.data.address || response.data));
  } catch (error: any) {
    yield put(createAddressFailure(error.response?.data?.message || 'Lỗi khi tạo địa chỉ'));
  }
}

// Update address saga
function* updateAddressSaga(action: PayloadAction<{ 
  id: number; 
  address: {
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
    is_default: boolean;
  } 
}>): SagaIterator {
  try {
    const { id, address } = action.payload;
    
    const response: any = yield call(api.patch, `/addresses/${id}`, {
      address: address
    });
    yield put(updateAddressSuccess(response.data.address || response.data));
  } catch (error: any) {
    yield put(updateAddressFailure(error.response?.data?.message || 'Lỗi khi cập nhật địa chỉ'));
  }
}

// Delete address saga
function* deleteAddressSaga(action: PayloadAction<{ addressId: number }>): SagaIterator {
  try {
    const { addressId } = action.payload;
    
    yield call(api.delete, `/addresses/${addressId}`);
    yield put(deleteAddressSuccess(addressId));
  } catch (error: any) {
    yield put(deleteAddressFailure(error.response?.data?.message || 'Lỗi khi xóa địa chỉ'));
  }
}

// Root address saga
export function* addressSaga(): SagaIterator {
  yield takeLatest(fetchAddressesRequest.type, fetchAddressesSaga);
  yield takeLatest(fetchAddressByIdRequest.type, fetchAddressByIdSaga);
  yield takeLatest(createAddressRequest.type, createAddressSaga);
  yield takeLatest(updateAddressRequest.type, updateAddressSaga);
  yield takeLatest(deleteAddressRequest.type, deleteAddressSaga);
}
