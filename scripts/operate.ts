import { ethers } from "hardhat";
import { Lock } from "../typechain-types";

import * as fs from "fs/promises";

import path from "path";

const main = async () => {
  const address = "0x93371030777779992812969434E2064169394aAA";
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);
  const Contract = await ethers.getContractFactory("Lock");
  const contract: Lock = Contract.attach(address) as Lock;
  console.log(await contract.getAddress());

  // await contract.setValue(1235);
  // console.log(await contract.value());

  // await contract.setMapping(ethers.toUtf8Bytes("/abc"), "string content ");

  // console.log(`web3 url is : https://${address}.80001.w3link.io/abc`);

  const processFile = async (filePath: string) => {
    try {
      const content = await fs.readFile(filePath, "utf8");
      const uri = filePath.replace("vite-project/dist", "");
      console.log(`Processing file: ${filePath} to URI: ${uri}`);
      const tx = await contract.setMapping(ethers.toUtf8Bytes(uri), content, {
        // gasLimit: ethers.parseUnits("30000000", "wei"),
      });
      console.log(
        `Transaction for ${uri} sent, waiting for confirmation ${tx.hash}`
      );
      await tx.wait();
      console.log(`Transaction for ${uri} completed`);
      console.log(`web3 url is : https://${address}.80001.w3link.io${uri}`);
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  };

  const traverseDirectory = async (directoryPath: string) => {
    try {
      const files = await fs.readdir(directoryPath);

      for (const file of files) {
        const fullPath = path.join(directoryPath, file);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          await traverseDirectory(fullPath);
        } else if (stats.isFile()) {
          await processFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${directoryPath}:`, error);
    }
  };

  await traverseDirectory("vite-project/dist");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
