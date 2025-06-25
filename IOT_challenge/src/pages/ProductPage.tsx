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
  ArrowBack as ArrowBackIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Product, categories, initialProducts } from "../mock/productMockData";
import ProductItem from "../components/ProductItem";

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "price" | "category" | "createdAt"
  >("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "/placeholder.svg?height=200&width=200",
    category: "",
    price: 0,
    description: "",
    stock: 0,
    sku: "",
  });

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter((product) => product.category === categoryFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sortBy === "createdAt") {
        return sortDirection === "asc"
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        const valueA = a[sortBy].toString().toLowerCase();
        const valueB = b[sortBy].toString().toLowerCase();
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, sortBy, sortDirection]);

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setFormData({
      id: "",
      name: "",
      image: "/placeholder.svg?height=200&width=200",
      category: "",
      price: 0,
      description: "",
      stock: 0,
      sku: "",
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      price: product.price,
      description: product.description || "",
      stock: product.stock || 0,
      sku: product.sku || "",
    });
    setDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setCurrentProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (currentProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== currentProduct.id));
      setSnackbar({
        open: true,
        message: `${currentProduct.name} has been deleted`,
        severity: "success",
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.category || formData.price <= 0) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    const newProduct: Product = {
      id: currentProduct ? currentProduct.id : Date.now().toString(),
      name: formData.name,
      image: formData.image,
      category: formData.category,
      price: formData.price,
      description: formData.description,
      stock: formData.stock,
      sku: formData.sku,
      createdAt: currentProduct ? currentProduct.createdAt : new Date(),
    };

    if (currentProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((p) => (p.id === currentProduct.id ? newProduct : p))
      );
      setSnackbar({
        open: true,
        message: `${newProduct.name} has been updated`,
        severity: "success",
      });
    } else {
      // Add new product
      setProducts((prev) => [...prev, newProduct]);
      setSnackbar({
        open: true,
        message: `${newProduct.name} has been added`,
        severity: "success",
      });
    }

    setDialogOpen(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server and get a URL back
      // For this demo, we'll just use a placeholder
      const imageUrl = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
        file.name
      )}`;
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
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

  const handleSortChange = (
    column: "name" | "price" | "category" | "createdAt"
  ) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 2, px: 3 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="inherit" onClick={() => navigate("/")}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" sx={{ ml: 2 }}>
                Product Management
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
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
            <Grid size={4}>
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
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                  displayEmpty
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={`${sortBy}-${sortDirection}`}
                  onChange={(e) => {
                    const [newSortBy, newSortDirection] = e.target.value.split(
                      "-"
                    ) as [
                      "name" | "price" | "category" | "createdAt",
                      "asc" | "desc"
                    ];
                    setSortBy(newSortBy);
                    setSortDirection(newSortDirection);
                  }}
                  label="Sort By"
                >
                  <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                  <MenuItem value="price-asc">Price (Low to High)</MenuItem>
                  <MenuItem value="price-desc">Price (High to Low)</MenuItem>
                  <MenuItem value="category-asc">Category (A-Z)</MenuItem>
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
                disabled={!searchTerm && !categoryFilter}
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
                <Grid size={4} key={product.id}>
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
                      onClick={() => handleSortChange("name")}
                    >
                      Name
                      {sortBy === "name" && (
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
                      onClick={() => handleSortChange("category")}
                    >
                      Category
                      {sortBy === "category" && (
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
                  <TableCell>SKU</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box
                          component="img"
                          src={product.image}
                          alt={product.name}
                          sx={{ width: 60, height: 60, objectFit: "contain" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.description?.substring(0, 50)}
                          {product.description &&
                          product.description.length > 50
                            ? "..."
                            : ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={product.category} size="small" />
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.sku}</TableCell>
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
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed",
                    borderColor: "grey.300",
                    borderRadius: 1,
                    mb: 2,
                    overflow: "hidden",
                    bgcolor: "grey.50",
                  }}
                >
                  {formData.image ? (
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Product"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <ImageIcon sx={{ fontSize: 60, color: "grey.400" }} />
                  )}
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  onClick={handleImageUpload}
                >
                  Upload Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            </Grid>
            <Grid size={8}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid size={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={12} >
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    required
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="SKU"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="e.g. ELEC-001"
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveProduct}
            startIcon={<SaveIcon />}
          >
            {currentProduct ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{currentProduct?.name}</strong>? This action cannot be
            undone.
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
