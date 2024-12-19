const { ethers } = require("ethers");
require("dotenv").config();

// Environment Variables
const RPC_URL = process.env.RPC_URL; 
const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY;
const ACCOUNT = process.env.ACCOUNT;

// PancakeSwap Addresses and Pair Info
const PANCAKE_PAIR_ADDRESS = "0xea8e174e7084ca40b5436b7ed0e7f855c77ce907";
const PANCAKE_ROUTER_ADDRESS = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
const USDT_ADDRESS = "0x55d398326f99059ff775485246999027b3197955";
const UPIT_ADDRESS = "0x4db7b2fd0a370170a874926b6fd98d34d3d488b5";

// Trading Parameters
const UPPER_TARGET_PRICE = parseFloat(process.env.UPPER_TARGET_PRICE || 0);
const LOWER_TARGET_PRICE = parseFloat(process.env.LOWER_TARGET_PRICE || 0);
const SELL_AMOUNT_IN_USD = parseFloat(process.env.SELL_AMOUNT_IN_USD || 0);
const MONITOR_INTERVAL_MS = 1000;

// ABI for PancakeSwap Pair, Router, and Token
const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
];
const ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];
const TOKEN_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

// Initialize Ethers.js
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
const pairContract = new ethers.Contract(PANCAKE_PAIR_ADDRESS, PAIR_ABI, provider);
const routerContract = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, ROUTER_ABI, wallet);
const tokenContract = new ethers.Contract(UPIT_ADDRESS, TOKEN_ABI, wallet);

// Helper Functions
async function getPrice() {
  try {
    const { reserve0, reserve1 } = await pairContract.getReserves();
    const usdtReserve = parseFloat(ethers.formatUnits(reserve1, 18));
    const upitReserve = parseFloat(ethers.formatUnits(reserve0, 18));
    if (upitReserve === 0) throw new Error("UPiT reserve is zero, price calculation failed.");
    return usdtReserve / upitReserve;
  } catch (error) {
    console.error("Error fetching price:", error.message);
    return null;
  }
}

async function approveToken(amountInTokens) {
  try {
    console.log("Approving UPiT tokens for PancakeSwap Router...");
    const tx = await tokenContract.approve(PANCAKE_ROUTER_ADDRESS, amountInTokens);
    console.log(`Approval Transaction Hash: ${tx.hash}`);
    await tx.wait();
    console.log("Token Approval Confirmed.");
  } catch (error) {
    console.error("Error approving token:", error.message);
    throw error; 
  }
}

async function executeSell(amountInUSD) {
  try {
    console.log(`Attempting to sell tokens for ${amountInUSD} USD`);

    const currentPrice = await getPrice();
    if (!currentPrice) throw new Error("Unable to fetch current price");

    const amountToSell = amountInUSD / currentPrice;
    const amountIn = ethers.parseUnits(amountToSell.toString(), 18); 
    const deadline = Math.floor(Date.now() / 1000) + 60 * 5;
    const path = [UPIT_ADDRESS, USDT_ADDRESS];
    const to = ACCOUNT;

    await approveToken(amountIn);

    const tx = await routerContract.swapExactTokensForTokens(
      amountIn,
      0,
      path,
      to,
      deadline
    );

    console.log("Sell Order Placed");
    console.log(`Transaction Hash: ${tx.hash}`);
    await tx.wait();
    console.log("Transaction Confirmed.");
  } catch (error) {
    console.error("Error executing sell trade:", error.message);
  }
}

async function monitorPrices() {
  console.log("Monitoring prices...");
  let selling = false;

  while (true) {
    try {
      const price = await getPrice();
      if (!price) {
        console.warn("Price fetch failed, retrying in the next cycle...");
        await new Promise((resolve) => setTimeout(resolve, MONITOR_INTERVAL_MS));
        continue;
      }

      console.log(`Current Price: ${price.toFixed(6)} USDT per UPiT`);

      if (!selling && price >= UPPER_TARGET_PRICE) {
        console.log(`Upper Target Price Reached (${price}). Starting to Sell...`);
        selling = true;
      }

      if (selling) {
        if (price >= LOWER_TARGET_PRICE) {
          console.log(`Price Above Lower Target (${price}). Executing Sell...`);
          await executeSell(SELL_AMOUNT_IN_USD);
          console.log("Sell Complete. Rechecking Price...");
        } else {
          console.log(`Price Dropped Below Lower Target (${price}). Stopping Sales.`);
          selling = false; 
        }
      }
    } catch (error) {
      console.error("Error in price monitoring loop:", error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, MONITOR_INTERVAL_MS));
  }
}

(async () => {
  try {
    console.log("Starting the trading bot...");
    await monitorPrices();
  } catch (error) {
    console.error("Critical error in bot execution:", error.message);
    process.exit(1); 
  }
})();

module.exports = {
  getPrice,
  monitorPrices,
  executeSell, // You can add more exported functions as needed
};
