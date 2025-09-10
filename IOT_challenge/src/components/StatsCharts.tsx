import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";

type ProductStat = { name: string; count: number };
type RevenuePoint = { period: string; revenue: number };

interface StatsChartsProps {
  products?: ProductStat[]; // top products or categories
  revenue?: RevenuePoint[]; // time series e.g. months/days
  sx?: any;
}

export default function StatsCharts({ products = [], revenue = [], sx }: StatsChartsProps) {
  const productsData = products.length
    ? products
    : [
        { name: "Sản phẩm A", count: 32 },
        { name: "Sản phẩm B", count: 21 },
        { name: "Sản phẩm C", count: 16 },
        { name: "Khác", count: 15 },
      ];

  const revenueData = revenue.length
    ? revenue
    : [
        { period: "Th06", revenue: 1200000 },
        { period: "Th07", revenue: 1850000 },
        { period: "Th08", revenue: 950000 },
        { period: "Th09", revenue: 2300000 },
        { period: "Th10", revenue: 1750000 },
      ];

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, ...sx }}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Top sản phẩm / danh mục
        </Typography>
        <Box sx={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productsData} margin={{ top: 8, right: 12, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(v: any) => [v, "Số lượng"]} />
              <Bar dataKey="count" fill="#1976d2" name="Số lượng" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Doanh thu theo thời gian
        </Typography>
        <Box sx={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 8, right: 12, left: 0, bottom: 6 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4caf50" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(v: any) => [new Intl.NumberFormat().format(Number(v)) + " đ", "Doanh thu"]} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#4caf50" fill="url(#colorRev)" name="Doanh thu" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}