import type { AppDispatch } from "@/store";
import { fetchUserOrdersRequest } from "@/store/slices/orderSlice";
import cable from "@/lib/cable";

export const subscribeOrdersChannel = (dispatch: AppDispatch) => {
  const channel = cable.subscriptions.create("OrdersChannel", {
    connected: () => {
      console.log("Connected to OrdersChannel");
    },
    disconnected: () => {
      console.log("Disconnected from OrdersChannel");
    },
    received: (data: { type: string; payload: any }) => {
      console.log("Order event received:", data);

      if (data.type === "ORDER_CREATED" || data.type === "ORDER_UPDATED") {
        dispatch(fetchUserOrdersRequest({ page: 1, per_page: 10 }));
      }
    },
  });

  return channel;
};
