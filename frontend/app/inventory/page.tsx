import Sidebar from "../components/dashboard/sidebar";
import ProductTable from "./product-table";
import { getProducts } from "../lib/api";

export default async function Inventory() {
  const products = await getProducts();

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
              Total Products
            </h3>
            <p className="text-3xl font-bold text-white">{products.length.toLocaleString()}</p>
          </div>
        </div>

        <ProductTable initialProducts={products} />
      </main>
    </div>
  );
}