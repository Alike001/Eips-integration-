import { useEffect, useState } from "react";

const SUPPORTED_CHAINS = {
  11155111: {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
  },
  84532: {
    chainId: "0x14a34",
    chainName: "Base Sepolia",
  },
};

const Eip6963 = () => {
  const [providers, setProviders] = useState([]);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(0);
  const [activeProvider, setActiveProvider] = useState(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

 useEffect(() => {
  const handleAnnouncement = (event) => {
    console.log("Provider: ", event.detail);
    setProviders((prev) => {
      const alreadyExists = prev.some(
        (p) => p.info.uuid === event.detail.info.uuid
      );
      if (alreadyExists) return prev;
      return [...prev, event.detail];
    });
  };

  window.addEventListener("eip6963:announceProvider", handleAnnouncement);

  window.dispatchEvent(new Event("eip6963:requestProvider"));

  return () => {
    window.removeEventListener("eip6963:announceProvider", handleAnnouncement);
  };
}, []);

  const validateChain = (chainId) => {
    const supported = Object.keys(SUPPORTED_CHAINS).includes(String(chainId));
    setIsWrongNetwork(!supported);

    if (!supported) {
      alert(
        `Unsupported network detected (chainId: ${chainId}). Please switch to Sepolia or Base Sepolia.`
      );
    }
  };

  const handleConnectWallet = async (provider) => {
    try {
      if (provider) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setActiveProvider(provider);

        const chainId = await provider.request({ method: "eth_chainId" });
        setChainId(parseInt(chainId, 16));
        validateChain(parseInt(chainId, 16));

        provider.on("accountsChanged", (accounts) => {
          setAccount(accounts[0] || "");
          if (!accounts[0]) {
            setActiveProvider(null);
          }
        });

        provider.on("chainChanged", (newChainId) => {
          setChainId(parseInt(newChainId, 16));
          validateChain(parseInt(newChainId, 16));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = () => {
    setAccount("");
    setChainId(0);
    setActiveProvider(null);
    setIsWrongNetwork(false);
  };

  const handleSwitchNetwork = async (targetChainId) => {
    if (!activeProvider) return;

    const targetChain = SUPPORTED_CHAINS[targetChainId];

    try {
      await activeProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChain.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await activeProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: targetChain.chainId,
                chainName: targetChain.chainName,
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
          alert("Failed to add the network to your wallet.");
        }
      } else {
        console.error("Failed to switch network:", switchError);
        alert("Failed to switch network.");
      }
    }
  };

 return (
    <div>
      {providers.map((provider) => (
        <div
          key={provider.info.uuid}
          style={{ display: "flex", gap: "10px", alignItems: "center", margin: "10px 20px" }}
        >
          <img
            src={provider.info.icon}
            alt={provider.info.name}
            width={50}
            height={50}
          />
          <p>{provider.info.name}</p>
          <button onClick={() => handleConnectWallet(provider.provider)}>
            connect {provider.info.name}
          </button>
        </div>
      ))}

      {account && (
        <div style={{ marginTop: "20px", marginLeft: "20px" }}>
          <h2>Connection Established</h2>

          <p>Account Connected: {account}</p>
          <p>Chain connected: {chainId}</p>

          {isWrongNetwork && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              ⚠ Wrong network! Please switch to a supported chain.
            </p>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {Object.entries(SUPPORTED_CHAINS).map(([id, chain]) => (
              <button key={id} onClick={() => handleSwitchNetwork(Number(id))}>
                Switch to {chain.chainName}
              </button>
            ))}
          </div>

          <button
            onClick={handleDisconnect}
            style={{ marginTop: "15px", backgroundColor: "red", color: "white" }}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default Eip6963;