import { ReactNode, useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navigation from './Navigation';
import '@rainbow-me/rainbowkit/styles.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background font-sans text-text-primary">
        <div className="glass-panel bg-opacity-30 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gradient">NBL</span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Empty placeholder for children */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-text-primary">
      <Navigation />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
      <footer className="glass-panel mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <p className="text-text-secondary"> 2025 Nebula. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">
                Discord
              </a>
              <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
