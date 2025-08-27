import axios from "axios";
import type { ApiOrder, Receipt, ReceiptItem, ProductShort } from "../types/receiptTypes";

const API_URL = import.meta.env.VITE_API_ENDPOINT || ""; // hoặc cấu hình tương ứng

function mapApiToReceipt(api: ApiOrder): Receipt {
  const o = api.order;
  const details = api.orderDetails || [];

  const items: ReceiptItem[] = details.map((d) => {
    const product: ProductShort = {
      id: d.product_id,
      name: `Product ${d.product_id}`, // nếu backend trả thêm tên product, replace ở đây
      price: d.price,
      sku: undefined,
    };
    return {
      id: d._id,
      product,
      quantity: d.quantity,
      price: d.price,
    };
  });

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = Number(o.total ?? o.total_bill ?? subtotal + tax);

  return {
    id: o._id,
    receiptNumber: o.order_code ?? `REC-${o._id}`,
    customer: null,
    items,
    subtotal,
    tax,
    total,
    status: (o.status as any) ?? "Pending",
    paymentMethod: "Cash",
    notes: "",
    createdAt: new Date(o.createdAt),
    createdBy: undefined,
  };
}

export const fetchAllReceipts = async (): Promise<Receipt[]> => {
  const resp = await axios.get(`${API_URL}/orders`);
  // backend có thể trả { success:true, data: [...] } hoặc array directly
  const payload = resp.data?.data ?? resp.data;
  if (!Array.isArray(payload)) return [];

  // payload items may be either shape: { ...order fields..., details: [...] } OR { order, orderDetails }
  return payload.map((item: any) => {
    if (item.order && item.orderDetails) {
      return mapApiToReceipt(item as ApiOrder);
    }

    // if backend returned order object flattened with details prop
    const order = {
      order: {
        _id: item._id,
        order_code: item.order_code,
        total: item.total,
        total_bill: item.total_bill,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
      orderDetails: item.details ?? item.orderDetails ?? [],
    } as ApiOrder;

    return mapApiToReceipt(order);
  });
};

export const fetchReceiptById = async (id: string): Promise<Receipt | null> => {
  const resp = await axios.get(`${API_URL}/orders/${id}`);
  const payload = resp.data?.data ?? resp.data;
  if (!payload) return null;
  if (payload.order && payload.orderDetails) {
    return mapApiToReceipt(payload as ApiOrder);
  }
  // fallback: maybe resp.data = { order, details }
  const order = payload.order ? payload.order : payload;
  const orderDetails = payload.orderDetails ?? payload.details ?? [];
  return mapApiToReceipt({ order, orderDetails } as ApiOrder);
};