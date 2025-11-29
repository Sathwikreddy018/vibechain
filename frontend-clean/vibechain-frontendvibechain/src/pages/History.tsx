import { useState } from 'react';
import { Search, Filter, ExternalLink, Download, Image as ImageIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

type HistoryTab = 'payments' | 'nfts';

export default function History() {
  const [activeTab, setActiveTab] = useState<HistoryTab>('payments');
  const [searchQuery, setSearchQuery] = useState('');

  const mockPayments = [
    {
      id: '1',
      amount: 250,
      token: 'ADA',
      status: 'confirmed',
      timestamp: new Date('2025-11-29T10:30:00'),
      hash: 'a1b2c3d4e5f6g7h8',
      receiver: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer...'
    },
    {
      id: '2',
      amount: 100,
      token: 'USDC',
      status: 'confirmed',
      timestamp: new Date('2025-11-28T15:45:00'),
      hash: 'b2c3d4e5f6g7h8i9',
      receiver: 'addr1qy3gxv3vmyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer...'
    },
    {
      id: '3',
      amount: 50,
      token: 'ADA',
      status: 'pending',
      timestamp: new Date('2025-11-27T09:20:00'),
      hash: 'c3d4e5f6g7h8i9j0',
      receiver: 'addr1qz4hxv4xmyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer...'
    }
  ];

  const mockNFTs = [
    {
      id: '1',
      name: 'Payment Receipt #1234',
      transactionId: 'a1b2c3d4e5f6g7h8',
      mintedAt: new Date('2025-11-29T10:35:00'),
      imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      tokenId: 'token_abc123'
    },
    {
      id: '2',
      name: 'Payment Receipt #1233',
      transactionId: 'b2c3d4e5f6g7h8i9',
      mintedAt: new Date('2025-11-28T15:50:00'),
      imageUrl: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg',
      tokenId: 'token_def456'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8F9FB] to-white pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold text-[#1A1F25]">Transaction History</h1>
          <p className="text-xl text-[#4F5765]">
            View your payment history and NFT certificates
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4F5765]" size={20} />
            <input
              type="text"
              placeholder="Search by transaction hash or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#E2E5E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD] transition-all"
            />
          </div>
          <Button variant="secondary" className="flex items-center space-x-2">
            <Filter size={20} />
            <span>Filter</span>
          </Button>
        </div>

        <div className="flex space-x-2 mb-8 border-b border-[#E2E5E9]">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
              activeTab === 'payments'
                ? 'text-[#0033AD] border-[#0033AD]'
                : 'text-[#4F5765] border-transparent hover:text-[#0033AD]'
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('nfts')}
            className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
              activeTab === 'nfts'
                ? 'text-[#0033AD] border-[#0033AD]'
                : 'text-[#4F5765] border-transparent hover:text-[#0033AD]'
            }`}
          >
            NFT Certificates
          </button>
        </div>

        {activeTab === 'payments' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {mockPayments.length > 0 ? (
              mockPayments.map((payment) => (
                <Card key={payment.id} hover className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(payment.status)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-[#1A1F25]">
                            {payment.amount} {payment.token}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#4F5765]">
                          {payment.timestamp.toLocaleString()}
                        </p>
                        <p className="text-sm text-[#4F5765] font-mono">
                          To: {payment.receiver}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <ExternalLink size={16} />
                        <span>Explorer</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <Download size={16} />
                        <span>Receipt</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-[#4F5765] pt-2 border-t border-[#E2E5E9]">
                    <span className="font-semibold">TX Hash:</span>
                    <span className="font-mono">{payment.hash}</span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 space-y-6">
                <div className="w-20 h-20 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto">
                  <Clock className="text-[#4F5765]" size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1F25]">No Transactions Yet</h3>
                  <p className="text-[#4F5765]">Your payment history will appear here once you make your first transaction</p>
                </div>
                <Button variant="primary" size="lg">
                  Make Your First Payment
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {mockNFTs.length > 0 ? (
              mockNFTs.map((nft) => (
                <Card key={nft.id} hover className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-[#0033AD]/10 to-[#0033AD]/5">
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-[#1A1F25]">{nft.name}</h3>
                    <p className="text-sm text-[#4F5765]">
                      Minted: {nft.mintedAt.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-[#4F5765] font-mono">
                      Token ID: {nft.tokenId}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1 flex items-center justify-center space-x-1">
                      <ExternalLink size={14} />
                      <span>View</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 flex items-center justify-center space-x-1">
                      <Download size={14} />
                      <span>Download</span>
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20 space-y-6">
                <div className="w-20 h-20 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto">
                  <ImageIcon className="text-[#4F5765]" size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1F25]">No NFT Certificates</h3>
                  <p className="text-[#4F5765]">Mint NFT receipts from your completed transactions to see them here</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
