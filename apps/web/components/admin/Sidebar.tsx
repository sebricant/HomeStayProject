"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

const menuItems = [
    { name: 'Dashboard', icon: 'LayoutGrid', path: '/admin' },
    { name: 'Enquiries', icon: 'Inbox', path: '/admin/enquiries' },
    { name: 'Calendar', icon: 'Calendar', path: '/admin/calendar' },
    { name: 'Reports', icon: 'BarChart', path: '/admin/reports' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-white/20 fixed h-full z-10 hidden md:flex flex-col shadow-soft">
            <div className="h-20 flex items-center px-6 border-b border-gray-100/50">
                <h2 className="text-primary font-bold text-2xl font-heading tracking-wide">Palm Grove</h2>
            </div>
            <nav className="flex-1 py-8 space-y-2">
                {menuItems.map((item) => {
                    // Exact match or sub-path match logic can be refined
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center px-6 py-3.5 mx-3 rounded-xl transition-all duration-300 font-medium ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                                : 'text-text-muted hover:bg-surface-hover hover:text-primary hover:translate-x-1'
                                }`}
                        >
                            <Icon name={item.icon as any} size={20} className={isActive ? "mr-3" : "mr-3 opacity-70"} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            {/* Logout etc */}
            <div className="p-6 border-t border-gray-200">
                <button
                    onClick={() => {
                        document.cookie = 'token=; Max-Age=0; path=/;';
                        window.location.href = '/admin/login';
                    }}
                    className="flex items-center text-danger text-sm font-medium hover:opacity-80 transition-opacity w-full"
                >
                    <Icon name="LogOut" size={18} className="mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
