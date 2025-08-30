import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Shelf, LoadCell } from "../types/selfTypes";
import { getEmployees } from "../service/user.service";
import { User } from "../types/userTypes";
import { updateShelf } from "../service/shefl.service";

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
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      getEmployees().then((users) => {
        setEmployees(users);
      });
    }
  }, [open]);

  useEffect(() => {
    if (!shelf) {
      setSelectedUserIds([]);
      return;
    }
    // shelf.user_id có thể là mảng object / mảng id / single object / single id
    const u = shelf.user_id;
    if (!u) {
      setSelectedUserIds([]);
    } else if (Array.isArray(u)) {
      const ids = u.map((it: any) =>
        typeof it === "string" ? it : it?._id ?? String(it)
      );
      setSelectedUserIds(ids);
    } else {
      // single
      const id = typeof u === "string" ? u : u._id ?? String(u);
      setSelectedUserIds([id]);
    }
  }, [shelf]);

  const handleUserChange = (e: any) => {
    const value = e.target.value;
    // value may be string (comma) or array
    const ids = typeof value === "string" ? value.split(",") : value;
    setSelectedUserIds(ids);
  };

  const handUpdateShelf = async (shelf_id: string) => {
    try {
      if (!selectedUserIds || selectedUserIds.length === 0) {
        alert("Vui lòng chọn ít nhất một người phụ trách!");
        return;
      }

      await updateShelf(shelf_id, { user_id: selectedUserIds } as any);
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
            value={selectedUserIds}
            fullWidth
            margin="normal"
            onChange={handleUserChange}
            SelectProps={{
              multiple: true,
              renderValue: (selected: any) =>
                (selected as string[])
                  .map(
                    (id) =>
                      employees.find((e) => e._id === id)?.fullName ?? id
                  )
                  .join(", "),
            }}
          >
            {employees.map((emp) => (
              <MenuItem key={emp._id} value={emp._id}>
                <Checkbox checked={selectedUserIds.indexOf(emp._id) > -1} />
                <ListItemText primary={emp.fullName ?? emp.username} />
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