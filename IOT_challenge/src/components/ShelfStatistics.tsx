import React from "react";
import { Paper, Typography, Grid } from "@mui/material";
import { Shelf, LoadCell } from "../types/selfTypes";

interface ShelfStatisticsProps {
  shelf?: Shelf;
  loadCells: LoadCell[]; // MỚI: Thêm prop loadCells
}

const ShelfStatistics: React.FC<ShelfStatisticsProps> = ({ shelf, loadCells }) => (
  <Paper sx={{ mt: 4, p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Shelf Statistics - {shelf?.shelf_name || "Unknown Shelf"}
    </Typography>
    <Grid container spacing={2}>
      <Grid component="div" size={3}>
        <Typography variant="body2" color="text.secondary">
          Total Compartments
        </Typography>
        <Typography variant="h4">15</Typography>
      </Grid>
      <Grid component="div" size={3}>
        <Typography variant="body2" color="text.secondary">
          Occupied
        </Typography>
        <Typography variant="h4" color="primary">
          {loadCells.filter((cell) => cell.product_id !== "").length}
        </Typography>
      </Grid>
      <Grid component="div" size={3}>
        <Typography variant="body2" color="text.secondary">
          Available
        </Typography>
        <Typography variant="h4" color="success.main">
          {loadCells.filter((cell) => cell.product_id === "").length}
        </Typography>
      </Grid>
      <Grid component="div" size={3}>
        <Typography variant="body2" color="text.secondary">
          Occupancy Rate
        </Typography>
        <Typography variant="h4" color="warning.main">
          {Math.round((loadCells.filter((cell) => cell.product_id !== "").length / 15) * 100)}%
        </Typography>
      </Grid>
    </Grid>
  </Paper>
);

export default ShelfStatistics;