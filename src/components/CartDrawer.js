"use client";

import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { calculateShipping } from "@/lib/orderCalculations";

export default function CartDrawer() {
  const {
    items,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!isDrawerOpen) return null;

  const shipping = calculateShipping(subtotal);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/40 z-50"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
          <h2 className="font-semibold">Your Cart</h2>
          <button onClick={closeDrawer} type="button">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-ink-600 text-center mt-10">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-cream-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-ink-600">
                      Rs. {item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="border border-cream-200 rounded p-1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs w-5 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="border border-cream-200 rounded p-1 disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-ink-600 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm font-semibold">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-cream-200 px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Subtotal</span>
              <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block w-full text-center border border-ink-900 text-ink-900 py-2.5 rounded-md text-sm font-medium hover:bg-cream-50"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full text-center bg-ink-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-black"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}