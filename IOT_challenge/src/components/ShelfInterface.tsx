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
import { createEmptyShelfItems, ShelfItem } from "../mock/shelfMockData";
import ProductCard from "./ProductCard";
import ShelfCompartment from "./ShelfCompartment";
import ShelfStatistics from "./ShelfStatistics";
import ShelvesOverview from "./ShelvesOverview";
import { fetchProducts, fetchShelves } from "../service/shefl.service";
import { Product, Shelf } from "../types/selfTypes";
import HeaderBar from "./HeaderBar";
import AddShelfDialog from "./AddShelfDialog";

export default function ShelfInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [activeShelfId, setActiveShelfId] = useState("1");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [editingShelf, setEditingShelf] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedShelfForMenu, setSelectedShelfForMenu] = useState<
    string | null
  >(null);
  const [sampleProducts, setSampleProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleShelfAdded = (shelf: any) => {
    handleCloseDialog();
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProducts();

      setSampleProducts(data);
      console.log(data);

      const dataShelves = await fetchShelves();

      setShelves(dataShelves);
    };

    fetchData();
  }, []);

  const activeShelf = shelves.find((shelf) => shelf.id === activeShelfId);
  const navigate = useNavigate();

  const handleCreateShelf = () => {
    if (newShelfName.trim()) {
      const newShelf: Shelf = {
        id: Date.now().toString(),
        name: newShelfName.trim(),
        items: createEmptyShelfItems(),
        createdAt: new Date(),
      };
      setShelves((prev) => [...prev, newShelf]);
      setActiveShelfId(newShelf.id);
      setNewShelfName("");
      setDialogOpen(false);
    }
  };

  const handleDeleteShelf = (shelfId: string) => {
    if (shelves.length > 1) {
      setShelves((prev) => prev.filter((shelf) => shelf.id !== shelfId));
      if (activeShelfId === shelfId) {
        setActiveShelfId(
          shelves.find((shelf) => shelf.id !== shelfId)?.id || shelves[0].id
        );
      }
    }
    setMenuAnchor(null);
  };

  const handleRenameShelf = (shelfId: string, newName: string) => {
    setShelves((prev) =>
      prev.map((shelf) =>
        shelf.id === shelfId ? { ...shelf, name: newName } : shelf
      )
    );
    setEditingShelf(null);
  };

  const handleDragStart = (e: React.DragEvent, product: Product) => {
    e.dataTransfer.setData("application/json", JSON.stringify(product));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent,
    level: number,
    compartment: number
  ) => {
    e.preventDefault();
    const productData = e.dataTransfer.getData("application/json");

    if (productData && activeShelf) {
      const product: Product = JSON.parse(productData);

      setShelves((prev) =>
        prev.map((shelf) =>
          shelf.id === activeShelfId
            ? {
                ...shelf,
                items: shelf.items.map((item) =>
                  item.position.level === level &&
                  item.position.compartment === compartment
                    ? { ...item, product }
                    : item
                ),
              }
            : shelf
        )
      );
    }
  };

  const handleRemoveFromShelf = (level: number, compartment: number) => {
    setShelves((prev) =>
      prev.map((shelf) =>
        shelf.id === activeShelfId
          ? {
              ...shelf,
              items: shelf.items.map((item) =>
                item.position.level === level &&
                item.position.compartment === compartment
                  ? { ...item, product: null }
                  : item
              ),
            }
          : shelf
      )
    );
  };

  const getShelfItem = (level: number, compartment: number) => {
    return activeShelf?.items.find(
      (item) =>
        item.position.level === level &&
        item.position.compartment === compartment
    );
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    shelfId: string
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedShelfForMenu(shelfId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedShelfForMenu(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Shelf Menu */}
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

      {/* Create Shelf Dialog */}
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

      {/* Sidebar */}
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
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Drag products to the shelf compartments
          </Typography>
          <List sx={{ p: 0 }}>
            {sampleProducts.map((product) => (
              <ListItem key={product.product_id} sx={{ p: 0, mb: 1 }}>
                <ProductCard
                  product={product}
                  handleDragStart={handleDragStart}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4">{activeShelf?.name || "Shelf"}</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Chip
                label={`Created: ${activeShelf?.createdAt.toLocaleDateString()}`}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
              >
                <AddIcon />
                Add Shelf
              </Button>
            </Box>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Organize your products across 3 levels with 5 compartments each.
            Click on placed items to remove them.
          </Typography>

          {/* Shelf Levels */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[0, 1, 2].map((level) => (
              <Box key={level}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Level {level + 1}
                </Typography>
                <Grid container spacing={2}>
                  {[0, 1, 2, 3, 4].map((compartment) => (
                    <Grid component="div" size={2.4} key={compartment}>
                      <ShelfCompartment
                        level={level}
                        compartment={compartment}
                        shelfItem={getShelfItem(level, compartment)}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        handleRemoveFromShelf={handleRemoveFromShelf}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>

          {/* Statistics */}
          <ShelfStatistics shelf={activeShelf} />

          {/* All Shelves Overview */}
          <ShelvesOverview
            shelves={shelves}
            activeShelfId={activeShelfId}
            setActiveShelfId={setActiveShelfId}
          />
        </Container>
      </Box>

      <AddShelfDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onShelfAdded={handleShelfAdded}
      />
    </Box>
  );
}
