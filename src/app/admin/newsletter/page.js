import { prisma } from "@/lib/prisma";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

async function getSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-ink-600">
            {subscribers.length} people signed up for launch updates.
          </p>
        </div>
      </div>

      <div className="bg-white border border-cream-200 rounded-xl overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="w-8 h-8 text-ink-300 mx-auto mb-3" />
            <p className="text-sm text-ink-600">No subscribers yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-left text-xs text-ink-600 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-cream-100 last:border-0 hover:bg-cream-50">
                  <td className="px-5 py-3 font-medium text-ink-900">{sub.email}</td>
                  <td className="px-5 py-3 text-ink-600 text-xs">
                    {new Date(sub.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}