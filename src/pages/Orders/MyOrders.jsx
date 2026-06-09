import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import { Package, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { cancelOrder, fetchMyOrders } from "../../Redux/Slices/OrderSlice";
import OrderListCard from "../../components/orders/OrderListCard";
import OrderDetailModal from "../../components/orders/OrderDetailModal";

const STATUS_TABS = ["All", "Pending", "Completed", "Cancelled"];

export default function MyOrders() {
  const dispatch = useDispatch();
  const { myOrders, isLoading, error } = useSelector((s) => s.order);
  const [statusTab, setStatusTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const counts = useMemo(() => {
    const c = { All: myOrders?.length ?? 0, Pending: 0, Completed: 0, Cancelled: 0 };
    myOrders?.forEach((o) => {
      if (c[o.status] !== undefined) c[o.status]++;
    });
    return c;
  }, [myOrders]);

  const activeFilter = STATUS_TABS[statusTab];
  const filtered = useMemo(() => {
    if (!myOrders) return [];
    if (activeFilter === "All") return myOrders;
    return myOrders.filter((o) => o.status === activeFilter);
  }, [myOrders, activeFilter]);

  const openOrder = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCancel = async (orderId) => {
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      toast.success("Order cancelled");
      setModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      toast.error(err || "Could not cancel order");
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <Stack direction="row" spacing={1} alignItems="center" className="text-pink-900 mb-1">
            <Package className="h-6 w-6" />
            <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700 }}>
              Your orders
            </Typography>
          </Stack>
          <Typography variant="h4" fontWeight={800} color="#1f2937">
            Track & manage orders
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tap any order to see photos and full details. Pending orders can be cancelled.
          </Typography>
        </div>
        <Button
          component={Link}
          to="/search"
          variant="outlined"
          startIcon={<ShoppingBag className="h-4 w-4" />}
          sx={{ textTransform: "none", alignSelf: { xs: "stretch", sm: "center" } }}
        >
          Browse products
        </Button>
      </div>

      {isLoading ? (
        <Box className="flex justify-center py-20">
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Typography color="error" className="text-center py-12">
          {error}
        </Typography>
      ) : !myOrders?.length ? (
        <Card sx={{ borderRadius: 3, textAlign: "center", py: 6, px: 2 }}>
          <Typography color="text.secondary" gutterBottom>
            No orders yet.
          </Typography>
          <Button component={Link} to="/search" variant="contained" sx={{ mt: 2, textTransform: "none" }}>
            Start shopping
          </Button>
        </Card>
      ) : (
        <>
          <Tabs
            value={statusTab}
            onChange={(_, v) => setStatusTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            {STATUS_TABS.map((status) => (
              <Tab
                key={status}
                label={
                  <Badge
                    badgeContent={counts[status]}
                    color={status === "Pending" ? "warning" : status === "Completed" ? "success" : "default"}
                    sx={{ pr: status === "All" ? 0 : 2 }}
                  >
                    {status}
                  </Badge>
                }
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
            ))}
          </Tabs>

          {filtered.length === 0 ? (
            <Typography color="text.secondary" className="text-center py-12">
              No {activeFilter === "All" ? "" : activeFilter.toLowerCase()} orders.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filtered.map((order) => (
                <Grid key={order._id} size={{ xs: 12, md: 6 }}>
                  <OrderListCard order={order} onClick={openOrder} />
                </Grid>
              ))}
            </Grid>
          )}

          <OrderDetailModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
            onCancel={handleCancel}
          />
        </>
      )}
    </div>
  );
}
