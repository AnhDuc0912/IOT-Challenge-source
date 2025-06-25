import { LoadCell } from "../types/selfTypes";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_ENDPOINT;

export const updateLoadCell = async (
  loadCellId: string,
  data: Partial<LoadCell>
): Promise<LoadCell> => {
  try {
    const response = await axios.put(`${API_URL}/loadcell/${loadCellId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating load cell ${loadCellId}:`, error);
    throw error;
  }
};