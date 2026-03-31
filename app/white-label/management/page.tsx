'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface WhiteLabelItem {
  id: string;
  brandName: string;
  logo: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export default function WhiteLabelManagementPage() {
  const [items, setItems] = useState<WhiteLabelItem[]>(() => {
    if (typeof window === 'undefined') return [];
    
    const saved = localStorage.getItem('whiteLabelItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse white label items:', e);
      }
    }
    
    // ข้อมูลตัวอย่าง
    const sampleData: WhiteLabelItem[] = [
      {
        id: '1',
        brandName: 'Brand A',
        logo: '/next.svg',
        createdAt: '2024-01-15',
        status: 'active',
      },
      {
        id: '2',
        brandName: 'Brand B',
        logo: '/vercel.svg',
        createdAt: '2024-02-10',
        status: 'active',
      },
      {
        id: '3',
        brandName: 'Brand C',
        logo: '/next.svg',
        createdAt: '2024-03-05',
        status: 'inactive',
      },
    ];
    localStorage.setItem('whiteLabelItems', JSON.stringify(sampleData));
    return sampleData;
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบ White Label นี้หรือไม่?')) {
      const updated = items.filter(item => item.id !== id);
      setItems(updated);
      localStorage.setItem('whiteLabelItems', JSON.stringify(updated));
    }
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">White Label Management</h1>
            <p className="text-gray-600 mt-2">จัดการ White Label Configuration ทั้งหมดในระบบ</p>
          </div>
          <Link
            href="/white-label/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            สร้าง White Label ใหม่
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="ค้นหาชื่อแบรนด์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600">
              ทั้งหมด {filteredItems.length} รายการ
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบข้อมูล</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'ไม่พบผลลัพธ์ที่ค้นหา' : 'ยังไม่มี White Label Configuration ในระบบ'}
            </p>
            {!searchTerm && (
              <Link
                href="/white-label/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                สร้าง White Label แรก
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <Link href={`/white-label/${item.id}`}>
                  <div className="p-6 cursor-pointer">
                    {/* Logo */}
                    <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center mb-4 relative">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.brandName}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="text-4xl text-gray-300">🏢</div>
                      )}
                    </div>

                    {/* Brand Name */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.brandName}
                    </h3>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.status === 'active' ? '🟢 Active' : '⚪ Inactive'}
                      </span>
                    </div>

                    {/* Created Date */}
                    <p className="text-sm text-gray-500">
                      สร้างเมื่อ: {new Date(item.createdAt).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                </Link>

                {/* Actions */}
                <div className="border-t border-gray-100 p-4 flex gap-2">
                  <Link
                    href={`/white-label/${item.id}`}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center text-sm font-medium"
                  >
                    แก้ไข
                  </Link>
                  <Link
                    href={`/demo/${item.id}`}
                    className="flex-1 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-center text-sm font-medium"
                  >
                    ดูตัวอย่าง
                  </Link>
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    {item.status === 'active' ? 'ปิด' : 'เปิด'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
