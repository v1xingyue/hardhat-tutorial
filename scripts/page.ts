import { ethers } from "hardhat";
import * as fs from "fs/promises";
import path from "path";

async function main() {
  const deployPath = "vite-project/dist";
  const provider = ethers.provider;
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await provider.getBalance(deployer.address);
  console.log(`deploy balance is : ${balance}`);

  const lockedAmount = ethers.parseEther("0.001");
  if (balance.valueOf() > lockedAmount.valueOf()) {
    const page = await ethers.deployContract("Page", [], {
      value: lockedAmount,
    });
    await page.waitForDeployment();
    console.log(
      `Lock with ${ethers.formatEther(lockedAmount)} ETH and  deployed to ${
        page.target
      }`
    );

    const processFile = async (filePath: string) => {
      try {
        const content = await fs.readFile(filePath, "utf8");
        const uri = filePath.replace(deployPath, "");
        console.log(
          `Processing file: ${filePath} len: ${content.length} to URI: ${uri}`
        );

        const tx = await page.setMapping(ethers.toUtf8Bytes(uri), content);
        console.log(
          `Transaction for ${uri} sent, waiting for confirmation ${tx.hash}`
        );
        await tx.wait();
        console.log(`Transaction for ${uri} completed`);
        console.log(
          `web3 url is : https://${page.target}.80001.w3link.io${uri}. sleep 3 seconds ....`
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
  } else {
    console.log("Insufficient funds");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
