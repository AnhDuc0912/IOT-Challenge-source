import axios from "axios";
import { Product, Shelf, ShelfCreationData,LoadCellResponse, LoadCell } from "../types/selfTypes";
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

export const fetchShelves = async (): Promise<Shelf[]> => {
  const response = await axios.get(`${API_URL}/shelves`);
  return response.data;
};

export const createShelf = async (
  shelfData: ShelfCreationData
): Promise<Shelf> => {
  const response = await axios.post(`${API_URL}/shelves`, shelfData);

  console.log(response);
  
  return response.data;
};

export const fetchLoadCellsByShelfId = async (shelfId: string): Promise<LoadCellResponse> => {
  try {
    const response = await axios.get(`${API_URL}/shelves/get-loadcell/${shelfId}`);
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching load cells for shelf ${shelfId}:`, error);
    throw error;
  }
};

