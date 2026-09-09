"use client";

import Link from "next/link";
import Logo from "./Logo";
import { ShoppingCart, Search, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full border-b border-cream-200 bg-white sticky top-0 z-50">
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
          <Search className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="flex items-center gap-1 text-sm hover:text-black transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">{session.user.name}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Logout"
                className="cursor-pointer hover:text-black transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 hover:text-black transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden md:inline text-sm">Login</span>
            </Link>
          )}

          <Link href="/cart" className="hover:text-black transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}