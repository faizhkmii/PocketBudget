'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/statistics', label: 'Statistics' },
  { href: '/checklist', label: 'Checklist' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded ${
              pathname === item.href ? 'bg-blue-800' : 'hover:bg-blue-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}