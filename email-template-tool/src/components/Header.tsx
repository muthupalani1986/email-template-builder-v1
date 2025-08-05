'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <header className="bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold">
            Email Template Tool
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="hover:text-red-200 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              href="/templates/new" 
              className="hover:text-red-200 transition-colors duration-200"
            >
              Create Template
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}