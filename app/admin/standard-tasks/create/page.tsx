'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import {
  StandardTask, TaskField, FieldType, TaskCategory,
  fieldTypeLabels, fieldTypeCategories, categoryLabels, defaultStandardTasks,
} from '@/types/standard-task';

function FieldConfigPanel({ field, onChange, onRemove, disabled }: {
  field: TaskField; onChange: (f: TaskField) => void; onRemove: () => void; disabled?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Field Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onChange({ ...field, label: e.target.value })}
            disabled={disabled}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
            placeholder="e.g. Oil Pressure Reading"
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">Field Type</label>
          <select
            value={field.type}
            onChange={(e) => onChange({ ...field, type: e.target.value as FieldType })}
            disabled={disabled}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-600"
          >
            {fieldTypeCategories.map(cat => (
              <optgroup key={cat.group} label={cat.group}>
                {cat.types.map(t => <option key={t} value={t}>{fieldTypeLabels[t]}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onChange({ ...field, required: e.target.checked })}
              disabled={disabled}
              className="h-4 w-4 text-teal-700 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Required</span>
          </label>
        </div>
        {!disabled && (
          <div className="md:col-span-3 flex items-end justify-end">
            <button onClick={onRemove} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove field">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Type-specific config */}
      {field.type === 'numeric' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
            <input type="text" value={field.unit || ''} onChange={(e) => onChange({ ...field, unit: e.target.value })} disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-600" placeholder="e.g. PSI, Hours, Volts" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Min Threshold</label>
            <input type="number" value={field.min ?? ''} onChange={(e) => onChange({ ...field, min: e.target.value ? Number(e.target.value) : undefined })} disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-600" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Max Threshold</label>
            <input type="number" value={field.max ?? ''} onChange={(e) => onChange({ ...field, max: e.target.value ? Number(e.target.value) : undefined })} disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-600" placeholder="Optional" />
          </div>
        </div>
      )}

      {field.type === 'single_select' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <label className="block text-xs font-medium text-gray-500 mb-1">Options (comma separated)</label>
          <input type="text" value={(field.options || []).join(', ')} onChange={(e) => onChange({ ...field, options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-600" placeholder="Good, Worn, Needs Sanding, Damaged" />
        </div>
      )}

      {field.type === 'photo' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <label className="block text-xs font-medium text-gray-500 mb-1">Max Photos (1-5)</label>
          <input type="number" min={1} max={5} value={field.maxPhotos ?? 3} onChange={(e) => onChange({ ...field, maxPhotos: Math.min(5, Math.max(1, Number(e.target.value))) })} disabled={disabled}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-600" />
        </div>
      )}
    </div>
  );
}

export default function CreateStandardTaskPage() {
  const router = useRouter();
  const [form, setForm] = useState<Omit<StandardTask, 'id' | 'updatedAt' | 'updatedBy'>>({
    name: '',
    description: '',
    category: 'cleaning',
    status: 'active',
    fields: [],
  });

  const handleAddField = () => {
    const newField: TaskField = {
      id: crypto.randomUUID().substring(0, 8),
      label: '',
      type: 'checkbox',
      required: false,
    };
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  const handleFieldChange = (fieldId: string, updated: TaskField) => {
    setForm({ ...form, fields: form.fields.map(f => f.id === fieldId ? updated : f) });
  };

  const handleRemoveField = (fieldId: string) => {
    setForm({ ...form, fields: form.fields.filter(f => f.id !== fieldId) });
  };

  const handleSave = () => {
    if (!form.name.trim()) { alert('Please enter a task name'); return; }
    if (form.fields.length === 0) { alert('Please add at least one field'); return; }

    const saved = localStorage.getItem('standardTasks');
    const allData: StandardTask[] = saved ? JSON.parse(saved) : defaultStandardTasks;
    const newId = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || crypto.randomUUID().substring(0, 8);

    allData.push({
      id: newId,
      ...form,
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: 'Admin User',
    });
    localStorage.setItem('standardTasks', JSON.stringify(allData));
    router.push('/admin/standard-tasks');
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Link href="/admin/standard-tasks" className="text-teal-700 hover:underline">Standard Tasks</Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-600">Add Task</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Standard Task</h1>
            <p className="text-gray-500 text-sm mt-1">Define a new composable task with custom input fields</p>
          </div>
          <Link href="/admin/standard-tasks" className="text-sm text-gray-600 hover:text-gray-900">← Back to List</Link>
        </div>

        {/* Task Information */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Task Information</h2>
            <p className="text-sm text-gray-500">Basic details about this standard task</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="e.g. Engine Oil Pressure Check" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TaskCategory })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500">
                    {(Object.keys(categoryLabels) as TaskCategory[]).map(c => (
                      <option key={c} value={c}>{categoryLabels[c]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y" placeholder="Describe what this task covers and when it should be performed" />
            </div>
          </div>
        </div>

        {/* Task Fields */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Task Fields <span className="text-red-500">*</span></h2>
              <p className="text-sm text-gray-500">Define what data the crew needs to input when completing this task</p>
            </div>
            <button onClick={handleAddField} className="px-4 py-2 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium">+ Add Field</button>
          </div>
          <div className="p-6">
            {form.fields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">No fields added yet</p>
                <button onClick={handleAddField} className="text-teal-700 hover:text-teal-800 text-sm font-medium">+ Add first field</button>
              </div>
            ) : (
              <div className="space-y-4">
                {form.fields.map((field, idx) => (
                  <div key={field.id} className="relative">
                    <span className="absolute -left-2 -top-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500">{idx + 1}</span>
                    <FieldConfigPanel field={field} onChange={(f) => handleFieldChange(field.id, f)} onRemove={() => handleRemoveField(field.id)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="px-6 py-2.5 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium">Create Task</button>
          <Link href="/admin/standard-tasks" className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors font-medium">Cancel</Link>
        </div>
      </div>
    </AdminLayout>
  );
}