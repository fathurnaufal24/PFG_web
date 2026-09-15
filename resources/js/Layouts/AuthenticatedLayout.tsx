import Sidebar from "@/Components/Sidebar";
import { Menu } from "lucide-react";
import { ReactNode, useState } from "react";

export default function AuthenticatedLayout({ children, className }: { children: ReactNode, className?: string; }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div id="divutama_authlayout" className={`flex h-screen w-full bg-slate-100 ${className ?? ''}`}>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            <div id="divpertama_authlayout" className="flex-1 w-full flex flex-col min-w-0 overflow-hidden">
                <header className="md:hidden bg-slate-900/95 p-4 shadow-sm flex items-center justify-between sticky top-0 z-30 backdrop-blur-sm border-b border-slate-700/70">
                    <div className="flex items-center space-x-2">
                        <img src='/images/logo-sidebar.png' alt="PFG Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold text-white">PFG Portal</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 text-white hover:bg-slate-700 rounded-lg transition"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
                    <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 xl:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
