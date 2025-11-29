import { useState } from 'react';
import Navbar from './components/Navbar';
import FloatingChat from './components/FloatingChat';
import Toast from './components/Toast';
import Home from './pages/Home';
import PayAndVerify from './pages/PayAndVerify';
import History from './pages/History';
import Whitepaper from './pages/Whitepaper';
import AboutCardano from './pages/AboutCardano';

type Page = 'home' | 'pay' | 'history' | 'whitepaper' | 'about';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
  };

  const handleWalletConnect = () => {
    if (walletConnected) {
      setWalletConnected(false);
      showToast('Wallet disconnected', 'info');
    } else {
      setTimeout(() => {
        setWalletConnected(true);
        showToast('Wallet connected successfully!', 'success');
      }, 500);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onWalletConnect={handleWalletConnect} />;
      case 'pay':
        return <PayAndVerify />;
      case 'history':
        return <History />;
      case 'whitepaper':
        return <Whitepaper />;
      case 'about':
        return <AboutCardano />;
      default:
        return <Home onNavigate={handleNavigate} onWalletConnect={handleWalletConnect} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onNavigate={handleNavigate}
        currentPage={currentPage}
        walletConnected={walletConnected}
        onWalletConnect={handleWalletConnect}
      />
      {renderPage()}
      <FloatingChat />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default App;
