export interface Transaction {
  id: string;
  amount: number;
  token: string;
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
  timestamp: Date;
  hash?: string;
  blockNumber?: number;
  receiver?: string;
}

export interface NFTCertificate {
  id: string;
  transactionId: string;
  tokenId: string;
  mintedAt: Date;
  imageUrl: string;
  metadata: Record<string, unknown>;
}

export interface WalletState {
  connected: boolean;
  address?: string;
  balance?: number;
}
