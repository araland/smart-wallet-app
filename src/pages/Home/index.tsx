import { useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";

import Web3 from "web3";
import ERC20ABI from "../../utils/abi/ERC20.json";

import { getEllipsisTxt } from "../../utils/formatter";
import Spinner from "./Spinner";

interface PopularTokenList {
  usdt: number;
  usdc: number;
}

const ethRpc = "https://ethereum.publicnode.com";
const erc20Token: any = {
  1: {
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  56: {
    usdt: "0x55d398326f99059ff775485246999027b3197955",
    usdc: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  },
  97: {
    usdt: "0x3b381528099ecb2be76b89fa49d4776b3357fec8",
    usdc: "0xE6C70f9D9713523a0F271F0d43E246b6C05b886A",
  },
};

function Home() {
  const { sdk, connected, connecting, provider, chainId, account } = useSDK();

  const [ethBalance, setEthBalance] = useState<number>(0);
  const [popularErcToken, setPopularErcToken] = useState<PopularTokenList>({
    usdt: 0,
    usdc: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const web3 = new Web3(provider || ethRpc);

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      // console.warn(`failed to connect..`, err);
    }
  };
  const disconnect = async () => {
    try {
      sdk?.disconnect();
    } catch (err) {
      // console.error("failed to disconnect..", err);
    }
  };

  const getEthBalance = async () => {
    if (!account) {
      setIsLoading(false);
      return;
    }

    try {
      const getBalance = await web3.eth.getBalance(account);
      const ethBalance = Number(web3.utils.fromWei(getBalance, "ether"));
      setEthBalance(ethBalance);
    } catch (err) {
      // console.error("Error on getEthBalance: ", err);
    }
  };
  const getErcBalance = async (token: string, chainId: number) => {
    if (!chainId) {
      setIsLoading(false);
      return;
    }

    try {
      const tokenAddress = erc20Token[chainId][token];
      const contract: any = new web3.eth.Contract(ERC20ABI, tokenAddress);
      const bal = await contract.methods.balanceOf(account).call();
      setPopularErcToken((prevState) => ({
        ...prevState,
        [token]:
          token == "usdt" ? Number(bal) / 10 ** 6 : Number(bal) / 10 ** 18,
      }));
    } catch (err) {
      // console.error("Error on getErcBalance: ", err);
    }
  };

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      await getEthBalance();
      await getErcBalance("usdt", Number(chainId));
      await getErcBalance("usdc", Number(chainId));
      setIsLoading(false);
    }

    init();

    return () => {
      setEthBalance(0);
      setPopularErcToken({
        usdt: 0,
        usdc: 0,
      });
      setIsLoading(false);
    };
  }, [account, chainId]);

  return (
    <div className="home bg-cover-pattern h-screen">
      <div className="container max-w-3xl m-auto px-4">
        <div className="heading h-20 flex justify-end items-center">
          {connected ? (
            <div
              className="disconnect-btn wallet-btn border-2 border-white rounded p-2 cursor-pointer"
              onClick={disconnect}
            >
              {account ? getEllipsisTxt(account) : "Connecting..."}
            </div>
          ) : (
            <div
              className="connect-btn wallet-btn border-2 border-white rounded p-2 cursor-pointer"
              onClick={connect}
            >
              {connecting ? "Connecting..." : "Connect"}
            </div>
          )}
        </div>
        <div className="content h-full py-20">
          <div className="connect-box">
            <div className="status">
              <span className="key-label text-lg">Connection Status: </span>
              <span className="value-label">
                {connected ? "connected" : "disconnected"}
              </span>
            </div>
            <div className="chain-id">
              <span className="key-label text-lg">Chain ID: </span>
              <span className="value-label">
                {chainId ? Number(chainId) : "disconnected"}
              </span>
            </div>
            <div className="wallet-balance flex items-center gap-2 mt-4">
              <span className="key-label text-lg">ETH Value: </span>
              <span className="value-label">
                {isLoading ? <Spinner /> : ethBalance}
              </span>
            </div>
            <div className="wallet-balance flex items-center gap-2">
              <span className="key-label text-lg">USDT Value: </span>
              <span className="value-label">
                {isLoading ? <Spinner /> : popularErcToken.usdt}
              </span>
            </div>
            <div className="wallet-balance flex items-center gap-2">
              <span className="key-label text-lg">USDC Value: </span>
              <span className="value-label">
                {isLoading ? <Spinner /> : popularErcToken.usdc}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
