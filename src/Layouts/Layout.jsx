import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Layout() {
  return (
    <div className="min-h-svh flex flex-col bg-gradient-to-b from-pink-50/80 via-white to-rose-50/40">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
