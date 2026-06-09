import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { Cake, Flower2, Home, Search, LogOut, Menu, Package, LogIn } from "lucide-react";
import { logoutUser } from "../Redux/Slices/UserAuthSlice";

const navBtnSx = {
  color: "inherit",
  textTransform: "none",
  fontWeight: 500,
  minWidth: "auto",
  px: { sm: 1.5 },
};

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.userAuth);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isAdminRoute) return null;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
    setDrawerOpen(false);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const links = [
    { to: "/", label: "Home", icon: Home, active: pathname === "/" },
    {
      to: "/search?type=bouquet",
      label: "Bouquets",
      icon: Flower2,
      active: pathname.startsWith("/bouquet") || pathname.includes("type=bouquet"),
    },
    { to: "/search", label: "Cakes", icon: Search, active: pathname === "/search" && !pathname.includes("bouquet") },
  ];

  const NavLink = ({ to, label, icon: Icon, active }) => (
    <Button
      component={Link}
      to={to}
      startIcon={<Icon className="h-4 w-4" />}
      sx={navBtnSx}
      size="small"
      variant={active ? "contained" : "text"}
      className={active ? "!bg-pink-900 !text-white shadow-none" : undefined}
      onClick={closeDrawer}
    >
      {label}
    </Button>
  );

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Cake className="h-6 w-6 text-pink-900" />
        <Typography fontWeight={700} color="#831843">
          Royal Cakes
        </Typography>
      </Box>
      <Divider />
      <List>
        {links.map((l) => (
          <ListItemButton key={l.to} component={Link} to={l.to} onClick={closeDrawer} selected={l.active}>
            <l.icon className="h-5 w-5 mr-3" />
            <ListItemText primary={l.label} />
          </ListItemButton>
        ))}
        {isLoggedIn && (
          <ListItemButton component={Link} to="/orders" onClick={closeDrawer} selected={pathname === "/orders"}>
            <Package className="h-5 w-5 mr-3" />
            <ListItemText primary="My Orders" />
          </ListItemButton>
        )}
      </List>
      <Divider />
      <List sx={{ px: 1, pb: 2 }}>
        {isLoggedIn ? (
          <>
            <Typography variant="caption" sx={{ px: 2, py: 1, display: "block", color: "text.secondary" }}>
              {user?.username || user?.email}
            </Typography>
            <ListItemButton onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-3" />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton component={Link} to="/login" onClick={closeDrawer}>
              <LogIn className="h-5 w-5 mr-3" />
              <ListItemText primary="Login" />
            </ListItemButton>
            <ListItemButton component={Link} to="/register" onClick={closeDrawer}>
              <ListItemText primary="Register" sx={{ pl: 5.5 }} />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.95)",
          color: "#831843",
          borderBottom: "1px solid",
          borderColor: "rgba(131, 24, 67, 0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar
          disableGutters
          className="max-w-6xl mx-auto w-full px-3 sm:px-6"
          sx={{ minHeight: { xs: 56, sm: 64 }, gap: 1 }}
        >
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { sm: "none" } }}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </IconButton>

          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mr: { sm: 2 },
              flexGrow: { xs: 1, sm: 0 },
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
            }}
          >
            <Cake className="h-6 w-6 shrink-0" strokeWidth={2} />
            Royal Cakes
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 0.25, flex: 1 }}>
            {links.map((l) => (
              <NavLink key={l.to} {...l} />
            ))}
            {isLoggedIn && (
              <NavLink to="/orders" label="My Orders" icon={Package} active={pathname === "/orders"} />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
            {isLoggedIn ? (
              <>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#831843",
                    fontSize: "0.85rem",
                    display: { xs: "none", md: "flex" },
                  }}
                >
                  {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
                </Avatar>
                <Button
                  onClick={handleLogout}
                  startIcon={<LogOut className="h-4 w-4" />}
                  sx={navBtnSx}
                  size="small"
                  color="inherit"
                >
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Logout
                  </Box>
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" sx={navBtnSx} size="small">
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="small"
                  disableElevation
                  sx={{ textTransform: "none", fontWeight: 600, display: { xs: "none", sm: "inline-flex" } }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>
    </>
  );
}
