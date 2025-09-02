// ====== GIỮ NGUYÊN DẠNG MONGOOSE TRẢ VỀ ======

export interface MongooseActivePaths {
  paths: Record<string, string>;
  states: {
    require: Record<string, unknown>;
    default: Record<string, unknown>;
    init: Record<string, boolean>;
  };
}

export interface MongooseDollarMeta {
  activePaths?: MongooseActivePaths;
  skipId?: boolean;
  // Cho phép các key linh hoạt khác của Mongoose
  [k: string]: unknown;
}

export interface OrderDoc {
  _id: string;
  order_code: string;
  shelf_id: string;
  total_bill: number;
  status: string; // "pending" | "processing" | "completed" | "cancelled" | ...
  total: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  __v: number;
}

export interface OrderDetail {
  _id: string;
  order_id:
    | OrderDoc // populate object như response mẫu của bạn
    | string;  // phòng trường hợp BE trả về chỉ ObjectId
  product_id: unknown | null; // có thể null
  quantity: number;
  price: number;
  total_price: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface FetchAllOrderItem {
  $__?: MongooseDollarMeta; // metadata Mongoose
  $isNew?: boolean;
  _doc: OrderDoc;           // Document thật nằm trong _doc
  details: OrderDetail[];   // Mảng chi tiết đi kèm
}

export interface FetchAllOrdersResponse {
  success: boolean;
  data: FetchAllOrderItem[];
}
