import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { PinataApiKey, PinataApiSecret } from "@/conf/envVariables";

interface UploadFileProps {
  account: string;
  contract: ethers.Contract;
}

const UploadFile: React.FC<UploadFileProps> = ({ account, contract }) => {
  const [file, setFile] = useState<File | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType.startsWith("image/")) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please select a valid image file (JPG, PNG, JPEG, GIF).");
        setFile(null);
      }
    }
  };

  const uploadToPinata = async () => {
    if (!file || !name || !description) return;

    setLoading(true);
    setError(null);

    const PINATA_API_KEY = PinataApiKey; // Replace with your actual Pinata API Key
    const PINATA_SECRET_KEY = PinataApiSecret; // Replace with your actual Pinata Secret Key

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      setIpfsUrl(ipfsUrl);

      await contract.add(account, name, description, ipfsUrl);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
      setError("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Upload New Image</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Select an image, add a name and description, and upload it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="text"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
              className="input w-full"
            />
            <Input
              type="text"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              className="input w-full"
            />
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="input w-full"
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="mt-4">
              <Button onClick={uploadToPinata} disabled={loading || !file || !name || !description}>
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>

          {ipfsUrl && (
            <div className="mt-4">
              <p>Image uploaded successfully!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadFile;
