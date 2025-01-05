import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "./ui/button";

interface ListFilesProps {
  account: string;
  contract: ethers.Contract;
}

interface IItems {
  name: string;
  description: string;
  uri: string;
}

const ListFiles: React.FC<ListFilesProps> = ({ account, contract }) => {
  const [items, setItems] = useState<IItems[]>([]);

  const fetchFiles = async () => {
    try {
      const itemsArray: IItems[] = await contract.display(account);
      setItems(itemsArray);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    if (account && contract) {
      fetchFiles();
    }
  }, [account, contract]);

  const handleDownload = async (uri: string, name: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Card
              key={index}
              className="w-64 h-auto mx-auto shadow-lg flex flex-col justify-between"
            >
              <CardHeader>
                <h3 className="text-lg font-semibold">{item.name}</h3>
              </CardHeader>
              <CardContent className="flex-grow">
                <img
                  src={item.uri}
                  alt={item.name}
                  className="rounded-lg mb-4 w-full h-[200px] object-cover"
                />
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleDownload(item.uri, item.name)}
                >
                  Download Document
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No items found for this account.</p>
        )}
      </div>
    </div>
  );
};

export default ListFiles;
