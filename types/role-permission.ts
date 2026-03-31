export type PermissionAction = 'view' | 'create' | 'edit';

export interface ModulePermission {
  module: string;
  actions: PermissionAction[];
}

export interface PermissionModuleDefinition {
  key: string;
  label: string;
  requiredFeature?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: ModulePermission[];
  updatedAt: string;
  updatedBy: string;
}

export const ROLE_PERMISSION_VERSION = 8;

export const permissionModules: PermissionModuleDefinition[] = [
  { key: 'home', label: 'Home', requiredFeature: 'dashboardOverview' },
  { key: 'home-itinerary', label: 'Home (Itinerary)' },
  { key: 'voyage', label: 'Voyage' },
  { key: 'task', label: 'Task', requiredFeature: 'workflowAutomation' },
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'itinerary-steward', label: 'Itinerary (Steward)' },
  { key: 'meals', label: 'Meals' },
  { key: 'safety', label: 'Safety' },
  { key: 'pms-housekeeping', label: 'PMS (Housekeeping)', requiredFeature: 'manageRestock' },
  { key: 'pms-engineer', label: 'PMS (Engineer)', requiredFeature: 'manageRestock' },
  { key: 'report', label: 'Report' },
  { key: 'profile', label: 'Profile' },
];

export const allActions: PermissionAction[] = ['view', 'create', 'edit'];

export function getAvailableModules(
  enabledFeatures?: Record<string, boolean>
): PermissionModuleDefinition[] {
  if (!enabledFeatures) return permissionModules;
  return permissionModules.filter(mod => {
    if (!mod.requiredFeature) return true;
    return enabledFeatures[mod.requiredFeature] === true;
  });
}

export function buildDefaultPermissions(
  presets?: Record<string, PermissionAction[]>
): ModulePermission[] {
  return permissionModules.map(mod => ({
    module: mod.key,
    actions: presets?.[mod.key] ?? [],
  }));
}

const all: PermissionAction[] = ['view', 'create', 'edit'];

export const defaultRoles: Role[] = [
  {
    id: 'captain',
    name: 'Captain',
    updatedAt: '2024-12-28',
    updatedBy: 'System',
    permissions: buildDefaultPermissions({
      'home': [...all], 'voyage': [...all], 'task': [...all],
      'itinerary': [...all], 'profile': [...all],
    }),
  },
  {
    id: 'passenger',
    name: 'Passenger',
    updatedAt: '2024-12-26',
    updatedBy: 'System',
    permissions: buildDefaultPermissions({
      'home-itinerary': ['view'], 'meals': ['view'],
      'safety': ['view'], 'profile': ['view', 'edit'],
    }),
  },
  {
    id: 'steward',
    name: 'Steward',
    updatedAt: '2024-12-24',
    updatedBy: 'System',
    permissions: buildDefaultPermissions({
      'itinerary-steward': [...all], 'meals': ['view', 'create', 'edit'],
      'pms-housekeeping': ['view', 'create', 'edit'], 'profile': ['view', 'edit'],
    }),
  },
  {
    id: 'chef',
    name: 'Chef',
    updatedAt: '2024-12-22',
    updatedBy: 'System',
    permissions: buildDefaultPermissions({
      'itinerary': ['view'], 'meals': ['view', 'create', 'edit'],
      'profile': ['view', 'edit'],
    }),
  },
  {
    id: 'engineer',
    name: 'Engineer',
    updatedAt: '2024-12-20',
    updatedBy: 'System',
    permissions: buildDefaultPermissions({
      'pms-engineer': ['view', 'create', 'edit'], 'profile': ['view', 'edit'],
    }),
  },
  {
    id: 'owner',
    name: 'Owner',
    updatedAt: '2024-12-18',
    updatedBy: 'System',
    permissions: buildDefaultPermissions({
      'report': [...all], 'profile': ['view', 'edit'],
    }),
  },
];
