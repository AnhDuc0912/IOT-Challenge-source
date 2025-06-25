import axios from "axios";
import { Product, Shelf, ShelfCreationData } from "../types/selfTypes";
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
