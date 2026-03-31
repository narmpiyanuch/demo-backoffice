'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewWhiteLabelPage() {
  const router = useRouter();

  useEffect(() => {
    // สร้าง ID ใหม่
    const newId = Date.now().toString();
    router.push(`/white-label/${newId}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">กำลังสร้าง White Label ใหม่...</p>
      </div>
    </div>
  );
}
