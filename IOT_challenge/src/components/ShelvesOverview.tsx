import React from "react";
import { Paper, Typography, Grid } from "@mui/material";
import { Shelf } from "../types/selfTypes";

interface ShelvesOverviewProps {
  shelves: Shelf[];
  activeShelfId: string;
  setActiveShelfId: (id: string) => void;
}

const ShelvesOverview: React.FC<ShelvesOverviewProps> = ({
  shelves,
  activeShelfId,
  setActiveShelfId,
}) => (
  <Paper sx={{ mt: 2, p: 2 }}>
    <Typography variant="h6" gutterBottom>
      All Shelves Overview
    </Typography>
    <Grid container spacing={2}>
      {shelves.map((shelf) => (
        <Grid component="div" size={4} key={shelf._id}>
          <Paper
            sx={{
              p: 2,
              border: shelf._id === activeShelfId ? 2 : 1,
              borderColor:
                shelf._id === activeShelfId ? "primary.main" : "grey.300",
              cursor: "pointer",
            }}
            onClick={() => setActiveShelfId(shelf._id)}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {shelf.shelf_name}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary">
              {shelf.items.filter((item) => item.product !== null).length}/15 occupied
            </Typography> */}
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(shelf.createdAt).getTime()}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

export default ShelvesOverview;
