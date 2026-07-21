"use client";

import { useState } from "react";

export type MovementType = "Stock In" | "Stock Out";

export interface ReportRow {
  id: string;
  productName: string;
  sku: string;
  category: string;
  type: MovementType;
  quantity: number;
  date: string;
  reference: string;
}

const categories = [
  "All Categories",
  "Electronics",
  "Machinery Parts",
  "Chemicals",
  "Furniture",
  "Accessories",
];
const movementTypes = ["All Types", "Stock In", "Stock Out"];

function TypeBadge({ type }: { type: MovementType }) {
  const isIn = type === "Stock In";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        isIn
          ? "bg-green-500/20 text-green-400 border-green-500/30"
          : "bg-red-500/20 text-red-400 border-red-500/30"
      }`}
    >
      {type}
    </span>
  );
}

interface ReportsTableProps {
  data: ReportRow[];
}

export default function ReportsTable({ data }: ReportsTableProps) {
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const filteredData = data.filter((row) => {
    const matchesCategory =
      categoryFilter === "All Categories" || row.category === categoryFilter;
    const matchesType = typeFilter === "All Types" || row.type === typeFilter;
    return matchesCategory && matchesType;
  });

  return (
    <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="p-5 border-b border-white/20 bg-black/20 flex justify-between items-center flex-wrap gap-3">
        <h3 className="font-semibold text-lg tracking-wide">
          Stock Movement Report
        </h3>

        <div className="flex gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-black/40 border border-white/20 text-sm text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#edde53]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-900">
                {cat}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-black/40 border border-white/20 text-sm text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#edde53]"
          >
            {movementTypes.map((type) => (
              <option key={type} value={type} className="bg-gray-900">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/20 text-sm text-gray-300 bg-black/30">
            <th className="p-4 font-medium">Product Name</th>
            <th className="p-4 font-medium">SKU</th>
            <th className="p-4 font-medium">Category</th>
            <th className="p-4 font-medium">Type</th>
            <th className="p-4 font-medium">Quantity</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium text-right">Reference</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {filteredData.length > 0 ? (
            filteredData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/10 hover:bg-white/5 transition-colors last:border-b-0"
              >
                <td className="p-4 font-medium text-white">
                  {row.productName}
                </td>
                <td className="p-4 text-gray-400">{row.sku}</td>
                <td className="p-4 text-gray-300">{row.category}</td>
                <td className="p-4">
                  <TypeBadge type={row.type} />
                </td>
                <td
                  className={`p-4 font-bold ${
                    row.type === "Stock In" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {row.type === "Stock In" ? "+" : "-"}
                  {row.quantity}
                </td>
                <td className="p-4 text-gray-400">{row.date}</td>
                <td className="p-4 text-right text-gray-400">
                  {row.reference}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-400">
                No records match the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}