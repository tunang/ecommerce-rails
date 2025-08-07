import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderUpdateData } from '../../types/order.type';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  totalOrders: number;
  currentPage: number;
  pageSize: number;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  totalOrders: 0,
  currentPage: 1,
  pageSize: 10,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Fetch orders actions
    fetchOrdersRequest: (state, _action: PayloadAction<{ page?: number; per_page?: number; search?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<{ orders: Order[]; total: number; page: number }>) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
      state.totalOrders = action.payload.total;
      state.currentPage = action.payload.page;
      state.error = null;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch single order actions
    fetchOrderByIdRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrderByIdSuccess: (state, action: PayloadAction<Order>) => {
      state.isLoading = false;
      state.currentOrder = action.payload;
      state.error = null;
    },
    fetchOrderByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update order status actions (Admin only)
    updateOrderStatusRequest: (state, _action: PayloadAction<{ id: number; orderData: OrderUpdateData }>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateOrderStatusSuccess: (state, action: PayloadAction<Order>) => {
      state.isLoading = false;
      const index = state.orders.findIndex((order: Order) => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
      state.error = null;
    },
    updateOrderStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderByIdRequest,
  fetchOrderByIdSuccess,
  fetchOrderByIdFailure,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  clearError,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
export type { Order };