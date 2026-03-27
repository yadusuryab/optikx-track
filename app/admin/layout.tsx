/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/layout.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/images',    label: 'Images'    },
  { href: '/admin/upload',    label: 'Upload'    },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router   = useRouter();
  const pathname = usePathname();               // ✅ replaces window.location (SSR-safe)

  const [isAuthenticated, setIsAuthenticated] = useState<any>(null);
  const [mobileOpen, setMobileOpen]           = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Skip auth check on the login page itself
    if (isLoginPage) {
      setIsAuthenticated(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify', {
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  // ── Login page — render children with no chrome ────────────────────────────
  if (isLoginPage) {
    return <>{children}</>;
  }

  // ── Unauthenticated — render nothing (redirect already fired) ──────────────
  if (!isAuthenticated) {
    return null;
  }

  // ── Authenticated layout ───────────────────────────────────────────────────
  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-secondary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Brand + desktop nav */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex gap-2 items-center mr-6">
                <h1 className="text-xl font-bold tracking-tight">optikx</h1>
                <Badge>TRACK ORDERS</Badge>
              </div>

              {/* Desktop links */}
              <div className="hidden sm:flex sm:space-x-6">
                {NAV_LINKS.map(({ href, label }) => {
                  const active = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={[
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                        active
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-foreground/70 hover:text-foreground hover:border-foreground/30',
                      ].join(' ')}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>

              {/* Mobile hamburger */}
              <button
                className="sm:hidden p-2 rounded-md text-foreground/70 hover:text-foreground focus:outline-none"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  // X icon
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-border px-4 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-foreground/70 hover:bg-accent hover:text-foreground',
                  ].join(' ')}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <main>{children}</main>
    </div>
  );
}