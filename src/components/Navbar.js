"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { itemCount, openDrawer } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full bg-white sticky top-0 z-50 transition-shadow duration-300 border-b ${
        isScrolled
          ? "shadow-md border-transparent"
          : "shadow-none border-cream-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-700">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <Link href="/categories" className="hover:text-black transition-colors">
            Categories
          </Link>
          <Link href="/about" className="hover:text-black transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-black transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-ink-900">
          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account/orders"
                title="My Orders"
                className="hover:text-black transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Logout"
                className="hover:text-black transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              title="Login"
              className="hover:text-black transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </Link>
          )}

          <button
            type="button"
            onClick={openDrawer}
            title="Cart"
            className="relative hover:text-black transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}