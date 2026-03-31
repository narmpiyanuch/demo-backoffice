'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function WhiteLabelPage() {
  useEffect(() => {
    redirect('/white-label/management');
  }, []);

  return null;
}
