"use client";
import { useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function MetaMaskPay() {
  const [account, setAccount] = useState("");

  // Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } else {
      alert("MetaMask not installed");
    }
  };

  // Dummy Payment
  const sendPayment = async () => {
    if (!account) return alert("Connect wallet first");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    await signer.sendTransaction({
      to: "0xYourTestWalletAddressHere", // testnet wallet
      value: ethers.parseEther("0.01"),
    });
    alert("Transaction sent!");
  };

  return (
    <div>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect MetaMask"}
      </button>

      {account && <button onClick={sendPayment}>Send Dummy Payment</button>}
    </div>
  );
}
