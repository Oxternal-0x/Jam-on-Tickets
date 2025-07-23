# Jam-on-Tickets 🎫

A decentralized peer-to-peer ticket exchange platform with smart escrow integration, built with Next.js, React, and Web3 technologies.

## 🌟 Features

### Core Functionality
- **Secure Ticket Exchange**: Peer-to-peer ticket trading with smart contract escrow
- **Wallet Integration**: MetaMask and WalletConnect support
- **IPFS Storage**: Decentralized ticket image and metadata storage
- **Real-time Status Updates**: Live escrow status tracking
- **Chat System**: Built-in messaging between buyers and sellers
- **Mobile-First Design**: Responsive UI optimized for all devices

### Smart Contract Features
- **Escrow System**: Automated payment holding and ticket release
- **Time-based Auto-release**: Automatic ticket release after payment confirmation
- **Dispute Resolution**: Built-in cancellation and refund mechanisms
- **Event Tracking**: Comprehensive transaction history and status updates

### User Experience
- **Intuitive Interface**: Clean, modern UI with smooth animations
- **Advanced Filtering**: Search by event, venue, price, and date
- **Real-time Notifications**: Toast notifications for transaction updates
- **Status Indicators**: Visual feedback for all transaction states

## 🚀 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icons

### Web3 Integration
- **Ethers.js**: Ethereum library for smart contract interaction
- **RainbowKit**: Wallet connection and management
- **Wagmi**: React hooks for Ethereum
- **IPFS**: Decentralized file storage

### Smart Contracts
- **Solidity**: Smart contract development
- **Hardhat**: Development and testing framework
- **OpenZeppelin**: Secure contract libraries

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/jam-on-tickets.git
   cd jam-on-tickets
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
   NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_infura_project_secret
   NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=your_deployed_contract_address
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Smart Contract Setup

### Deploy the Escrow Contract

1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. **Initialize Hardhat**
   ```bash
   npx hardhat init
   ```

3. **Deploy to your preferred network**
   ```bash
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

4. **Update contract address**
   Copy the deployed contract address to your `.env.local` file.

### Contract Functions

```solidity
// List a ticket for sale
function listTicket(uint256 price, string memory imageHash, string memory metadata) 
    external returns (uint256 ticketId)

// Create escrow for ticket purchase
function createEscrow(uint256 ticketId) external payable returns (uint256 escrowId)

// Release ticket to buyer (seller only)
function releaseTicket(uint256 escrowId) external

// Cancel escrow and refund buyer
function cancelEscrow(uint256 escrowId) external
```

## 🎯 Usage Guide

### For Sellers

1. **Connect Wallet**: Click "Connect Wallet" and authorize with MetaMask
2. **List Ticket**: Click "Sell Ticket" and fill in ticket details
3. **Upload Image**: Upload ticket screenshot or PDF (max 10MB)
4. **Set Price**: Choose your preferred currency and price
5. **Confirm Listing**: Review details and confirm the transaction

### For Buyers

1. **Browse Tickets**: Use search and filters to find tickets
2. **Review Details**: Check seat information and seller details
3. **Initiate Purchase**: Click "Buy Ticket" to start escrow
4. **Confirm Payment**: Approve the transaction in your wallet
5. **Wait for Release**: Seller will release the ticket after payment

### Escrow Process

1. **Payment Locked**: Buyer's payment is held in smart contract
2. **Seller Notification**: Seller receives notification of payment
3. **Ticket Release**: Seller releases ticket to buyer
4. **Funds Released**: Payment automatically transferred to seller
5. **Transaction Complete**: Both parties receive confirmation

## 🔒 Security Features

- **Smart Contract Escrow**: All payments held securely in smart contract
- **Time-based Auto-release**: Automatic ticket release after confirmation
- **Dispute Resolution**: Built-in cancellation mechanisms
- **IPFS Storage**: Decentralized, tamper-proof file storage
- **Wallet Verification**: Secure wallet connection and transaction signing

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Mobile-optimized navigation
- Responsive ticket cards
- Mobile wallet integration

## 🌐 Supported Networks

- **Ethereum Mainnet**: Production deployment
- **Polygon**: Low-fee transactions
- **Arbitrum**: Fast and cost-effective
- **Sepolia**: Testnet for development

## 🛠️ Development

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── TicketCard.tsx   # Individual ticket display
│   ├── TicketModal.tsx  # Ticket listing form
│   ├── FilterModal.tsx  # Search filters
│   ├── ChatModal.tsx    # Buyer-seller chat
│   └── EscrowStatus.tsx # Escrow status display
├── lib/                 # Utilities and services
│   ├── contracts.ts     # Smart contract integration
│   └── ipfs.ts         # IPFS file storage
└── types/              # TypeScript type definitions
```

### Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/jam-on-tickets/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/jam-on-tickets/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/jam-on-tickets/discussions)

## 🙏 Acknowledgments

- [RainbowKit](https://rainbowkit.com/) for wallet integration
- [IPFS](https://ipfs.io/) for decentralized storage
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contracts
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ for the Web3 community**
