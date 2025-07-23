// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TicketEscrow
 * @dev A smart contract for peer-to-peer ticket exchange with escrow functionality
 */
contract TicketEscrow is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    // Structs
    struct Ticket {
        address seller;
        uint256 price;
        string imageHash;
        string metadata;
        bool isListed;
        bool exists;
    }

    struct Escrow {
        uint256 ticketId;
        address buyer;
        uint256 amount;
        uint256 createdAt;
        bool isActive;
        bool exists;
    }

    // State variables
    Counters.Counter private _ticketIds;
    Counters.Counter private _escrowIds;
    
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public userTickets;
    mapping(address => uint256[]) public userEscrows;

    // Events
    event TicketListed(uint256 indexed ticketId, address indexed seller, uint256 price, string imageHash);
    event TicketDelisted(uint256 indexed ticketId, address indexed seller);
    event EscrowCreated(uint256 indexed escrowId, uint256 indexed ticketId, address indexed buyer, uint256 amount);
    event TicketReleased(uint256 indexed escrowId, address indexed buyer, address indexed seller);
    event EscrowCancelled(uint256 indexed escrowId, address indexed buyer, address indexed seller);
    event FundsWithdrawn(uint256 indexed escrowId, address indexed seller, uint256 amount);

    // Modifiers
    modifier ticketExists(uint256 ticketId) {
        require(tickets[ticketId].exists, "Ticket does not exist");
        _;
    }

    modifier escrowExists(uint256 escrowId) {
        require(escrows[escrowId].exists, "Escrow does not exist");
        _;
    }

    modifier onlyTicketSeller(uint256 ticketId) {
        require(tickets[ticketId].seller == msg.sender, "Only ticket seller can perform this action");
        _;
    }

    modifier onlyEscrowBuyer(uint256 escrowId) {
        require(escrows[escrowId].buyer == msg.sender, "Only escrow buyer can perform this action");
        _;
    }

    modifier onlyEscrowSeller(uint256 escrowId) {
        uint256 ticketId = escrows[escrowId].ticketId;
        require(tickets[ticketId].seller == msg.sender, "Only ticket seller can perform this action");
        _;
    }

    /**
     * @dev List a ticket for sale
     * @param price Price in wei
     * @param imageHash IPFS hash of the ticket image
     * @param metadata JSON string containing ticket metadata
     * @return ticketId The ID of the listed ticket
     */
    function listTicket(
        uint256 price,
        string memory imageHash,
        string memory metadata
    ) external returns (uint256 ticketId) {
        require(price > 0, "Price must be greater than 0");
        require(bytes(imageHash).length > 0, "Image hash cannot be empty");

        _ticketIds.increment();
        ticketId = _ticketIds.current();

        tickets[ticketId] = Ticket({
            seller: msg.sender,
            price: price,
            imageHash: imageHash,
            metadata: metadata,
            isListed: true,
            exists: true
        });

        userTickets[msg.sender].push(ticketId);

        emit TicketListed(ticketId, msg.sender, price, imageHash);
        return ticketId;
    }

    /**
     * @dev Delist a ticket (only seller can do this)
     * @param ticketId The ID of the ticket to delist
     */
    function delistTicket(uint256 ticketId) 
        external 
        ticketExists(ticketId) 
        onlyTicketSeller(ticketId) 
    {
        require(tickets[ticketId].isListed, "Ticket is not listed");
        
        tickets[ticketId].isListed = false;
        
        emit TicketDelisted(ticketId, msg.sender);
    }

    /**
     * @dev Create an escrow for ticket purchase
     * @param ticketId The ID of the ticket to purchase
     * @return escrowId The ID of the created escrow
     */
    function createEscrow(uint256 ticketId) 
        external 
        payable 
        ticketExists(ticketId) 
        nonReentrant 
        returns (uint256 escrowId) 
    {
        Ticket storage ticket = tickets[ticketId];
        
        require(ticket.isListed, "Ticket is not listed for sale");
        require(msg.value == ticket.price, "Incorrect payment amount");
        require(msg.sender != ticket.seller, "Seller cannot buy their own ticket");

        _escrowIds.increment();
        escrowId = _escrowIds.current();

        escrows[escrowId] = Escrow({
            ticketId: ticketId,
            buyer: msg.sender,
            amount: msg.value,
            createdAt: block.timestamp,
            isActive: true,
            exists: true
        });

        // Mark ticket as no longer listed
        ticket.isListed = false;

        userEscrows[msg.sender].push(escrowId);

        emit EscrowCreated(escrowId, ticketId, msg.sender, msg.value);
        return escrowId;
    }

    /**
     * @dev Release ticket to buyer (seller action)
     * @param escrowId The ID of the escrow
     */
    function releaseTicket(uint256 escrowId) 
        external 
        escrowExists(escrowId) 
        onlyEscrowSeller(escrowId) 
        nonReentrant 
    {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.isActive, "Escrow is not active");

        escrow.isActive = false;

        // Transfer funds to seller
        address seller = tickets[escrow.ticketId].seller;
        (bool success, ) = seller.call{value: escrow.amount}("");
        require(success, "Transfer to seller failed");

        emit TicketReleased(escrowId, escrow.buyer, seller);
        emit FundsWithdrawn(escrowId, seller, escrow.amount);
    }

    /**
     * @dev Cancel escrow and refund buyer (buyer action)
     * @param escrowId The ID of the escrow
     */
    function cancelEscrow(uint256 escrowId) 
        external 
        escrowExists(escrowId) 
        onlyEscrowBuyer(escrowId) 
        nonReentrant 
    {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.isActive, "Escrow is not active");

        escrow.isActive = false;

        // Re-list the ticket
        tickets[escrow.ticketId].isListed = true;

        // Refund buyer
        (bool success, ) = escrow.buyer.call{value: escrow.amount}("");
        require(success, "Refund to buyer failed");

        emit EscrowCancelled(escrowId, escrow.buyer, tickets[escrow.ticketId].seller);
    }

    /**
     * @dev Get ticket details
     * @param ticketId The ID of the ticket
     * @return seller Address of the seller
     * @return price Price in wei
     * @return imageHash IPFS hash of the ticket image
     * @return isListed Whether the ticket is currently listed
     */
    function getTicket(uint256 ticketId) 
        external 
        view 
        ticketExists(ticketId) 
        returns (address seller, uint256 price, string memory imageHash, bool isListed) 
    {
        Ticket storage ticket = tickets[ticketId];
        return (ticket.seller, ticket.price, ticket.imageHash, ticket.isListed);
    }

    /**
     * @dev Get escrow details
     * @param escrowId The ID of the escrow
     * @return ticketId The ID of the ticket
     * @return buyer Address of the buyer
     * @return amount Amount in wei
     * @return isActive Whether the escrow is active
     */
    function getEscrow(uint256 escrowId) 
        external 
        view 
        escrowExists(escrowId) 
        returns (uint256 ticketId, address buyer, uint256 amount, bool isActive) 
    {
        Escrow storage escrow = escrows[escrowId];
        return (escrow.ticketId, escrow.buyer, escrow.amount, escrow.isActive);
    }

    /**
     * @dev Get all tickets listed by a user
     * @param user Address of the user
     * @return Array of ticket IDs
     */
    function getUserTickets(address user) external view returns (uint256[] memory) {
        return userTickets[user];
    }

    /**
     * @dev Get all escrows created by a user
     * @param user Address of the user
     * @return Array of escrow IDs
     */
    function getUserEscrows(address user) external view returns (uint256[] memory) {
        return userEscrows[user];
    }

    /**
     * @dev Get total number of tickets
     * @return Total number of tickets
     */
    function getTotalTickets() external view returns (uint256) {
        return _ticketIds.current();
    }

    /**
     * @dev Get total number of escrows
     * @return Total number of escrows
     */
    function getTotalEscrows() external view returns (uint256) {
        return _escrowIds.current();
    }

    /**
     * @dev Emergency function to withdraw stuck funds (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Emergency withdrawal failed");
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Allow contract to receive ETH
    }
} 