'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content with right margin for sidebar */}
      <div className="pl-64 pt-0">
        {children}
      </div>
      
      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}