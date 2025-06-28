"use client";

import React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  Paper,
  Divider,
  Tooltip,
  Fab,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Image as ImageIcon,
  Save as SaveIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { Product } from "../types/selfTypes";
import ProductItem from "../components/ProductItem";
import ProductDialog from "../components/ProductDialog";
import {
  fetchProducts,
  addProduct,
  updateProduct,
} from "../service/product.service";

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"product_name" | "price" | "createdAt">(
    "createdAt"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort products
  useEffect(() => {
    const fetchAndSetProducts = async () => {
      let result = await fetchProducts();

      // Apply search filter
      if (searchTerm) {
        result = result.filter((product) =>
          product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      result.sort((a, b) => {
        if (sortBy === "price") {
          return sortDirection === "asc"
            ? a.price - b.price
            : b.price - a.price;
        } else if (sortBy === "createdAt") {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
        } else {
          const valueA = a[sortBy].toString().toLowerCase();
          const valueB = b[sortBy].toString().toLowerCase();
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
      });

      setProducts(result);
      setFilteredProducts(result);
    };

    fetchAndSetProducts();
  }, [searchTerm, sortBy, sortDirection]);

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setCurrentProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (currentProduct) {
      setProducts((prev) =>
        prev.filter((p) => p.product_id !== currentProduct.product_id)
      );
      setSnackbar({
        open: true,
        message: `${currentProduct.product_name} has been deleted`,
        severity: "success",
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveProduct = async (
    formData: Omit<Product, "createdAt" | "updatedAt">,
    file?: File
  ) => {
    if (!formData.product_name || formData.price <= 0) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    if (currentProduct) {
      try {
        const updatedProduct = await updateProduct(
          currentProduct._id,
          formData,
          file
        );

        setProducts((prev) =>
          prev.map((p) =>
            p.product_id === updatedProduct.product_id ? updatedProduct : p
          )
        );
        setFilteredProducts((prev) =>
          prev.map((p) =>
            p.product_id === updatedProduct.product_id ? updatedProduct : p
          )
        );
        setSnackbar({
          open: true,
          message: `${updatedProduct.product_name} has been updated`,
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to update product.",
          severity: "error",
        });
      }
    } else {
      try {
        const productToAdd = {
          product_id: Date.now().toString(),
          product_name: formData.product_name,
          img_url: "", // backend sẽ tự set
          price: formData.price,
          stock: formData.stock,
        };

        const addedProduct = await addProduct(productToAdd, file);

        setProducts((prev) => [...prev, addedProduct]);
        setFilteredProducts((prev) => [...prev, addedProduct]);
        setSnackbar({
          open: true,
          message: `${addedProduct.product_name} has been added`,
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to add product.",
          severity: "error",
        });
      }
    }

    setDialogOpen(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortChange = (column: "product_name" | "price" | "createdAt") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ py: 2, px: 3 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ ml: 2 }}>
              Product Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
              sx={{ fontWeight: "bold" }}
            >
              Add Product
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={6}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm("")}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={4}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={`${sortBy}-${sortDirection}`}
                  onChange={(e) => {
                    const [newSortBy, newSortDirection] = e.target.value.split(
                      "-"
                    ) as [
                      "product_name" | "price" | "createdAt",
                      "asc" | "desc"
                    ];
                    setSortBy(newSortBy);
                    setSortDirection(newSortDirection);
                  }}
                  label="Sort By"
                >
                  <MenuItem value="product_name-asc">Name (A-Z)</MenuItem>
                  <MenuItem value="product_name-desc">Name (Z-A)</MenuItem>
                  <MenuItem value="price-asc">Price (Low to High)</MenuItem>
                  <MenuItem value="price-desc">Price (High to Low)</MenuItem>
                  <MenuItem value="createdAt-desc">Newest First</MenuItem>
                  <MenuItem value="createdAt-asc">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={1}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                disabled={!searchTerm}
              >
                Clear
              </Button>
            </Grid>
            <Grid size={1}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Tooltip
                  title={viewMode === "grid" ? "List View" : "Grid View"}
                >
                  <IconButton
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                  >
                    {viewMode === "grid" ? (
                      <ViewListIcon />
                    ) : (
                      <ViewModuleIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or filters
            </Typography>
          </Paper>
        ) : viewMode === "grid" ? (
          <Grid container spacing={3}>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <Grid size={12} key={product._id}>
                  <ProductItem
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                </Grid>
              ))}
          </Grid>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSortChange("product_name")}
                    >
                      Name
                      {sortBy === "product_name" && (
                        <SortIcon
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(180deg)"
                                : "none",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSortChange("price")}
                    >
                      Price
                      {sortBy === "price" && (
                        <SortIcon
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(180deg)"
                                : "none",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell>
                        <Box
                          component="img"
                          src={product.img_url}
                          alt={product.product_name}
                          sx={{ width: 60, height: 60, objectFit: "contain" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {product.product_name}
                        </Typography>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditProduct(product)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}

        {/* Pagination for Grid View */}
        {viewMode === "grid" && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <TablePagination
              rowsPerPageOptions={[8, 12, 24]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}
      </Container>

      {/* Add/Edit Product Dialog */}
      <ProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveProduct}
        product={currentProduct}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{currentProduct?.product_name}</strong>? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeleteProduct}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden file input for image upload */}
      <input type="file" style={{ display: "none" }} />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Floating action button for mobile */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "block", md: "none" },
        }}
      >
        <Fab color="primary" onClick={handleAddProduct}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
}
