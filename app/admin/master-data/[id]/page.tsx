'use client';

import { useState, useEffect, startTransition } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { MasterData, MasterOption, defaultMasterData } from '@/types/master-data';

export default function MasterDataDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const mode = (searchParams.get('mode') || 'view') as 'view' | 'edit';

  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState<MasterData>({
    id: '',
    name: '',
    description: '',
    status: 'active',
    options: [],
    updatedAt: new Date().toISOString().split('T')[0],
    updatedBy: 'Admin User',
  });

  useEffect(() => {
    let allData = defaultMasterData;
    const saved = localStorage.getItem('masterData');
    if (saved) {
      try {
        allData = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse master data:', e);
      }
    }
    const found = allData.find(item => item.id === id);
    startTransition(() => {
      if (found) {
        setForm({ ...found, options: found.options || [] });
      }
      setIsLoaded(true);
    });
  }, [id]);

  const handleSave = () => {
    const saved = localStorage.getItem('masterData');
    const allData: MasterData[] = saved ? JSON.parse(saved) : defaultMasterData;
    const idx = allData.findIndex(item => item.id === id);
    const updated = { ...form, updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'Admin User' };

    if (idx >= 0) {
      allData[idx] = updated;
    }
    localStorage.setItem('masterData', JSON.stringify(allData));
    setForm(updated);
    setIsEditing(false);
    alert('บันทึกสำเร็จ');
  };

  const handleAddOption = () => {
    const newOption: MasterOption = {
      id: crypto.randomUUID().substring(0, 8),
      name: '',
      value: '',
    };
    setForm({ ...form, options: [...form.options, newOption] });
  };

  const handleRemoveOption = (optionId: string) => {
    setForm({ ...form, options: form.options.filter(o => o.id !== optionId) });
  };

  const handleOptionChange = (optionId: string, field: 'name' | 'value', val: string) => {
    setForm({
      ...form,
      options: form.options.map(o => o.id === optionId ? { ...o, [field]: val } : o),
    });
  };

  const modeLabel = isEditing ? 'Edit Master' : 'View Master';

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
      <div className="p-6 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Link href="/admin/master-data" className="text-teal-700 hover:underline">
            Master Management
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-600">{modeLabel}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{modeLabel}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isEditing ? 'Update the details for this master option set' : 'View the details for this master option set'}
            </p>
          </div>
          <Link
            href="/admin/master-data"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to List
          </Link>
        </div>

        {/* Master Information */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Master Information</h2>
              <p className="text-sm text-gray-500">
                {isEditing ? 'Update the details for this master option set' : 'Details of this master option set'}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              Last updated: {new Date(form.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} by {form.updatedBy}
            </span>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Master Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                placeholder="e.g. Severity Levels"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 resize-y"
                placeholder="Describe what this master data is used for"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                disabled={!isEditing}
                className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-600"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Master Options */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Master Options <span className="text-red-500">*</span>
              </h2>
              <p className="text-sm text-gray-500">Manage individual options for this master</p>
            </div>
            {isEditing && (
              <button
                onClick={handleAddOption}
                className="px-4 py-2 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium"
              >
                + Add Option
              </button>
            )}
          </div>

          <div className="p-6">
            {form.options.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">ยังไม่มี Option</p>
                {isEditing && (
                  <button
                    onClick={handleAddOption}
                    className="text-teal-700 hover:text-teal-800 text-sm font-medium"
                  >
                    + เพิ่ม Option แรก
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {form.options.map((option, idx) => (
                  <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Option Name
                        </label>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => handleOptionChange(option.id, 'name', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                          placeholder={`Option ${idx + 1}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Option Value
                        </label>
                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) => handleOptionChange(option.id, 'value', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                          placeholder={`option-${idx + 1}`}
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleRemoveOption(option.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="ลบ Option"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => { setIsEditing(false); router.push(`/admin/master-data/${id}?mode=view`); }}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium"
            >
              Edit Master
            </button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
