export type Combo = {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  current_price: number;
  original_price: number;
  validFrom?: Date;
  validTo?: Date;
  products?: any[]; // populated product objects or ids
  createdAt?: string;
  updatedAt?: string;
};