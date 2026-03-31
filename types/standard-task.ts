export type FieldType =
  | 'checkbox'
  | 'short_text'
  | 'long_text'
  | 'numeric'
  | 'pass_fail'
  | 'single_select'
  | 'photo'
  | 'file'
  | 'date_time'
  | 'inventory_link';

export const fieldTypeLabels: Record<FieldType, string> = {
  checkbox: 'Checkbox (Done/Not Done)',
  short_text: 'Short Text',
  long_text: 'Long Text (Paragraph)',
  numeric: 'Numeric (Measurement)',
  pass_fail: 'Pass/Fail (Inspection)',
  single_select: 'Single Select (Dropdown)',
  photo: 'Photo/Image Upload',
  file: 'File Attachment',
  date_time: 'Date/Time Picker',
  inventory_link: 'Inventory Link',
};

export const fieldTypeCategories: { group: string; types: FieldType[] }[] = [
  { group: 'Basic Inputs', types: ['checkbox', 'short_text', 'long_text'] },
  { group: 'Measurements & Logic', types: ['numeric', 'pass_fail', 'single_select'] },
  { group: 'Media & Evidence', types: ['photo', 'file'] },
  { group: 'Advanced / Yacht Specific', types: ['date_time', 'inventory_link'] },
];

export interface TaskField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  // numeric specific
  unit?: string;
  min?: number;
  max?: number;
  // single_select specific
  options?: string[];
  // photo specific
  maxPhotos?: number;
}

export type TaskCategory = 'cleaning' | 'maintenance' | 'safety';

export const categoryLabels: Record<TaskCategory, string> = {
  cleaning: 'Cleaning',
  maintenance: 'Maintenance',
  safety: 'Safety',
};

export interface StandardTask {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  status: 'active' | 'inactive';
  fields: TaskField[];
  updatedAt: string;
  updatedBy: string;
}

export const STANDARD_TASK_VERSION = 2;

export const defaultStandardTasks: StandardTask[] = [
  {
    id: 'wash-main-deck',
    name: 'Wash Down Main Deck',
    description: 'Daily deck wash down procedure including all exterior surfaces',
    category: 'cleaning',
    status: 'active',
    fields: [
      { id: 'f1', label: 'Deck washed and dried', type: 'checkbox', required: true },
      { id: 'f2', label: 'Photo of deck after wash', type: 'photo', required: true, maxPhotos: 2 },
      { id: 'f3', label: 'Notes', type: 'short_text', required: false },
    ],
    updatedAt: '2025-12-01',
    updatedBy: 'Admin User',
  },
  {
    id: 'engine-oil-check',
    name: 'Engine Oil Pressure Check',
    description: 'Check and record oil pressure for port and starboard engines',
    category: 'maintenance',
    status: 'active',
    fields: [
      { id: 'f1', label: 'Port Engine Oil Pressure', type: 'numeric', required: true, unit: 'PSI', min: 30, max: 80 },
      { id: 'f2', label: 'Starboard Engine Oil Pressure', type: 'numeric', required: true, unit: 'PSI', min: 30, max: 80 },
      { id: 'f3', label: 'Oil filter serial number', type: 'short_text', required: false },
      { id: 'f4', label: 'Oil Filter Used', type: 'inventory_link', required: false },
    ],
    updatedAt: '2025-11-28',
    updatedBy: 'Admin User',
  },
  {
    id: 'fire-extinguisher-check',
    name: 'Fire Extinguisher Inspection',
    description: 'Monthly inspection of all fire extinguishers on board',
    category: 'safety',
    status: 'active',
    fields: [
      { id: 'f1', label: 'Gauge Check', type: 'pass_fail', required: true },
      { id: 'f2', label: 'Seal Intact', type: 'pass_fail', required: true },
      { id: 'f3', label: 'Expiry Date', type: 'date_time', required: true },
      { id: 'f4', label: 'Photo of gauge', type: 'photo', required: true, maxPhotos: 1 },
      { id: 'f5', label: 'Condition notes', type: 'long_text', required: false },
    ],
    updatedAt: '2025-11-20',
    updatedBy: 'Admin User',
  },
  {
    id: 'teak-deck-inspection',
    name: 'Teak Deck Condition Report',
    description: 'Weekly inspection of teak deck surfaces and seams',
    category: 'maintenance',
    status: 'active',
    fields: [
      { id: 'f1', label: 'Overall Teak Condition', type: 'single_select', required: true, options: ['Good', 'Worn', 'Needs Sanding', 'Damaged'] },
      { id: 'f2', label: 'Seam condition', type: 'single_select', required: true, options: ['Intact', 'Minor gaps', 'Needs recaulking'] },
      { id: 'f3', label: 'Photos of any damage', type: 'photo', required: false, maxPhotos: 5 },
      { id: 'f4', label: 'Detailed observations', type: 'long_text', required: false },
    ],
    updatedAt: '2025-11-15',
    updatedBy: 'Admin User',
  },
  {
    id: 'generator-hours-log',
    name: 'Generator Hours Log',
    description: 'Daily recording of generator running hours and status',
    category: 'maintenance',
    status: 'active',
    fields: [
      { id: 'f1', label: 'Generator 1 Hours', type: 'numeric', required: true, unit: 'Hours' },
      { id: 'f2', label: 'Generator 2 Hours', type: 'numeric', required: true, unit: 'Hours' },
      { id: 'f3', label: 'Voltage Output', type: 'numeric', required: false, unit: 'Volts', min: 220, max: 240 },
      { id: 'f4', label: 'Abnormal noise or vibration', type: 'pass_fail', required: true },
    ],
    updatedAt: '2025-11-10',
    updatedBy: 'Admin User',
  },
  {
    id: 'cabin-deep-clean',
    name: 'Guest Cabin Deep Clean',
    description: 'Thorough cleaning checklist for guest cabins',
    category: 'cleaning',
    status: 'active',
    fields: [
      { id: 'f1', label: 'Bed linen changed', type: 'checkbox', required: true },
      { id: 'f2', label: 'Bathroom sanitized', type: 'checkbox', required: true },
      { id: 'f3', label: 'Carpet vacuumed', type: 'checkbox', required: true },
      { id: 'f4', label: 'Mini-bar restocked', type: 'checkbox', required: true },
      { id: 'f5', label: 'Photo of finished cabin', type: 'photo', required: true, maxPhotos: 3 },
      { id: 'f6', label: 'Maintenance issues found', type: 'long_text', required: false },
    ],
    updatedAt: '2025-11-05',
    updatedBy: 'Admin User',
  },
  {
    id: 'flare-pack-check',
    name: 'Flare Pack Expiry Check',
    description: 'Quarterly check of all pyrotechnic flare packs',
    category: 'safety',
    status: 'inactive',
    fields: [
      { id: 'f1', label: 'Flare Pack Expiry Date', type: 'date_time', required: true },
      { id: 'f2', label: 'Condition', type: 'pass_fail', required: true },
      { id: 'f3', label: 'Storage location photo', type: 'photo', required: true, maxPhotos: 1 },
      { id: 'f4', label: 'Inspection report', type: 'file', required: false },
    ],
    updatedAt: '2025-10-28',
    updatedBy: 'Admin User',
  },
  {
    id: 'hull-inspection',
    name: 'Hull Condition Inspection',
    description: 'Underwater hull inspection and antifouling condition report',
    category: 'maintenance',
    status: 'active',
    fields: [
      { id: 'f1', label: 'Hull condition', type: 'single_select', required: true, options: ['Clean', 'Light fouling', 'Heavy fouling', 'Damage found'] },
      { id: 'f2', label: 'Describe condition of hull scratches', type: 'long_text', required: false },
      { id: 'f3', label: 'Underwater photos', type: 'photo', required: true, maxPhotos: 5 },
      { id: 'f4', label: 'Diver report attachment', type: 'file', required: false },
    ],
    updatedAt: '2025-10-20',
    updatedBy: 'Admin User',
  },
];
