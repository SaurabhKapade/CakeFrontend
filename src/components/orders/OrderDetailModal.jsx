import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { X } from "lucide-react";
import {
  formatInr,
  orderImageUrl,
  orderUserEmail,
  orderUserLabel,
  shortOrderId,
} from "../../Helpers/formatUtils";

const statusColor = {
  Pending: "warning",
  Completed: "success",
  Cancelled: "default",
};

function DetailRow({ label, value, children }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
        {label}
      </Typography>
      {children || (
        <Typography variant="body2" sx={{ mt: 0.25, wordBreak: "break-word" }}>
          {value ?? "—"}
        </Typography>
      )}
    </Box>
  );
}

export default function OrderDetailModal({
  open,
  onClose,
  order,
  adminMode = false,
  onStatusChange,
  onCancel,
}) {
  if (!order) return null;

  const img = orderImageUrl(order);
  const unitPrice = order.price;
  const total = order.totalAmount ?? (unitPrice && order.quantity ? unitPrice * order.quantity : null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      slotProps={{ paper: { sx: { borderRadius: 3, mx: { xs: 1, sm: 2 } } } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", pr: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Order #{shortOrderId(order)}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Chip label={order.status} size="small" color={statusColor[order.status] || "default"} />
            <Typography variant="caption" color="text.secondary">
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
          </Stack>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <X className="h-5 w-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <Box
              component="img"
              src={img}
              alt={order.productName}
              sx={{
                width: "100%",
                maxHeight: 280,
                objectFit: "cover",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 7 }}>
            <Typography variant="h6" fontWeight={700} color="#831843">
              {order.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize", mb: 2 }}>
              {order.productType}
            </Typography>
            <Stack spacing={1.5}>
              <DetailRow label="Quantity" value={order.quantity} />
              <DetailRow label="Unit price" value={formatInr(unitPrice)} />
              <DetailRow label="Total amount" value={formatInr(total)} />
              <DetailRow label="Product ID" value={String(order.productId || "—")} />
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Customer details
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow label="Name on order" value={order.customerName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow label="Mobile" value={order.customerMobile} />
          </Grid>
          {adminMode && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailRow label="Account username" value={orderUserLabel(order)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailRow label="Account email" value={orderUserEmail(order) || "—"} />
              </Grid>
            </>
          )}
        </Grid>

        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Order description
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
            {order.notes?.trim() || "—"}
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
          <DetailRow
            label="Last updated"
            value={order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "—"}
          />
        </Stack>

        {adminMode && (
          <FormControl fullWidth size="small" sx={{ mt: 3 }}>
            <InputLabel>Update status</InputLabel>
            <Select
              label="Update status"
              value={order.status}
              onChange={(e) => onStatusChange?.(order._id, e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, flexWrap: "wrap", gap: 1 }}>
        {!adminMode && order.status === "Pending" && onCancel && (
          <Button color="error" variant="outlined" onClick={() => onCancel(order._id)} sx={{ textTransform: "none" }}>
            Cancel order
          </Button>
        )}
        <Button onClick={onClose} variant="contained" sx={{ textTransform: "none", ml: "auto" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
