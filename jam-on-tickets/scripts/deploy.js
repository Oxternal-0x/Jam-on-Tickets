const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TicketEscrow contract...");

  // Get the contract factory
  const TicketEscrow = await ethers.getContractFactory("TicketEscrow");
  
  // Deploy the contract
  const ticketEscrow = await TicketEscrow.deploy();
  
  // Wait for deployment to complete
  await ticketEscrow.waitForDeployment();
  
  // Get the deployed contract address
  const address = await ticketEscrow.getAddress();
  
  console.log("TicketEscrow deployed to:", address);
  console.log("Contract address:", address);
  
  // Verify the deployment
  console.log("Verifying deployment...");
  
  // Get the total tickets (should be 0 initially)
  const totalTickets = await ticketEscrow.getTotalTickets();
  console.log("Initial total tickets:", totalTickets.toString());
  
  // Get the total escrows (should be 0 initially)
  const totalEscrows = await ticketEscrow.getTotalEscrows();
  console.log("Initial total escrows:", totalEscrows.toString());
  
  console.log("Deployment successful!");
  console.log("=".repeat(50));
  console.log("Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Add it to your .env.local file as NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS");
  console.log("3. Update the contract address in src/lib/contracts.ts");
  console.log("4. Restart your development server");
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  }); 