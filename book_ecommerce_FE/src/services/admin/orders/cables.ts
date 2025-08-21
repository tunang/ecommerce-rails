import type { AppDispatch } from "@/store";
import { fetchOrdersRequest } from "@/store/slices/orderSlice";
import cable from "@/lib/cable";

export const subscribeAdminOrdersChannel = (dispatch: AppDispatch) => {
  const channel = cable.subscriptions.create("AdminOrdersChannel", {
    connected: () => {
      console.log("Connected to AdminOrdersChannel");
    },
    disconnected: () => {
      console.log("Disconnected from AdminOrdersChannel");
    },
    received: (data: { type: string; payload: any }) => {
      console.log("Order event received:", data);

      if (data.type === "ORDER_CREATED" || data.type === "ORDER_UPDATED") {
        dispatch(fetchOrdersRequest({ page: 1, per_page: 10 }));
      }
    },
  });

  return channel;
};
