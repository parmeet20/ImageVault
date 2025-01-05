import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ListFiles from "./ListFilex";

interface ShareAccessProps {
  address: string;
  contract: ethers.Contract;
}

interface Access {
  user: string;
  access: boolean;
}

const ShareAccess: React.FC<ShareAccessProps> = ({ contract }) => {
  const [accessList, setAccessList] = useState<Access[]>([]);
  const [userAddress, setUserAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchAddress, setSearchAddress] = useState<string>("");

  const fetchAccessList = async () => {
    try {
      const accessData: Access[] = await contract.shareAccess();
      setAccessList(accessData);
    } catch (error) {
      console.error("Error fetching access list:", error);
    }
  };

  const allowAccess = async () => {
    if (!ethers.isAddress(userAddress)) {
      alert("Invalid Ethereum address");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.allow(userAddress);
      await tx.wait();
      alert("Access granted!");
      fetchAccessList();
    } catch (error) {
      console.error("Error granting access:", error);
      alert("Error granting access!");
    }
    setLoading(false);
  };

  const disallowAccess = async (user: string) => {
    setLoading(true);
    try {
      const tx = await contract.disAllow(user);
      await tx.wait();
      alert("Access revoked!");
      fetchAccessList();
    } catch (error) {
      console.error("Error revoking access:", error);
      alert("Error revoking access!");
    }
    setLoading(false);
  };


  useEffect(() => {
    if (contract) {
      fetchAccessList();
    }
  }, [contract]);

  return (
    <div className="p-6 space-y-4 shadow-md border m-10 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Share Access</h2>

      <div className="mb-5">
        <Input
          placeholder="Enter Ethereum address to grant access"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          className="w-full mb-4"
        />
        <Button onClick={allowAccess} disabled={loading} className="w-full">
          {loading ? "Processing..." : "Allow Access"}
        </Button>
      </div>

      <div className=" border p-5 shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Users with Access</h3>
        {accessList.length > 0 ? (
          <ul className="space-y-2">
            {accessList.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  {item.user}
                  {item.access ? " (Granted)" : " (Revoked)"}
                </span>
                <Button
                  variant="destructive"
                  onClick={() => disallowAccess(item.user)}
                  size="sm"
                >
                  Disallow
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users have access.</p>
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Search Images by Address</h3>
        <Input
          placeholder="Enter Ethereum address to search images"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          className="w-full mb-4"
        />
        <ListFiles contract={contract!} account={searchAddress}/>
      </div>


    </div>
  );
};

export default ShareAccess;
