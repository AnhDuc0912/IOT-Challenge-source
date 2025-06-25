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
  Fab,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  AppBar,
  Toolbar,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Receipt as ReceiptIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  FileDownload as FileDownloadIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  FilterList as FilterListIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { Receipt, ReceiptItem, User } from "../types/receiptTypes";
import {
  sampleProducts,
  sampleCustomers,
  sampleUsers,
  generateSampleReceipts,
} from "../mock/receiptMockData";
import { Product } from "../mock/shelfMockData";

export default function ReceiptManagement() {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<Receipt[]>(generateSampleReceipts());
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>(receipts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("");
  const [dateRangeFilter, setDateRangeFilter] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [receiptDetailDialog, setReceiptDetailDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);

  // Form state for new/edit receipt
  const [formData, setFormData] = useState({
    customer: null as User | null,
    items: [] as ReceiptItem[],
    paymentMethod: "Cash" as Receipt["paymentMethod"],
    status: "Paid" as Receipt["status"],
    notes: "",
  });

  // Current product being added
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  // Calculate totals
  const calculateSubtotal = (items: ReceiptItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateTotal = (subtotal: number, tax: number) => {
    return subtotal + tax;
  };

  // Filter receipts
  useEffect(() => {
    let result = [...receipts];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (receipt) =>
          receipt.receiptNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          receipt.customer?.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          receipt.customer?.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          receipt.items.some((item) =>
            item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((receipt) => receipt.status === statusFilter);
    }

    // Apply payment method filter
    if (paymentMethodFilter) {
      result = result.filter(
        (receipt) => receipt.paymentMethod === paymentMethodFilter
      );
    }

    // Apply date range filter
    if (dateRangeFilter.start && dateRangeFilter.end) {
      result = result.filter(
        (receipt) =>
          receipt.createdAt >= dateRangeFilter.start! &&
          receipt.createdAt <= dateRangeFilter.end!
      );
    } else if (dateRangeFilter.start) {
      result = result.filter(
        (receipt) => receipt.createdAt >= dateRangeFilter.start!
      );
    } else if (dateRangeFilter.end) {
      result = result.filter(
        (receipt) => receipt.createdAt <= dateRangeFilter.end!
      );
    }

    setFilteredReceipts(result);
  }, [
    receipts,
    searchTerm,
    statusFilter,
    paymentMethodFilter,
    dateRangeFilter,
  ]);

  const handleAddReceipt = () => {
    setCurrentReceipt(null);
    setFormData({
      customer: null,
      items: [],
      paymentMethod: "Cash",
      status: "Paid",
      notes: "",
    });
    setDialogOpen(true);
  };

  const handleEditReceipt = (receipt: Receipt) => {
    setCurrentReceipt(receipt);
    setFormData({
      customer: receipt.customer,
      items: [...receipt.items],
      paymentMethod: receipt.paymentMethod,
      status: receipt.status,
      notes: receipt.notes || "",
    });
    setDialogOpen(true);
  };

  const handleViewReceipt = (receipt: Receipt) => {
    setCurrentReceipt(receipt);
    setReceiptDetailDialog(true);
  };

  const handleDeleteReceipt = (receipt: Receipt) => {
    setCurrentReceipt(receipt);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteReceipt = () => {
    if (currentReceipt) {
      setReceipts((prev) => prev.filter((r) => r.id !== currentReceipt.id));
      setSnackbar({
        open: true,
        message: `Receipt ${currentReceipt.receiptNumber} has been deleted`,
        severity: "success",
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleAddItem = () => {
    if (!currentProduct) return;

    const newItem: ReceiptItem = {
      id: `temp-${Date.now()}`,
      product: currentProduct,
      quantity: currentQuantity,
      price: currentProduct.price,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setCurrentProduct(null);
    setCurrentQuantity(1);
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleSaveReceipt = () => {
    if (formData.items.length === 0) {
      setSnackbar({
        open: true,
        message: "Please add at least one item to the receipt",
        severity: "error",
      });
      return;
    }

    const subtotal = calculateSubtotal(formData.items);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);

    if (currentReceipt) {
      // Update existing receipt
      const updatedReceipt: Receipt = {
        ...currentReceipt,
        customer: formData.customer,
        items: formData.items,
        subtotal,
        tax,
        total,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      setReceipts((prev) =>
        prev.map((r) => (r.id === currentReceipt.id ? updatedReceipt : r))
      );
      setSnackbar({
        open: true,
        message: `Receipt ${currentReceipt.receiptNumber} has been updated`,
        severity: "success",
      });
    } else {
      // Add new receipt
      const newReceipt: Receipt = {
        id: `r${Date.now()}`,
        receiptNumber: `REC-${new Date().getFullYear()}-${
          1000 + receipts.length + 1
        }`,
        customer: formData.customer,
        items: formData.items,
        subtotal,
        tax,
        total,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        createdAt: new Date(),
        createdBy: sampleUsers[0], // Assuming first user is current user
      };

      setReceipts((prev) => [...prev, newReceipt]);
      setSnackbar({
        open: true,
        message: `Receipt ${newReceipt.receiptNumber} has been created`,
        severity: "success",
      });
    }

    setDialogOpen(false);
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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentMethodFilter("");
    setDateRangeFilter({ start: null, end: null });
  };

  const handlePrintReceipt = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "error";
      case "Refunded":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircleIcon />;
      case "Pending":
        return <PendingIcon />;
      case "Cancelled":
        return <CancelIcon />;
      case "Refunded":
        return <MoneyIcon />;
      default:
        return <ReceiptIcon />;
    }
  };

  // Calculate statistics
  const totalReceipts = receipts.length;
  const totalSales = receipts.reduce(
    (sum, receipt) =>
      sum + (receipt.status !== "Cancelled" ? receipt.total : 0),
    0
  );
  const paidReceipts = receipts.filter((r) => r.status === "Paid").length;
  const pendingReceipts = receipts.filter((r) => r.status === "Pending").length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" onClick={() => navigate("/")}>
              <ArrowBackIcon />
            </IconButton>
            <ReceiptIcon sx={{ ml: 2, mr: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Receipt Management
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                      >
                        Total Receipts
                      </Typography>
                      <Typography variant="h4">{totalReceipts}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <ReceiptIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                      >
                        Total Sales
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        ${totalSales.toFixed(2)}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <MoneyIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                      >
                        Paid Receipts
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {paidReceipts}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "success.main" }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                      >
                        Pending Receipts
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {pendingReceipts}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "warning.main" }}>
                      <PendingIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FilterListIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Filters</Typography>
              </Box>
              <IconButton onClick={() => setExpandedFilters(!expandedFilters)}>
                {expandedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={expandedFilters}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search receipts..."
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
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                      displayEmpty
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                      <MenuItem value="Refunded">Refunded</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethodFilter}
                      onChange={(e) => setPaymentMethodFilter(e.target.value)}
                      label="Payment Method"
                      displayEmpty
                    >
                      <MenuItem value="">All Payment Methods</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Debit Card">Debit Card</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={clearFilters}
                    disabled={
                      !searchTerm &&
                      !statusFilter &&
                      !paymentMethodFilter &&
                      !dateRangeFilter.start &&
                      !dateRangeFilter.end
                    }
                  >
                    Clear Filters
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <DatePicker
                      label="Start Date"
                      value={dateRangeFilter.start}
                      onChange={(date) =>
                        setDateRangeFilter({ ...dateRangeFilter, start: date })
                      }
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                    <DatePicker
                      label="End Date"
                      value={dateRangeFilter.end}
                      onChange={(date) =>
                        setDateRangeFilter({ ...dateRangeFilter, end: date })
                      }
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Collapse>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
            >
              <Tab label="All Receipts" />
              <Tab label="Paid" />
              <Tab label="Pending" />
              <Tab label="Cancelled/Refunded" />
            </Tabs>
          </Box>

          {/* Receipts Table */}
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Receipt #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReceipts
                    .filter((receipt) => {
                      if (tabValue === 0) return true;
                      if (tabValue === 1) return receipt.status === "Paid";
                      if (tabValue === 2) return receipt.status === "Pending";
                      if (tabValue === 3)
                        return (
                          receipt.status === "Cancelled" ||
                          receipt.status === "Refunded"
                        );
                      return true;
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((receipt) => (
                      <TableRow
                        key={receipt.id}
                        hover
                        onClick={() => handleViewReceipt(receipt)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{receipt.receiptNumber}</TableCell>
                        <TableCell>
                          {receipt.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {receipt.customer
                            ? `${receipt.customer.firstName} ${receipt.customer.lastName}`
                            : "Walk-in Customer"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${receipt.items.length} items`}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>${receipt.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(receipt.status)}
                            label={receipt.status}
                            color={getStatusColor(receipt.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{receipt.paymentMethod}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditReceipt(receipt);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReceipt(receipt);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={
                filteredReceipts.filter((receipt) => {
                  if (tabValue === 0) return true;
                  if (tabValue === 1) return receipt.status === "Paid";
                  if (tabValue === 2) return receipt.status === "Pending";
                  if (tabValue === 3)
                    return (
                      receipt.status === "Cancelled" ||
                      receipt.status === "Refunded"
                    );
                  return true;
                }).length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Container>

        {/* Add/Edit Receipt Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {currentReceipt ? "Edit Receipt" : "Create New Receipt"}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  options={sampleCustomers}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  value={formData.customer}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, customer: newValue })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Customer" fullWidth />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target
                          .value as Receipt["paymentMethod"],
                      })
                    }
                    label="Payment Method"
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Debit Card">Debit Card</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Receipt["status"],
                      })
                    }
                    label="Status"
                  >
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="Refunded">Refunded</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Items" />
                </Divider>
              </Grid>

              {/* Add Item Form */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Autocomplete
                  options={sampleProducts}
                  getOptionLabel={(option) =>
                    `${option.name} - $${option.price.toFixed(2)}`
                  }
                  value={currentProduct}
                  onChange={(_, newValue) => setCurrentProduct(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Product" fullWidth />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={currentQuantity}
                  onChange={(e) =>
                    setCurrentQuantity(
                      Math.max(1, Number.parseInt(e.target.value) || 1)
                    )
                  }
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                  disabled={!currentProduct}
                  fullWidth
                  sx={{ height: "100%" }}
                >
                  Add Item
                </Button>
              </Grid>

              {/* Items List */}
              <Grid size={12}>
                <Paper
                  variant="outlined"
                  sx={{ mt: 2, maxHeight: 300, overflow: "auto" }}
                >
                  <List dense>
                    {formData.items.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="No items added yet" />
                      </ListItem>
                    ) : (
                      formData.items.map((item) => (
                        <ListItem key={item.id}>
                          <ListItemText
                            primary={item.product.name}
                            secondary={`${
                              item.quantity
                            } x $${item.price.toFixed(2)} = $${(
                              item.quantity * item.price
                            ).toFixed(2)}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <RemoveCircleIcon color="error" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))
                    )}
                  </List>
                </Paper>
              </Grid>

              {/* Totals */}
              <Grid size={12}>
                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal:
                      </Typography>
                      <Typography variant="h6">
                        ${calculateSubtotal(formData.items).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tax (8%):
                      </Typography>
                      <Typography variant="h6">
                        $
                        {calculateTax(
                          calculateSubtotal(formData.items)
                        ).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total:
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        $
                        {calculateTotal(
                          calculateSubtotal(formData.items),
                          calculateTax(calculateSubtotal(formData.items))
                        ).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  fullWidth
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveReceipt}
              startIcon={<SaveIcon />}
            >
              {currentReceipt ? "Update Receipt" : "Create Receipt"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Receipt Detail Dialog */}
        <Dialog
          open={receiptDetailDialog}
          onClose={() => setReceiptDetailDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Receipt Details</Typography>
              <Box>
                <IconButton onClick={handlePrintReceipt}>
                  <PrintIcon />
                </IconButton>
                <IconButton>
                  <FileDownloadIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {currentReceipt && (
              <Box ref={printRef}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Receipt #{currentReceipt.receiptNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <CalendarIcon
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            verticalAlign: "text-bottom",
                          }}
                        />
                        Date: {currentReceipt.createdAt.toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <PersonIcon
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            verticalAlign: "text-bottom",
                          }}
                        />
                        Created by: {currentReceipt.createdBy.firstName}{" "}
                        {currentReceipt.createdBy.lastName}
                      </Typography>
                    </Box>
                    <Chip
                      label={currentReceipt.status}
                      color={getStatusColor(currentReceipt.status) as any}
                      icon={getStatusIcon(currentReceipt.status)}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Customer Information
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        {currentReceipt.customer ? (
                          <>
                            <Typography variant="body1">
                              {currentReceipt.customer.firstName}{" "}
                              {currentReceipt.customer.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {currentReceipt.customer.email}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body1">
                            Walk-in Customer
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Payment Information
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body1">
                          Method: {currentReceipt.paymentMethod}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {currentReceipt.status}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                    Items
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>SKU</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentReceipt.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product.name}</TableCell>
                            <TableCell>{item.product.sku || "N/A"}</TableCell>
                            <TableCell align="right">
                              ${item.price.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box
                    sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 8 }}>
                        {currentReceipt.notes && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Notes:</Typography>
                            <Typography variant="body2">
                              {currentReceipt.notes}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body1">Subtotal:</Typography>
                          <Typography variant="body1">
                            ${currentReceipt.subtotal.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                          }}
                        >
                          <Typography variant="body1">Tax (8%):</Typography>
                          <Typography variant="body1">
                            ${currentReceipt.tax.toFixed(2)}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="h6">Total:</Typography>
                          <Typography variant="h6" color="primary.main">
                            ${currentReceipt.total.toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReceiptDetailDialog(false)}>Close</Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => {
                setReceiptDetailDialog(false);
                if (currentReceipt) handleEditReceipt(currentReceipt);
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrintReceipt}
            >
              Print
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
              Are you sure you want to delete receipt{" "}
              <strong>{currentReceipt?.receiptNumber}</strong>? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDeleteReceipt}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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
          <Fab color="primary" onClick={handleAddReceipt}>
            <AddIcon />
          </Fab>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

// Avatar component definition since it's used but not imported
const Avatar = ({ children, sx }: { children: React.ReactNode; sx?: any }) => {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
