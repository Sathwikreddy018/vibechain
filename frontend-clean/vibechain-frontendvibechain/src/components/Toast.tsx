import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <AlertCircle className="text-red-500" size={24} />,
    info: <AlertCircle className="text-[#0033AD]" size={24} />
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`fixed top-24 right-6 max-w-sm w-full ${backgrounds[type]} border-2 rounded-lg shadow-lg p-4 flex items-start space-x-3 animate-in slide-in-from-right duration-300 z-50`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-[#1A1F25] font-medium">{message}</p>
      <button onClick={onClose} className="flex-shrink-0 text-[#4F5765] hover:text-[#1A1F25]">
        <X size={20} />
      </button>
    </div>
  );
}
