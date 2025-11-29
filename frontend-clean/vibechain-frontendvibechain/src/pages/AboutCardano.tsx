import { Leaf, Users, Shield, Lightbulb, ExternalLink, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function AboutCardano() {
  const features = [
    {
      icon: <Leaf className="text-[#0033AD]" size={40} />,
      title: 'Sustainable by Design',
      description: 'Cardano uses Ouroboros, a provably secure proof-of-stake protocol that consumes significantly less energy than proof-of-work systems. Each transaction uses approximately 0.5 kWh compared to Bitcoin\'s 1,700 kWh.',
      stats: '99.9% less energy than Bitcoin'
    },
    {
      icon: <Shield className="text-[#0033AD]" size={40} />,
      title: 'Peer-Reviewed Research',
      description: 'Every aspect of Cardano\'s architecture is built on peer-reviewed academic research. Over 150 papers have been published, covering everything from consensus mechanisms to smart contract languages.',
      stats: '150+ research papers'
    },
    {
      icon: <Lightbulb className="text-[#0033AD]" size={40} />,
      title: 'Formal Verification',
      description: 'Cardano employs formal methods to verify the correctness of smart contracts and protocol implementations, significantly reducing the risk of bugs and vulnerabilities.',
      stats: 'Mathematically proven security'
    },
    {
      icon: <Users className="text-[#0033AD]" size={40} />,
      title: 'Community Governance',
      description: 'Through Project Catalyst, the Cardano community directly votes on funding proposals and protocol changes, making it one of the world\'s largest decentralized autonomous organizations.',
      stats: '$1B+ in community funding'
    },
    {
      icon: <TrendingUp className="text-[#0033AD]" size={40} />,
      title: 'Scalability',
      description: 'Cardano\'s layered architecture separates settlement from computation, enabling horizontal scaling through sidechains and state channels while maintaining security guarantees.',
      stats: '1M+ transactions per second (theoretical)'
    }
  ];

  const resources = [
    {
      title: 'Official Documentation',
      description: 'Comprehensive guides and technical documentation',
      url: 'https://docs.cardano.org'
    },
    {
      title: 'Cardano Foundation',
      description: 'Supporting and advancing the Cardano ecosystem',
      url: 'https://cardanofoundation.org'
    },
    {
      title: 'IOHK Research',
      description: 'Academic papers and research publications',
      url: 'https://iohk.io/research'
    },
    {
      title: 'Project Catalyst',
      description: 'Community funding and governance platform',
      url: 'https://cardano.ideascale.com'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8F9FB] to-white pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <img
            src="/src/assets/logo.jpg"
            alt="VibeChain AI Logo"
            className="h-24 w-24 mx-auto transition-transform duration-500 hover:scale-110"
          />
          <h1 className="text-5xl lg:text-6xl font-bold text-[#1A1F25]">About VibeChain AI</h1>
          <p className="text-xl text-[#4F5765] max-w-3xl mx-auto leading-relaxed">
            A third-generation blockchain platform built on peer-reviewed research and designed for
            long-term sustainability, scalability, and security.
          </p>
        </div>

        <div className="mb-20">
          <Card className="bg-gradient-to-br from-[#0033AD] to-[#0055DD] text-white p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">The Scientific Blockchain</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Founded in 2015 by Charles Hoskinson, Cardano takes a research-first approach to
                blockchain development. Every protocol and feature is rigorously peer-reviewed by
                academics and cryptographers before implementation, ensuring the highest standards
                of security and correctness.
              </p>
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="space-y-2">
                  <div className="text-4xl font-bold">3M+</div>
                  <div className="text-white/80">Active Wallets</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">$10B+</div>
                  <div className="text-white/80">Market Cap</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">3,000+</div>
                  <div className="text-white/80">Stake Pools</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold text-[#1A1F25]">Why Cardano?</h2>
            <p className="text-lg text-[#4F5765] max-w-2xl mx-auto">
              Built on scientific philosophy and research-driven development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                hover
                className="space-y-4 animate-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-[#1A1F25] text-center">{feature.title}</h3>
                <p className="text-[#4F5765] leading-relaxed">{feature.description}</p>
                <div className="pt-4 border-t border-[#E2E5E9]">
                  <p className="text-sm font-semibold text-[#0033AD] text-center">{feature.stats}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <Card className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-[#1A1F25] mb-6">The ADA Token</h2>
            <div className="space-y-4 text-[#4F5765] leading-relaxed">
              <p>
                ADA is the native cryptocurrency of the Cardano blockchain, named after Ada Lovelace,
                the 19th-century mathematician recognized as the first computer programmer.
              </p>
              <p>
                ADA serves multiple purposes within the Cardano ecosystem:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment for transaction fees on the network</li>
                <li>Staking to participate in the proof-of-stake consensus mechanism</li>
                <li>Voting rights in the governance system through Project Catalyst</li>
                <li>Collateral for smart contract execution</li>
              </ul>
              <p>
                Unlike many cryptocurrencies, ADA has a fixed maximum supply of 45 billion tokens,
                ensuring long-term scarcity and predictable monetary policy.
              </p>
            </div>
          </Card>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold text-[#1A1F25]">Cardano Ecosystem Resources</h2>
            <p className="text-lg text-[#4F5765]">
              Explore the official resources and learn more about the Cardano ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} hover className="space-y-4">
                <h3 className="text-xl font-bold text-[#1A1F25]">{resource.title}</h3>
                <p className="text-[#4F5765]">{resource.description}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  <span>Visit</span>
                  <ExternalLink size={16} />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-br from-[#F8F9FB] to-white">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#1A1F25]">Ready to Experience VibeChain AI?</h3>
              <p className="text-[#4F5765]">
                Start making secure, sustainable payments with VibeChain AI
              </p>
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
