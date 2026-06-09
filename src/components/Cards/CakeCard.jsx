import { Link } from "react-router-dom";
import { cakeImageUrl, formatInr } from "../../Helpers/formatUtils";

export default function CakeCard({ cake }) {
  const id = cake._id || cake.id;
  return (
    <article className="group rounded-2xl border border-pink-100 bg-white shadow-sm shadow-pink-900/5 overflow-hidden transition hover:shadow-md hover:border-pink-200">
      <Link
        to={`/product/${id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-t-2xl"
      >
        <div className="aspect-[4/3] overflow-hidden bg-pink-50">
          <img
            src={cakeImageUrl(cake)}
            alt={cake.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4 sm:p-5">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-pink-950 text-lg leading-snug hover:text-pink-800 transition-colors">
            {cake.name}
          </h3>
        </Link>
        {cake.category ? (
          <p className="text-xs uppercase tracking-wide text-pink-600/80 mt-1">
            {cake.category}
          </p>
        ) : null}
        <p className="text-stone-600 text-sm mt-2 line-clamp-2">
          {cake.description}
        </p>
        <p className="mt-3 text-lg font-bold text-pink-900">
          {formatInr(cake.price)}
        </p>
      </div>
    </article>
  );
}
