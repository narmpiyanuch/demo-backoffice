'use client';

import { useState, useEffect, startTransition } from 'react';
import { WhiteLabelConfig } from '@/types/white-label';

export function useWhiteLabelConfig(id?: string) {
  const [config, setConfig] = useState<WhiteLabelConfig | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (id) {
      // โหลด config ตาม ID
      const saved = localStorage.getItem(`whiteLabel_${id}`);
      if (saved) {
        try {
          startTransition(() => {
            setConfig(JSON.parse(saved));
          });
        } catch (e) {
          console.error('Failed to parse config:', e);
        }
      }
    } else {
      // โหลด config เริ่มต้น (active config)
      const activeId = localStorage.getItem('activeWhiteLabelId');
      if (activeId) {
        const saved = localStorage.getItem(`whiteLabel_${activeId}`);
        if (saved) {
          try {
            startTransition(() => {
              setConfig(JSON.parse(saved));
            });
          } catch (e) {
            console.error('Failed to parse config:', e);
          }
        }
      }
    }
  }, [id]);

  return config;
}
