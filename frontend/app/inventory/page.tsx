import Sidebar from "../components/dashboard/sidebar";

const products = [
  {
    id: "PRD-001",
    name: "Wireless Mouse",
    category: "Electronics",
    stock: 128,
    price: "$24.99",
    status: "In Stock",
  },
  {
    id: "PRD-002",
    name: "Mechanical Keyboard",
    category: "Electronics",
    stock: 42,
    price: "$89.99",
    status: "In Stock",
  },
  {
    id: "PRD-003",
    name: "USB-C Hub",
    category: "Accessories",
    stock: 8,
    price: "$34.50",
    status: "Low Stock",
  },
  {
    id: "PRD-004",
    name: "Office Chair",
    category: "Furniture",
    stock: 0,
    price: "$199.00",
    status: "Out of Stock",
  },
  {
    id: "PRD-005",
    name: "Desk Lamp",
    category: "Furniture",
    stock: 76,
    price: "$18.75",
    status: "In Stock",
  },
  {
    id: "PRD-006",
    name: "Monitor Stand",
    category: "Accessories",
    stock: 15,
    price: "$45.00",
    status: "Low Stock",
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Stock": "bg-green-500/20 text-green-400 border-green-500/30",
    "Low Stock": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    "Out of Stock": "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function Inventory() {
  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
            <p className="text-gray-700 text-sm mt-1">
              Inventory page for view the inventories
            </p>
          </div>
          <button className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl shadow-lg transition-colors border border-yellow-300">
            + Add New Product
          </button>
        </header>

        <div className="gap-6 mb-8">
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-gray-300 text-sm font-semibold mb-1">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-white">1,248</p>
          </div>
        </div>

        {/* Inventory Table - hardcoded data, API not ready yet */}
        <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h3 className="text-lg font-bold text-white">Product List</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20 text-gray-300 text-sm">
                  <th className="px-6 py-4 font-semibold">Product ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {product.price}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#edde53] hover:text-yellow-300 text-sm font-medium mr-3">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}