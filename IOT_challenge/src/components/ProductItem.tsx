// src/components/ProductItem.tsx
import React from "react";
import { Card, CardContent, CardMedia, CardActions, Button, Chip, Divider, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product } from "../mock/productMockData";

interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductItem({ product, onEdit, onDelete }: ProductItemProps) {
  return (
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
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: "contain", bgcolor: "grey.100", p: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom noWrap sx={{ maxWidth: "70%" }}>
            {product.name}
          </Typography>
          <Chip label={`$${product.price.toFixed(2)}`} color="primary" size="small" sx={{ fontWeight: "bold" }} />
        </Box>
        <Chip label={product.category} size="small" sx={{ mb: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: 40, overflow: "hidden" }}>
          {product.description}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            SKU: {product.sku}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Stock: {product.stock}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(product)} sx={{ flexGrow: 1 }}>
          Edit
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(product)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}