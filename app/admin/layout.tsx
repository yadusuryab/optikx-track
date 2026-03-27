'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify', {
          credentials: 'include',
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Only redirect if we're not already on login page
          if (!window.location.pathname.includes('/admin/login')) {
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't show layout for login page
  if (window.location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show layout only when authenticated
  return isAuthenticated ? (
    <div className="min-h-screen ">
      <nav className="bg-secondary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex gap-1 items-center">
                <h1 className="text-xl font-bold tracking-tight text-sm">optikx</h1>
                <Badge>TRACK ORDERS</Badge>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/upload"
                  className="border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/images"
                  className="border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Images
                </Link>
                <Link
                  href="/admin/upload"
                  className="border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Upload
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                onClick={async () => {
                  await fetch('/api/admin/auth/logout', { 
                    method: 'POST',
                    credentials: 'include'
                  });
                  router.push('/admin/login');
                }}
variant={'destructive'}              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  ) : null;
}