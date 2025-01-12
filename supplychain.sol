// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    
    enum Role { None, Supplier, Manufacturer, Distributor, Wholesaler, Retailer, Consumer }

    struct Member {
        address addr;
        Role role;
        string name;
    }

    
    struct Product {
        uint256 id;
        string name;
        string ipfsHash; 
        address owner;
        string status;
    }

    mapping(address => Member) public members; 
    mapping(uint256 => Product) public products; 

    
    uint256 public productCount;

    
    address public owner;


    event MemberRegistered(address indexed addr, Role role, string name);
    event ProductCreated(uint256 indexed id, string name, address indexed owner, string status);
    event ProductOwnershipTransferred(uint256 indexed id, address indexed from, address indexed to, string status);

    
    modifier onlyOwner() {
        require(msg.sender == owner, "Access denied: Only the contract owner can perform this action");
        _;
    }


    modifier onlyRole(Role role) {
        require(members[msg.sender].role == role, "Access denied: Incorrect role");
        _;
    }

    modifier productExists(uint256 id) {
        require(products[id].id != 0, "Product does not exist");
        _;
    }

    
    constructor() {
        owner = msg.sender;
    }


    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }

    
    function registerMember(address addr, Role role, string memory name) public onlyOwner {
        require(members[addr].role == Role.None, "Member already registered");
        members[addr] = Member(addr, role, name);
        emit MemberRegistered(addr, role, name);
    }

    
    function createProduct(string memory name, string memory ipfsHash) public onlyRole(Role.Supplier) {
        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: name,
            ipfsHash: ipfsHash,
            owner: msg.sender,
            status: "Created"
        });
        emit ProductCreated(productCount, name, msg.sender, "Created");
    }


    function transferOwnershipOfProduct(uint256 id, address to) public productExists(id) {
        Product storage product = products[id];
        require(product.owner == msg.sender, "Only the owner can transfer ownership");
        require(members[to].role != Role.None, "Recipient must be a registered member");

    
        Role senderRole = members[msg.sender].role;
        Role recipientRole = members[to].role;

        if (senderRole == Role.Supplier) {
            require(recipientRole == Role.Manufacturer, "Supplier can only transfer to Manufacturer");
        } else if (senderRole == Role.Manufacturer) {
            require(recipientRole == Role.Distributor, "Manufacturer can only transfer to Distributor");
        } else if (senderRole == Role.Distributor) {
            require(recipientRole == Role.Wholesaler, "Distributor can only transfer to Wholesaler");
        } else if (senderRole == Role.Wholesaler) {
            require(recipientRole == Role.Retailer, "Wholesaler can only transfer to Retailer");
        } else if (senderRole == Role.Retailer) {
            require(recipientRole == Role.Consumer, "Retailer can only transfer to Consumer");
        } else {
            revert("Invalid ownership transfer");
        }

    
        address previousOwner = product.owner;
        product.owner = to;
        product.status = getStatusForRole(recipientRole);

        emit ProductOwnershipTransferred(id, previousOwner, to, product.status);
    }

    // Get product status based on role
    function getStatusForRole(Role role) internal pure returns (string memory) {
        if (role == Role.Manufacturer) return "Under Production";
        if (role == Role.Distributor) return "In Distribution";
        if (role == Role.Wholesaler) return "In Wholesale";
        if (role == Role.Retailer) return "Available in Retail";
        if (role == Role.Consumer) return "Delivered to Consumer";
        return "Unknown Status";
    }


    function getProduct(uint256 id) public view productExists(id) returns (
        uint256, string memory, string memory, address, string memory
    ) {
        Product memory product = products[id];
        return (product.id, product.name, product.ipfsHash, product.owner, product.status);
    }
}
