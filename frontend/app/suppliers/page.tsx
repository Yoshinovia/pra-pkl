import Sidebar from "../components/dashboard/sidebar";

export default function Suppliers() {
    return (
        <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
            {/* Reusable Sidebar Component */}
            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-8">
                
                {/* Header Section */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manage Suppliers</h2>
                        <p className="text-gray-700 text-sm mt-1">View and manage your vendor directory and contact information.</p>
                    </div>
                    <button className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl shadow-lg transition-colors border border-yellow-300">
                        + Add New Supplier
                    </button>
                </header>

                {/* Quick Search & Stats Panel - Tinted Glass */}
                <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 mb-8 flex flex-col md:flex-row gap-8 md:items-center justify-between">
                    <div className="flex-1 max-w-xl">
                        <input 
                            type="text" 
                            placeholder="Search suppliers by company name or contact..." 
                            className="w-full bg-black/30 border border-white/30 text-white placeholder-gray-400 py-3 px-4 rounded-xl focus:outline-none focus:border-[#edde53] transition-colors"
                        />
                    </div>
                    
                    <div className="flex gap-6 items-center">
                        <div className="text-center px-4">
                            <p className="text-3xl font-bold text-white">24</p>
                            <p className="text-xs text-gray-300 uppercase tracking-wider mt-1">Active</p>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <div className="text-center px-4">
                            <p className="text-3xl font-bold text-gray-400">3</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Inactive</p>
                        </div>
                    </div>
                </div>

                {/* Supplier Data Table - Tinted Glass */}
                <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="p-5 border-b border-white/20 bg-black/20">
                        <h3 className="font-semibold text-lg tracking-wide">Supplier Directory</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/20 text-sm text-gray-300 bg-black/30">
                                    <th className="p-4 font-medium">Supplier Name</th>
                                    <th className="p-4 font-medium">Contact Person</th>
                                    <th className="p-4 font-medium">Email / Phone</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                
                                {/* Row 1 */}
                                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <p className="font-medium text-white text-base">Global Parts Co.</p>
                                        <p className="text-xs text-gray-400 mt-0.5">ID: SUP-001</p>
                                    </td>
                                    <td className="p-4 text-gray-300">Michael Chen</td>
                                    <td className="p-4">
                                        <p className="text-gray-300">m.chen@globalparts.com</p>
                                        <p className="text-xs text-gray-400 mt-0.5">+1 (555) 123-4567</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-medium">Active</span>
                                    </td>
                                    <td className="p-4 text-right space-x-3 whitespace-nowrap">
                                        <button className="text-black bg-[#edde53] hover:bg-yellow-400 px-4 py-1.5 rounded-lg transition-colors font-medium">Edit</button>
                                        <button className="text-white bg-red-500/80 hover:bg-red-500 px-4 py-1.5 rounded-lg transition-colors font-medium border border-red-500/50">Delete</button>
                                    </td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <p className="font-medium text-white text-base">Apex Fluids Ltd.</p>
                                        <p className="text-xs text-gray-400 mt-0.5">ID: SUP-002</p>
                                    </td>
                                    <td className="p-4 text-gray-300">Sarah Jenkins</td>
                                    <td className="p-4">
                                        <p className="text-gray-300">s.jenkins@apexfluids.net</p>
                                        <p className="text-xs text-gray-400 mt-0.5">+44 20 7946 0958</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-medium">Active</span>
                                    </td>
                                    <td className="p-4 text-right space-x-3 whitespace-nowrap">
                                        <button className="text-black bg-[#edde53] hover:bg-yellow-400 px-4 py-1.5 rounded-lg transition-colors font-medium">Edit</button>
                                        <button className="text-white bg-red-500/80 hover:bg-red-500 px-4 py-1.5 rounded-lg transition-colors font-medium border border-red-500/50">Delete</button>
                                    </td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <p className="font-medium text-white text-base">Old Town Packaging</p>
                                        <p className="text-xs text-gray-400 mt-0.5">ID: SUP-003</p>
                                    </td>
                                    <td className="p-4 text-gray-300">Robert Vance</td>
                                    <td className="p-4">
                                        <p className="text-gray-300">rvance@otp.com</p>
                                        <p className="text-xs text-gray-400 mt-0.5">+1 (555) 987-6543</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-gray-500/20 text-gray-400 border border-gray-500/30 px-3 py-1 rounded-full text-xs font-medium">Inactive</span>
                                    </td>
                                    <td className="p-4 text-right space-x-3 whitespace-nowrap">
                                        <button className="text-black bg-[#edde53] hover:bg-yellow-400 px-4 py-1.5 rounded-lg transition-colors font-medium">Edit</button>
                                        <button className="text-white bg-red-500/80 hover:bg-red-500 px-4 py-1.5 rounded-lg transition-colors font-medium border border-red-500/50">Delete</button>
                                    </td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    )
}