import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { fetchCakes } from "../Redux/Slices/CakeSlice";
import { fetchBouquets } from "../Redux/Slices/BouquetSlice";
import CakeCard from "../components/Cards/CakeCard";
import BouquetCard from "../components/Cards/BouquetCard";
import { ArrowRight, Star, Truck, Heart, ChefHat } from "lucide-react";


import img1 from "../assets/img1.jpeg";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import img4 from "../assets/img4.jpeg";
import img5 from "../assets/img5.jpeg";
import img6 from "../assets/img6.jpeg";

const heroImages = [img1, img2, img3, img4, img5, img6];
export default function Home() {
  const dispatch = useDispatch();
  const { cakesData, isLoading: cakesLoading, error: cakeError } = useSelector(
    (s) => s.cake
  );
  const { bouquetsData, isLoading: bouquetsLoading, error: bouquetError } = useSelector(
    (s) => s.bouquet
  );

  const [scrollY, setScrollY] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    dispatch(fetchCakes());
    dispatch(fetchBouquets());
  }, [dispatch]);

  // Parallax scroll listener
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const featuredCakes = (cakesData || []).slice(0, 3);
  const featuredBouquets = (bouquetsData || []).slice(0, 3);

  const testimonials = [
    {
      name: "Aarav Sharma",
      text: "Best cakes and bouquets I've ever ordered. Super fresh and beautiful!",
      rating: 5,
    },
    {
      name: "Priya Mehta",
      text: "Delivery was fast and everything tasted and looked amazing.",
      rating: 5,
    },
    {
      name: "Rohan Patil",
      text: "Custom cake and rose bouquet came out exactly as I wanted.",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col-reverse lg:flex-row items-center justify-between gap-16 ">
        <div 
          className="flex-1 text-center lg:text-left z-10 transition-transform duration-75 ease-out"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100/50 border border-pink-200 backdrop-blur-sm mb-6 animate-fade-in">
            <Star className="w-4 h-4 text-pink-600 fill-pink-600" />
            <span className="text-xs font-semibold tracking-wider text-pink-700 uppercase">
              Premium Bakery & Florist
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Make Every <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-400">
              Moment
            </span>{" "}
            Special
          </h1>

          <p className="mt-6 text-gray-600 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
            Handcrafted cakes baked with love and stunning fresh floral arrangements delivered straight to your door.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link to="/search?type=cake">
               <Button
                variant="contained"
                endIcon={<ArrowRight className="w-4 h-4" />}
                sx={{
                  bgcolor: "#be185d",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  py: 1.5,
                  px: 4,
                  borderRadius: 999,
                  boxShadow: "0 10px 25px -5px rgba(190, 24, 93, 0.4)",
                  "&:hover": { 
                    bgcolor: "#9f1239",
                    transform: "translateY(-2px)",
                    boxShadow: "0 20px 25px -5px rgba(190, 24, 93, 0.3)"
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Order Cakes
              </Button>
            </Link>

            <Link to="/search?type=bouquet">
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#be185d",
                  color: "#be185d",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  py: 1.5,
                  px: 4,
                  borderRadius: 999,
                  borderWidth: "2px",
                  "&:hover": { 
                    borderColor: "#9f1239", 
                    bgcolor: "rgba(190, 24, 93, 0.05)",
                    borderWidth: "2px",
                    transform: "translateY(-2px)"
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Explore Bouquets
              </Button>
            </Link>
          </div>
        </div>

        <div 
          className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center perspective-1000 transition-transform duration-75 ease-out"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          {/* Carousel */}
          {heroImages.map((img, index) => {
            const isActive = index === currentImg;
            const isPrev = index === (currentImg - 1 + heroImages.length) % heroImages.length;
            const isNext = index === (currentImg + 1) % heroImages.length;

            let transform = "scale(0.8) translateY(20%)";
            let opacity = 0;
            let zIndex = 10;

            if (isActive) {
              transform = "rotate(-3deg) scale(1) translateX(0)";
              opacity = 1;
              zIndex = 30;
            } else if (isNext) {
              transform = "rotate(5deg) scale(0.9) translateX(20%)";
              opacity = 0.7;
              zIndex = 20;
            } else if (isPrev) {
              transform = "rotate(-8deg) scale(0.9) translateX(-20%)";
              opacity = 0.7;
              zIndex = 20;
            }

            return (
              <img
                key={index}
                src={img}
                className="absolute w-48 sm:w-64 md:w-80 h-64 sm:h-80 md:h-96 object-cover rounded-2xl md:rounded-[2rem] shadow-xl transition-all duration-700 ease-in-out border-2 md:border-4 border-white/50 backdrop-blur-sm"
                style={{
                  transform,
                  opacity,
                  zIndex,
                }}
                alt={`Carousel ${index + 1}`}
              />
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <ChefHat className="w-8 h-8 text-pink-600" />, title: "Master Bakers", desc: "Crafted by experts with years of experience." },
          { icon: <Heart className="w-8 h-8 text-emerald-600" />, title: "Fresh Flowers", desc: "Hand-tied floral arrangements for every occasion." },
          { icon: <Truck className="w-8 h-8 text-blue-600" />, title: "Fast Delivery", desc: "Quick and safe doorstep delivery." },
        ].map((feat, i) => (
          <div key={i} className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-100 transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-pink-50 transition-all duration-300">
              {feat.icon}
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-3">{feat.title}</h3>
            <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Cakes */}
      <section>
        <div className="flex flex-col sm:flex-row items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Signature Cakes</h2>
            <p className="text-gray-500 mt-2 text-lg">Our most loved bakes, made fresh daily.</p>
          </div>
          <Link
            to="/search?type=cake"
            className="group flex items-center gap-2 text-pink-700 hover:text-pink-800 font-semibold text-lg transition-colors"
          >
            View full menu 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {cakesLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-700"></div>
          </div>
        ) : cakeError ? (
          <p className="text-red-500 text-center py-10 bg-red-50 rounded-2xl">{cakeError}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCakes.map((cake) => (
              <div key={cake._id || cake.id} className="hover:-translate-y-2 transition-transform duration-300">
                <CakeCard cake={cake} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Bouquets */}
      <section>
        <div className="flex flex-col sm:flex-row items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Fresh Bouquets</h2>
            <p className="text-gray-500 mt-2 text-lg">Stunning floral arrangements for every occasion.</p>
          </div>
          <Link
            to="/search?type=bouquet"
            className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold text-lg transition-colors"
          >
            View all flowers
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {bouquetsLoading ? (
           <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
          </div>
        ) : bouquetError ? (
          <p className="text-red-500 text-center py-10 bg-red-50 rounded-2xl">{bouquetError}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBouquets.map((bouquet) => (
              <div key={bouquet._id || bouquet.id} className="hover:-translate-y-2 transition-transform duration-300">
                <BouquetCard bouquet={bouquet} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-pink-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-800 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-800 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Customers</h2>
            <p className="text-pink-200 text-lg">Don't just take our word for it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-colors"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed mb-6 font-light">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-800 rounded-full flex items-center justify-center font-bold text-xl">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-sm text-pink-300">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

