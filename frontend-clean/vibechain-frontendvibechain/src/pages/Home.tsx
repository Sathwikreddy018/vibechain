import { Shield, Zap, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import CardanoOrb from '../components/CardanoOrb';

interface HomeProps {
  onNavigate: (page: string) => void;
  onWalletConnect: () => void;
}

export default function Home({ onNavigate, onWalletConnect }: HomeProps) {
  const features = [
    {
      icon: <Zap className="text-[#0033AD]" size={32} />,
      title: 'Lightning Fast',
      description: 'Process transactions in seconds with Cardano\'s proof-of-stake consensus'
    },
    {
      icon: <Shield className="text-[#0033AD]" size={32} />,
      title: 'Battle-Tested Security',
      description: 'Built on peer-reviewed cryptographic research and formal verification'
    },
    {
      icon: <Lock className="text-[#0033AD]" size={32} />,
      title: 'Privacy First',
      description: 'Your data stays yours. Decentralized architecture ensures complete control'
    }
  ];

  const trustBadges = [
    '100% Decentralized',
    'Open Source',
    'Peer Reviewed',
    'Energy Efficient'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8F9FB] to-white">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#0033AD]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#0033AD]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-block">
              <div className="flex items-center space-x-2 bg-[#0033AD]/10 text-[#0033AD] px-4 py-2 rounded-full text-sm font-semibold">
                <CheckCircle size={16} />
                <span>VibeChain AI Infrastructure</span>
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-[#1A1F25] leading-tight">
              Fast. Secure.
              <span className="block text-[#0033AD]">VibeChain AI Payments.</span>
            </h1>

            <p className="text-xl text-[#4F5765] leading-relaxed">
              A decentralized and privacy-focused payment experience built on the world's most
              sustainable blockchain.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={onWalletConnect}>
                Connect Wallet
              </Button>
              <Button variant="secondary" size="lg" onClick={() => onNavigate('pay')}>
                Make a Payment
              </Button>
              <Button variant="ghost" size="lg" onClick={() => onNavigate('whitepaper')}>
                Whitepaper
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center space-x-2 text-sm text-[#4F5765]"
                >
                  <CheckCircle size={16} className="text-[#0033AD]" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[500px] animate-in slide-in-from-right duration-700">
            <CardanoOrb />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-[#1A1F25]">Why Choose VibeChain AI?</h2>
            <p className="text-lg text-[#4F5765] max-w-2xl mx-auto">
              Experience the next generation of blockchain payments with unmatched security and speed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                hover
                className="text-center space-y-4 animate-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#1A1F25]">{feature.title}</h3>
                <p className="text-[#4F5765]">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-[#0033AD] to-[#0055DD]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="text-xl text-white/90">
            Connect your wallet and experience the future of decentralized payments
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={onWalletConnect}
            className="bg-white text-[#0033AD] hover:bg-gray-50"
          >
            Connect Wallet Now
          </Button>
        </div>
      </section>
    </div>
  );
}
