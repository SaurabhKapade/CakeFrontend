import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { formatInr, orderImageUrl, orderUserLabel, shortOrderId } from "../../Helpers/formatUtils";

const statusColor = {
  Pending: "warning",
  Completed: "success",
  Cancelled: "default",
};

export default function OrderListCard({ order, onClick, showUser = false }) {
  const total = order.totalAmount ?? order.price * order.quantity;

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        height: "100%",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <CardActionArea onClick={() => onClick?.(order)} sx={{ height: "100%", alignItems: "stretch" }}>
        <Stack direction="row" sx={{ height: "100%" }}>
          <Box
            component="img"
            src={orderImageUrl(order)}
            alt={order.productName}
            sx={{
              width: { xs: 100, sm: 120 },
              minHeight: 120,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <CardContent sx={{ flex: 1, py: 1.5, pr: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Typography variant="subtitle2" fontWeight={700} color="#831843" noWrap sx={{ maxWidth: "70%" }}>
                {order.productName}
              </Typography>
              <Chip label={order.status} size="small" color={statusColor[order.status] || "default"} />
            </Stack>
            <Typography variant="caption" color="text.secondary" display="block">
              #{shortOrderId(order)} · {order.productType} · Qty {order.quantity}
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
              {formatInr(total)}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              {order.customerName} · {order.customerMobile}
            </Typography>
            {showUser && orderUserLabel(order) && (
              <Typography variant="caption" color="primary" display="block">
                User: {orderUserLabel(order)}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block">
              {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
