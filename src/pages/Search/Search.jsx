import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Search as SearchIcon } from "lucide-react";
import { fetchCakes, searchCake } from "../../Redux/Slices/CakeSlice";
import { fetchBouquets, searchBouquet } from "../../Redux/Slices/BouquetSlice";
import CakeCard from "../../components/Cards/CakeCard";
import BouquetCard from "../../components/Cards/BouquetCard";

const TYPES = ["all", "cake", "bouquet"];

export default function Search() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();

  const qParam = params.get("q") ?? "";
  const typeParam = TYPES.includes(params.get("type"))
    ? params.get("type")
    : "all";

  const { cakesData, isLoading: cakesLoading, isSearching: cakesSearching, error: cakeError } =
    useSelector((s) => s.cake);
  const {
    bouquetsData,
    isLoading: bouquetsLoading,
    isSearching: bouquetsSearching,
    error: bouquetError,
  } = useSelector((s) => s.bouquet);

  const [query, setQuery] = useState(qParam);
  const [productType, setProductType] = useState(typeParam);

  const runSearch = useCallback(
    (trimmed, type) => {
      const name = trimmed || undefined;

      if (type === "cake" || type === "all") {
        if (name) dispatch(searchCake({ name }));
        else dispatch(fetchCakes());
      }
      if (type === "bouquet" || type === "all") {
        if (name) dispatch(searchBouquet({ name }));
        else dispatch(fetchBouquets());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    setQuery(qParam);
    setProductType(typeParam);
  }, [qParam, typeParam]);

  useEffect(() => {
    runSearch(qParam.trim(), typeParam);
  }, [qParam, typeParam, runSearch]);

  const handleSearch = () => {
    const trimmed = query.trim();
    const next = new URLSearchParams(params);
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    next.set("type", productType);
    setParams(next, { replace: true });
    runSearch(trimmed, productType);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const showCakes = productType === "all" || productType === "cake";
  const showBouquets = productType === "all" || productType === "bouquet";
  const isLoading =
    (showCakes && (cakesLoading || cakesSearching)) ||
    (showBouquets && (bouquetsLoading || bouquetsSearching));

  const cakes = showCakes ? cakesData || [] : [];
  const bouquets = showBouquets ? bouquetsData || [] : [];
  const total = cakes.length + bouquets.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-pink-950">
          Search our collection
        </h1>
        <p className="mt-2 text-stone-600 max-w-2xl">
          Find cakes and bouquets by name. Filter by product type below.
        </p>
      </div>

      <ToggleButtonGroup
        value={productType}
        exclusive
        onChange={(_, v) => v && setProductType(v)}
        size="small"
        sx={{ flexWrap: "wrap" }}
      >
        <ToggleButton value="all" sx={{ textTransform: "none" }}>
          All
        </ToggleButton>
        <ToggleButton value="cake" sx={{ textTransform: "none" }}>
          Cakes
        </ToggleButton>
        <ToggleButton value="bouquet" sx={{ textTransform: "none" }}>
          Bouquets
        </ToggleButton>
      </ToggleButtonGroup>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <TextField
          fullWidth
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="h-5 w-5 text-stone-400" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            backgroundColor: "#ec4899",
            "&:hover": { backgroundColor: "#db2777" },
            height: 55,
            minWidth: 120,
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Search
        </Button>
      </div>

      {isLoading && (
        <p className="text-center text-gray-500 py-10">Searching…</p>
      )}

      {(cakeError || bouquetError) && (
        <p className="text-red-500 text-center">
          {cakeError || bouquetError}
        </p>
      )}

      {!isLoading && total === 0 && (
        <p className="text-center text-stone-500 py-12">
          No results found. Try a different name or browse all products.
        </p>
      )}

      {showCakes && cakes.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-pink-950 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-pink-500" />
            Cakes ({cakes.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cakes.map((cake) => (
              <CakeCard key={cake._id || cake.id} cake={cake} />
            ))}
          </div>
        </section>
      )}

      {showBouquets && bouquets.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-emerald-950 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            Bouquets ({bouquets.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bouquets.map((bouquet) => (
              <BouquetCard key={bouquet._id || bouquet.id} bouquet={bouquet} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
