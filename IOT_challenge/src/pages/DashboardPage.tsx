import React from "react";
import { Box, Grid, Paper, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, onClick }) => (
  <Paper elevation={2} sx={{ p: 2, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
    <Typography variant="subtitle2" color="textSecondary">
      {title}
    </Typography>
    <Typography variant="h4" sx={{ mt: 1 }}>
      {value}
    </Typography>
  </Paper>
);

export default function DashboardPage() {
  const navigate = useNavigate();

  // UI-first: static mock data (no API)
  const stats = {
    shelves: 12,
    products: 84,
    orders: 37,
    users: 9,
  };

  const recent = [
    "Order HD20250827-UOIU created",
    "Shelf S0005 depleted on LC-1-3",
    "User nguyen.v added to Shelf S0002",
    "Product PRD-123 price updated",
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={3}>
          <StatCard title="Shelves" value={stats.shelves} onClick={() => navigate("/shelf")} />
        </Grid>
        <Grid size={3}>
          <StatCard title="Products" value={stats.products} onClick={() => navigate("/products")} />
        </Grid>
        <Grid size={3}>
          <StatCard title="Orders" value={stats.orders} onClick={() => navigate("/receipts")} />
        </Grid>
        <Grid size={3}>
          <StatCard title="Users" value={stats.users} onClick={() => navigate("/users")} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={6}>
          <Paper elevation={2} sx={{ p: 2, minHeight: 200 }}>
            <Typography variant="h6">Recent activity</Typography>
            <List>
              {recent.map((r, i) => (
                <ListItem key={i} divider>
                  <ListItemText primary={r} secondary={new Date().toLocaleString()} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={6}>
          <Paper elevation={2} sx={{ p: 2, minHeight: 200 }}>
            <Typography variant="h6" gutterBottom>
              Quick actions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button variant="contained" onClick={() => navigate("/shelf")}>
                Manage Shelves
              </Button>
              <Button variant="outlined" onClick={() => navigate("/products")}>
                Manage Products
              </Button>
              <Button variant="outlined" onClick={() => navigate("/receipts")}>
                View Orders
              </Button>
              <Button variant="outlined" onClick={() => navigate("/users")}>
                Manage Users
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}