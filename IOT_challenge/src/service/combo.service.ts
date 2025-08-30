import axios from "axios";
import { Combo } from "../types/combo.type";

const API_URL = import.meta.env.VITE_API_ENDPOINT;
const IMG_PREFIX = import.meta.env.VITE_PREFIX_IMAGE;

/**
 * Normalize backend combo to frontend Combo type and fix image url
 */
function mapComboImage(c: any): Combo {
  const image = c.image ?? c.img ?? "";
  return {
    ...c,
    image: image && !image.startsWith("http") ? (IMG_PREFIX || "") + image : image,
    // ensure numeric fields exist
    current_price: Number(c.current_price ?? c.current_price ?? 0),
    original_price: c.original_price !== undefined ? Number(c.original_price) : undefined,
  } as Combo;
}

export async function fetchCombos(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ data: Combo[]; meta?: any } | null> {
  try {
    const res = await axios.get(`${API_URL}/combos`, { params });
    const payload = Array.isArray(res.data) ? { data: res.data } : res.data;
    const combos = (payload.data || []).map(mapComboImage);
    console.log(combos);
    
    return { data: combos, meta: payload.meta };
  } catch (error) {
    console.error("fetchCombos error", error);
    return null;
  }
}

export async function getComboById(id: string): Promise<Combo | null> {
  try {
    const res = await axios.get(`${API_URL}/combos/${id}`);
    const payload = res.data?.data ?? res.data;
    return payload ? mapComboImage(payload) : null;
  } catch (error) {
    console.error("getComboById error", error);
    return null;
  }
}

export async function createCombo(payload: {
  name: string;
  description?: string;
  current_price: number;
  original_price?: number;
  validFrom?: string;
  validTo?: string;
  products?: string[]; // product ids
  imageFile?: File | null;
}): Promise<Combo | null> {
  try {
    const form = new FormData();
    form.append("name", payload.name);
    if (payload.description) form.append("description", payload.description);
    form.append("current_price", String(payload.current_price));
    if (payload.original_price !== undefined) form.append("original_price", String(payload.original_price));
    if (payload.validFrom) form.append("validFrom", payload.validFrom);
    if (payload.validTo) form.append("validTo", payload.validTo);
    if (payload.products) payload.products.forEach((p) => form.append("products[]", p));
    if (payload.imageFile) form.append("image", payload.imageFile);

    const res = await axios.post(`${API_URL}/combos`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = res.data?.data ?? res.data;
    return data ? mapComboImage(data) : null;
  } catch (error) {
    console.error("createCombo error", error);
    throw error;
  }
}

export async function updateCombo(
  id: string,
  payload: {
    name?: string;
    description?: string;
    current_price?: number;
    original_price?: number;
    validFrom?: string;
    validTo?: string;
    products?: string[];
    imageFile?: File | null;
    active?: boolean;
  }
): Promise<Combo | null> {
  try {
    // use FormData if file present, otherwise send JSON
    if (payload.imageFile) {
      const form = new FormData();
      if (payload.name) form.append("name", payload.name);
      if (payload.description) form.append("description", payload.description);
      if (payload.current_price !== undefined) form.append("current_price", String(payload.current_price));
      if (payload.original_price !== undefined) form.append("original_price", String(payload.original_price));
      if (payload.validFrom) form.append("validFrom", payload.validFrom);
      if (payload.validTo) form.append("validTo", payload.validTo);
      if (payload.active !== undefined) form.append("active", String(payload.active));
      if (payload.products) payload.products.forEach((p) => form.append("products[]", p));
      form.append("image", payload.imageFile);
      const res = await axios.put(`${API_URL}/combos/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data?.data ?? res.data;
      return data ? mapComboImage(data) : null;
    } else {
      const body: any = { ...payload };
      const res = await axios.put(`${API_URL}/combos/${id}`, body);
      const data = res.data?.data ?? res.data;
      return data ? mapComboImage(data) : null;
    }
  } catch (error) {
    console.error("updateCombo error", error);
    throw error;
  }
}

export async function deleteCombo(id: string): Promise<boolean> {
  try {
    await axios.delete(`${API_URL}/combos/${id}`);
    return true;
  } catch (error) {
    console.error("deleteCombo error", error);
    return false;
  }
}

export default {
  fetchCombos,
  getComboById,
  createCombo,
  updateCombo,
  deleteCombo,
};