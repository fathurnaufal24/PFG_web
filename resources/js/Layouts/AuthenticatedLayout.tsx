import Sidebar from "@/Components/Sidebar";
import { Menu } from "lucide-react";
import { ReactNode, useState } from "react";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return <div id="divutama_authlayout" className="flex min-h-screen bg-[#F3F4F9]">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div id="divpertama_authlayout" className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header className="md:hidden bg-[#1E293B] p-4 shadow-sm flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center space-x-2">
                    <img src='/images/logo-sidebar.png' alt="PFG Logo" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-white">PFG Portal</span>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-white hover:bg-gray-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                {children}
            </main>
        </div>
    </div>
}
