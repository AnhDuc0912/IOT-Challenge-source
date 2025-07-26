import axios from "axios";

const apiUrl = import.meta.env.VITE_API_ENDPOINT;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "Admin" | "Manager" | "Employee" | "Viewer";
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  department?: string;
  joinDate: Date;
  lastLogin?: Date;
  permissions: string[];
}

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${apiUrl}/users`);
  return response.data.map((u: any) => ({
    id: u._id,
    firstName: u.fullName?.split(" ")[0] || "",
    lastName: u.fullName?.split(" ").slice(1).join(" ") || "",
    email: u.email,
    phone: u.phone,
    role:
      u.role === "admin" ? "Admin" :
      u.role === "manager" ? "Manager" :
      u.role === "employee" ? "Employee" :
      "Viewer",

    status: u.isActive ? "Active" : "Inactive",
    avatar: u.avatar,
    department: "", // Nếu có trường department thì lấy, còn không để rỗng
    joinDate: u.createdAt ? new Date(u.createdAt) : new Date(),
    lastLogin: u.updatedAt ? new Date(u.updatedAt) : undefined,
    permissions: [], // Nếu có trường permissions thì lấy, còn không để mảng rỗng
  }));
};

export const getEmployees = async (): Promise<User[]> => {
  const users = await getUsers();
  return users.filter(user => user.role === "Employee").map(employee => ({
    ...employee,
    // Format lại dữ liệu cho phù hợp với TaskDialog
    id: employee.id,
    name: `${employee.firstName} ${employee.lastName}`,
  }));
};



// Có thể thêm các hàm khác như createUser, updateUser, deleteUser nếu cần