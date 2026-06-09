export function formatInr(price) {
  if (price == null || Number.isNaN(Number(price))) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export function cakeImageUrl(cake) {
  if (cake?.image) return cake.image;
  const name = encodeURIComponent(cake?.name || "Cake");
  return `https://placehold.co/600x400/fdf2f8/831843?text=${name}`;
}

export function bouquetImageUrl(bouquet) {
  if (bouquet?.image) return bouquet.image;
  const name = encodeURIComponent(bouquet?.name || "Bouquet");
  return `https://placehold.co/600x400/f0fdf4/166534?text=${name}`;
}

/** Product image for an order row (uses saved productImage or placeholder). */
export function orderImageUrl(order) {
  if (order?.productImage) return order.productImage;
  const name = encodeURIComponent(order?.productName || "Product");
  const isBouquet = order?.productType === "bouquet";
  const bg = isBouquet ? "f0fdf4" : "fdf2f8";
  const fg = isBouquet ? "166534" : "831843";
  return `https://placehold.co/400x400/${bg}/${fg}?text=${name}`;
}

export function orderUserLabel(order) {
  const u = order?.userId;
  if (!u) return null;
  if (typeof u === "object") {
    return u.username || u.email || "Registered user";
  }
  return "Registered user";
}

export function orderUserEmail(order) {
  const u = order?.userId;
  if (u && typeof u === "object" && u.email) return u.email;
  return null;
}

export function shortOrderId(order) {
  const id = order?._id;
  if (!id) return "—";
  return String(id).slice(-8).toUpperCase();
}
