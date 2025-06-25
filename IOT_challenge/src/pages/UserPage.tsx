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
  Avatar,
  Switch,
  FormControlLabel,
  Badge,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface User {
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

const roles = ["Admin", "Manager", "Employee", "Viewer"];
const departments = [
  "Operations",
  "Warehouse",
  "IT",
  "Management",
  "Sales",
  "Support",
];
const availablePermissions = [
  "manage_shelves",
  "manage_products",
  "manage_users",
  "view_analytics",
  "export_data",
  "system_settings",
];

const initialUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    status: "Active",
    avatar: "/placeholder.svg?height=100&width=100",
    department: "IT",
    joinDate: new Date(2023, 0, 15),
    lastLogin: new Date(2024, 11, 10),
    permissions: [
      "manage_shelves",
      "manage_products",
      "manage_users",
      "view_analytics",
      "export_data",
      "system_settings",
    ],
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    phone: "+1 (555) 234-5678",
    role: "Manager",
    status: "Active",
    avatar: "/placeholder.svg?height=100&width=100",
    department: "Operations",
    joinDate: new Date(2023, 2, 20),
    lastLogin: new Date(2024, 11, 9),
    permissions: [
      "manage_shelves",
      "manage_products",
      "view_analytics",
      "export_data",
    ],
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 345-6789",
    role: "Employee",
    status: "Active",
    avatar: "/placeholder.svg?height=100&width=100",
    department: "Warehouse",
    joinDate: new Date(2023, 5, 10),
    lastLogin: new Date(2024, 11, 8),
    permissions: ["manage_shelves", "manage_products"],
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1 (555) 456-7890",
    role: "Employee",
    status: "Inactive",
    avatar: "/placeholder.svg?height=100&width=100",
    department: "Warehouse",
    joinDate: new Date(2023, 8, 5),
    lastLogin: new Date(2024, 10, 15),
    permissions: ["manage_shelves"],
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    role: "Viewer",
    status: "Active",
    department: "Sales",
    joinDate: new Date(2024, 1, 12),
    lastLogin: new Date(2024, 11, 7),
    permissions: ["view_analytics"],
  },
];

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Employee" as User["role"],
    status: "Active" as User["status"],
    avatar: "/placeholder.svg?height=100&width=100",
    department: "",
    permissions: [] as string[],
  });

  // Filter and search users
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Apply department filter
    if (departmentFilter) {
      result = result.filter((user) => user.department === departmentFilter);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter, departmentFilter]);

  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Employee",
      status: "Active",
      avatar: "/placeholder.svg?height=100&width=100",
      department: "",
      permissions: [],
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setFormData({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      status: user.status,
      avatar: user.avatar || "/placeholder.svg?height=100&width=100",
      department: user.department || "",
      permissions: user.permissions,
    });
    setDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (currentUser) {
      setUsers((prev) => prev.filter((u) => u.id !== currentUser.id));
      setSnackbar({
        open: true,
        message: `${currentUser.firstName} ${currentUser.lastName} has been deleted`,
        severity: "success",
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveUser = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    const newUser: User = {
      id: currentUser ? currentUser.id : Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      avatar: formData.avatar,
      department: formData.department,
      permissions: formData.permissions,
      joinDate: currentUser ? currentUser.joinDate : new Date(),
      lastLogin: currentUser?.lastLogin,
    };

    if (currentUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? newUser : u))
      );
      setSnackbar({
        open: true,
        message: `${newUser.firstName} ${newUser.lastName} has been updated`,
        severity: "success",
      });
    } else {
      // Add new user
      setUsers((prev) => [...prev, newUser]);
      setSnackbar({
        open: true,
        message: `${newUser.firstName} ${newUser.lastName} has been added`,
        severity: "success",
      });
    }

    setDialogOpen(false);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : ("Active" as User["status"]),
            }
          : user
      )
    );
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(
        file.name
      )}`;
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
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

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setStatusFilter("");
    setDepartmentFilter("");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <AdminIcon />;
      case "Manager":
        return <WorkIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "default";
      case "Suspended":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircleIcon />;
      case "Inactive":
        return <VisibilityIcon />;
      case "Suspended":
        return <BlockIcon />;
      default:
        return <PersonIcon />;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>
          <PersonIcon sx={{ ml: 2, mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
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
                      Total Users
                    </Typography>
                    <Typography variant="h4">{users.length}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <PersonIcon />
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
                      Active Users
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {users.filter((u) => u.status === "Active").length}
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
                      Admins
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {users.filter((u) => u.role === "Admin").length}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <AdminIcon />
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
                      Departments
                    </Typography>
                    <Typography variant="h4" color="info.main">
                      {
                        new Set(users.map((u) => u.department).filter(Boolean))
                          .size
                      }
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "info.main" }}>
                    <WorkIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                placeholder="Search users..."
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
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Role"
                  displayEmpty
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                  displayEmpty
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="Department"
                  displayEmpty
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                disabled={
                  !searchTerm &&
                  !roleFilter &&
                  !statusFilter &&
                  !departmentFilter
                }
              >
                Clear
              </Button>
            </Grid>
            <Grid size={{ xs: 6, md: 1 }}>
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

        {/* Users Display */}
        {filteredUsers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or filters
            </Typography>
          </Paper>
        ) : viewMode === "grid" ? (
          <Grid container spacing={3}>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={getStatusIcon(user.status)}
                        color={getStatusColor(user.status) as any}
                      >
                        <Avatar
                          src={user.avatar}
                          sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                          alt={`${user.firstName} ${user.lastName}`}
                        >
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </Avatar>
                      </Badge>
                      <Typography variant="h6" gutterBottom>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        {getRoleIcon(user.role)}
                        <Chip label={user.role} size="small" sx={{ ml: 1 }} />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <EmailIcon
                          fontSize="small"
                          sx={{ mr: 0.5, verticalAlign: "middle" }}
                        />
                        {user.email}
                      </Typography>
                      {user.phone && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          <PhoneIcon
                            fontSize="small"
                            sx={{ mr: 0.5, verticalAlign: "middle" }}
                          />
                          {user.phone}
                        </Typography>
                      )}
                      {user.department && (
                        <Chip
                          label={user.department}
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      )}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Joined: {user.joinDate.toLocaleDateString()}
                      </Typography>
                      {user.lastLogin && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Last login: {user.lastLogin.toLocaleDateString()}
                        </Typography>
                      )}
                    </CardContent>
                    <Divider />
                    <CardActions
                      sx={{ justifyContent: "space-between", px: 2 }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={user.status === "Active"}
                            onChange={() => handleToggleUserStatus(user.id)}
                            size="small"
                          />
                        }
                        label={user.status}
                        sx={{ m: 0 }}
                      />
                      <Box>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar src={user.avatar} sx={{ mr: 2 }}>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {getRoleIcon(user.role)}
                          <Typography sx={{ ml: 1 }}>{user.role}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.department || "-"}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={getStatusColor(user.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {user.joinDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.lastLogin?.toLocaleDateString() || "Never"}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user)}
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
              count={filteredUsers.length}
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
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}
      </Container>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{currentUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Avatar
                  src={formData.avatar}
                  sx={{ width: 120, height: 120, mb: 2, cursor: "pointer" }}
                  onClick={handleAvatarUpload}
                >
                  {formData.firstName[0]}
                  {formData.lastName[0]}
                </Avatar>
                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={handleAvatarUpload}
                >
                  Upload Avatar
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
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      label="Department"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as User["role"],
                        })
                      }
                      label="Role"
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as User["status"],
                        })
                      }
                      label="Status"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Suspended">Suspended</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Permissions
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {availablePermissions.map((permission) => (
                      <Chip
                        key={permission}
                        label={permission.replace("_", " ").toUpperCase()}
                        clickable
                        color={
                          formData.permissions.includes(permission)
                            ? "primary"
                            : "default"
                        }
                        onClick={() => {
                          const newPermissions = formData.permissions.includes(
                            permission
                          )
                            ? formData.permissions.filter(
                                (p) => p !== permission
                              )
                            : [...formData.permissions, permission];
                          setFormData({
                            ...formData,
                            permissions: newPermissions,
                          });
                        }}
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            startIcon={<SaveIcon />}
          >
            {currentUser ? "Update User" : "Add User"}
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
            <strong>
              {currentUser?.firstName} {currentUser?.lastName}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteUser}>
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
        <Fab color="primary" onClick={handleAddUser}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
}
