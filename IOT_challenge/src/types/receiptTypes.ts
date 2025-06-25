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

export interface ReceiptItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  customer: User | null;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Paid" | "Pending" | "Cancelled" | "Refunded";
  paymentMethod: "Cash" | "Credit Card" | "Debit Card" | "Bank Transfer" | "Other";
  notes?: string;
  createdAt: Date;
  createdBy: User;
}
