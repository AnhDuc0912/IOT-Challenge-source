import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Skeleton,
  TextField,
  Stack,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as comboService from "../service/combo.service";
import type { Combo } from "../types/combo.type";

/**
 * Sample data adjusted to backend model (current_price, original_price)
 */
const sampleCombos: Partial<Combo>[] = [
];

export default function ComboPage() {
  const [combos, setCombos] = useState<Combo[] | null>(null);
  const [selected, setSelected] = useState<Combo | null>(null);
  const [loading, setLoading] = useState(false);

  // create dialog state
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    current_price: "",
    original_price: "",
    productSkus: "",
    imageFile: null as File | null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadCombos = async () => {
    setLoading(true);
    try {
      const res = await comboService.fetchCombos({ page: 1, limit: 50 });
      const data = res?.data ?? [];
      setCombos(data.length ? data : (sampleCombos as Combo[]));
    } catch (err) {
      console.warn("Không lấy được combos từ API, dùng mẫu", err);
      setCombos(sampleCombos as Combo[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCombos();
  }, []);

  const formatCurrency = (v?: number) =>
    (v ?? 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleOpenCreate = () => {
    setForm({ name: "", description: "", current_price: "", original_price: "", productSkus: "", imageFile: null });
    setOpenCreate(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setForm((s) => ({ ...s, imageFile: f ?? null }));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.current_price) {
      setSnackbar({ open: true, message: "Vui lòng nhập tên và giá hiện tại", severity: "error" });
      return;
    }
    setCreating(true);
    try {
      const products = form.productSkus
        ? form.productSkus.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean)
        : undefined;

      const payload: any = {
        name: form.name,
        description: form.description || undefined,
        current_price: Number(form.current_price),
        original_price: form.original_price ? Number(form.original_price) : undefined,
        products,
        imageFile: form.imageFile,
      };

      const created = await comboService.createCombo(payload);
      if (created) {
        setSnackbar({ open: true, message: "Tạo combo thành công", severity: "success" });
        // refresh list
        await loadCombos();
        setOpenCreate(false);
      } else {
        setSnackbar({ open: true, message: "Tạo combo thất bại", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Lỗi khi tạo combo", severity: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Combo sản phẩm</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Thêm combo
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography color="text.secondary">Danh sách các combo khuyến mãi. Nhấn vào "Xem" để xem chi tiết.</Typography>
      </Box>

      <Grid container spacing={3}>
        {loading && (!combos || combos.length === 0) ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Grid size={4} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={160} />
                <CardContent>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                  <Skeleton width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (combos || []).length === 0 ? (
          <Grid size={12}>
            <Typography>Không có combo nào.</Typography>
          </Grid>
        ) : (
          combos!.map((c) => {
            // support both backend naming and older fields
            const currentPrice = Number((c as any).current_price ?? (c as any).price ?? 0);
            const originalPrice = (c as any).original_price ?? (c as any).oldPrice;
            const discount =
              originalPrice && originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

            const productCount = (c as any).productSkus?.length ?? (c.products?.length ?? undefined);

            return (
              <Grid size={4} key={c._id ?? (c as any).externalId ?? c.name}>
                <Card>
                  {c.image ? <CardMedia component="img" height="160" image={c.image} alt={c.name} /> : <Box sx={{ height: 160, bgcolor: "grey.100" }} />}
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6">{c.name}</Typography>
                      {discount > 0 && <Chip label={`-${discount}%`} color="primary" size="small" />}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: 42 }}>
                      {c.description}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "baseline", mt: 2 }}>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(currentPrice)}
                      </Typography>
                      {originalPrice ? (
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                          {formatCurrency(originalPrice)}
                        </Typography>
                      ) : null}
                    </Box>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      {productCount !== undefined ? `${productCount} sản phẩm` : "Số lượng sản phẩm không xác định"}
                    </Typography>

                    {/* ensure we only call Date constructor with string/number/Date */}
                    {((c as any).validFrom || (c as any).validTo) &&
                      (() => {
                        const vf = (c as any).validFrom ? new Date(String((c as any).validFrom)) : null;
                        const vt = (c as any).validTo ? new Date(String((c as any).validTo)) : null;
                        return (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            {vf ? `Từ: ${vf.toLocaleDateString()}` : ""} {vt ? `Đến: ${vt.toLocaleDateString()}` : ""}
                          </Typography>
                        );
                      })()}
                  </CardContent>

                  <CardActions>
                    <Button size="small" onClick={() => setSelected(c)}>
                      Xem
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Create dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tạo combo mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Tên combo" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} fullWidth />
            <TextField label="Mô tả" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} multiline rows={3} fullWidth />
            <TextField label="Giá hiện tại" value={form.current_price} onChange={(e) => setForm((s) => ({ ...s, current_price: e.target.value }))} type="number" fullWidth />
            <TextField label="Giá gốc (nếu có)" value={form.original_price} onChange={(e) => setForm((s) => ({ ...s, original_price: e.target.value }))} type="number" fullWidth />
            <TextField label="Product SKUs (phân tách bởi dấu phẩy)" value={form.productSkus} onChange={(e) => setForm((s) => ({ ...s, productSkus: e.target.value }))} fullWidth />
            <Box>
              <input id="combo-image" type="file" accept="image/*" onChange={handleFileChange} />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)} disabled={creating}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating}>
            {creating ? "Đang tạo..." : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết Combo</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box>
              {selected.image && <Box component="img" src={selected.image} alt={selected.name} sx={{ width: "100%", borderRadius: 1, mb: 2 }} />}

              <Typography variant="h6">{selected.name}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {selected.description}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center" }}>
                <Typography variant="h6" color="primary">
                  {formatCurrency(Number((selected as any).current_price ?? (selected as any).price ?? 0))}
                </Typography>
                {(selected as any).original_price ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                    {formatCurrency(Number((selected as any).original_price))}
                  </Typography>
                ) : null}
                {(selected as any).original_price && (
                  <Chip
                    label={`-${Math.round(((Number((selected as any).original_price) - Number((selected as any).current_price ?? 0)) / Number((selected as any).original_price)) * 100)}%`}
                    color="primary"
                    size="small"
                  />
                )}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Sản phẩm:</Typography>

                {((selected as any).productSkus && (selected as any).productSkus.length > 0) ? (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                    {(selected as any).productSkus.map((sku: string) => (
                      <Chip key={sku} label={sku} />
                    ))}
                  </Box>
                ) : (selected.products && selected.products.length > 0) ? (
                  <Box sx={{ mt: 1 }}>
                    {selected.products.map((p: any, i: number) => (
                      <Typography key={i} variant="body2">
                        {p.name ?? p.sku ?? String(p)}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Không có thông tin sản phẩm chi tiết
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button onClick={() => setSelected(null)}>Đóng</Button>
        </Box>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}