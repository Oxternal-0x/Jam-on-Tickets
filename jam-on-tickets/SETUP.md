# Jam-on-Tickets Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
# Web3 Configuration
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id_here
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_infura_project_secret_here

# Smart Contract Address (update after deployment)
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Smart Contract Deployment (Optional)

### 1. Install Hardhat Dependencies
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
```

### 2. Deploy to Local Network
```bash
# Start local Hardhat node
npx hardhat node

# In another terminal, deploy the contract
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Deploy to Testnet (Sepolia)
```bash
# Add your private key to .env.local
echo "PRIVATE_KEY=your_private_key_here" >> .env.local

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Update Contract Address
After deployment, copy the contract address and update:
- `.env.local` file
- `src/lib/contracts.ts` file

## 🎯 Features Implemented

### ✅ Core Features
- [x] **Responsive UI**: Mobile-first design with Tailwind CSS
- [x] **Wallet Integration**: MetaMask and WalletConnect support
- [x] **Ticket Listing**: Upload images and metadata to IPFS
- [x] **Search & Filter**: Find tickets by event, venue, price, date
- [x] **Escrow System**: Smart contract integration for secure transactions
- [x] **Real-time Status**: Live updates for escrow states
- [x] **Chat System**: Buyer-seller communication
- [x] **Mobile Navigation**: Bottom navigation for mobile devices

### ✅ Smart Contract Features
- [x] **Ticket Listing**: List tickets with IPFS hash and metadata
- [x] **Escrow Creation**: Secure payment holding
- [x] **Ticket Release**: Seller can release tickets to buyers
- [x] **Escrow Cancellation**: Buyers can cancel and get refunds
- [x] **Event Tracking**: Comprehensive transaction history
- [x] **Security**: Reentrancy protection and access controls

### ✅ Web3 Integration
- [x] **Ethers.js**: Smart contract interaction
- [x] **RainbowKit**: Wallet connection management
- [x] **Wagmi**: React hooks for Ethereum
- [x] **IPFS**: Decentralized file storage
- [x] **Multi-chain Support**: Ethereum, Polygon, Arbitrum, Sepolia

## 📱 User Experience

### For Sellers
1. Connect wallet using MetaMask or WalletConnect
2. Click "Sell Ticket" to open listing form
3. Upload ticket image (PNG, JPG, PDF)
4. Fill in event details (name, venue, date, time, seat info)
5. Set price and currency
6. Confirm transaction to list ticket

### For Buyers
1. Browse available tickets with search and filters
2. Review ticket details and seller information
3. Click "Buy Ticket" to initiate escrow
4. Approve payment in wallet
5. Wait for seller to release ticket
6. Receive ticket and confirmation

### Escrow Process
1. **Payment Locked**: Buyer's payment held in smart contract
2. **Seller Notification**: Seller receives payment confirmation
3. **Ticket Release**: Seller releases ticket to buyer
4. **Funds Released**: Payment automatically transferred to seller
5. **Transaction Complete**: Both parties receive confirmation

## 🛠️ Development Commands

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

# Smart contract compilation
npx hardhat compile

# Smart contract testing
npx hardhat test

# Smart contract deployment
npx hardhat run scripts/deploy.js --network <network>
```

## 🔒 Security Features

- **Smart Contract Escrow**: All payments secured in smart contract
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Access Controls**: Only authorized users can perform actions
- **IPFS Storage**: Decentralized, tamper-proof file storage
- **Wallet Verification**: Secure wallet connection and signing
- **Input Validation**: Comprehensive validation on all inputs

## 🌐 Supported Networks

- **Ethereum Mainnet**: Production deployment
- **Polygon**: Low-fee transactions
- **Arbitrum**: Fast and cost-effective
- **Sepolia**: Testnet for development
- **Local Hardhat**: Local development and testing

## 📁 Project Structure

```
jam-on-tickets/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Main home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── TicketCard.tsx   # Individual ticket display
│   │   ├── TicketModal.tsx  # Ticket listing form
│   │   ├── FilterModal.tsx  # Search filters
│   │   ├── ChatModal.tsx    # Buyer-seller chat
│   │   ├── EscrowStatus.tsx # Escrow status display
│   │   └── providers.tsx    # Web3 providers
│   └── lib/                 # Utilities and services
│       ├── contracts.ts     # Smart contract integration
│       └── ipfs.ts         # IPFS file storage
├── contracts/               # Smart contracts
│   └── TicketEscrow.sol    # Main escrow contract
├── scripts/                 # Deployment scripts
│   └── deploy.js           # Contract deployment
├── hardhat.config.js       # Hardhat configuration
└── README.md               # Project documentation
```

## 🚨 Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Ensure MetaMask is installed and unlocked
   - Check if you're on the correct network
   - Try refreshing the page

2. **Contract Interaction Fails**
   - Verify contract address is correct
   - Check if you have sufficient gas fees
   - Ensure you're on the correct network

3. **IPFS Upload Fails**
   - Check your Infura project credentials
   - Verify file size is under 10MB
   - Ensure file type is supported

4. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors with `npm run type-check`
   - Verify environment variables are set correctly

### Getting Help

- Check the browser console for error messages
- Verify all environment variables are set
- Ensure you're using the latest version of Node.js
- Try clearing browser cache and local storage

## 🎉 Next Steps

1. **Deploy Smart Contract**: Deploy to your preferred network
2. **Configure IPFS**: Set up Infura IPFS project
3. **Set Up WalletConnect**: Get project ID from WalletConnect
4. **Test Transactions**: Test the full escrow flow
5. **Customize UI**: Modify colors, branding, and styling
6. **Add Features**: Implement additional features like notifications, analytics

---

**Happy coding! 🎫✨** 