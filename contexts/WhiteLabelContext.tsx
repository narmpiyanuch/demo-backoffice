'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WhiteLabelConfig, defaultWhiteLabelConfig } from '@/types/white-label';

interface WhiteLabelContextType {
  config: WhiteLabelConfig;
  updateConfig: (config: Partial<WhiteLabelConfig>) => void;
  resetConfig: () => void;
}

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

export function WhiteLabelProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<WhiteLabelConfig>(defaultWhiteLabelConfig);

  useEffect(() => {
    const saved = localStorage.getItem('whiteLabelConfig');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse white label config:', e);
      }
    }
  }, []);

  const updateConfig = (newConfig: Partial<WhiteLabelConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem('whiteLabelConfig', JSON.stringify(updated));
  };

  const resetConfig = () => {
    setConfig(defaultWhiteLabelConfig);
    localStorage.removeItem('whiteLabelConfig');
  };

  return (
    <WhiteLabelContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </WhiteLabelContext.Provider>
  );
}

export function useWhiteLabel() {
  const context = useContext(WhiteLabelContext);
  if (!context) {
    throw new Error('useWhiteLabel must be used within WhiteLabelProvider');
  }
  return context;
}
