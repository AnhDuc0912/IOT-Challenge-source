import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";
import { Shelf, LoadCell } from "../types/selfTypes";
import { getEmployees, getUsers } from "../service/user.service";
import { User } from "../types/userTypes";
import { updateShelf } from "../service/shefl.service"; // Thêm dòng này ở đầu file

interface ShelfInfoDialogProps {
  open: boolean;
  onClose: () => void;
  shelf: Shelf | undefined;
  loadCells?: LoadCell[];
}

const ShelfInfoDialog: React.FC<ShelfInfoDialogProps> = ({
  open,
  onClose,
  shelf,
  loadCells = [],
}) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    if (open) {
      getEmployees().then((users) => {
        setEmployees(users);
      });
      // Nếu shelf có user_id thì set luôn
      setSelectedUserId(
        typeof shelf?.user_id === "object"
          ? String(shelf.user_id?._id)
          : ""
      );
    }
  }, [open, shelf]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUserId(e.target.value);
    // Nếu muốn gọi API cập nhật, gọi tại đây
    // updateShelf(shelf._id, { user_id: e.target.value });
  };

  const handUpdateShelf = async (shelf_id: string) => {
    try {
      if (!selectedUserId) {
        alert("Vui lòng chọn người phụ trách!");
        return;
      }

      await updateShelf(shelf_id, { user_id: selectedUserId } as any);
      alert("Cập nhật người phụ trách thành công!");
      onClose();
    } catch (error) {
      console.error("Cập nhật người phụ trách thất bại", error);
      alert("Cập nhật người phụ trách thất bại!");
    }
  };



  if (!shelf) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thông tin kệ hàng</DialogTitle>
      <DialogContent dividers>
        <Box mb={2} component="form">
          <TextField
            label="Mã kệ"
            value={shelf.shelf_id}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên kệ"
            value={shelf.shelf_name}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Vị trí"
            value={shelf.location ?? ""}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Người phụ trách"
            value={selectedUserId}
            fullWidth
            margin="normal"
            onChange={handleUserChange}
          >
            {employees.map((emp) => (
              <MenuItem key={emp._id} value={emp._id}>
                {emp.fullName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Ngày tạo"
            value={
              shelf.createdAt
                ? new Date(shelf.createdAt).toLocaleString()
                : ""
            }
            fullWidth
            margin="normal"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          color="secondary"
          onClick={() => handUpdateShelf(shelf._id)} // Gọi updateShelf
        >
          Lưu
        </Button>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>

    </Dialog>
  );
};

export default ShelfInfoDialog;