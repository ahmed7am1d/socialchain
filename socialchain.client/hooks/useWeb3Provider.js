import { useState, useEffect } from "react";
import { ethers } from "ethers";
import SocialChainContractConstants from "@/constants/blockchain/SocialChainContractConstants";
import socialChainContractABI from "../contract-artifacts/contracts/SocialChain.sol/SocialChain.json";

export default function useWeb3Provider() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const contract = new ethers.Contract(
          SocialChainContractConstants.SOCIAL_CHAIN_CONTRACT_ADDRESS,
          socialChainContractABI.abi,
          provider
        );
        setContract(contract);
      }
    }
    init();
  }, []);
  return {provider,contract}
}
