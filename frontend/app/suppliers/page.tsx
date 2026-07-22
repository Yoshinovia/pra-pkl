import Sidebar from "../components/dashboard/sidebar";
import SupplierTable from "./supplier-table";
import { getSuppliers } from "../lib/api";

export default async function Suppliers() {
  const suppliers = await getSuppliers();

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Manage Suppliers</h2>
            <p className="text-gray-700 text-sm mt-1">View and manage your vendor directory and contact information.</p>
          </div>
        </header>

        <SupplierTable initialSuppliers={suppliers} />
      </main>
    </div>
  )
}