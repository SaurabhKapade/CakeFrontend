import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./Layouts/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import Home from "./pages/Home";
import Search from "./pages/Search/Search";
import ProductDetails from "./pages/Products/ProductDetails";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import EditCake from "./pages/Admin/EditCake";
import BouquetDetails from "./pages/Products/BouquetDetails";
import EditBouquet from "./pages/Admin/EditBouquet";
import AdminLogin from "./pages/Admin/AdminLogin";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MyOrders from "./pages/Orders/MyOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
const theme = createTheme({
  palette: {
    primary: { main: "#831843" },
    secondary: { main: "#9f1239" },
  },
  shape: { borderRadius: 12 },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/bouquet/:id" element={<BouquetDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<UserProtectedRoute />}>
            <Route path="/orders" element={<MyOrders />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/edit/:id" element={<EditCake />} />
            <Route path="/admin/bouquet/edit/:id" element={<EditBouquet />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
