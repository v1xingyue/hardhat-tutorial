import { ethers } from "hardhat";

import zlib from "zlib";

async function main() {
  const provider = ethers.provider;
  const network = await provider.getNetwork();
  const chainId = network.chainId.valueOf();
  console.log("chainId: ", chainId);
  console.log("network: ", network.name);
  const [deployer] = await ethers.getSigners();
  console.log("Current deployer address:", deployer.address);
  const balance = await provider.getBalance(deployer.address);
  console.log(`deploy balance is :  ${ethers.formatEther(balance)}`);

  const gp = await ethers.deployContract("GzipPage", [], {
    value: 0,
  });
  await gp.waitForDeployment();
  console.log("deployed at : ", await gp.getAddress());

  const jsRaw = `
  console.log("hello world");
  `;
  const buffer = Buffer.from(jsRaw, "utf-8");

  zlib.gzip(buffer, async (err, result) => {
    if (err) throw err;
    console.log("gzip result : ", result);
    const tx = await gp.setGzipScript(result);
    await tx.wait();

    console.log(
      `web3 url is : https://${gp.target}.${chainId}.w3link.io/gzip.js`
    );

    console.log(`web3 url is : web3://${gp.target}:${chainId}/gzip.js`);

    const gzipJs = await gp.gzipJavascript();
    console.log("gzipjs is : ", gzipJs);
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
