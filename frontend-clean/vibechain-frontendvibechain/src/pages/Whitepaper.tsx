import { useState } from 'react';
import { Download, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Whitepaper() {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const sections = [
    {
      title: 'Executive Summary',
      content: `CardanoPay represents the next evolution in blockchain-based payment infrastructure, leveraging Cardano's proof-of-stake consensus mechanism to deliver secure, fast, and sustainable transactions.

Our platform addresses the critical challenges facing decentralized payment systems: scalability, security, and user experience. By building on Cardano's scientifically peer-reviewed architecture, we ensure that every transaction benefits from formal verification and cryptographic security.`
    },
    {
      title: 'Technical Architecture',
      content: `The CardanoPay infrastructure is built on three core pillars:

1. Smart Contract Layer: Utilizing Plutus smart contracts for automated payment processing and verification
2. Settlement Layer: Leveraging Cardano's UTXO model for efficient transaction settlement
3. User Interface Layer: Web-based interface providing seamless interaction with the blockchain

Our architecture ensures sub-second transaction initiation with final settlement typically completing within 20 seconds, significantly faster than traditional payment rails while maintaining cryptographic security guarantees.`
    },
    {
      title: 'Security & Privacy',
      content: `Security is paramount in CardanoPay's design philosophy:

- End-to-end encryption for all payment metadata
- Non-custodial architecture ensuring users maintain full control of funds
- Multi-signature support for enterprise accounts
- Zero-knowledge proof integration for enhanced privacy
- Formal verification of all critical smart contracts

Privacy features include optional transaction shielding and metadata encryption, allowing users to control the visibility of their payment history while maintaining compliance with regulatory requirements.`
    },
    {
      title: 'Tokenomics & Governance',
      content: `CardanoPay operates on a transparent economic model:

- Network fees are denominated in ADA, ensuring alignment with Cardano ecosystem
- Fee structure: 0.17 ADA base fee + 0.1% transaction value
- 70% of fees distributed to stake pool operators
- 20% allocated to protocol development
- 10% reserved for community treasury

Governance decisions are made through on-chain voting, with voting power proportional to staked tokens and participation history.`
    },
    {
      title: 'Roadmap & Future Development',
      content: `Our development roadmap focuses on expanding functionality and ecosystem integration:

Q1 2026:
- Multi-chain bridge integration
- Enhanced NFT receipt system
- Mobile application launch

Q2 2026:
- Recurring payment automation
- Invoice generation and management
- API for merchant integration

Q3 2026:
- Cross-chain atomic swaps
- Lightning Network integration
- Enterprise SDK release

Q4 2026:
- DeFi protocol integrations
- Stablecoin payment rails
- Global expansion initiatives`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8F9FB] to-white pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="w-20 h-20 bg-[#0033AD]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-[#0033AD]" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-[#1A1F25]">Whitepaper</h1>
          <p className="text-xl text-[#4F5765]">
            Technical documentation and vision for CardanoPay
          </p>
          <Button variant="primary" size="lg" className="flex items-center space-x-2 mx-auto">
            <Download size={20} />
            <span>Download Full Whitepaper (PDF)</span>
          </Button>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-r from-[#0033AD] to-[#0055DD] rounded-2xl text-white">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Version 1.0</h3>
              <p className="text-white/90">Published: November 29, 2025</p>
              <p className="text-sm text-white/80">Last updated: November 29, 2025</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer transition-all duration-300"
              hover
            >
              <button
                onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h2 className="text-2xl font-bold text-[#1A1F25]">{section.title}</h2>
                {expandedSection === index ? (
                  <ChevronUp className="text-[#0033AD] flex-shrink-0" size={24} />
                ) : (
                  <ChevronDown className="text-[#0033AD] flex-shrink-0" size={24} />
                )}
              </button>

              {expandedSection === index && (
                <div className="mt-6 pt-6 border-t border-[#E2E5E9] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="prose prose-lg max-w-none">
                    {section.content.split('\n\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-[#4F5765] mb-4 leading-relaxed whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-br from-[#F8F9FB] to-white rounded-2xl border-2 border-[#E2E5E9]">
          <h3 className="text-2xl font-bold text-[#1A1F25] mb-4">Abstract</h3>
          <p className="text-[#4F5765] leading-relaxed mb-6">
            This whitepaper presents CardanoPay, a decentralized payment infrastructure built on the
            Cardano blockchain. We detail our technical architecture, security model, and economic
            design, demonstrating how proof-of-stake consensus and formal verification enable a
            payment system that is simultaneously secure, scalable, and sustainable. Our approach
            prioritizes user sovereignty while maintaining the throughput necessary for global
            adoption.
          </p>
          <Button variant="secondary" size="lg" className="w-full flex items-center justify-center space-x-2">
            <Download size={20} />
            <span>Download Complete Whitepaper</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
