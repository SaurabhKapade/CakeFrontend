import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { fetchBouquets, fetchBouquetById } from "../../Redux/Slices/BouquetSlice";
import { bouquetImageUrl, formatInr } from "../../Helpers/formatUtils";
import OrderModal from "../../Components/OrderModal";

export default function BouquetDetails() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBouquet, bouquetsData, isLoadingOne, oneError } = useSelector(
    (s) => s.bouquet
  );

  useEffect(() => {
    dispatch(fetchBouquets());
  }, [dispatch]);

  useEffect(() => {
    if (id) dispatch(fetchBouquetById(id));
  }, [id, dispatch]);

  const bouquet = currentBouquet;

  const related = useMemo(() => {
    if (!bouquet || !bouquetsData?.length) return [];
    const cat = (bouquet.category || "").trim().toLowerCase();
    return bouquetsData
      .filter((b) => (b._id || b.id) !== (bouquet._id || bouquet.id))
      .filter((b) =>
        cat ? (b.category || "").trim().toLowerCase() === cat : true
      )
      .slice(0, 3);
  }, [bouquet, bouquetsData]);

  if (isLoadingOne) {
    return <p className="text-center py-24 text-gray-500">Loading bouquet…</p>;
  }

  if (oneError || !bouquet) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-red-600">{oneError || "Bouquet not found"}</p>
        <Button component={Link} to="/search" sx={{ mt: 2 }} variant="contained">
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/" className="text-sm text-emerald-700 hover:underline">
          Home
        </Link>
        <Link to="/search?type=bouquet" className="text-sm text-emerald-700 hover:underline">
          Bouquets
        </Link>
        <Typography className="text-sm text-gray-600">{bouquet.name}</Typography>
      </Breadcrumbs>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-emerald-100">
          <img
            src={bouquetImageUrl(bouquet)}
            alt={bouquet.name}
            className="w-full aspect-square object-cover"
          />
        </div>

        <div className="space-y-5">
          {bouquet.category && (
            <span className="text-xs uppercase tracking-widest text-emerald-600 font-semibold">
              {bouquet.category}
            </span>
          )}

          <h1 className="text-4xl font-bold text-gray-900">{bouquet.name}</h1>

          <p className="text-3xl font-bold text-emerald-700">
            {formatInr(bouquet.price)}
          </p>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2">
            <p className="text-sm text-gray-600">Fresh flowers, hand-arranged</p>
            <p className="text-sm text-gray-600">Same-day delivery available</p>
            <p className="text-sm text-gray-600">Custom message card on request</p>
          </div>

          <p className="text-gray-700 leading-relaxed">{bouquet.description}</p>

          {bouquet.flowers?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Flowers</h2>
              <div className="flex flex-wrap gap-2">
                {bouquet.flowers.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="contained"
              onClick={() => setOrderModalOpen(true)}
              sx={{
                bgcolor: "#15803d",
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
              to="/search?type=bouquet"
              variant="outlined"
              sx={{
                borderColor: "#166534",
                color: "#166534",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              More Bouquets
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">You may also like</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {related.map((b) => (
              <Link
                key={b._id || b.id}
                to={`/bouquet/${b._id || b.id}`}
                className="bg-white border border-emerald-100 rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={bouquetImageUrl(b)}
                  alt={b.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <p className="font-semibold text-gray-800">{b.name}</p>
                  <p className="text-emerald-700 font-bold">{formatInr(b.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <OrderModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        product={bouquet}
        productType="bouquet"
      />
    </div>
  );
}
