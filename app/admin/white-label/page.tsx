'use client';

import { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';

interface WhiteLabelItem {
  id: string;
  brandName: string;
  logo: string;
  createdAt: string;
  status: 'active' | 'inactive';
  tier: 'basic' | 'professional' | 'enterprise';
}

const ITEMS_PER_PAGE = 6;

const sampleData: WhiteLabelItem[] = [
  { id: '1', brandName: 'Brand A', logo: '/next.svg', createdAt: '2024-12-28', status: 'active', tier: 'professional' },
  { id: '2', brandName: 'Brand B', logo: '/vercel.svg', createdAt: '2024-12-20', status: 'active', tier: 'enterprise' },
  { id: '3', brandName: 'Brand C', logo: '/next.svg', createdAt: '2024-12-15', status: 'inactive', tier: 'basic' },
  { id: '4', brandName: 'Brand D', logo: '/vercel.svg', createdAt: '2024-12-10', status: 'active', tier: 'basic' },
  { id: '5', brandName: 'Brand E', logo: '/next.svg', createdAt: '2024-12-05', status: 'active', tier: 'professional' },
  { id: '6', brandName: 'Brand F', logo: '/vercel.svg', createdAt: '2024-11-28', status: 'inactive', tier: 'enterprise' },
  { id: '7', brandName: 'Brand G', logo: '/next.svg', createdAt: '2024-11-20', status: 'active', tier: 'basic' },
  { id: '8', brandName: 'Brand H', logo: '/vercel.svg', createdAt: '2024-11-15', status: 'active', tier: 'professional' },
];

export default function AdminWhiteLabelPage() {
  const [items, setItems] = useState<WhiteLabelItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let data = sampleData;
    const saved = localStorage.getItem('whiteLabelItems');
    if (saved) {
      try {
        data = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse white label items:', e);
      }
    } else {
      localStorage.setItem('whiteLabelItems', JSON.stringify(sampleData));
    }
    startTransition(() => {
      setItems(data);
      setIsLoaded(true);
    });
  }, []);

  const filtered = items.filter(item => {
    const matchSearch = item.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIdx = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const handleDelete = (id: string) => {
    if (!confirm('ต้องการลบ White Label นี้หรือไม่?')) return;
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('whiteLabelItems', JSON.stringify(updated));
  };

  const toggleStatus = (id: string) => {
    const updated = items.map(item =>
      item.id === id
        ? { ...item, status: item.status === 'active' ? 'inactive' as const : 'active' as const }
        : item
    );
    setItems(updated);
    localStorage.setItem('whiteLabelItems', JSON.stringify(updated));
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'professional': return 'bg-blue-50 text-blue-700';
      case 'enterprise': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!isLoaded) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">White Label Management</h1>
          <p className="text-gray-500 mt-1">Manage all white label configurations across the system</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Q</span>
            <input
              type="text"
              placeholder="Search brand name"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as 'all' | 'active' | 'inactive'); setCurrentPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Link
            href="/admin/white-label/create"
            className="px-5 py-2 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium whitespace-nowrap"
          >
            + Add White Label
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? 'No results found' : 'No white label configurations yet'}
                  </td>
                </tr>
              ) : (
                paged.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          {item.logo ? (
                            <Image src={item.logo} alt={item.brandName} width={24} height={24} className="object-contain" />
                          ) : (
                            <span className="text-gray-400 text-xs">Logo</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.brandName}</div>
                          <div className="text-xs text-gray-500">ID: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTierBadge(item.tier)}`}>
                        {item.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {item.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/demo/${item.id}`}
                          className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Preview"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/white-label/${item.id}`}
                          className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => toggleStatus(item.id)}
                          className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                          title={item.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {startIdx} to {endIdx} of {filtered.length} results
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm rounded-lg ${
                      currentPage === page
                        ? 'bg-teal-700 text-white'
                        : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
