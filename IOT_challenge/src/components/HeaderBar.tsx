import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";


const HeaderBar: React.FC = () => {
  const [editingShelf, setEditingShelf] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state: RootState) => state.user.user);
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user);

  const dispatch = useDispatch();

  const handleMenuOpen = (e: React.MouseEvent, id: number) => {
    // Implement menu logic here
    setEditingShelf(id);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Button
            color="inherit"
            onClick={() => navigate("/products")}
            sx={{ ml: 2 }}
          >
            Manage Products
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/users")}
            sx={{ ml: 2 }}
          >
            Manage Users
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/receipts")}
            sx={{ ml: 2 }}
          >
            Manage Receipts
          </Button>

          <Box sx={{ ml: "auto" }}>
            {isLoggedIn ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography>{user?.fullName}</Typography>
                <Button
                  color="inherit"
                  onClick={() => {
                    //   dispatch(logout action) hoặc navigate("/logout")
                  }}
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
