import React from "react";
import { Box, Grid, Paper, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShelfRealtimePanel from "../components/ShelfRealtimePanel";
import useMqtt from "../lib/useMqtt";
import StatsCharts from "../components/StatsCharts";

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

  // connect to mqtt and subscribe topics
  const { connected, sensor, loadcellQuantities, tracking, status } = useMqtt({
    host: "broker.hivemq.com",
    port: 8000,
    path: "/mqtt",
    topics: [
      "shelf/sensor/environment",
      "shelf/loadcell/quantity",
      "shelf/tracking/unpaid_customer",
      "shelf/status/data",
    ],
  });

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

  const topProducts = [
    { name: "Snack A", count: 42 },
    { name: "Snack B", count: 28 },
    { name: "Drink X", count: 18 },
    { name: "Other", count: 12 },
  ];

  const revenueSeries = [
    { period: "2025-06", revenue: 1200000 },
    { period: "2025-07", revenue: 1850000 },
    { period: "2025-08", revenue: 950000 },
    { period: "2025-09", revenue: 2300000 },
    { period: "2025-10", revenue: 1750000 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ my: 2 }}>
        <Typography variant="h6">Realtime kệ</Typography>
        <Typography variant="caption" color="text.secondary">
          MQTT: {connected ? "Đã kết nối" : "Đang ngắt kết nối"}
        </Typography>
        <ShelfRealtimePanel
          sensor={sensor}
          status={status}
          useLocalStorageFallback={true}
          sx={{ mt: 1 }}
        />
      </Box>

      <Box>
        <StatsCharts products={topProducts} revenue={revenueSeries} />
      </Box>

    </Box>
  );
}