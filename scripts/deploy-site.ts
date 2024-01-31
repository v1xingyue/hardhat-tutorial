import { ethers } from "hardhat";
import { Lock } from "../typechain-types";

import * as fs from "fs/promises";

import path from "path";

const main = async () => {
  const deployPath = "vite-project/dist";
  const address = "0x6eC3512a2A37f068797764A843B27017693035a1";
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);
  const Contract = await ethers.getContractFactory("Lock");
  const contract: Lock = Contract.attach(address) as Lock;
  console.log(await contract.getAddress());

  const processFile = async (filePath: string) => {
    try {
      const content = await fs.readFile(filePath, "utf8");
      const uri = filePath.replace(deployPath, "");
      console.log(
        `Processing file: ${filePath} len: ${content.length} to URI: ${uri}`
      );

      const tx = await contract.setMapping(ethers.toUtf8Bytes(uri), content);
      console.log(
        `Transaction for ${uri} sent, waiting for confirmation ${tx.hash}`
      );
      await tx.wait();
      console.log(`Transaction for ${uri} completed`);
      console.log(
        `web3 url is : https://${address}.80001.w3link.io${uri}. sleep 3 seconds ....`
      );
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("do next Transaction!");
          resolve(true);
        }, 3000);
      });
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

  await traverseDirectory(deployPath);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
