import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import { LoadCell, Product } from "../types/selfTypes";
import ShelfItemMenu from "./ShelfItemMenu";
import ProductDialog from "./ProductDialog";
import {
  updateLoadCellThreshold,
  updateLoadCellQuantity,
} from "../service/loadcell.service";
import { WarningAmber } from "@mui/icons-material";

interface ShelfCompartmentProps {
  level: number;
  compartment: number;
  quantity: number;
  shelfItem: (LoadCell & { product: Product | null }) | null;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, level: number, compartment: number) => void;
  handleRemoveFromShelf: (level: number, compartment: number) => void;
  onViewProductInfo: (product: Product) => void; // Thêm prop mới
}

const ShelfCompartment: React.FC<ShelfCompartmentProps> = ({
  level,
  quantity,
  compartment,
  shelfItem,
  handleDragOver,
  handleDrop,
  handleRemoveFromShelf,
  onViewProductInfo, // Thêm prop mới
}) => {
  const isEmpty = !shelfItem?.product;
  const isLoadCellError =
    !!shelfItem && !!shelfItem.error && shelfItem?.error !== 0;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [productDialogOpen, setProductDialogOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [localProduct, setLocalProduct] = React.useState<Product | null>(
    shelfItem?.product ?? null
  );

  const [localThreshold, setLocalThreshold] = React.useState<
    number | undefined
  >(shelfItem && (shelfItem as any).threshold);
  const [localQuantity, setLocalQuantity] = React.useState<number | undefined>(
    shelfItem?.quantity
  );

  React.useEffect(() => {
    console.log(shelfItem);
    
    setLocalProduct(shelfItem?.product ?? null);
    setLocalThreshold(shelfItem?.threshold);
    setLocalQuantity(shelfItem?.quantity);
  }, [shelfItem?.product, shelfItem]);

  // Đồng bộ localQuantity với prop quantity (realtime từ cha)
  React.useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  const handleOpenMenu = (event: React.MouseEvent) => {
    if (!isEmpty) setAnchorEl(event.currentTarget as HTMLElement);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  // Các hàm xử lý cho menu
  const handleRemove = () => handleRemoveFromShelf(level, compartment);
  const handleViewInfo = () => {
    if (shelfItem?.product) {
      onViewProductInfo(shelfItem.product);
    }
  };
  const handleEditPrice = (newPrice: string) => {
    if (localProduct) {
      setLocalProduct({ ...localProduct, price: Number(newPrice) });
    }
  };
  const handleChangeThreshold = async (newThreshold: string) => {
    if (shelfItem) {
      try {
        const updated = await updateLoadCellThreshold(
          shelfItem._id,
          Number(newThreshold)
        );

        setLocalThreshold((updated as any).threshold);
      } catch (err) {
        alert("Cập nhật ngưỡng thất bại!");
      }
    }
  };

  const handleChangeQuantity = async (newQuantity: string) => {
    if (shelfItem) {
      try {
        const updated = await updateLoadCellQuantity(
          shelfItem._id,
          Number(newQuantity)
        );
        setLocalQuantity(Number(newQuantity));
      } catch (err) {
        alert("Cập nhật số lượng thất bại!");
      }
    }
  };

  const handleCloseProductDialog = () => {
    setProductDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = (productData: any, file?: File) => {
    // Xử lý lưu sản phẩm nếu cần
    console.log("Saving product:", productData, file);
    handleCloseProductDialog();
  };

  return (
    <Paper
      onDragOver={isLoadCellError ? undefined : handleDragOver}
      onDrop={
        isLoadCellError ? undefined : (e) => handleDrop(e, level, compartment)
      }
      sx={{
        height: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "4px dashed",
        borderColor: isEmpty
          ? "grey.300"
          : isLoadCellError
          ? "warning.main"
          : localQuantity === 0
          ? "error.main"
          : localQuantity && localThreshold && localQuantity < localThreshold
          ? "warning.main"
          : "primary.main",
        backgroundColor: isEmpty ? "grey.50" : "background.paper",
        cursor: isEmpty
          ? "default"
          : isLoadCellError
          ? "not-allowed"
          : "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: isEmpty
            ? "grey.400"
            : isLoadCellError
            ? "warning.dark"
            : localQuantity === 0
            ? "error.dark"
            : localQuantity && localThreshold && localQuantity < localThreshold
            ? "warning.dark"
            : "primary.dark",
          backgroundColor: isEmpty ? "grey.100" : "grey.50",
        },
        opacity: isLoadCellError ? 0.7 : 1,
      }}
    >
      {!localProduct ? (
        <Typography variant="body2" color="text.secondary">
          Drop here
        </Typography>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            cursor: isLoadCellError ? "not-allowed" : "pointer",
            backgroundImage: `url(${
              localProduct.img_url || "/placeholder.svg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 8,
            overflow: "hidden",
          }}
          onClick={isLoadCellError ? undefined : handleOpenMenu}
        >
          {/* Overlay cảnh báo loadcell lỗi */}
          {isLoadCellError && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(255, 215, 0, 0.5)", // vàng nhạt
                zIndex: 10,
                display: "flex",
                
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography fontWeight="700" fontSize="30px" color="#000">
                {shelfItem.error}
              </Typography>
            </div>
          )}
          {/* Hiển thị threshold ở góc trái */}
          {localThreshold !== undefined && (
            <div
              style={{
                position: "absolute",
                top: 4,
                left: 4,
                background: "rgba(255,255,255,0.7)",
                borderRadius: 4,
                padding: "2px 6px",
                zIndex: 3,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
              >
                Threshold: {localThreshold}
              </Typography>
            </div>
          )}
          <div
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              padding: 4,
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              noWrap
              sx={{ width: "100%", fontWeight: "bold" }}
            >
              {localProduct.product_name}
            </Typography>
            <Typography
              variant="caption"
              color="inherit"
              sx={{ display: "block" }}
            >
              Giá:{" "}
              {localProduct.price
                ? localProduct.price.toLocaleString() + "₫"
                : "N/A"}
            </Typography>
            <Typography
              variant="caption"
              color="inherit"
              sx={{ display: "block" }}
            >
              Quantity: {localQuantity !== undefined ? localQuantity : "N/A"}
            </Typography>
          </div>
        </div>
      )}
      <ShelfItemMenu
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        onRemove={handleRemove}
        onViewInfo={handleViewInfo}
        onEditPrice={handleEditPrice}
        onChangeThreshold={handleChangeThreshold}
        onChangeQuantity={handleChangeQuantity}
        currentThreshold={localThreshold}
        currentQuantity={localQuantity}
      />
      <ProductDialog
        open={productDialogOpen}
        onClose={handleCloseProductDialog}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </Paper>
  );
};

export default ShelfCompartment;
