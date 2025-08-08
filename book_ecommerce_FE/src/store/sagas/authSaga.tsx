import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  logoutFailure,
  logoutRequest,
  initializeAuth,
} from "../slices/authSlice";
import api from "@/services/api.service";
import { ApiConstant } from "@/constant/api.constant";
import { setUser } from "../slices/authSlice";
// Types for API responses
interface ApiResponse {
  data: {
    user: any;
    access_token: string;
    refresh_token: string;
  };
  headers: {
    authorization?: string;
  };
}

interface LoginResponse extends ApiResponse {}
interface RegisterResponse extends ApiResponse {}

// Authentication initialization saga
function* initializeAuthSaga(): SagaIterator {
  try {
    const response = yield call(api.get, '/me');
    console.log(response.data.user);
    yield put(setUser(response.data.user));
  } catch (error) {
    yield put(loginFailure("Token không hợp lệ"));
  }
}
// Login saga
function* loginSaga(
  action: PayloadAction<{ email: string; password: string }>
): SagaIterator {
  try {
    const { email, password } = action.payload;

    const response: LoginResponse = yield call(
      api.post,
      ApiConstant.auth.login,
      {
        user: {
          email,
          password,
        },
      }
    );
    console.log(response)
    // Lấy token từ authorization header
    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
  
    yield put(
      loginSuccess({
        user: response.data.user,
        token: accessToken,
      })
    );

  } catch (error: any) {
    yield put(
      loginFailure(error.response?.data?.message || "Đăng nhập thất bại")
    );
  }
}

// Register saga
function* registerSaga(
  action: PayloadAction<{
    email: string;
    name: string;
    password: string;
  }>
): SagaIterator {
  try {
    const { email, name, password } = action.payload;
    console.log(1)
    const response: RegisterResponse = yield call(api.post, ApiConstant.auth.register, {
      user: {
        email,
        name,
        password,
      },
    });

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    yield put(
      registerSuccess({
        user: response.data.user,
        token: accessToken,
      })
    );

  } catch (error: any) {
    console.log(error);
    yield put(
      registerFailure(error.response?.data?.status?.message || "Đăng ký thất bại")
    );
  }
}

function* logoutSaga(): SagaIterator {
  try {
    yield call(api.delete, ApiConstant.auth.logout);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    yield put(logoutSuccess());
  } catch (error: any) {
    yield put(
      logoutFailure(error.response?.data?.message || "Đăng xuất thất bại")
    );
  }
}

// Root auth saga
export function* authSaga(): SagaIterator {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeLatest(initializeAuth.type, initializeAuthSaga);
}
