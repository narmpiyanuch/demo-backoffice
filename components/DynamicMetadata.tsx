'use client';

import { useEffect } from 'react';
import { useWhiteLabelConfig } from '@/hooks/useWhiteLabelConfig';

interface DynamicMetadataProps {
  whiteLabelId?: string;
}

export default function DynamicMetadata({ whiteLabelId }: DynamicMetadataProps) {
  const config = useWhiteLabelConfig(whiteLabelId);

  useEffect(() => {
    if (!config) return;

    // อัพเดท title
    document.title = `${config.brandName} - Backoffice`;

    // อัพเดท favicon
    if (config.favicon) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = config.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    // อัพเดท CSS variables สำหรับสี
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-secondary', config.colors.secondary);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-background', config.colors.background);
    root.style.setProperty('--color-text', config.colors.text);
    root.style.setProperty('--border-radius', config.theme.borderRadius);
    root.style.setProperty('--font-family', config.theme.fontFamily);
  }, [config]);

  return null;
}
