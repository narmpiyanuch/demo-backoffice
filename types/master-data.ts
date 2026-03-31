export interface MasterOption {
  id: string;
  name: string;
  value: string;
}

export interface MasterData {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  options: MasterOption[];
  updatedAt: string;
  updatedBy: string;
}

// version สำหรับ force reset localStorage เมื่อ schema เปลี่ยน
export const MASTER_DATA_VERSION = 2;

export interface ModuleMasterData extends MasterData {
  module: string; // feature group ที่ data นี้สังกัด
}

export const MODULE_MASTER_DATA_VERSION = 1;

export const moduleOptions = [
  'Dashboard & Analytics',
  'User Management',
  'Inventory',
  'Branding & Theme',
  'Documents & Workflow',
  'Integration & Security',
  'Reports & Support',
];

export const defaultModuleMasterData: ModuleMasterData[] = [
  {
    id: 'dashboard-widget-type',
    name: 'Dashboard Widget Type',
    description: 'Types of widgets available on the dashboard',
    module: 'Dashboard & Analytics',
    status: 'active',
    updatedAt: '2024-12-28',
    updatedBy: 'Admin User',
    options: [
      { id: 'dw1', name: 'Bar Chart', value: 'bar-chart' },
      { id: 'dw2', name: 'Line Chart', value: 'line-chart' },
      { id: 'dw3', name: 'Pie Chart', value: 'pie-chart' },
      { id: 'dw4', name: 'KPI Card', value: 'kpi-card' },
      { id: 'dw5', name: 'Table', value: 'table' },
    ],
  },
  {
    id: 'user-permission-scope',
    name: 'Permission Scope',
    description: 'Scope levels for user permissions',
    module: 'User Management',
    status: 'active',
    updatedAt: '2024-12-25',
    updatedBy: 'Admin User',
    options: [
      { id: 'ps1', name: 'Global', value: 'global' },
      { id: 'ps2', name: 'Organization', value: 'organization' },
      { id: 'ps3', name: 'Department', value: 'department' },
      { id: 'ps4', name: 'Team', value: 'team' },
      { id: 'ps5', name: 'Personal', value: 'personal' },
    ],
  },
  {
    id: 'inventory-unit',
    name: 'Inventory Unit',
    description: 'Units of measurement for inventory items',
    module: 'Inventory',
    status: 'active',
    updatedAt: '2024-12-22',
    updatedBy: 'Admin User',
    options: [
      { id: 'iu1', name: 'Piece', value: 'piece' },
      { id: 'iu2', name: 'Liter', value: 'liter' },
      { id: 'iu3', name: 'Kilogram', value: 'kilogram' },
      { id: 'iu4', name: 'Meter', value: 'meter' },
      { id: 'iu5', name: 'Box', value: 'box' },
      { id: 'iu6', name: 'Set', value: 'set' },
    ],
  },
  {
    id: 'theme-font-family',
    name: 'Font Family',
    description: 'Available font families for branding customization',
    module: 'Branding & Theme',
    status: 'active',
    updatedAt: '2024-12-20',
    updatedBy: 'Admin User',
    options: [
      { id: 'ff1', name: 'System Default', value: 'system-ui' },
      { id: 'ff2', name: 'Inter', value: 'inter' },
      { id: 'ff3', name: 'Roboto', value: 'roboto' },
      { id: 'ff4', name: 'Open Sans', value: 'open-sans' },
      { id: 'ff5', name: 'Noto Sans Thai', value: 'noto-sans-thai' },
    ],
  },
  {
    id: 'document-category',
    name: 'Document Category',
    description: 'Categories for document classification',
    module: 'Documents & Workflow',
    status: 'active',
    updatedAt: '2024-12-18',
    updatedBy: 'Admin User',
    options: [
      { id: 'dc1', name: 'Policy', value: 'policy' },
      { id: 'dc2', name: 'Procedure', value: 'procedure' },
      { id: 'dc3', name: 'Template', value: 'template' },
      { id: 'dc4', name: 'Form', value: 'form' },
      { id: 'dc5', name: 'Manual', value: 'manual' },
    ],
  },
  {
    id: 'api-rate-limit-tier',
    name: 'API Rate Limit Tier',
    description: 'Rate limiting tiers for API access',
    module: 'Integration & Security',
    status: 'active',
    updatedAt: '2024-12-15',
    updatedBy: 'Admin User',
    options: [
      { id: 'rl1', name: 'Free (100/hr)', value: 'free' },
      { id: 'rl2', name: 'Standard (1,000/hr)', value: 'standard' },
      { id: 'rl3', name: 'Premium (10,000/hr)', value: 'premium' },
      { id: 'rl4', name: 'Unlimited', value: 'unlimited' },
    ],
  },
  {
    id: 'report-format',
    name: 'Report Export Format',
    description: 'Available export formats for reports',
    module: 'Reports & Support',
    status: 'active',
    updatedAt: '2024-12-12',
    updatedBy: 'Admin User',
    options: [
      { id: 'rf1', name: 'PDF', value: 'pdf' },
      { id: 'rf2', name: 'Excel (XLSX)', value: 'xlsx' },
      { id: 'rf3', name: 'CSV', value: 'csv' },
      { id: 'rf4', name: 'JSON', value: 'json' },
    ],
  },
  {
    id: 'workflow-status',
    name: 'Workflow Status',
    description: 'Status options for workflow automation steps',
    module: 'Documents & Workflow',
    status: 'active',
    updatedAt: '2024-12-10',
    updatedBy: 'Admin User',
    options: [
      { id: 'ws1', name: 'Pending', value: 'pending' },
      { id: 'ws2', name: 'In Review', value: 'in-review' },
      { id: 'ws3', name: 'Approved', value: 'approved' },
      { id: 'ws4', name: 'Rejected', value: 'rejected' },
      { id: 'ws5', name: 'Completed', value: 'completed' },
    ],
  },
];

export const defaultMasterData: MasterData[] = [
  {
    id: 'agency',
    name: 'Agency',
    description: 'รายชื่อหน่วยงานสำหรับเลือกตอนสร้าง Charter',
    status: 'active',
    updatedAt: '2024-12-28',
    updatedBy: 'Admin User',
    options: [
      { id: 'ag1', name: 'สำนักงานใหญ่', value: 'head-office' },
      { id: 'ag2', name: 'ฝ่ายพัฒนาธุรกิจ', value: 'business-dev' },
      { id: 'ag3', name: 'ฝ่ายเทคโนโลยีสารสนเทศ', value: 'it' },
      { id: 'ag4', name: 'ฝ่ายการตลาด', value: 'marketing' },
      { id: 'ag5', name: 'ฝ่ายทรัพยากรบุคคล', value: 'hr' },
      { id: 'ag6', name: 'ฝ่ายบัญชีและการเงิน', value: 'finance' },
      { id: 'ag7', name: 'ฝ่ายกฎหมาย', value: 'legal' },
    ],
  },
  {
    id: 'user-role',
    name: 'User Role',
    description: 'บทบาทผู้ใช้งานในระบบ',
    status: 'active',
    updatedAt: '2024-12-24',
    updatedBy: 'Admin User',
    options: [
      { id: 'ur1', name: 'Super Admin', value: 'super-admin' },
      { id: 'ur2', name: 'Admin', value: 'admin' },
      { id: 'ur3', name: 'Manager', value: 'manager' },
      { id: 'ur4', name: 'Supervisor', value: 'supervisor' },
      { id: 'ur5', name: 'Staff', value: 'staff' },
      { id: 'ur6', name: 'Viewer', value: 'viewer' },
    ],
  },
  {
    id: 'severity-level',
    name: 'Severity Level',
    description: 'ระดับความรุนแรงของปัญหาในระบบ',
    status: 'active',
    updatedAt: '2024-12-22',
    updatedBy: 'Admin User',
    options: [
      { id: 'sv1', name: 'Critical', value: 'critical' },
      { id: 'sv2', name: 'Major', value: 'major' },
      { id: 'sv3', name: 'Minor', value: 'minor' },
      { id: 'sv4', name: 'Trivial', value: 'trivial' },
    ],
  },
  {
    id: 'priority-level',
    name: 'Priority Level',
    description: 'ระดับความสำคัญของงาน',
    status: 'active',
    updatedAt: '2024-12-18',
    updatedBy: 'Admin User',
    options: [
      { id: 'pl1', name: 'Urgent', value: 'urgent' },
      { id: 'pl2', name: 'High', value: 'high' },
      { id: 'pl3', name: 'Medium', value: 'medium' },
      { id: 'pl4', name: 'Low', value: 'low' },
      { id: 'pl5', name: 'None', value: 'none' },
    ],
  },
  {
    id: 'charter-status',
    name: 'Charter Status',
    description: 'สถานะของ Charter ในระบบ',
    status: 'active',
    updatedAt: '2024-12-16',
    updatedBy: 'Admin User',
    options: [
      { id: 'cs1', name: 'Draft', value: 'draft' },
      { id: 'cs2', name: 'Pending Review', value: 'pending-review' },
      { id: 'cs3', name: 'In Progress', value: 'in-progress' },
      { id: 'cs4', name: 'Approved', value: 'approved' },
      { id: 'cs5', name: 'Rejected', value: 'rejected' },
      { id: 'cs6', name: 'Completed', value: 'completed' },
      { id: 'cs7', name: 'Cancelled', value: 'cancelled' },
    ],
  },
  {
    id: 'asset-type',
    name: 'Asset Type',
    description: 'ประเภทสินทรัพย์ในองค์กร',
    status: 'active',
    updatedAt: '2024-12-15',
    updatedBy: 'Admin User',
    options: [
      { id: 'at1', name: 'คอมพิวเตอร์/โน้ตบุ๊ก', value: 'computer' },
      { id: 'at2', name: 'อุปกรณ์เครือข่าย', value: 'network-equipment' },
      { id: 'at3', name: 'เฟอร์นิเจอร์สำนักงาน', value: 'furniture' },
      { id: 'at4', name: 'ยานพาหนะ', value: 'vehicle' },
      { id: 'at5', name: 'ซอฟต์แวร์ลิขสิทธิ์', value: 'software-license' },
      { id: 'at6', name: 'อุปกรณ์สื่อสาร', value: 'communication' },
    ],
  },
  {
    id: 'location-name',
    name: 'Location Name',
    description: 'สถานที่ตั้งสำนักงานและสาขา',
    status: 'active',
    updatedAt: '2024-12-12',
    updatedBy: 'Admin User',
    options: [
      { id: 'ln1', name: 'สำนักงานใหญ่ กรุงเทพฯ', value: 'hq-bangkok' },
      { id: 'ln2', name: 'สาขาเชียงใหม่', value: 'branch-chiang-mai' },
      { id: 'ln3', name: 'สาขาภูเก็ต', value: 'branch-phuket' },
      { id: 'ln4', name: 'สาขาขอนแก่น', value: 'branch-khon-kaen' },
      { id: 'ln5', name: 'สาขาชลบุรี', value: 'branch-chonburi' },
    ],
  },
  {
    id: 'document-type',
    name: 'Document Type',
    description: 'ประเภทเอกสารในระบบ',
    status: 'active',
    updatedAt: '2024-12-10',
    updatedBy: 'Admin User',
    options: [
      { id: 'dt1', name: 'สัญญา', value: 'contract' },
      { id: 'dt2', name: 'ใบเสนอราคา', value: 'quotation' },
      { id: 'dt3', name: 'ใบแจ้งหนี้', value: 'invoice' },
      { id: 'dt4', name: 'ใบเสร็จรับเงิน', value: 'receipt' },
      { id: 'dt5', name: 'รายงาน', value: 'report' },
      { id: 'dt6', name: 'บันทึกข้อความ', value: 'memo' },
      { id: 'dt7', name: 'คำสั่ง', value: 'order' },
    ],
  },
  {
    id: 'department',
    name: 'Department',
    description: 'แผนกในองค์กร',
    status: 'active',
    updatedAt: '2024-12-08',
    updatedBy: 'Admin User',
    options: [
      { id: 'dep1', name: 'ฝ่ายบริหาร', value: 'management' },
      { id: 'dep2', name: 'ฝ่ายการเงิน', value: 'finance' },
      { id: 'dep3', name: 'ฝ่ายทรัพยากรบุคคล', value: 'hr' },
      { id: 'dep4', name: 'ฝ่ายไอที', value: 'it' },
      { id: 'dep5', name: 'ฝ่ายการตลาด', value: 'marketing' },
      { id: 'dep6', name: 'ฝ่ายขาย', value: 'sales' },
      { id: 'dep7', name: 'ฝ่ายปฏิบัติการ', value: 'operations' },
      { id: 'dep8', name: 'ฝ่ายจัดซื้อ', value: 'procurement' },
    ],
  },
  {
    id: 'payment-method',
    name: 'Payment Method',
    description: 'วิธีการชำระเงิน',
    status: 'active',
    updatedAt: '2024-12-05',
    updatedBy: 'Admin User',
    options: [
      { id: 'pm1', name: 'โอนเงินผ่านธนาคาร', value: 'bank-transfer' },
      { id: 'pm2', name: 'บัตรเครดิต', value: 'credit-card' },
      { id: 'pm3', name: 'เงินสด', value: 'cash' },
      { id: 'pm4', name: 'เช็ค', value: 'cheque' },
      { id: 'pm5', name: 'PromptPay', value: 'promptpay' },
    ],
  },
];
