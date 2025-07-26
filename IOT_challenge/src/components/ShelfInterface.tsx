"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Drawer,
  List,
  ListItem,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  Divider,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ShelfCompartment from "./ShelfCompartment";
import ShelfStatistics from "./ShelfStatistics";
import ShelvesOverview from "./ShelvesOverview";
import {
  fetchProducts,
  fetchShelves,
  fetchLoadCellsByShelfId,
} from "../service/shefl.service"; // SỬA: Thêm fetchLoadCellsByShelfId
import { getProductById } from "../service/product.service"; // Thêm import này
import { Product, Shelf, LoadCell } from "../types/selfTypes"; // SỬA: Thêm LoadCell
import AddShelfDialog from "./AddShelfDialog";
import { updateLoadCell } from "../service/loadcell.service";
import ProductDialog from "./ProductDialog";
import TaskDialog from "./TaskDialog";
import { getEmployees } from "../service/user.service";

interface Employee {
  id: string;
  name: string;
}

export default function ShelfInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [activeShelfId, setActiveShelfId] = useState(
    "685aafc545619025a0bb9f27"
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [editingShelf, setEditingShelf] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedShelfForMenu, setSelectedShelfForMenu] = useState<
    string | null
  >(null);
  const [sampleProducts, setSampleProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadCells, setLoadCells] = useState<LoadCell[]>([]); // MỚI: Thêm state cho load cells
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleShelfAdded = (shelf: Shelf) => {
    // Xử lý thêm shelf vào danh sách nếu cần
    setShelves((prev) => [...prev, shelf]);
    setActiveShelfId(shelf.shelf_id);
    handleCloseDialog();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, shelvesData, employeesList] = await Promise.all([
          fetchProducts(),
          fetchShelves(),
          getEmployees(),
        ]);
        setSampleProducts(products);
        setShelves(shelvesData);
        // Format dữ liệu employee cho đúng interface
        const formattedEmployees = employeesList.map((emp) => ({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
        }));
        setEmployees(formattedEmployees);
        console.log("Loaded data:", {
          products,
          employees: formattedEmployees,
        }); // Debug
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Không thể tải dữ liệu sản phẩm hoặc kệ. Vui lòng thử lại.");
      }
    };

    fetchData();
  }, []);

  // MỚI: Lấy dữ liệu load cells khi activeShelfId thay đổi
  useEffect(() => {
    const fetchLoadCells = async () => {
      if (activeShelfId) {
        try {
          const data = await fetchLoadCellsByShelfId(activeShelfId);
          console.log(data.loadCells);

          setLoadCells(data.loadCells);
          console.log("data.loadCells", loadCells);
        } catch (error) {
          console.error("Failed to fetch load cells:", error);
        }
      }
    };
    fetchLoadCells();
  }, [activeShelfId]);

  const activeShelf: Shelf | undefined = shelves.find(
    (shelf) => shelf._id === activeShelfId
  );

  const handleCreateShelf = () => {
    if (newShelfName.trim()) {
      const newShelf: Shelf = {
        _id: Date.now().toString(),
        shelf_id: `S${Date.now()}`,
        shelf_name: newShelfName.trim(),
        user_id: "default_user",
        location: "default_location",
        createdAt: new Date(),
      };
      setShelves((prev) => [...prev, newShelf]);
      setActiveShelfId(newShelf.shelf_id);
      setNewShelfName("");
      setDialogOpen(false);
    }
  };

  const handleDeleteShelf = (shelfId: string) => {
    if (shelves.length > 1) {
      setShelves((prev) => prev.filter((shelf) => shelf.shelf_id !== shelfId));
      if (activeShelfId === shelfId) {
        setActiveShelfId(
          shelves.find((shelf) => shelf.shelf_id !== shelfId)?.shelf_id ||
            shelves[0].shelf_id
        );
      }
    }
    setMenuAnchor(null);
  };

  const handleDragStart = (e: React.DragEvent, product: Product) => {
    e.dataTransfer.setData("application/json", JSON.stringify(product));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const uploadAllLoadCells = async () => {
    try {
      try {
        await Promise.all(
          loadCells.map((cell) =>
            updateLoadCell(cell._id, {
              product_id: cell.product_id ? cell.product_id : null,
              quantity: cell.quantity,
            })
          )
        );
        alert("Upload thành công toàn bộ load cell!");
      } catch (error) {
        alert("Có lỗi khi upload load cell!");
        console.error(error);
      }
      // Tạo updatedHistory trước
      const updatedHistory = loadCells.map((cell) => {
        const matchedProduct = sampleProducts.find(
          (p) => p._id === cell.product_id
        );
        return {
          productID: cell.product_id,
          productName: matchedProduct?.product_name || "", // lấy name từ sampleProducts
          quantity: cell.quantity,
          updatedAt: new Date().toISOString(),
        };
      });

      // Lọc sampleProducts theo productName từ updatedHistory
      const filteredProducts = sampleProducts.filter((product) =>
        updatedHistory.some((history) => history.productID === product._id)
      );
      

      localStorage.setItem(
        "loadcellHistory",
        JSON.stringify([...updatedHistory])
      );

      alert("Upload thành công toàn bộ load cell!");
    } catch (error) {
      alert("Có lỗi khi upload load cell!");
      console.error(error);
    }
  };

  const handleDrop = async (
    e: React.DragEvent,
    level: number,
    compartment: number
  ) => {
    e.preventDefault();
    const productData = e.dataTransfer.getData("application/json");

    console.log(activeShelf);
    if (productData && activeShelf && sampleProducts.length > 0) {
      const product: Product = JSON.parse(productData);
      const targetCell = loadCells.find(
        (cell) => cell.floor === level + 1 && cell.column === compartment + 1
      );

      if (targetCell) {
        setLoadCells((prev) =>
          prev.map((cell) =>
            cell._id === targetCell._id
              ? { ...cell, product_id: product._id, quantity: 1 }
              : cell
          )
        );
      }
    } else {
      console.warn("No products loaded or active shelf not found.");
    }
  };

  const handleRemoveFromShelf = async (level: number, compartment: number) => {
    const targetCell = loadCells.find(
      (cell) => cell.floor === level + 1 && cell.column === compartment + 1
    );

    if (targetCell) {
      // Cập nhật state cục bộ
      setLoadCells((prev) =>
        prev.map((cell) =>
          cell._id === targetCell._id
            ? { ...cell, product_id: null, quantity: 0 }
            : cell
        )
      );
    }
  };

  const getShelfItem = (
    level: number,
    compartment: number
  ): (LoadCell & { product: Product | null }) | null => {
    const loadCell = loadCells.find(
      (cell) => cell.floor === level + 1 && cell.column === compartment + 1
    );
    if (!loadCell) return null;

    let product = sampleProducts.find((p) => p._id === loadCell.product_id);

    return {
      ...loadCell,
      product: product || null,
    };
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedShelfForMenu(null);
  };

  // Thêm hàm xử lý hiển thị ProductDialog
  const handleViewProductInfo = (product: Product) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
  };

  const handleCloseProductDialog = () => {
    setProductDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = (productData: any, file?: File) => {
    // Xử lý lưu sản phẩm nếu cần
    console.log("Saving product:", productData, file);
    handleCloseProductDialog();
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            setEditingShelf(selectedShelfForMenu);
            handleMenuClose();
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Rename
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() =>
            selectedShelfForMenu && handleDeleteShelf(selectedShelfForMenu)
          }
          disabled={shelves.length <= 1}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Shelf</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Shelf Name"
            fullWidth
            variant="outlined"
            value={newShelfName}
            onChange={(e) => setNewShelfName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateShelf();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateShelf}
            variant="contained"
            disabled={!newShelfName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            mt: 8,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Hàng hóa
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Kéo thả vào các ô tương ứng ở trên kệ
          </Typography>
          <List sx={{ p: 0 }}>
            {sampleProducts.map((product) => (
              <ListItem key={product._id} sx={{ p: 0, mb: 1 }}>
                <ProductCard
                  product={product}
                  handleDragStart={handleDragStart}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: sidebarOpen ? 0 : "-280px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Các mã lỗi:
          </Typography>
          <List dense sx={{ pl: 2 }}>
            <ListItem
              sx={{ display: "list-item", listStyleType: "disc", py: 0.5 }}
            >
              <ListItemText primary="255: lỗi loadcell" />
            </ListItem>
            <ListItem
              sx={{ display: "list-item", listStyleType: "disc", py: 0.5 }}
            >
              <ListItemText primary="200, 222: lỗi sản phẩm đặt không đúng vị trí" />
            </ListItem>
          </List>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4">
              {activeShelf?.shelf_name || "Shelf"}
            </Typography>{" "}
            {/* SỬA: Sử dụng shelf_name */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* <Chip
                label={`Created: ${activeShelf?.createdAt.toLocaleDateString()}`}
                variant="outlined"
                size="small"
              /> */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
              >
                <AddIcon />
                Thêm Kệ
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={uploadAllLoadCells}
              >
                Cập nhật
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => setTaskDialogOpen(true)}
              >
                Giao việc
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[0, 1, 2].map((level) => (
              <Box key={level}>
                <Grid container spacing={2}>
                  {[0, 1, 2, 3, 4].map((compartment, index) => (
                    <Grid component="div" size={2.4} key={index}>
                      <ShelfCompartment
                        level={level}
                        compartment={compartment}
                        shelfItem={getShelfItem(level, compartment)}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        handleRemoveFromShelf={handleRemoveFromShelf}
                        onViewProductInfo={handleViewProductInfo}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>

          <>
            <ShelfStatistics shelf={activeShelf} loadCells={loadCells} />

            <ShelvesOverview
              shelves={shelves}
              activeShelfId={activeShelfId}
              setActiveShelfId={setActiveShelfId}
            />
          </>
        </Container>
      </Box>

      <AddShelfDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onShelfAdded={handleShelfAdded}
      />

      {/* Thêm ProductDialog */}
      <ProductDialog
        open={productDialogOpen}
        onClose={handleCloseProductDialog}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />

      <TaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        onSave={(taskData) => {
          console.log("Dữ liệu công việc:", taskData);
          setTaskDialogOpen(false);
        }}
        employees={employees}
      />
    </Box>
  );
}
