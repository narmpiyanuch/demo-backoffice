'use client';

import { useState, useEffect, startTransition } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import {
  Role,
  PermissionAction,
  defaultRoles,
  permissionModules,
  allActions,
  buildDefaultPermissions,
  getAvailableModules,
} from '@/types/role-permission';
import { useWhiteLabelConfig } from '@/hooks/useWhiteLabelConfig';

export default function RoleDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const mode = (searchParams.get('mode') || 'view') as 'view' | 'edit';
  const whiteLabelConfig = useWhiteLabelConfig();
  const availableModules = getAvailableModules(
    whiteLabelConfig?.enabledFeatures as unknown as Record<string, boolean>
  );
  const availableKeys = new Set(availableModules.map(m => m.key));

  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState<Role>({
    id: '', name: '',
    permissions: buildDefaultPermissions(),
    updatedAt: new Date().toISOString().split('T')[0],
    updatedBy: 'Admin User',
  });

  useEffect(() => {
    let allData = defaultRoles;
    const saved = localStorage.getItem('rolePermissionData');
    if (saved) {
      try { allData = JSON.parse(saved); } catch (e) { console.error('Failed to parse roles:', e); }
    }
    const found = allData.find(item => item.id === id);
    startTransition(() => {
      if (found) setForm({ ...found });
      setIsLoaded(true);
    });
  }, [id]);

  const toggleAction = (moduleKey: string, action: PermissionAction) => {
    if (!isEditing) return;
    setForm({
      ...form,
      permissions: form.permissions.map(p => {
        if (p.module !== moduleKey) return p;
        const has = p.actions.includes(action);
        return { ...p, actions: has ? p.actions.filter(a => a !== action) : [...p.actions, action] };
      }),
    });
  };

  const toggleAllModule = (moduleKey: string) => {
    if (!isEditing) return;
    setForm({
      ...form,
      permissions: form.permissions.map(p => {
        if (p.module !== moduleKey) return p;
        const ac = allActions.every(a => p.actions.includes(a));
        return { ...p, actions: ac ? [] : [...allActions] };
      }),
    });
  };

  const toggleAllAction = (action: PermissionAction) => {
    if (!isEditing) return;
    const ac = form.permissions.every(p => p.actions.includes(action));
    setForm({
      ...form,
      permissions: form.permissions.map(p => ({
        ...p,
        actions: ac ? p.actions.filter(a => a !== action) : [...new Set([...p.actions, action])],
      })),
    });
  };

  const selectAll = () => {
    if (!isEditing) return;
    const ag = form.permissions.every(p => allActions.every(a => p.actions.includes(a)));
    setForm({
      ...form,
      permissions: form.permissions.map(p => ({ ...p, actions: ag ? [] : [...allActions] })),
    });
  };

  const handleSave = () => {
    const saved = localStorage.getItem('rolePermissionData');
    const allData: Role[] = saved ? JSON.parse(saved) : defaultRoles;
    const idx = allData.findIndex(item => item.id === id);
    const updated = { ...form, updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'Admin User' };
    if (idx >= 0) allData[idx] = updated;
    localStorage.setItem('rolePermissionData', JSON.stringify(allData));
    setForm(updated);
    setIsEditing(false);
    alert('Saved successfully');
  };

  const modeLabel = isEditing ? 'Edit Permission' : 'View Permission';
  const allGranted = form.permissions.every(p => allActions.every(a => p.actions.includes(a)));

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
      <div className="p-6 max-w-5xl">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Link href="/admin/roles" className="text-teal-700 hover:underline">Role & Permission</Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-600">{form.name}</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.name} — {modeLabel}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isEditing ? 'Update which modules this role can access' : 'Permissions granted to this role'}
            </p>
          </div>
          <Link href="/admin/roles" className="text-sm text-gray-600 hover:text-gray-900">← Back to List</Link>
        </div>

        {/* Permission Matrix */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Permission Matrix</h2>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(form.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} by {form.updatedBy}
              </p>
            </div>
            {isEditing && (
              <button onClick={selectAll} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                {allGranted ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-64">Menu / Permission</th>
                  {allActions.map(action => (
                    <th key={action} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                      {isEditing ? (
                        <button onClick={() => toggleAllAction(action)} className="hover:text-teal-700 transition-colors">{action}</button>
                      ) : action}
                    </th>
                  ))}
                  {isEditing && <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">All</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {form.permissions.map((perm) => {
                  const moduleDef = permissionModules.find(m => m.key === perm.module);
                  const isLocked = !availableKeys.has(perm.module);
                  const moduleAllChecked = allActions.every(a => perm.actions.includes(a));
                  return (
                    <tr key={perm.module} className={`transition-colors ${isLocked ? 'opacity-40 bg-gray-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {moduleDef?.label ?? perm.module}
                          {isLocked && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" /></svg>
                              Upgrade
                            </span>
                          )}
                        </div>
                      </td>
                      {allActions.map(action => (
                        <td key={action} className="px-4 py-3 text-center">
                          {isEditing && !isLocked ? (
                            <input type="checkbox" checked={perm.actions.includes(action)} onChange={() => toggleAction(perm.module, action)} className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-500 cursor-pointer" />
                          ) : (
                            <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs ${
                              !isLocked && perm.actions.includes(action) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {!isLocked && perm.actions.includes(action) ? '✓' : '—'}
                            </span>
                          )}
                        </td>
                      ))}
                      {isEditing && (
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" checked={!isLocked && moduleAllChecked} onChange={() => !isLocked && toggleAllModule(perm.module)} disabled={isLocked} className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-500 cursor-pointer disabled:cursor-not-allowed" />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="px-6 py-2.5 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium">Save Changes</button>
              <button onClick={() => { setIsEditing(false); router.push(`/admin/roles/${id}?mode=view`); }} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors font-medium">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium">Edit Permission</button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
