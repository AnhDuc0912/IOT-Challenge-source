export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  sku?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ApiOrderDetail {
  _id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  total_price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrder {
  order: {
    _id: string;
    order_code?: string;
    shelf_id?: string;
    total_bill?: number;
    total?: number;
    status?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
  };
  orderDetails: ApiOrderDetail[];
}

// UI-friendly types (kept similar to existing Receipt)
export interface ProductShort {
  id: string;
  name: string;
  sku?: string;
  price?: number;
}

export interface ReceiptItem {
  id: string;
  product: ProductShort;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Paid" | "Pending" | "Cancelled" | "Refunded" | string;
  paymentMethod: "Cash" | "Credit Card" | "Debit Card" | "Bank Transfer" | "Other" | string;
  notes?: string;
  createdAt: Date;
  createdBy?: any;
}
