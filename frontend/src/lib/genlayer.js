import { createClient } from "genlayer-js";

// From GenLayer Docs / Network Config
export const BRADBURY_CHAIN = {
  id: 4221,
  name: "GenLayer Bradbury Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "GEN",
    symbol: "GEN",
  },
  rpcUrls: {
    default: { http: ["https://rpc-bradbury.genlayer.com"] },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer-bradbury.genlayer.com" },
  },
};

// Official contract address deployed
export const GEN_RESOLVE_ADDRESS = "0x98328B991c55BDFF44b4ef228b112EAb66A1b005";

export function getGenLayerClient(userAddress = null) {
  return createClient({
    chain: BRADBURY_CHAIN,
    // If userAddress is provided, genlayer SDK delegates signing to window.ethereum
    ...(userAddress ? { account: userAddress } : {})
  });
}
