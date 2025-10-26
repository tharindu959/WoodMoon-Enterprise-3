"use client";

import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Bell, Home } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import useAuthStore from "@/stores/authStore";
import useCartStore from "@/stores/cartStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { clearCart } = useCartStore();

  const handleLogout = () => {
    logout();
    clearCart();
    localStorage.removeItem("token");
  };

  return (
    <nav className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
      {/* LEFT */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="TrendLama"
          width={36}
          height={36}
          className="w-6 h-6 md:w-9 md:h-9"
        />
        <p className="hidden md:block text-md font-medium tracking-wider">
          WoodMoon.
        </p>
      </Link>

      {/* CENTER - Service Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/services"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Browse Services
        </Link>
        <Link
          href="/requests"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Request Service
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <SearchBar />
        <Link href="/">
          <Home className="w-4 h-4 text-gray-600" />
        </Link>
        <Bell className="w-4 h-4 text-gray-600" />
        <ShoppingCartIcon />
        <Link href="/contact" className="text-gray-700 hover:text-blue-600">
          Contact Us
        </Link>

        {/* ✅ Auth Section */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 font-medium hidden md:block">
              {user}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 text-sm font-semibold hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-gray-700 hover:text-blue-600 font-semibold"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
