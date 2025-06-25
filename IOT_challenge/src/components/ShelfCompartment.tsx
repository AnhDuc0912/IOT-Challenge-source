import React from "react";
import { Paper, Typography } from "@mui/material";
import { ShelfItem } from "../mock/shelfMockData";

interface ShelfCompartmentProps {
  level: number;
  compartment: number;
  shelfItem: ShelfItem | undefined;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, level: number, compartment: number) => void;
  handleRemoveFromShelf: (level: number, compartment: number) => void;
}

const ShelfCompartment: React.FC<ShelfCompartmentProps> = ({
  level,
  compartment,
  shelfItem,
  handleDragOver,
  handleDrop,
  handleRemoveFromShelf,
}) => {
  const isEmpty = !shelfItem?.product;
  return (
    <Paper
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, level, compartment)}
      onClick={() => !isEmpty && handleRemoveFromShelf(level, compartment)}
      sx={{
        height: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed",
        borderColor: isEmpty ? "grey.300" : "primary.main",
        backgroundColor: isEmpty ? "grey.50" : "background.paper",
        cursor: isEmpty ? "default" : "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: isEmpty ? "grey.400" : "primary.dark",
          backgroundColor: isEmpty ? "grey.100" : "grey.50",
        },
      }}
    >
      {isEmpty ? (
        <Typography variant="body2" color="text.secondary">
          Drop here
        </Typography>
      ) : (
        <>
          <img
            src={shelfItem.product!.image || "/placeholder.svg"}
            alt={shelfItem.product!.name}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              marginBottom: 4,
            }}
          />
          <Typography
            variant="caption"
            textAlign="center"
            noWrap
            sx={{ maxWidth: "100%" }}
          >
            {shelfItem.product!.name}
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default ShelfCompartment; 