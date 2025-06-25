import React from "react";
import { Paper, Typography, Grid } from "@mui/material";
import { Shelf } from "../mock/shelfMockData";

interface ShelfStatisticsProps {
  shelf?: Shelf;
}

const ShelfStatistics: React.FC<ShelfStatisticsProps> = ({ shelf }) => (
  <Paper sx={{ mt: 4, p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Shelf Statistics - {shelf?.name}
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
          {shelf?.items.filter((item) => item.product !== null).length || 0}
        </Typography>
      </Grid>
      <Grid component="div" size={3}>
        <Typography variant="body2" color="text.secondary">
          Available
        </Typography>
        <Typography variant="h4" color="success.main">
          {shelf?.items.filter((item) => item.product === null).length || 0}
        </Typography>
      </Grid>
      <Grid component="div" size={3}>
        <Typography variant="body2" color="text.secondary">
          Occupancy Rate
        </Typography>
        <Typography variant="h4" color="warning.main">
          {shelf
            ? Math.round(
                (shelf.items.filter((item) => item.product !== null).length / 15) * 100
              )
            : 0}
          %
        </Typography>
      </Grid>
    </Grid>
  </Paper>
);

export default ShelfStatistics; 