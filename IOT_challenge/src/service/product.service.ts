import axios from "axios";
import { Product } from "../types/selfTypes";
const API_URL = import.meta.env.VITE_API_ENDPOINT;
const IMG_PREFIX = import.meta.env.VITE_PREFIX_IMAGE;

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products`);
    // Gắn prefix cho img_url
    const productsWithPrefix = response.data.map((product) => ({
      ...product,
      img_url: product.img_url.startsWith("http")
        ? product.img_url
        : IMG_PREFIX + product.img_url,
    }));
    return productsWithPrefix;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const response = await axios.get<Product>(`${API_URL}/products/${productId}`);
    const product = response.data;
    return {
      ...product,
      img_url: product.img_url.startsWith("http")
        ? product.img_url
        : IMG_PREFIX + product.img_url,
    };
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return null;
  }
}

export async function addProduct(productData: Product, file?: File) {
  const form = new FormData();
  form.append("product_id", productData.product_id);
  form.append("product_name", productData.product_name);
  form.append("price", String(productData.price));
  form.append("discount", String(productData.discount));
  form.append("weight", String(productData.weight));
  form.append("max_quantity", String(productData.max_quantity));
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

export async function updateProduct(
  productId: string | undefined,
  productData: any,
  file?: File
) {
  const form = new FormData();
  form.append("product_name", productData.product_name);
  form.append("price", String(productData.price));
  form.append("stock", String(productData.stock));
  form.append("discount", String(productData.discount));
  form.append("weight", String(productData.weight));
  form.append("max_quantity", String(productData.max_quantity));
  if (file) {
    form.append("product_image", file); // hoặc img_url nếu backend yêu cầu tên này
  }

  // Nếu backend dùng PUT/PATCH và endpoint là /api/products/:id
  const response = await axios.put(`${API_URL}/products/${productId}`, form);
  return response.data;
}
