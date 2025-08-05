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
} from "../slices/authSlice";
import api from "@/services/api.service";
import { ApiConstant } from "@/constant/api.constant";

// Types for API responses
interface ApiResponse {
  data: {
    user: any;
    token?: string;
  };
  headers: {
    authorization?: string;
  };
}

interface LoginResponse extends ApiResponse {}
interface RegisterResponse extends ApiResponse {}

// Authentication initialization saga

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
    const authHeader = response.headers.authorization;
  
    let token = '';
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      localStorage.setItem("token", token);
    } else {
      console.error("Không tìm thấy token trong Authorization header");
    }
  
    yield put(
      loginSuccess({
        user: response.data.user,
        token: token,
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
    console.log(response);
    // Lấy token từ authorization header
    const authHeader = response.headers.authorization;
    console.log('Auth header:', authHeader);
  
    let token = '';
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      localStorage.setItem("token", token);
    } else {
      console.error("Không tìm thấy token trong Authorization header");
    }

    yield put(
      registerSuccess({
        user: response.data.user,
        token: token,
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
    localStorage.removeItem("token");
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
}
