import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2, ExternalLink, Download, Share2, QrCode } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

type Step = 1 | 2 | 3;

interface PaymentData {
  amount: number;
  token: string;
  receiver: string;
  fee: number;
}

export default function PayAndVerify() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 0,
    token: 'ADA',
    receiver: '',
    fee: 0.17
  });
  const [txHash, setTxHash] = useState('');
  const [blockStatus, setBlockStatus] = useState<'initialized' | 'processing' | 'awaiting' | 'confirmed'>('initialized');

  const handlePayment = () => {
    setCurrentStep(2);
    setBlockStatus('processing');

    setTimeout(() => setBlockStatus('awaiting'), 2000);
    setTimeout(() => {
      setBlockStatus('confirmed');
      setTxHash('a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0');
      setCurrentStep(3);
    }, 4000);
  };

  const tokens = ['ADA', 'USDC', 'AGIX'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8F9FB] to-white pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold text-[#1A1F25]">Pay & Verify</h1>
          <p className="text-xl text-[#4F5765]">
            Secure blockchain payments with instant verification
          </p>
        </div>

        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300
                  ${currentStep >= step ? 'bg-[#0033AD] text-white' : 'bg-gray-200 text-[#4F5765]'}
                `}
              >
                {currentStep > step ? <CheckCircle size={24} /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-24 h-1 transition-all duration-300 ${
                    currentStep > step ? 'bg-[#0033AD]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <Card className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-[#1A1F25]">Step 1: Payment Setup</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1F25] mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={paymentData.amount || ''}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-[#E2E5E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD] transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1F25] mb-2">
                  Token
                </label>
                <select
                  value={paymentData.token}
                  onChange={(e) => setPaymentData({ ...paymentData, token: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E2E5E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD] transition-all"
                >
                  {tokens.map((token) => (
                    <option key={token} value={token}>{token}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1F25] mb-2">
                  Receiver Address
                </label>
                <input
                  type="text"
                  value={paymentData.receiver}
                  onChange={(e) => setPaymentData({ ...paymentData, receiver: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E2E5E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD] transition-all"
                  placeholder="addr1..."
                />
              </div>

              <div className="bg-[#F8F9FB] p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4F5765]">Network Fee</span>
                  <span className="font-semibold text-[#1A1F25]">{paymentData.fee} ADA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4F5765]">Total</span>
                  <span className="font-bold text-[#1A1F25]">
                    {(paymentData.amount + paymentData.fee).toFixed(2)} {paymentData.token}
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handlePayment}
              disabled={!paymentData.amount || !paymentData.receiver}
              className="w-full"
            >
              Continue
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-[#1A1F25]">Step 2: Transaction Progress</h2>

            <div className="space-y-4">
              {[
                { status: 'initialized', label: 'Initialized' },
                { status: 'processing', label: 'Processing Transaction' },
                { status: 'awaiting', label: 'Awaiting Block Confirmation' },
                { status: 'confirmed', label: 'Confirmed' }
              ].map((item, index) => {
                const isActive = item.status === blockStatus;
                const isPast = ['initialized', 'processing', 'awaiting', 'confirmed'].indexOf(blockStatus) > index;

                return (
                  <div
                    key={item.status}
                    className={`
                      flex items-center space-x-4 p-4 rounded-lg transition-all duration-300
                      ${isActive ? 'bg-[#0033AD]/10 border-2 border-[#0033AD]' : ''}
                      ${isPast ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}
                    `}
                  >
                    <div className="flex-shrink-0">
                      {isPast && <CheckCircle className="text-green-500" size={24} />}
                      {isActive && <Loader2 className="text-[#0033AD] animate-spin" size={24} />}
                      {!isPast && !isActive && <div className="w-6 h-6 rounded-full border-2 border-gray-300" />}
                    </div>
                    <span className={`font-semibold ${isActive || isPast ? 'text-[#1A1F25]' : 'text-[#4F5765]'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-[#4F5765]">
              <Loader2 className="animate-spin mx-auto mb-2" size={32} />
              <p>Please wait while we confirm your transaction...</p>
            </div>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-[#1A1F25]">Payment Verified!</h2>
              <p className="text-[#4F5765]">Your transaction has been confirmed on the Cardano blockchain</p>
            </div>

            <div className="bg-[#F8F9FB] p-6 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-[#4F5765]">Amount</span>
                <span className="font-bold text-[#1A1F25]">{paymentData.amount} {paymentData.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4F5765]">Network Fee</span>
                <span className="font-semibold text-[#1A1F25]">{paymentData.fee} ADA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4F5765]">Transaction Hash</span>
                <span className="font-mono text-sm text-[#0033AD]">{txHash.slice(0, 16)}...</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="flex items-center justify-center space-x-2">
                <Download size={18} />
                <span>PDF Receipt</span>
              </Button>
              <Button variant="secondary" className="flex items-center justify-center space-x-2">
                <QrCode size={18} />
                <span>QR Code</span>
              </Button>
            </div>

            <div className="space-y-3">
              <Button variant="primary" className="w-full flex items-center justify-center space-x-2">
                <ExternalLink size={18} />
                <span>View on Explorer</span>
              </Button>
              <Button variant="ghost" className="w-full flex items-center justify-center space-x-2">
                <Share2 size={18} />
                <span>Share Transaction</span>
              </Button>
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                setCurrentStep(1);
                setPaymentData({ amount: 0, token: 'ADA', receiver: '', fee: 0.17 });
                setBlockStatus('initialized');
              }}
              className="w-full"
            >
              Make Another Payment
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
