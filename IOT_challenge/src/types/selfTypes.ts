export interface Product {
  product_id: string;
  product_name: string;
  img_url: string;
  price: number;
  stock: number;
}

export interface Shelf {
  _id: string;
  shelf_id: string;
  shelf_name: string;
  user_id: string;
  location: string;
  createdAt: Date;
}

export interface ShelfCreationData {
  shelf_id: string;
  shelf_name: string;
  location: string;
  user_id: string;
}

export interface LoadCell {
  _id: string;
  load_cell_id: string;
  load_cell_name: string;
  product_id: string;
  shelf_id: string;
  quantity: number;
}
export interface LoadCell {
  _id: string;
  load_cell_id: string;
  load_cell_name: string;
  product_id: string;
  shelf_id: string;
  quantity: number;
  floor: number;    // Thêm nếu load cell có vị trí tầng
  column: number;   // Thêm nếu load cell có vị trí cột
}
export interface LoadCellResponse {
  shelf: {
    shelf_id: string;
    _id: string;
  };
  loadCells: LoadCell[];
  message: string;
}