import ConnectButton from "./components/ConnectButton";
import { useWalletConnection } from "./hooks/useWalletConnection";

function App() {
  const { account, chainId, balance, isWrongChain, getBalance } = useWalletConnection();


  return (
    <div>
      <h1 style={{ margin: "20px" }}>EIP 1193</h1>
      {account && (
        <>
          <p>Account: {account}</p>
        </>
      )}
      {chainId && (
        <>
          <p>Chainid: {chainId}</p>
        </>
      )}

      {balance && (
        <>
          <p>Balance: {balance}</p>
        </>
      )}


      {isWrongChain && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          ⚠ Unsupported network. Please switch to Sepolia or Base Sepolia.
        </p>
      )}

      <ConnectButton />

      {account && (
        <button onClick={getBalance} style={{ marginLeft: "10px" }}>
          Refresh Balance
        </button>
      )}
      
    </div>
  );
}

export default App;




// import { useEffect, useState } from "react";
//import Eip6963 from "./Eip6963";

/*function App() {
  //const [account, setAccount] = useState("");
  //const [chainId, setChainId] = useState(0);

  async function setUp() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    setChainId(parseInt(chainId, 16));

    console.log(accounts);

    // console.log(`hexadecimal string: ${chainId}`);
    // console.log(`decimal number: ${parseInt(chainId, 16)}`);

    // console.log("ETH Balance: ", balance);

    window.ethereum.on("connect", () => {
      console.log("Connected!!");
    });

    window.ethereum.on("accountsChanged", (accounts) => {
      //console.log("Accounts Changed: ", accounts);
      setAccount(accounts[0] || "");
    });

    window.ethereum.on("chainChanged", (chainId) => {
      //console.log("ChainId Changed: ", parseInt(chainId, 16));
      setChainId(parseInt(chainId, 16));
    });

      window.ethereum.on("disconnect", () => {
      console.log("Disconnected!!");
      setAccount("");
      setChainId(0);
    }); 


    
  }

  useEffect(() => {
    setUp();
  }, []);

  return (
    <div>
      <Eip6963 />

      <h1 style={{margin: "20px"}}>EIP 1193</h1>
      <p>Account: {account}</p>
      <p>chainid: {chainId}</p>
    </div>
  );
}

export default App; */