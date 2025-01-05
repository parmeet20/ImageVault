import React from "react";
import { ethers } from "ethers";
import ABI from "./ABI.json";
import UploadFile from "./components/UploadFile";
import ListFiles from "./components/ListFilex";
import { Button } from "./components/ui/button";
import ShareAccess from "./components/ShareAccess";
import { contractAddress } from "./conf/envVariables";
const App: React.FC = () => {
  const [address, setAddress] = React.useState<string | null>(null);

  const [, setProvider] = React.useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  React.useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          ABI.abi,
          signer
        );
        setContract(contractInstance);
        setProvider(provider);

        try {
          if (provider) {
            await provider.send("eth_requestAccounts", []);
            window.ethereum.on("accountsChanged", () => {
              window.location.reload();
            });

            const signer = provider.getSigner();
            const address = (await signer).getAddress();
            setAddress(await address);
          }
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      }
    };
    connectWallet();
    console.log("hello");
  }, []);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  return (
    <div>
      {/* Navbar */}
      <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-7xl shadow-lg z-50">
        <div className="flex justify-between items-center">
          <div className="flex">
            <img src="https://tse3.mm.bing.net/th?id=OIG2.B7S17.Lpw.Eux6SHsqc2&pid=ImgGn" alt="NA" height={2} className="mr-2 rounded-full" width={40} />
            <h1 className="text-slate-700 text-3xl font-bold">ImageVault</h1>
          </div>
          <div className="space-x-4 flex items-center">
            <UploadFile contract={contract!} account={address!} />
            <Button>
              {address ? (
                <span className="text-sm font-semibold">
                  Connected: {shortenAddress(address)}
                </span>
              ) : (
                <span className="text-sm font-semibold">Loading...</span>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-24">
        <h2 className="text-2xl font-bold mb-6 text-center">My Gallery</h2>
        <ListFiles contract={contract!} account={address!} />
        <ShareAccess contract={contract!} address={address!} />
      </div>
    </div>
  );
};

export default App;
