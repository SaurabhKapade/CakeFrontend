import { Link } from "react-router-dom";
import { bouquetImageUrl, formatInr } from "../../Helpers/formatUtils";

export default function BouquetCard({ bouquet }) {
  const id = bouquet._id || bouquet.id;
  return (
    <article className="group rounded-2xl border border-emerald-100 bg-white shadow-sm shadow-emerald-900/5 overflow-hidden transition hover:shadow-md hover:border-emerald-200">
      <Link
        to={`/bouquet/${id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-2xl"
      >
        <div className="aspect-[4/3] overflow-hidden bg-emerald-50">
          <img
            src={bouquetImageUrl(bouquet)}
            alt={bouquet.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4 sm:p-5">
        <Link to={`/bouquet/${id}`}>
          <h3 className="font-semibold text-emerald-950 text-lg leading-snug hover:text-emerald-800 transition-colors">
            {bouquet.name}
          </h3>
        </Link>
        {bouquet.category ? (
          <p className="text-xs uppercase tracking-wide text-emerald-600/80 mt-1">
            {bouquet.category}
          </p>
        ) : null}
        <p className="text-stone-600 text-sm mt-2 line-clamp-2">
          {bouquet.description}
        </p>
        <p className="mt-3 text-lg font-bold text-emerald-900">
          {formatInr(bouquet.price)}
        </p>
      </div>
    </article>
  );
}
