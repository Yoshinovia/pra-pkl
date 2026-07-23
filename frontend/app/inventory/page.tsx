import Sidebar from "../components/dashboard/sidebar";
import InventoryTable from "./inventory-table";
import { getInventories } from "../lib/api";

export default async function InventoryPage() {
  const items = await getInventories();

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Inventory</h2>
            <p className="text-gray-700 text-sm mt-1">
              Manage your product inventory
            </p>
          </div>
        </header>

        <div className="gap-6 mb-8">
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-gray-300 text-sm font-semibold mb-1">
              Total Items
            </h3>
            <p className="text-3xl font-bold text-white">{items.length.toLocaleString()}</p>
          </div>
        </div>

        <InventoryTable initialItems={items} />
      </main>
    </div>
  );
}
