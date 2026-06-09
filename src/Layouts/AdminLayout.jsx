import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Cake, LogOut, ArrowLeft } from "lucide-react";
import { logoutAdmin } from "../Redux/Slices/AuthSlice";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  return (
    <div className="min-h-svh flex flex-col bg-slate-100">
      <Box
        component="header"
        sx={{
          bgcolor: "#831843",
          color: "#fdf2f8",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        <Box
          className="max-w-7xl mx-auto w-full px-4 sm:px-6"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 56,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
            <Cake className="h-7 w-7 shrink-0" strokeWidth={1.75} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                Royal Cakes
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                Admin dashboard
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
            <Button
              component={Link}
              to="/"
              size="small"
              startIcon={<ArrowLeft className="h-4 w-4" />}
              sx={{
                color: "inherit",
                textTransform: "none",
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              Storefront
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleLogout}
              startIcon={<LogOut className="h-4 w-4" />}
              sx={{
                color: "#fdf2f8",
                borderColor: "rgba(255,255,255,0.5)",
                textTransform: "none",
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Box>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
