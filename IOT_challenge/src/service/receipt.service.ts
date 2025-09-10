import axios from "axios";
import type { FetchAllOrdersResponse } from "../types/receiptTypes";
const API_URL = import.meta.env.VITE_API_ENDPOINT;

/** Lấy toàn bộ orders (đúng payload bạn gửi: giữ nguyên _doc, $__ ...) */
export async function fetchAllReceipts(signal?: AbortSignal) {
  const res = await axios.get<FetchAllOrdersResponse>(API_URL + "/orders", { signal });
  return res.data; // { success, data: FetchAllOrderItem[] }
}
