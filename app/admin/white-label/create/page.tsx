'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import ColorPicker from '@/components/ColorPicker';
import { WhiteLabelConfig, defaultWhiteLabelConfig, tierFeatures, featureGroups, tierBadgeLabel } from '@/types/white-label';

type TabId = 'branding' | 'colors' | 'content' | 'features';

const tabs: { id: TabId; label: string }[] = [
  { id: 'branding', label: 'Branding' },
  { id: 'colors', label: 'Colors & Theme' },
  { id: 'content', label: 'Content' },
  { id: 'features', label: 'Features & Pricing' },
];

export default function CreateWhiteLabelPage() {
  const router = useRouter();
  const [config, setConfig] = useState<WhiteLabelConfig>(defaultWhiteLabelConfig);
  const [activeTab, setActiveTab] = useState<TabId>('branding');

  const currentTier = config.tier && tierFeatures[config.tier] ? config.tier : 'basic';

  const updateConfig = (updates: Partial<WhiteLabelConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleTierChange = (newTier: 'basic' | 'professional' | 'enterprise') => {
    const tierAllowedFeatures = tierFeatures[newTier].features;
    const updatedEnabledFeatures = { ...config.enabledFeatures };
    Object.keys(updatedEnabledFeatures).forEach((feature) => {
      updatedEnabledFeatures[feature as keyof typeof updatedEnabledFeatures] =
        tierAllowedFeatures.includes(feature);
    });
    updateConfig({ tier: newTier, subscription: { ...config.subscription, plan: newTier }, enabledFeatures: updatedEnabledFeatures });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      updateConfig({ logo: { light: base64, dark: base64 } });
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/x-icon', 'image/png', 'image/vnd.microsoft.icon'];
    if (!allowedTypes.includes(file.type)) {
      alert('กรุณาเลือกไฟล์ .ico หรือ .png เท่านั้น');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      updateConfig({ favicon: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const newId = Date.now().toString();
    const finalConfig = {
      ...config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`whiteLabel_${newId}`, JSON.stringify(finalConfig));
    const items = JSON.parse(localStorage.getItem('whiteLabelItems') || '[]');
    items.push({
      id: newId,
      brandName: config.brandName,
      logo: config.logo.light,
      createdAt: new Date().toISOString(),
      status: config.subscription.status,
      tier: config.tier,
    });
    localStorage.setItem('whiteLabelItems', JSON.stringify(items));
    alert('สร้าง White Label สำเร็จ!');
    router.push('/admin/white-label');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => router.push('/admin/white-label')}
              className="mt-1 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add White Label</h1>
              <p className="text-gray-500 text-sm mt-1">Create a new white label configuration for your client</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create White Label
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-700 text-teal-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Brand Identity</h2>
              <p className="text-sm text-gray-500 mb-6">Set your brand name and tagline</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Name</label>
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => updateConfig({ brandName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => updateConfig({ tagline: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enterprise Solutions Platform"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Logo & Favicon</h2>
              <p className="text-sm text-gray-500 mb-6">Upload your brand assets</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
                  <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
                    {config.logo.light ? (
                      <div className="relative w-24 h-24 mx-auto">
                        <Image src={config.logo.light} alt="Logo" fill className="object-contain" />
                      </div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 mx-auto text-gray-400 mb-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">SVG, PNG or JPG (max 2MB)</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Favicon</label>
                  <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors">
                    {config.favicon && config.favicon !== '/favicon.ico' ? (
                      <div className="relative w-8 h-8 shrink-0">
                        <Image src={config.favicon} alt="Favicon" width={32} height={32} className="object-contain" />
                      </div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-gray-400 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                    )}
                    <div>
                      <p className="text-sm text-gray-700">Upload favicon</p>
                      <p className="text-xs text-gray-400">ICO or PNG, 32x32px</p>
                    </div>
                    <input type="file" accept=".ico,.png,image/x-icon,image/png,image/vnd.microsoft.icon" onChange={handleFaviconUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Colors & Theme Tab */}
        {activeTab === 'colors' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Colors & Theme</h2>
            <p className="text-sm text-gray-500 mb-6">Customize your platform colors</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <ColorPicker label="Primary Color" value={config.colors.primary} onChange={(v) => updateConfig({ colors: { ...config.colors, primary: v } })} />
              <ColorPicker label="Secondary Color" value={config.colors.secondary} onChange={(v) => updateConfig({ colors: { ...config.colors, secondary: v } })} />
              <ColorPicker label="Accent Color" value={config.colors.accent} onChange={(v) => updateConfig({ colors: { ...config.colors, accent: v } })} />
              <ColorPicker label="Background Color" value={config.colors.background} onChange={(v) => updateConfig({ colors: { ...config.colors, background: v } })} />
              <ColorPicker label="Text Color" value={config.colors.text} onChange={(v) => updateConfig({ colors: { ...config.colors, text: v } })} />
            </div>
            <div className="mt-8 p-5 rounded-lg border border-gray-200 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Preview</p>
              <div className="flex flex-wrap gap-3">
                <button style={{ backgroundColor: config.colors.primary }} className="px-4 py-2 text-white rounded-lg text-sm">Primary</button>
                <button style={{ backgroundColor: config.colors.secondary }} className="px-4 py-2 text-white rounded-lg text-sm">Secondary</button>
                <button style={{ backgroundColor: config.colors.accent }} className="px-4 py-2 text-white rounded-lg text-sm">Accent</button>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Contact Information</h2>
              <p className="text-sm text-gray-500 mb-6">Contact details shown to end users</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={config.contact.email}
                    onChange={(e) => updateConfig({ contact: { ...config.contact, email: e.target.value } })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="support@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={config.contact.phone}
                    onChange={(e) => updateConfig({ contact: { ...config.contact, phone: e.target.value } })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="+66 2 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                  <input
                    type="url"
                    value={config.contact.website}
                    onChange={(e) => updateConfig({ contact: { ...config.contact, website: e.target.value } })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Footer & Branding</h2>
              <p className="text-sm text-gray-500 mb-6">Customize footer content</p>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <label htmlFor="showPoweredBy" className="text-sm font-medium text-gray-700">Show &quot;Powered by&quot; badge</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="showPoweredBy"
                      checked={config.features.showPoweredBy}
                      onChange={(e) => updateConfig({ features: { ...config.features, showPoweredBy: e.target.checked } })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-checked:bg-teal-700 rounded-full peer-focus:ring-4 peer-focus:ring-teal-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Custom Footer Text</label>
                  <textarea
                    value={config.features.customFooter}
                    onChange={(e) => updateConfig({ features: { ...config.features, customFooter: e.target.value } })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                    placeholder="Custom footer text for your platform"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal Notes</label>
                  <textarea
                    value={config.notes}
                    onChange={(e) => updateConfig({ notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                    placeholder="Internal notes for your team..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features & Pricing Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Package Selection</h2>
              <p className="text-sm text-gray-500 mb-6">Choose the right plan for your client</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(tierFeatures) as Array<keyof typeof tierFeatures>).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => handleTierChange(tier)}
                    className={`p-5 rounded-lg border-2 transition-all text-center ${
                      currentTier === tier
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-lg mb-1">{tierFeatures[tier].name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{tierFeatures[tier].description}</p>
                    <p className="text-2xl font-bold text-teal-700 mb-1">{tierFeatures[tier].price}</p>
                    <p className="text-xs text-gray-400 mb-3">{tierFeatures[tier].featureCount} features · {tierFeatures[tier].limits.maxVessels === -1 ? 'Unlimited' : tierFeatures[tier].limits.maxVessels} vessels</p>
                    {currentTier === tier && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-700 text-white rounded-full text-xs font-medium">
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Vessel Management */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Vessel Management</h2>
                  <p className="text-sm text-gray-500">
                    Add vessels for this client.
                    {tierFeatures[currentTier].limits.maxVessels === -1
                      ? ' Unlimited vessels allowed.'
                      : ` Up to ${tierFeatures[currentTier].limits.maxVessels} vessels for the ${tierFeatures[currentTier].name} plan.`}
                    <span className="ml-2 font-medium text-gray-900">
                      {config.vessels?.length || 0} / {tierFeatures[currentTier].limits.maxVessels === -1 ? 'Unlimited' : tierFeatures[currentTier].limits.maxVessels}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    const maxV = tierFeatures[currentTier].limits.maxVessels;
                    const current = config.vessels?.length || 0;
                    if (maxV !== -1 && current >= maxV) {
                      alert(`Maximum ${maxV} vessels allowed for the ${tierFeatures[currentTier].name} plan. Please upgrade to add more.`);
                      return;
                    }
                    updateConfig({
                      vessels: [...(config.vessels || []), { id: crypto.randomUUID().substring(0, 8), name: '' }],
                    });
                  }}
                  className="px-4 py-2 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium whitespace-nowrap"
                >
                  + Add Vessel
                </button>
              </div>

              {(!config.vessels || config.vessels.length === 0) ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No vessels added yet</p>
                  <button
                    onClick={() => updateConfig({ vessels: [{ id: crypto.randomUUID().substring(0, 8), name: '' }] })}
                    className="text-teal-700 hover:text-teal-800 text-sm font-medium"
                  >
                    + Add first vessel
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {config.vessels.map((vessel, idx) => (
                    <div key={vessel.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                      <span className="text-xs text-gray-400 w-6 text-center">{idx + 1}</span>
                      <input
                        type="text"
                        value={vessel.name}
                        onChange={(e) => {
                          const updated = config.vessels.map(v => v.id === vessel.id ? { ...v, name: e.target.value } : v);
                          updateConfig({ vessels: updated });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Vessel name (e.g. M/Y Ocean Star)"
                      />
                      <button
                        onClick={() => updateConfig({ vessels: config.vessels.filter(v => v.id !== vessel.id) })}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove vessel"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Feature Configuration</h2>
              <p className="text-sm text-gray-500 mb-6">
                Customize which features are available for the <span className="font-semibold text-gray-900">{tierFeatures[currentTier].name}</span> tier. Toggle individual features on or off.
              </p>
              <div className="space-y-6">
                {featureGroups.map((group) => (
                  <div key={group.group}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{group.group}</h3>
                    <div className="divide-y divide-gray-100">
                      {group.features.map((feat) => {
                        const isAvailable = tierFeatures[currentTier].features.includes(feat.key);
                        const isEnabled = config.enabledFeatures?.[feat.key as keyof typeof config.enabledFeatures] ?? false;
                        return (
                          <div key={feat.key} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              {isAvailable ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-teal-700">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-300">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                              )}
                              <span className={`text-sm ${isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>{feat.label}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                feat.minTier === 'basic' ? 'bg-gray-100 text-gray-600' :
                                feat.minTier === 'professional' ? 'bg-blue-50 text-blue-700' :
                                'bg-purple-50 text-purple-700'
                              }`}>
                                {tierBadgeLabel[feat.minTier]}
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                disabled={!isAvailable}
                                onChange={(e) => updateConfig({
                                  enabledFeatures: { ...config.enabledFeatures, [feat.key]: e.target.checked },
                                })}
                                className="sr-only peer"
                              />
                              <div className={`w-11 h-6 rounded-full peer-focus:ring-4 peer-focus:ring-teal-300 ${
                                isAvailable
                                  ? 'bg-gray-200 peer-checked:bg-teal-700'
                                  : 'bg-gray-100 cursor-not-allowed'
                              } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-sm font-medium text-teal-900">
                Current plan: {tierFeatures[currentTier].name} — {tierFeatures[currentTier].featureCount} features included
              </p>
            </div>
          </div>
        )}

        {/* Bottom Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium"
          >
            Create White Label
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}