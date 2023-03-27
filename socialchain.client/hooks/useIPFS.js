import { useEffect, useState } from "react";
import { create } from "ipfs-http-client";

export default function useIPFS() {
  const [ipfs, setIpfs] = useState(null);
  const [ipfsFileHash, setIpfsFileHash] = useState("");
  useEffect(() => {
    async function connect() {
      const apiKey = process.env.NEXT_PUBLIC_IPFS_API_KEY;
      const projectKey = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
      const authorization = "Basic " + btoa(projectKey + ":" + apiKey);
      let ready = false;
      if (!ready) {
        const client = create({
          url: "https://ipfs.infura.io:5001/api/v0",
          headers: {
            authorization,
          },
        });
        setIpfs(client);
        ready = true;
      }
    }
    connect();
  }, []);

  async function uploadFileToIPFS(file) {
    if (!ipfs) return;
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        const buffer = Buffer.from(reader.result);
        const { cid } = await ipfs.add(buffer);
        console.log(cid.toString());
        setIpfsFileHash(cid.toString());
        resolve(cid.toString()); // Return the resolved value of ipfsFileHash
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
    });
  }
  return { ipfs, uploadFileToIPFS };
}
