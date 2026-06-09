import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../../Redux/Slices/OrderSlice";
import OrderListCard from "../../components/orders/OrderListCard";
import OrderDetailModal from "../../components/orders/OrderDetailModal";

const STATUS_TABS = ["Pending", "Completed", "Cancelled"];

export default function AdminOrdersPanel() {
  const dispatch = useDispatch();
  const { ordersData, isLoading } = useSelector((s) => s.order);
  const [statusTab, setStatusTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const counts = useMemo(() => {
    const c = { Pending: 0, Completed: 0, Cancelled: 0 };
    ordersData?.forEach((o) => {
      if (c[o.status] !== undefined) c[o.status]++;
    });
    return c;
  }, [ordersData]);

  const activeStatus = STATUS_TABS[statusTab];
  const filtered = useMemo(
    () => ordersData?.filter((o) => o.status === activeStatus) ?? [],
    [ordersData, activeStatus]
  );

  const openOrder = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await dispatch(
        updateOrderStatus({ orderId, status: newStatus })
      ).unwrap();
      setSelectedOrder(updated);
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error(err || "Failed to update status");
    }
  };

  if (isLoading && !ordersData?.length) {
    return (
      <Box className="flex justify-center py-16">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Typography variant="h5" fontWeight={700}>
            Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click a card to view full details and update status.
          </Typography>
        </div>
        <Typography variant="body2" color="text.secondary">
          Total: {ordersData?.length ?? 0} orders
        </Typography>
      </Box>

      <Tabs
        value={statusTab}
        onChange={(_, v) => setStatusTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          px: 1,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {STATUS_TABS.map((status) => (
          <Tab
            key={status}
            label={
              <Badge badgeContent={counts[status]} color={status === "Pending" ? "warning" : status === "Completed" ? "success" : "default"} sx={{ pr: 2 }}>
                {status}
              </Badge>
            }
            sx={{ textTransform: "none", fontWeight: 600, minHeight: 48 }}
          />
        ))}
      </Tabs>

      {filtered.length === 0 ? (
        <Box
          sx={{
            py: 10,
            textAlign: "center",
            bgcolor: "white",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography color="text.secondary">No {activeStatus.toLowerCase()} orders.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((order) => (
            <Grid key={order._id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <OrderListCard order={order} onClick={openOrder} showUser />
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
        adminMode
        onStatusChange={handleStatusChange}
      />
    </Box>
  );
}
