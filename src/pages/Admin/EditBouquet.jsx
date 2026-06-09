import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBouquetById, updateBouquet } from "../../Redux/Slices/BouquetSlice";

export default function EditBouquet() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentBouquet, isLoadingOne } = useSelector((s) => s.bouquet);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    flowers: "",
  });

  useEffect(() => {
    dispatch(fetchBouquetById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentBouquet) {
      setForm({
        name: currentBouquet.name || "",
        description: currentBouquet.description || "",
        price: currentBouquet.price || "",
        image: currentBouquet.image || "",
        category: currentBouquet.category || "",
        flowers: (currentBouquet.flowers || []).join(", "),
      });
    }
  }, [currentBouquet]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    dispatch(
      updateBouquet({
        id,
        data: {
          ...form,
          price: Number(form.price),
          flowers: form.flowers
            ? form.flowers.split(",").map((f) => f.trim())
            : [],
        },
      })
    );
    navigate("/admin");
  };

  if (isLoadingOne) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Edit Bouquet</h1>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Name"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Description"
      />

      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Price"
        type="number"
      />

      <input
        name="image"
        value={form.image}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Image URL"
      />

      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Category"
      />

      <input
        name="flowers"
        value={form.flowers}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Flowers (comma separated)"
      />

      <button
        onClick={handleUpdate}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        Update Bouquet
      </button>
    </div>
  );
}
