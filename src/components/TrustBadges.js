import { Truck, RotateCcw, Wallet } from "lucide-react";

export default function TrustBadges() {
  return (
<div className="grid grid-cols-3 gap-3">      <div className="flex flex-col items-center text-center gap-1.5">
        <Truck className="w-5 h-5 text-ink-900" />
        <span className="text-[11px] text-ink-600 leading-tight">
          Free shipping over Rs. 1500
        </span>
      </div>
      <div className="flex flex-col items-center text-center gap-1.5">
        <RotateCcw className="w-5 h-5 text-ink-900" />
        <span className="text-[11px] text-ink-600 leading-tight">
          7-day easy returns
        </span>
      </div>
      <div className="flex flex-col items-center text-center gap-1.5">
        <Wallet className="w-5 h-5 text-ink-900" />
        <span className="text-[11px] text-ink-600 leading-tight">
          Cash on delivery
        </span>
      </div>
    </div>
  );
}