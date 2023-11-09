import { useState } from "react";
import { useSDK } from "@metamask/sdk-react";

import "./Home.css";

function Home() {
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const [account, setAccount] = useState<string>("");

  const connect = async () => {
    try {
      const accounts: any = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };
  const disconnect = async () => {
    try {
      const res = sdk?.disconnect();
      console.log(res);
      setAccount("");
    } catch (err) {
      console.error("failed to disconnect..", err);
    }
  };

  console.log(sdk);

  return (
    <div className="home">
      <div className="container">
        {connected ? (
          <div className="disconnect-btn wallet-btn" onClick={disconnect}>
            Disconnect
          </div>
        ) : (
          <div className="connect-btn wallet-btn" onClick={connect}>
            {connecting ? "Loading..." : "Connect"}
          </div>
        )}

        <div className="connect-box">
          <div className="status">
            <span className="key-label">Connection Status: </span>
            <span className="value-label">
              {connected ? "connected" : "disconnected"}
            </span>
          </div>
          <div className="wallet-address">
            <span className="key-label">Wallet Address: </span>
            <span className="value-label">{account ? account : ""}</span>
          </div>
          <div className="chain-id">
            <span className="key-label">Chain ID: </span>
            <span className="value-label">{chainId?.toString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
