'use client';

import { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { Role, defaultRoles, ROLE_PERMISSION_VERSION, permissionModules } from '@/types/role-permission';

export default function RolesPage() {
  const [items, setItems] = useState<Role[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let data = defaultRoles;
    const savedVersion = localStorage.getItem('rolePermissionVersion');
    if (savedVersion !== String(ROLE_PERMISSION_VERSION)) {
      localStorage.setItem('rolePermissionData', JSON.stringify(defaultRoles));
      localStorage.setItem('rolePermissionVersion', String(ROLE_PERMISSION_VERSION));
    } else {
      const saved = localStorage.getItem('rolePermissionData');
      if (saved) {
        try { data = JSON.parse(saved); } catch (e) { console.error('Failed to parse roles:', e); }
      }
    }
    startTransition(() => { setItems(data); setIsLoaded(true); });
  }, []);

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Role & Permission</h1>
          <p className="text-gray-500 mt-1">Manage permissions for each role. Roles are predefined and cannot be added or removed.</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Q</span>
            <input
              type="text"
              placeholder="Search role name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No results found' : 'No roles defined'}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const activePerms = item.permissions.filter(p => p.actions.length > 0);
                  const activeLabels = activePerms.map(p => {
                    const def = permissionModules.find(m => m.key === p.module);
                    return def?.label ?? p.module;
                  });
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {activeLabels.map(label => (
                            <span key={label} className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700">{label}</span>
                          ))}
                          {activeLabels.length === 0 && <span className="text-xs text-gray-400">No permissions</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-500">by {item.updatedBy}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/roles/${item.id}?mode=view`} className="p-2 text-gray-400 hover:text-gray-700 transition-colors" title="View">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </Link>
                          <Link href={`/admin/roles/${item.id}?mode=edit`} className="p-2 text-gray-400 hover:text-gray-700 transition-colors" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
