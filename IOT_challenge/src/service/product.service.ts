import axios from "axios";
import { Product } from "../types/selfTypes";
const API_URL = import.meta.env.VITE_API_ENDPOINT;

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export async function addProduct(productData: any, file?: File) {
  const form = new FormData();
  form.append("product_id", productData.product_id);
  form.append("product_name", productData.product_name);
  form.append("price", String(productData.price));
  form.append("stock", String(productData.stock));
  if (file) {
    form.append("product_image", file); // 👈 tên phải trùng với upload.single("product_image")
  }

  try {
    const response = await axios.post(`${API_URL}/products`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to add product");
  }
}

export async function updateProduct(productId: string, productData: any, file?: File) {
  const form = new FormData();
  form.append("product_name", productData.product_name);
  form.append("price", String(productData.price));
  form.append("stock", String(productData.stock));
  if (file) {
    form.append("product_image", file); // hoặc img_url nếu backend yêu cầu tên này
  }

  // Nếu backend dùng PUT/PATCH và endpoint là /api/products/:id
  const response = await axios.put(`${API_URL}/products/${productId}`, form);
  return response.data;
}
