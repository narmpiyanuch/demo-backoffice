export interface WhiteLabelConfig {
  // Basic Info
  brandName: string;
  tagline: string;
  logo: {
    light: string;
    dark: string;
  };
  favicon: string;
  
  // Customer Info
  customer: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    taxId?: string;
  };
  
  // Subscription Info
  subscription: {
    plan: 'basic' | 'professional' | 'enterprise';
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive' | 'suspended' | 'expired';
    autoRenew: boolean;
    billingCycle: 'monthly' | 'yearly';
  };
  
  // Technical Config
  domain: {
    subdomain: string; // customer.yourdomain.com
    customDomain?: string; // customer.com
    sslEnabled: boolean;
  };
  
  // Design Config
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  theme: {
    borderRadius: string;
    fontFamily: string;
  };
  
  // Contact Info (for customer's end users)
  contact: {
    email: string;
    phone: string;
    website: string;
    supportEmail?: string;
    supportPhone?: string;
  };
  
  // Features & Limits
  features: {
    showPoweredBy: boolean;
    customFooter: string;
    maxUsers: number;
    maxStorage: number; // in GB
    apiCallsPerMonth: number;
    customReports: boolean;
    whiteLabel: boolean;
    ssoEnabled: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
  };
  
  // System Config
  tier: 'basic' | 'professional' | 'enterprise';
  enabledFeatures: {
    dashboardOverview: boolean;
    advancedAnalytics: boolean;
    realtimeMonitoring: boolean;
    basicUserManagement: boolean;
    customRolesPermissions: boolean;
    userApiAccess: boolean;
    viewInventory: boolean;
    manageRestock: boolean;
    inventoryForecasting: boolean;
    customBranding: boolean;
    advancedTheme: boolean;
    multiLanguage: boolean;
    whiteLabel: boolean;
    documentManagement: boolean;
    workflowAutomation: boolean;
    auditLog: boolean;
    dataExport: boolean;
    apiAccess: boolean;
    ssoIntegration: boolean;
    advancedSecurity: boolean;
    analytics: boolean;
    customReports: boolean;
    prioritySupport: boolean;
    dedicatedSupport: boolean;
  };
  
  // Vessels
  vessels: {
    id: string;
    name: string;
    type?: string;
  }[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string; // admin user who created this config
  notes?: string; // internal notes
}

export const tierFeatures = {
  basic: {
    name: 'Basic',
    price: '฿999/เดือน',
    features: [
      'dashboardOverview', 'basicUserManagement', 'viewInventory',
      'customBranding', 'advancedTheme',
    ],
    description: 'เหมาะสำหรับธุรกิจขนาดเล็ก',
    featureCount: 5,
    limits: {
      maxUsers: 10,
      maxStorage: 5,
      apiCallsPerMonth: 1000,
      maxVessels: 3,
    },
  },
  professional: {
    name: 'Professional',
    price: '฿2,999/เดือน',
    features: [
      'dashboardOverview', 'advancedAnalytics',
      'basicUserManagement', 'customRolesPermissions',
      'viewInventory', 'manageRestock',
      'customBranding', 'advancedTheme', 'multiLanguage',
      'apiAccess', 'analytics', 'customReports',
      'documentManagement', 'workflowAutomation',
    ],
    description: 'เหมาะสำหรับธุรกิจขนาดกลาง',
    featureCount: 14,
    limits: {
      maxUsers: 50,
      maxStorage: 25,
      apiCallsPerMonth: 10000,
      maxVessels: 10,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 'ติดต่อเรา',
    features: [
      'dashboardOverview', 'advancedAnalytics', 'realtimeMonitoring',
      'basicUserManagement', 'customRolesPermissions', 'userApiAccess',
      'viewInventory', 'manageRestock', 'inventoryForecasting',
      'customBranding', 'advancedTheme', 'multiLanguage',
      'apiAccess', 'prioritySupport', 'whiteLabel',
      'analytics', 'customReports', 'ssoIntegration', 'advancedSecurity',
      'documentManagement', 'workflowAutomation',
      'auditLog', 'dataExport', 'dedicatedSupport',
    ],
    description: 'เหมาะสำหรับองค์กรขนาดใหญ่',
    featureCount: 24,
    limits: {
      maxUsers: -1,
      maxStorage: -1,
      apiCallsPerMonth: -1,
      maxVessels: -1,
    },
  },
};

// กลุ่มของ features พร้อม tier ขั้นต่ำที่ต้องการ
export const featureGroups: {
  group: string;
  features: { key: string; label: string; minTier: 'basic' | 'professional' | 'enterprise' }[];
}[] = [
  {
    group: 'Dashboard & Analytics',
    features: [
      { key: 'dashboardOverview', label: 'Dashboard Overview', minTier: 'basic' },
      { key: 'advancedAnalytics', label: 'Advanced Analytics', minTier: 'professional' },
      { key: 'realtimeMonitoring', label: 'Realtime Monitoring', minTier: 'enterprise' },
    ],
  },
  {
    group: 'User Management',
    features: [
      { key: 'basicUserManagement', label: 'Basic User Management', minTier: 'basic' },
      { key: 'customRolesPermissions', label: 'Custom Roles & Permissions', minTier: 'professional' },
      { key: 'userApiAccess', label: 'User API Access', minTier: 'enterprise' },
    ],
  },
  {
    group: 'Inventory',
    features: [
      { key: 'viewInventory', label: 'View Inventory', minTier: 'basic' },
      { key: 'manageRestock', label: 'Manage & Restock', minTier: 'professional' },
      { key: 'inventoryForecasting', label: 'Inventory Forecasting', minTier: 'enterprise' },
    ],
  },
  {
    group: 'Branding & Theme',
    features: [
      { key: 'customBranding', label: 'Custom Branding & Logo', minTier: 'basic' },
      { key: 'advancedTheme', label: 'Advanced Theme Customization', minTier: 'basic' },
      { key: 'multiLanguage', label: 'Multi-Language Support', minTier: 'professional' },
      { key: 'whiteLabel', label: 'Full White Label (Hide System Brand)', minTier: 'enterprise' },
    ],
  },
  {
    group: 'Documents & Workflow',
    features: [
      { key: 'documentManagement', label: 'Document Management', minTier: 'professional' },
      { key: 'workflowAutomation', label: 'Workflow Automation', minTier: 'professional' },
      { key: 'auditLog', label: 'Audit Log', minTier: 'enterprise' },
      { key: 'dataExport', label: 'Data Export & Backup', minTier: 'enterprise' },
    ],
  },
  {
    group: 'Integration & Security',
    features: [
      { key: 'apiAccess', label: 'API Access', minTier: 'professional' },
      { key: 'ssoIntegration', label: 'Single Sign-On (SSO)', minTier: 'enterprise' },
      { key: 'advancedSecurity', label: 'Advanced Security', minTier: 'enterprise' },
    ],
  },
  {
    group: 'Reports & Support',
    features: [
      { key: 'analytics', label: 'Basic Reports & Analytics', minTier: 'professional' },
      { key: 'customReports', label: 'Custom Reports Builder', minTier: 'professional' },
      { key: 'prioritySupport', label: 'Priority Support', minTier: 'enterprise' },
      { key: 'dedicatedSupport', label: 'Dedicated Account Manager', minTier: 'enterprise' },
    ],
  },
];

export const tierBadgeLabel: Record<string, string> = {
  basic: 'Starter',
  professional: 'Pro',
  enterprise: 'Enterprise',
};

export const featureLabels: Record<string, string> = {
  dashboardOverview: 'Dashboard Overview',
  advancedAnalytics: 'Advanced Analytics',
  realtimeMonitoring: 'Realtime Monitoring',
  basicUserManagement: 'Basic User Management',
  customRolesPermissions: 'Custom Roles & Permissions',
  userApiAccess: 'User API Access',
  viewInventory: 'View Inventory',
  manageRestock: 'Manage & Restock',
  inventoryForecasting: 'Inventory Forecasting',
  customBranding: 'Custom Branding & Logo',
  advancedTheme: 'Advanced Theme Customization',
  multiLanguage: 'Multi-Language Support',
  whiteLabel: 'Full White Label',
  documentManagement: 'Document Management',
  workflowAutomation: 'Workflow Automation',
  auditLog: 'Audit Log',
  dataExport: 'Data Export & Backup',
  apiAccess: 'API Access',
  ssoIntegration: 'Single Sign-On (SSO)',
  advancedSecurity: 'Advanced Security',
  analytics: 'Basic Reports & Analytics',
  customReports: 'Custom Reports Builder',
  prioritySupport: 'Priority Support',
  dedicatedSupport: 'Dedicated Account Manager',
};

export const defaultWhiteLabelConfig: WhiteLabelConfig = {
  brandName: 'New Customer',
  tagline: 'Enterprise Solutions Platform',
  logo: {
    light: '',
    dark: '',
  },
  favicon: '/favicon.ico',
  
  customer: {
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
  },
  
  subscription: {
    plan: 'basic',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    status: 'active',
    autoRenew: true,
    billingCycle: 'monthly',
  },
  
  domain: {
    subdomain: '',
    customDomain: '',
    sslEnabled: true,
  },
  
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#10b981',
    background: '#ffffff',
    text: '#1f2937',
  },
  theme: {
    borderRadius: '0.5rem',
    fontFamily: 'system-ui, sans-serif',
  },
  contact: {
    email: '',
    phone: '',
    website: '',
    supportEmail: '',
    supportPhone: '',
  },
  features: {
    showPoweredBy: true,
    customFooter: '',
    maxUsers: 10,
    maxStorage: 5,
    apiCallsPerMonth: 1000,
    customReports: false,
    whiteLabel: false,
    ssoEnabled: false,
    backupFrequency: 'weekly',
  },
  tier: 'basic',
  enabledFeatures: {
    dashboardOverview: true,
    advancedAnalytics: false,
    realtimeMonitoring: false,
    basicUserManagement: true,
    customRolesPermissions: false,
    userApiAccess: false,
    viewInventory: true,
    manageRestock: false,
    inventoryForecasting: false,
    customBranding: true,
    advancedTheme: true,
    multiLanguage: false,
    whiteLabel: false,
    documentManagement: false,
    workflowAutomation: false,
    auditLog: false,
    dataExport: false,
    apiAccess: false,
    ssoIntegration: false,
    advancedSecurity: false,
    analytics: false,
    customReports: false,
    prioritySupport: false,
    dedicatedSupport: false,
  },
  
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'admin',
  notes: '',
  vessels: [],
};
