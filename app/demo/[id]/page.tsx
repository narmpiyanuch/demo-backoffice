'use client';

import { useState, useEffect, startTransition } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { WhiteLabelConfig, defaultWhiteLabelConfig, tierFeatures, featureGroups, tierBadgeLabel } from '@/types/white-label';

type TabId = 'branding' | 'colors' | 'content' | 'features';

const tabs: { id: TabId; label: string }[] = [
  { id: 'branding', label: 'Branding' },
  { id: 'colors', label: 'Colors & Theme' },
  { id: 'content', label: 'Content' },
  { id: 'features', label: 'Features & Pricing' },
];

export default function DemoPage() {
  const params = useParams();
  const id = params.id as string;
  const [config, setConfig] = useState<WhiteLabelConfig | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('branding');

  useEffect(() => {
    let data = { ...defaultWhiteLabelConfig };
    const saved = localStorage.getItem(`whiteLabel_${id}`);
    if (saved) {
      try {
        data = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    }
    startTransition(() => {
      setConfig(data);
    });
  }, [id]);

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    );
  }

  const currentTier = config.tier && tierFeatures[config.tier] ? config.tier : 'basic';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <Link href="/admin/white-label" className="mt-1 text-gray-400 hover:text-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">White Label Preview</h1>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">View Only</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Preview the configuration for {config.brandName}</p>
            </div>
          </div>
          <Link
            href={`/white-label/${id}`}
            className="px-5 py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium"
          >
            Edit Configuration
          </Link>
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
              <p className="text-sm text-gray-500 mb-6">Brand name and tagline</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Name</label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {config.brandName || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {config.tagline || '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Logo & Favicon</h2>
              <p className="text-sm text-gray-500 mb-6">Brand assets</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex items-center justify-center min-h-[120px]">
                    {config.logo.light ? (
                      <div className="relative w-24 h-24">
                        <Image src={config.logo.light} alt="Logo" fill className="object-contain" />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No logo uploaded</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Favicon</label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {config.favicon && config.favicon !== '/favicon.ico' ? (
                      <div className="relative w-8 h-8 shrink-0">
                        <Image src={config.favicon} alt="Favicon" width={32} height={32} className="object-contain" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded shrink-0" />
                    )}
                    <p className="text-sm text-gray-500">
                      {config.favicon && config.favicon !== '/favicon.ico' ? 'Favicon uploaded' : 'No favicon uploaded'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Colors & Theme Tab */}
        {activeTab === 'colors' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Colors & Theme</h2>
            <p className="text-sm text-gray-500 mb-6">Platform color scheme</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Primary', color: config.colors.primary },
                { label: 'Secondary', color: config.colors.secondary },
                { label: 'Accent', color: config.colors.accent },
                { label: 'Background', color: config.colors.background },
                { label: 'Text', color: config.colors.text },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-sm text-gray-700">{item.label}</p>
                  <p className="text-xs font-mono text-gray-400">{item.color}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-lg border border-gray-200 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Button Preview</p>
              <div className="flex flex-wrap gap-3">
                <button style={{ backgroundColor: config.colors.primary }} className="px-4 py-2 text-white rounded-lg text-sm">Primary</button>
                <button style={{ backgroundColor: config.colors.secondary }} className="px-4 py-2 text-white rounded-lg text-sm">Secondary</button>
                <button style={{ backgroundColor: config.colors.accent }} className="px-4 py-2 text-white rounded-lg text-sm">Accent</button>
                <button style={{ borderColor: config.colors.primary, color: config.colors.primary }} className="px-4 py-2 border-2 rounded-lg text-sm">Outline</button>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Contact Information</h2>
              <p className="text-sm text-gray-500 mb-6">Contact details for end users</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {config.contact.email || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {config.contact.phone || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {config.contact.website || '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Footer & Branding</h2>
              <p className="text-sm text-gray-500 mb-6">Footer configuration</p>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Show &quot;Powered by&quot; badge</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    config.features.showPoweredBy ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {config.features.showPoweredBy ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Custom Footer Text</label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 min-h-[80px]">
                    {config.features.customFooter || '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features & Pricing Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Current Package</h2>
              <p className="text-sm text-gray-500 mb-6">Selected plan and pricing</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(tierFeatures) as Array<keyof typeof tierFeatures>).map((tier) => (
                  <div
                    key={tier}
                    className={`p-5 rounded-lg border-2 text-center ${
                      currentTier === tier
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 bg-white opacity-50'
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
                  </div>
                ))}
              </div>
            </div>

            {/* Vessel Management (Read-only) */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Vessel Management</h2>
              <p className="text-sm text-gray-500 mb-4">
                Registered vessels.
                {tierFeatures[currentTier].limits.maxVessels === -1
                  ? ' Unlimited vessels allowed.'
                  : ` Up to ${tierFeatures[currentTier].limits.maxVessels} vessels for the ${tierFeatures[currentTier].name} plan.`}
                <span className="ml-2 font-medium text-gray-900">
                  {config.vessels?.length || 0} / {tierFeatures[currentTier].limits.maxVessels === -1 ? 'Unlimited' : tierFeatures[currentTier].limits.maxVessels}
                </span>
              </p>

              {(!config.vessels || config.vessels.length === 0) ? (
                <div className="text-center py-8 text-gray-500">No vessels registered</div>
              ) : (
                <div className="space-y-2">
                  {config.vessels.map((vessel, idx) => (
                    <div key={vessel.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <span className="text-xs text-gray-400 w-6 text-center">{idx + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{vessel.name || '(Unnamed)'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Feature Status</h2>
              <p className="text-sm text-gray-500 mb-6">
                Features for the <span className="font-semibold text-gray-900">{tierFeatures[currentTier].name}</span> tier
              </p>

              <div className="space-y-6">
                {featureGroups.map((group) => (
                  <div key={group.group}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{group.group}</h3>
                    <div className="divide-y divide-gray-100">
                      {group.features.map((feat) => {
                        const isEnabled = config.enabledFeatures?.[feat.key as keyof typeof config.enabledFeatures] ?? false;
                        const isAvailable = tierFeatures[currentTier].features.includes(feat.key);

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
                              <span className={`text-sm ${isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>
                                {feat.label}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                feat.minTier === 'basic' ? 'bg-gray-100 text-gray-600' :
                                feat.minTier === 'professional' ? 'bg-blue-50 text-blue-700' :
                                'bg-purple-50 text-purple-700'
                              }`}>
                                {tierBadgeLabel[feat.minTier]}
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isEnabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
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
      </div>
    </div>
  );
}
