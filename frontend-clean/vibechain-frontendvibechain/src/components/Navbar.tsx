import { useState, useEffect } from 'react';
import { Wallet, Menu, X } from 'lucide-react';
import Button from './Button';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  walletConnected: boolean;
  onWalletConnect: () => void;
}

export default function Navbar({ onNavigate, currentPage, walletConnected, onWalletConnect }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Pay & Verify', id: 'pay' },
    { name: 'History', id: 'history' },
    { name: 'Whitepaper', id: 'whitepaper' },
    { name: 'About VibeChain', id: 'about' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <img
              src="/src/assets/WhatsApp Image 2025-11-29 at 12.38.33_80dce766.jpg"
              alt="VibeChain AI Logo"
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-bold text-[#1A1F25]">VibeChain AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  currentPage === item.id
                    ? 'text-[#0033AD]'
                    : 'text-[#4F5765] hover:text-[#0033AD]'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0033AD] transition-all duration-300 ${
                  currentPage === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              variant={walletConnected ? 'secondary' : 'primary'}
              size="sm"
              onClick={onWalletConnect}
              className="flex items-center space-x-2"
            >
              <Wallet size={16} />
              <span>{walletConnected ? 'Connected' : 'Connect Wallet'}</span>
            </Button>
          </div>

          <button
            className="md:hidden text-[#1A1F25]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E2E5E9]">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-[#0033AD]/10 text-[#0033AD] font-medium'
                    : 'text-[#4F5765] hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
            <Button
              variant={walletConnected ? 'secondary' : 'primary'}
              size="md"
              onClick={onWalletConnect}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Wallet size={16} />
              <span>{walletConnected ? 'Connected' : 'Connect Wallet'}</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
