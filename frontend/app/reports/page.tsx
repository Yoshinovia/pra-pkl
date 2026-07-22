import Sidebar from "../components/dashboard/sidebar";
import ReportsClient from "./reports-client";
import { getMovements } from "../lib/api";

export default async function Reports() {
  const movements = await getMovements();

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
            <p className="text-gray-700 text-sm mt-1">
              Generate and review stock movement reports
            </p>
          </div>
        </header>

        <ReportsClient data={movements} />
      </main>
    </div>
  );
}