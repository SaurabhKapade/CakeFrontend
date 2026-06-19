import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { fetchCakes, fetchCakeById } from "../../Redux/Slices/CakeSlice";
import { cakeImageUrl, formatInr } from "../../Helpers/formatUtils";
import OrderModal from "../../components/OrderModal";

export default function ProductDetails() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCake, cakesData, isLoadingOne, oneError } = useSelector(
    (s) => s.cake
  );

  useEffect(() => {
    dispatch(fetchCakes());
  }, [dispatch]);

  useEffect(() => {
    if (id) dispatch(fetchCakeById(id));
  }, [id, dispatch]);

  const cake = currentCake;

  const related = useMemo(() => {
    if (!cake || !cakesData?.length) return [];
    const cat = (cake.category || "").trim().toLowerCase();
    return cakesData
      .filter((c) => (c._id || c.id) !== (cake._id || cake.id))
      .filter((c) =>
        cat ? (c.category || "").trim().toLowerCase() === cat : true
      )
      .slice(0, 3);
  }, [cake, cakesData]);

  if (isLoadingOne) {
    return <p className="text-center py-24 text-gray-500">Loading cake…</p>;
  }

  if (oneError || !cake) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-red-600">{oneError || "Cake not found"}</p>
        <Button component={Link} to="/search" sx={{ mt: 2 }} variant="contained">
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* BREADCRUMB */}
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/" className="text-sm text-pink-700 hover:underline">
          Home
        </Link>
        <Link to="/search" className="text-sm text-pink-700 hover:underline">
          Cakes
        </Link>
        <Typography className="text-sm text-gray-600">
          {cake.name}
        </Typography>
      </Breadcrumbs>

      {/* MAIN HERO */}
      <div className="grid lg:grid-cols-2 gap-10 items-start">

        {/* IMAGE */}
        <div className="rounded-2xl overflow-hidden shadow-lg border">
          <img
            src={cakeImageUrl(cake)}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* INFO */}
        <div className="space-y-5">

          {cake.category && (
            <span className="text-xs uppercase tracking-widest text-pink-600 font-semibold">
              {cake.category}
            </span>
          )}

          <h1 className="text-4xl font-bold text-gray-900">
            {cake.name}
          </h1>

          <p className="text-3xl font-bold text-pink-700">
            {formatInr(cake.price)}
          </p>

          {/* QUICK HIGHLIGHT BOX */}
          <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
            <p className="text-sm text-gray-600">
              Freshly baked premium cake
            </p>
            <p className="text-sm text-gray-600">
              Custom message available
            </p>
            <p className="text-sm text-gray-600">
              Eggless options available
            </p>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-700 leading-relaxed">
            {cake.description}
          </p>

          {/* INGREDIENTS */}
          {cake.ingredients?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-800 mb-2">
                Ingredients
              </h2>
              <div className="flex flex-wrap gap-2">
                {cake.ingredients.map((i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA SECTION */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="contained"
              onClick={() => setOrderModalOpen(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                borderRadius: 2,
              }}
            >
              Place order
            </Button>

            <Button
              component={Link}
              to="/search"
              variant="outlined"
              sx={{
                borderColor: "#831843",
                color: "#831843",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              More Cakes
            </Button>
          </div>

        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="border-t pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            You may also like
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {related.map((c) => (
              <Link
                key={c._id || c.id}
                to={`/product/${c._id || c.id}`}
                className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={cakeImageUrl(c)}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <p className="font-semibold text-gray-800">
                    {c.name}
                  </p>
                  <p className="text-pink-700 font-bold">
                    {formatInr(c.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <OrderModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        product={cake}
        productType="cake"
      />
    </div>
  );
}