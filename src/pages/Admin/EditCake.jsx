import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCakeById, updateCake } from "../../Redux/Slices/CakeSlice";

export default function EditCake() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentCake, isLoadingOne } = useSelector((s) => s.cake);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    ingredients: "",
  });

  useEffect(() => {
    dispatch(fetchCakeById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentCake) {
      setForm({
        name: currentCake.name || "",
        description: currentCake.description || "",
        price: currentCake.price || "",
        image: currentCake.image || "",
        category: currentCake.category || "",
        ingredients: (currentCake.ingredients || []).join(", "),
      });
    }
  }, [currentCake]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    dispatch(
      updateCake({
        id,
        data: {
          ...form,
          ingredients: form.ingredients
            ? form.ingredients.split(",").map((i) => i.trim())
            : [],
        },
      })
    );

    navigate("/admin");
  };

  if (isLoadingOne) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Edit Cake</h1>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full"
        placeholder="Name"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full"
        placeholder="Description"
      />

      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        className="border p-2 w-full"
        placeholder="Price"
        type="number"
      />

      <input
        name="image"
        value={form.image}
        onChange={handleChange}
        className="border p-2 w-full"
        placeholder="Image URL"
      />

      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 w-full"
        placeholder="Category"
      />

      <input
        name="ingredients"
        value={form.ingredients}
        onChange={handleChange}
        className="border p-2 w-full"
        placeholder="Ingredients (comma separated)"
      />

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update Cake
      </button>
    </div>
  );
}