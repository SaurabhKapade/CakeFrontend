import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { X, ShoppingBag } from "lucide-react";
import { bouquetImageUrl, cakeImageUrl, formatInr } from "../Helpers/formatUtils.js";
import toast from "react-hot-toast";
import { createOrder } from "../Redux/Slices/OrderSlice";

const MOBILE_RE = /^[6-9]\d{9}$/;

function normalizeMobile(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

export default function OrderModal({ open, onClose, product, productType = "cake" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((s) => s.userAuth);

  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState(user?.username || "");
  const [customerMobile, setCustomerMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUrl =
    productType === "bouquet" ? bouquetImageUrl(product) : cakeImageUrl(product);

  const lineTotal = product ? (product.price || 0) * quantity : 0;

  const handlePlaceOrder = async () => {
    if (!product) return;
    if (!isLoggedIn) {
      toast.error("Please log in to place an order");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    const mobile = normalizeMobile(customerMobile);
    if (!MOBILE_RE.test(mobile)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter an order description");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        createOrder({
          customerName: customerName.trim(),
          customerMobile: mobile,
          productId: product._id || product.id,
          productType,
          productName: product.name,
          quantity,
          notes: description.trim(),
        })
      ).unwrap();
      toast.success("Order placed! Track it under My Orders.");
      onClose();
      setDescription("");
      setCustomerMobile("");
      setQuantity(1);
      navigate("/orders");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      slotProps={{ paper: { sx: { borderRadius: 3, mx: { xs: 1, sm: 2 } } } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          pr: 1,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              bgcolor: "#fce7f3",
              color: "#831843",
              borderRadius: 2,
              p: 1,
              display: "flex",
            }}
          >
            <ShoppingBag className="h-6 w-6" strokeWidth={2} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Place your order
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              We&apos;ll save your order — track or cancel it anytime from My Orders.
            </Typography>
          </Box>
        </Stack>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <X className="h-5 w-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        <Stack spacing={2.5}>
          {!isLoggedIn && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Link to="/login" className="font-semibold text-pink-800 underline">
                Log in
              </Link>{" "}
              or{" "}
              <Link to="/register" className="font-semibold text-pink-800 underline">
                register
              </Link>{" "}
              to place an order.
            </Alert>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <Box
              component="img"
              src={imageUrl}
              alt=""
              sx={{
                width: { xs: "100%", sm: 88 },
                maxWidth: { xs: 200, sm: 88 },
                height: 88,
                borderRadius: 2,
                objectFit: "cover",
                border: "1px solid",
                borderColor: "divider",
              }}
            />
            <Box flex={1} minWidth={0}>
              <Typography fontWeight={700} color="#831843">
                {product.name}
              </Typography>
              <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                {formatInr(product.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Total: <strong>{formatInr(lineTotal)}</strong> ({quantity} × {formatInr(product.price)})
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Your name"
              size="small"
              fullWidth
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <TextField
              label="Mobile number"
              size="small"
              fullWidth
              required
              placeholder="10-digit number"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              helperText="Used for delivery updates"
            />
          </Stack>

          <TextField
            label="Quantity"
            type="number"
            size="small"
            fullWidth
            inputProps={{ min: 1, max: 99 }}
            value={quantity}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              setQuantity(Number.isNaN(n) || n < 1 ? 1 : Math.min(n, 99));
            }}
          />

          <TextField
            label="Order description"
            placeholder="Delivery date, address, eggless, message on cake, special requests…"
            multiline
            minRows={3}
            fullWidth
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, gap: 1, flexWrap: "wrap" }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: "none" }} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePlaceOrder}
          disabled={isSubmitting || !isLoggedIn}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Place order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
