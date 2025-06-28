import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Box,
  IconButton,
} from "@mui/material";
import { Save as SaveIcon, Image as ImageIcon } from "@mui/icons-material";
import { Product } from "../types/selfTypes";

type ProductFormData = Omit<Product, "createdAt" | "updatedAt">;

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (productData: ProductFormData, file?: File) => void; // ✅ sửa ở đây
  product: Product | null;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    _id: "",
    product_id: "",
    product_name: "",
    img_url: "/placeholder.svg?height=200&width=200",
    price: 0,
    stock: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          _id: "",
          product_id: product.product_id,
          product_name: product.product_name,
          img_url: product.img_url,
          price: product.price,
          stock: product.stock || 0,
        });
      } else {
        setFormData({
          _id: "",

          product_id: "",
          product_name: "",
          img_url: "/placeholder.svg?height=200&width=200",
          price: 0,
          stock: 0,
        });
      }
    }
  }, [product, open]);

  useEffect(() => {
    // This effect handles the cleanup of blob URLs
    const currentImageUrl = formData.img_url;

    if (!open && currentImageUrl?.startsWith("blob:")) {
      // When the dialog closes, revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(currentImageUrl);
    }

    return () => {
      // Cleanup function that runs when the component unmounts or dependencies change
      if (currentImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentImageUrl);
      }
    };
  }, [open, formData.img_url]);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const tempUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, img_url: tempUrl }));
    }
  };

  const handleInternalSave = () => {
    onSave(formData, selectedFile || undefined); // ✅ sửa ở đây
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px dashed",
                  borderColor: "grey.300",
                  borderRadius: 1,
                  mb: 2,
                  overflow: "hidden",
                  bgcolor: "grey.50",
                }}
              >
                {formData.img_url ? (
                  <img
                    src={formData.img_url || "/placeholder.svg"}
                    alt="Product"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <ImageIcon sx={{ fontSize: 60, color: "grey.400" }} />
                )}
              </Box>
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                onClick={handleImageUpload}
              >
                Upload Image
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
          <Grid size={12}>
            <Grid container spacing={2}>
              <Grid size={4}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({ ...formData, product_name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleInternalSave}
          startIcon={<SaveIcon />}
        >
          {product ? "Update Product" : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
