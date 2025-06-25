import axios from "axios";
import { Product, Shelf, ShelfCreationData,LoadCellResponse, LoadCell } from "../types/selfTypes";
const API_URL = import.meta.env.VITE_API_ENDPOINT;

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
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
    return response.data;
  } catch (error) {
    console.error(`Error fetching load cells for shelf ${shelfId}:`, error);
    throw error;
  }
};

