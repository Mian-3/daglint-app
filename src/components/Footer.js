import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-cream-200 bg-cream-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Logo />
          <p className="text-sm text-ink-600 mt-3">
            Premium products, delivered to your door.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm text-ink-900">Shop</h4>
          <ul className="space-y-2 text-sm text-ink-600">
            <li>
              <Link href="/shop" className="hover:text-black transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-black transition-colors">
                Categories
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm text-ink-900">Support</h4>
          <ul className="space-y-2 text-sm text-ink-600">
            <li>
              <Link href="/contact" className="hover:text-black transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-black transition-colors">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-black transition-colors">
                Return Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm text-ink-900">Legal</h4>
          <ul className="space-y-2 text-sm text-ink-600">
            <li>
              <Link href="/privacy-policy" className="hover:text-black transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-black transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-200 py-4 text-center text-xs text-ink-600">
        © {new Date().getFullYear()} Daglint. All rights reserved.
      </div>
    </footer>
  );
}