import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-pink-100 bg-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-6 sm:justify-between sm:items-center text-sm text-stone-600">
        <div>
          <p className="font-semibold text-pink-950 text-base">Royal Cakes</p>
          <p className="mt-1">Fresh cakes baked to order.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
          <div className="flex flex-wrap gap-4">
            <Link to="/" className="hover:text-pink-800 transition-colors">
              Home
            </Link>
            <Link to="/search" className="hover:text-pink-800 transition-colors">
              Browse cakes
            </Link>
            <Link to="/orders" className="hover:text-pink-800 transition-colors">
              My orders
            </Link>
            <Link to="/login" className="hover:text-pink-800 transition-colors">
              Login
            </Link>
          </div>
          
          <a 
            href="https://www.instagram.com/cake_studio_by_royal?igsh=Nmc4OXFjaTI5bG9s" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-pink-700 hover:text-pink-900 font-semibold transition-colors bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full"
            title="Paste your Instagram link in the href"
          >
            <FaInstagram size={18} />
            <span>Contact Us</span>
          </a>
        </div>
      </div>
      <div className="flex justify-center items-center text-center text-sm text-stone-500 py-4 border-t border-pink-100 px-4">
        <p>We are not providing any delivery services at the moment.</p>
      </div>
    </footer>
  );
}
