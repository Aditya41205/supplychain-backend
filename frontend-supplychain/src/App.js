import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS = "0x0358a4ec68fa43282bf7d402dfbc4a40bfd48f6e";
const CONTRACT_ABI =  [
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "addr",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "enum SupplyChain.Role",
              "name": "role",
              "type": "uint8"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
          }
      ],
      "name": "MemberRegistered",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "status",
              "type": "string"
          }
      ],
      "name": "ProductCreated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "status",
              "type": "string"
          }
      ],
      "name": "ProductOwnershipTransferred",
      "type": "event"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "addr",
              "type": "address"
          },
          {
              "internalType": "enum SupplyChain.Role",
              "name": "role",
              "type": "uint8"
          },
          {
              "internalType": "string",
              "name": "name",
              "type": "string"
          }
      ],
      "name": "registerMember",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "name",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
          }
      ],
      "name": "createProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          }
      ],
      "name": "transferOwnershipOfProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
          }
      ],
      "name": "getProduct",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          },
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          },
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          },
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
          }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "productCount",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "owner",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "members",
      "outputs": [
          {
              "internalType": "address",
              "name": "addr",
              "type": "address"
          },
          {
              "internalType": "enum SupplyChain.Role",
              "name": "role",
              "type": "uint8"
          },
          {
              "internalType": "string",
              "name": "name",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "products",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
          },
          {
              "internalType": "string",
              "name": "name",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
          },
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "internalType": "string",
              "name": "status",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  }
]
;

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [addr, setAddr] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [productId, setProductId] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Metamask not found");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const transferOwnership = async () => {
    if (!window.ethereum) {
      setError("Metamask not found");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      await contract.transferOwnership(newOwner);
      setError("");
      setNewOwner("");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const registerMember = async () => {
    if (!window.ethereum) {
      setError("Metamask not found");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      await contract.registerMember(addr, role, name);
      setError("");
      setAddr("");
      setRole("");
      setName("");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const createProduct = async () => {
    if (!window.ethereum) {
      setError("Metamask not found");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      await contract.createProduct(productName, ipfsHash);
      setError("");
      setProductName("");
      setIpfsHash("");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const getProductStatus = async () => {
    if (!window.ethereum) {
      setError("Metamask not found");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const product = await contract.getProduct(productId);
      setProductStatus(product[4]); // Assuming the 5th return value is the status
      setError("");
      setProductId("");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const transferOwnershipOfProduct = async () => {
    if (!window.ethereum) {
      setError("Metamask not found");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      await contract.transferOwnershipOfProduct(productId, toAddress);
      setError("");
      setProductId("");
      setToAddress("");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Supply Chain Management</h1>

      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Wallet Address: {walletAddress || "Not connected"}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h2>Transfer Ownership of Contract</h2>
        <input
          type="text"
          placeholder="New Owner Address"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
        />
        <button onClick={transferOwnership}>Transfer Ownership</button>
      </div>

      <div>
        <h2>Register Member</h2>
        <input
          type="text"
          placeholder="Address"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role (1-6)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={registerMember}>Register Member</button>
      </div>

      <div>
        <h2>Create Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="IPFS Hash"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
        />
        <button onClick={createProduct}>Create Product</button>
      </div>

      <div>
        <h2>Get Product Status</h2>
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button onClick={getProductStatus}>Get Status</button>
        {productStatus && <p>Status: {productStatus}</p>}
      </div>

      <div>
        <h2>Transfer Ownership of Product</h2>
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Recipient Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
        <button onClick={transferOwnershipOfProduct}>Transfer Ownership</button>
      </div>
    </div>
  );
}

export default App;
