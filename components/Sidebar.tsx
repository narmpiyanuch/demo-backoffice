'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    id: 'white-label',
    label: 'White Label Management',
    href: '/admin/white-label',
  },
  {
    id: 'master-data',
    label: 'Master Data Setting',
    href: '/admin/master-data',
  },
  {
    id: 'module-master',
    label: 'Module Master Data',
    href: '/admin/module-master',
  },
  {
    id: 'standard-tasks',
    label: 'Standard Tasks',
    href: '/admin/standard-tasks',
  },
  {
    id: 'roles-permissions',
    label: 'Role & Permission',
    href: '/admin/roles',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Panel</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith(item.href)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}