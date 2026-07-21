import Sidebar from "../components/dashboard/sidebar";
import ReportsTable, { ReportRow } from "../components/reports/reports_table";

// TODO: replace with real fetch once API is ready
// const reportData = await fetch("your-api-url").then((res) => res.json());
const reportData: ReportRow[] = [
  {
    id: "1",
    productName: "Industrial Bearings (12mm)",
    sku: "BRG-12-IND",
    category: "Machinery Parts",
    type: "Stock In",
    quantity: 150,
    date: "2026-07-18",
    reference: "PO-2026-0091",
  },
  {
    id: "2",
    productName: "Synthetic Lubricant 5L",
    sku: "LUB-SYN-5L",
    category: "Chemicals",
    type: "Stock Out",
    quantity: 25,
    date: "2026-07-19",
    reference: "SO-2026-0433",
  },
  {
    id: "3",
    productName: "Wireless Mouse",
    sku: "PRD-001",
    category: "Electronics",
    type: "Stock In",
    quantity: 200,
    date: "2026-07-19",
    reference: "PO-2026-0092",
  },
  {
    id: "4",
    productName: "Mechanical Keyboard",
    sku: "PRD-002",
    category: "Electronics",
    type: "Stock Out",
    quantity: 12,
    date: "2026-07-20",
    reference: "SO-2026-0434",
  },
  {
    id: "5",
    productName: "Office Chair",
    sku: "PRD-004",
    category: "Furniture",
    type: "Stock Out",
    quantity: 5,
    date: "2026-07-20",
    reference: "SO-2026-0435",
  },
  {
    id: "6",
    productName: "USB-C Hub",
    sku: "PRD-003",
    category: "Accessories",
    type: "Stock In",
    quantity: 80,
    date: "2026-07-21",
    reference: "PO-2026-0093",
  },
];

export default function Reports() {
  const totalIn = reportData
    .filter((r) => r.type === "Stock In")
    .reduce((sum, r) => sum + r.quantity, 0);
  const totalOut = reportData
    .filter((r) => r.type === "Stock Out")
    .reduce((sum, r) => sum + r.quantity, 0);

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header - static, stays server-rendered */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
            <p className="text-gray-700 text-sm mt-1">
              Generate and review stock movement reports
            </p>
          </div>
          <button className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl shadow-lg transition-colors border border-yellow-300">
            Export Report
          </button>
        </header>

        {/* Summary Cards - static, stays server-rendered */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-gray-300 text-sm font-semibold mb-1">
              Total Stock In
            </h3>
            <p className="text-3xl font-bold text-green-400">{totalIn}</p>
          </div>
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-gray-300 text-sm font-semibold mb-1">
              Total Stock Out
            </h3>
            <p className="text-3xl font-bold text-red-400">{totalOut}</p>
          </div>
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-gray-300 text-sm font-semibold mb-1">
              Net Movement
            </h3>
            <p className="text-3xl font-bold text-[#edde53]">
              {totalIn - totalOut}
            </p>
          </div>
        </div>

        {/* Only this part needs interactivity -> Client Component */}
        <ReportsTable data={reportData} />
      </main>
    </div>
  );
}