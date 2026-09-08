"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          YourBrand
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 cursor-pointer" />

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link href="/account" className="flex items-center gap-1 text-sm">
                <User className="w-5 h-5" />
                <span className="hidden md:inline">{session.user.name}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Logout"
                className="cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1">
              <User className="w-5 h-5 cursor-pointer" />
              <span className="hidden md:inline text-sm">Login</span>
            </Link>
          )}

          <Link href="/cart">
            <ShoppingCart className="w-5 h-5 cursor-pointer" />
          </Link>
        </div>
      </div>
    </header>
  );
}