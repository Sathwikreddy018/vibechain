import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-[#E2E5E9] z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#0033AD] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span className="font-semibold">Support Chat</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <div className="text-[#4F5765] text-sm">
              <p className="mb-4">Hello! How can we assist you today?</p>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  How do I make a payment?
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  Connect wallet help
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  View transaction history
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-[#E2E5E9]">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-[#E2E5E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#0033AD] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
