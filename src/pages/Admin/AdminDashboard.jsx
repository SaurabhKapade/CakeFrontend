import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCake, deleteCake, fetchCakes } from "../../Redux/Slices/CakeSlice";
import { addBouquet, deleteBouquet, fetchBouquets } from "../../Redux/Slices/BouquetSlice";
import { fetchOrders, updateOrderStatus } from "../../Redux/Slices/OrderSlice";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import toast from "react-hot-toast";
import { bouquetImageUrl, cakeImageUrl } from "../../Helpers/formatUtils";
import AdminOrdersPanel from "./AdminOrdersPanel";

const emptyCakeForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  ingredients: "",
};

const emptyBouquetForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  flowers: "",
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { cakesData, isLoading: cakesLoading } = useSelector((s) => s.cake);
  const { bouquetsData, isLoading: bouquetsLoading } = useSelector((s) => s.bouquet);
  const { ordersData, isLoading: ordersLoading } = useSelector((s) => s.order);

  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [cakeForm, setCakeForm] = useState(emptyCakeForm);
  const [bouquetForm, setBouquetForm] = useState(emptyBouquetForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const isCakeTab = tab === 0;

  useEffect(() => {
    dispatch(fetchCakes());
    dispatch(fetchBouquets());
    dispatch(fetchOrders());
  }, [dispatch]);

  const validateCake = () => {
    if (!cakeForm.name.trim()) return "Name required";
    if (!cakeForm.description.trim()) return "Description required";
    if (!cakeForm.price || isNaN(cakeForm.price)) return "Valid price required";
    if (!cakeForm.category.trim()) return "Category required";
    if (!cakeForm.ingredients.trim()) return "Ingredients required";
    if (!imageFile) return "Image required";
    return null;
  };

  const validateBouquet = () => {
    if (!bouquetForm.name.trim()) return "Name required";
    if (!bouquetForm.description.trim()) return "Description required";
    if (!bouquetForm.price || isNaN(bouquetForm.price)) return "Valid price required";
    if (!bouquetForm.category.trim()) return "Category required";
    if (!bouquetForm.flowers.trim()) return "Flowers required";
    if (!imageFile) return "Image required";
    return null;
  };

  const handleAdd = () => {
    const error = isCakeTab ? validateCake() : validateBouquet();
    if (error) {
      toast.error(error);
      return;
    }

    const formData = new FormData();

    if (isCakeTab) {
      formData.append("name", cakeForm.name.trim());
      formData.append("description", cakeForm.description.trim());
      formData.append("price", cakeForm.price);
      formData.append("category", cakeForm.category.trim());
      formData.append(
        "ingredients",
        JSON.stringify(
          cakeForm.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
        )
      );
    } else {
      formData.append("name", bouquetForm.name.trim());
      formData.append("description", bouquetForm.description.trim());
      formData.append("price", bouquetForm.price);
      formData.append("category", bouquetForm.category.trim());
      formData.append(
        "flowers",
        JSON.stringify(
          bouquetForm.flowers.split(",").map((f) => f.trim()).filter(Boolean)
        )
      );
    }

    formData.append("image", imageFile);

    const action = isCakeTab ? addCake(formData) : addBouquet(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        setOpen(false);
        setCakeForm(emptyCakeForm);
        setBouquetForm(emptyBouquetForm);
        setImageFile(null);
        setPreview("");
      })
      .catch((err) => {
        toast.error(err || "Failed to add product");
      });
  };

  const isLoading = tab === 0 ? cakesLoading : tab === 1 ? bouquetsLoading : ordersLoading;
  const items = tab === 0 ? cakesData : tab === 1 ? bouquetsData : [];

  const orderCounts = {
    pending: ordersData?.filter((o) => o.status === "Pending").length ?? 0,
    completed: ordersData?.filter((o) => o.status === "Completed").length ?? 0,
    cancelled: ordersData?.filter((o) => o.status === "Cancelled").length ?? 0,
  };

  return (
    <div className="space-y-6">
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1f2937">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage products and customer orders
          </Typography>
        </Box>
        {tab !== 2 && (
          <Button variant="contained" onClick={() => setOpen(true)} sx={{ textTransform: "none" }}>
            Add {isCakeTab ? "Cake" : "Bouquet"}
          </Button>
        )}
      </Box>

      <Box className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Paper sx={{ p: 2, borderRadius: 2 }} elevation={0} variant="outlined">
          <Typography variant="caption" color="text.secondary">Cakes</Typography>
          <Typography variant="h5" fontWeight={700}>{cakesData?.length ?? 0}</Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2 }} elevation={0} variant="outlined">
          <Typography variant="caption" color="text.secondary">Bouquets</Typography>
          <Typography variant="h5" fontWeight={700}>{bouquetsData?.length ?? 0}</Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2 }} elevation={0} variant="outlined">
          <Typography variant="caption" color="warning.main">Pending orders</Typography>
          <Typography variant="h5" fontWeight={700}>{orderCounts.pending}</Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2 }} elevation={0} variant="outlined">
          <Typography variant="caption" color="text.secondary">Total orders</Typography>
          <Typography variant="h5" fontWeight={700}>{ordersData?.length ?? 0}</Typography>
        </Paper>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ bgcolor: "white", borderRadius: 2, px: 1, border: "1px solid", borderColor: "divider" }}
      >
        <Tab label={`Cakes (${cakesData?.length ?? 0})`} sx={{ textTransform: "none", fontWeight: 600 }} />
        <Tab label={`Bouquets (${bouquetsData?.length ?? 0})`} sx={{ textTransform: "none", fontWeight: 600 }} />
        <Tab
          label={`Orders (${ordersData?.length ?? 0})`}
          sx={{ textTransform: "none", fontWeight: 600 }}
        />
      </Tabs>

      {isLoading ? (
        <p>Loading...</p>
      ) : tab === 2 ? (
        <AdminOrdersPanel />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {items?.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <img
                src={
                  isCakeTab ? cakeImageUrl(item) : bouquetImageUrl(item)
                }
                alt={item.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p
                  className={`font-bold ${
                    isCakeTab ? "text-pink-600" : "text-emerald-600"
                  }`}
                >
                  ₹{item.price}
                </p>
                <div className="flex justify-between pt-2">
                  <Link
                    to={
                      isCakeTab
                        ? `/admin/edit/${item._id}`
                        : `/admin/bouquet/edit/${item._id}`
                    }
                    className="text-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() =>
                      dispatch(
                        isCakeTab
                          ? deleteCake(item._id)
                          : deleteBouquet(item._id)
                      )
                    }
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New {isCakeTab ? "Cake" : "Bouquet"}</DialogTitle>
        <DialogContent className="space-y-3">
          {isCakeTab ? (
            <>
              <input
                placeholder="Name"
                className="w-full border p-2 rounded mt-2"
                value={cakeForm.name}
                onChange={(e) =>
                  setCakeForm({ ...cakeForm, name: e.target.value })
                }
              />
              <input
                placeholder="Price"
                className="w-full border p-2 rounded"
                value={cakeForm.price}
                onChange={(e) =>
                  setCakeForm({ ...cakeForm, price: e.target.value })
                }
              />
              <input
                placeholder="Category"
                className="w-full border p-2 rounded"
                value={cakeForm.category}
                onChange={(e) =>
                  setCakeForm({ ...cakeForm, category: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={cakeForm.description}
                onChange={(e) =>
                  setCakeForm({ ...cakeForm, description: e.target.value })
                }
              />
              <input
                placeholder="Ingredients (comma separated)"
                className="w-full border p-2 rounded"
                value={cakeForm.ingredients}
                onChange={(e) =>
                  setCakeForm({ ...cakeForm, ingredients: e.target.value })
                }
              />
            </>
          ) : (
            <>
              <input
                placeholder="Name"
                className="w-full border p-2 rounded mt-2"
                value={bouquetForm.name}
                onChange={(e) =>
                  setBouquetForm({ ...bouquetForm, name: e.target.value })
                }
              />
              <input
                placeholder="Price"
                className="w-full border p-2 rounded"
                value={bouquetForm.price}
                onChange={(e) =>
                  setBouquetForm({ ...bouquetForm, price: e.target.value })
                }
              />
              <input
                placeholder="Category"
                className="w-full border p-2 rounded"
                value={bouquetForm.category}
                onChange={(e) =>
                  setBouquetForm({ ...bouquetForm, category: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={bouquetForm.description}
                onChange={(e) =>
                  setBouquetForm({
                    ...bouquetForm,
                    description: e.target.value,
                  })
                }
              />
              <input
                placeholder="Flowers (comma separated)"
                className="w-full border p-2 rounded"
                value={bouquetForm.flowers}
                onChange={(e) =>
                  setBouquetForm({ ...bouquetForm, flowers: e.target.value })
                }
              />
            </>
          )}

          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageFile(file || null);
              setPreview(file ? URL.createObjectURL(file) : "");
            }}
          />

          {preview && (
            <img src={preview} alt="" className="h-32 w-full object-cover rounded" />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
