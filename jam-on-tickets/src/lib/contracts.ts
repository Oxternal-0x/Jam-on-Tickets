import { ethers } from 'ethers';

// Smart Contract ABI (simplified for demo)
export const ESCROW_ABI = [
  // Events
  'event TicketListed(uint256 indexed ticketId, address indexed seller, uint256 price, string imageHash)',
  'event EscrowCreated(uint256 indexed escrowId, uint256 indexed ticketId, address indexed buyer, uint256 amount)',
  'event TicketReleased(uint256 indexed escrowId, address indexed buyer)',
  'event EscrowCancelled(uint256 indexed escrowId, address indexed buyer)',
  
  // Functions
  'function listTicket(uint256 price, string memory imageHash, string memory metadata) external returns (uint256)',
  'function createEscrow(uint256 ticketId) external payable returns (uint256)',
  'function releaseTicket(uint256 escrowId) external',
  'function cancelEscrow(uint256 escrowId) external',
  'function getTicket(uint256 ticketId) external view returns (address seller, uint256 price, string memory imageHash, bool isListed)',
  'function getEscrow(uint256 escrowId) external view returns (uint256 ticketId, address buyer, uint256 amount, bool isActive)',
];

// Contract address (replace with actual deployed contract address)
export const ESCROW_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface TicketMetadata {
  event: string;
  venue: string;
  date: string;
  time: string;
  section: string;
  row: string;
  seat: string;
  currency: string;
}

export interface EscrowInfo {
  ticketId: string;
  buyer: string;
  amount: string;
  isActive: boolean;
}

export class EscrowContract {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(signer: ethers.Signer) {
    this.signer = signer;
    this.contract = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, signer);
  }

  async listTicket(price: string, imageHash: string, metadata: TicketMetadata): Promise<string> {
    try {
      const metadataString = JSON.stringify(metadata);
      const priceWei = ethers.parseEther(price);
      
      const tx = await this.contract.listTicket(priceWei, imageHash, metadataString);
      const receipt = await tx.wait();
      
      // Extract ticket ID from event
      const event = receipt.logs.find((log: any) => 
        log.eventName === 'TicketListed'
      );
      
      return event?.args?.ticketId?.toString() || '';
    } catch (error) {
      console.error('Error listing ticket:', error);
      throw error;
    }
  }

  async createEscrow(ticketId: string, price: string): Promise<string> {
    try {
      const priceWei = ethers.parseEther(price);
      
      const tx = await this.contract.createEscrow(ticketId, { value: priceWei });
      const receipt = await tx.wait();
      
      // Extract escrow ID from event
      const event = receipt.logs.find((log: any) => 
        log.eventName === 'EscrowCreated'
      );
      
      return event?.args?.escrowId?.toString() || '';
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    }
  }

  async releaseTicket(escrowId: string): Promise<void> {
    try {
      const tx = await this.contract.releaseTicket(escrowId);
      await tx.wait();
    } catch (error) {
      console.error('Error releasing ticket:', error);
      throw error;
    }
  }

  async cancelEscrow(escrowId: string): Promise<void> {
    try {
      const tx = await this.contract.cancelEscrow(escrowId);
      await tx.wait();
    } catch (error) {
      console.error('Error cancelling escrow:', error);
      throw error;
    }
  }

  async getTicket(ticketId: string): Promise<any> {
    try {
      const ticket = await this.contract.getTicket(ticketId);
      return {
        seller: ticket[0],
        price: ethers.formatEther(ticket[1]),
        imageHash: ticket[2],
        isListed: ticket[3],
      };
    } catch (error) {
      console.error('Error getting ticket:', error);
      throw error;
    }
  }

  async getEscrow(escrowId: string): Promise<EscrowInfo> {
    try {
      const escrow = await this.contract.getEscrow(escrowId);
      return {
        ticketId: escrow[0].toString(),
        buyer: escrow[1],
        amount: ethers.formatEther(escrow[2]),
        isActive: escrow[3],
      };
    } catch (error) {
      console.error('Error getting escrow:', error);
      throw error;
    }
  }

  // Event listeners
  onTicketListed(callback: (ticketId: string, seller: string, price: string, imageHash: string) => void) {
    this.contract.on('TicketListed', (ticketId, seller, price, imageHash) => {
      callback(
        ticketId.toString(),
        seller,
        ethers.formatEther(price),
        imageHash
      );
    });
  }

  onEscrowCreated(callback: (escrowId: string, ticketId: string, buyer: string, amount: string) => void) {
    this.contract.on('EscrowCreated', (escrowId, ticketId, buyer, amount) => {
      callback(
        escrowId.toString(),
        ticketId.toString(),
        buyer,
        ethers.formatEther(amount)
      );
    });
  }

  onTicketReleased(callback: (escrowId: string, buyer: string) => void) {
    this.contract.on('TicketReleased', (escrowId, buyer) => {
      callback(escrowId.toString(), buyer);
    });
  }

  onEscrowCancelled(callback: (escrowId: string, buyer: string) => void) {
    this.contract.on('EscrowCancelled', (escrowId, buyer) => {
      callback(escrowId.toString(), buyer);
    });
  }
}

// Hook to get contract instance
export function useEscrowContract(signer: ethers.Signer | null): EscrowContract | null {
  if (!signer) return null;
  return new EscrowContract(signer);
} 