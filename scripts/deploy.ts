import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  // const wallet = ethers.Wallet.createRandom();
  // console.log(wallet.privateKey);

  const provider = ethers.provider;

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await provider.getBalance(deployer.address);
  console.log(`deploy balance is : ${balance}`);

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.parseEther("0.001");
  if (balance.valueOf() > lockedAmount.valueOf()) {
    const lock = await ethers.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });

    await lock.waitForDeployment();

    console.log(
      `Lock with ${ethers.formatEther(
        lockedAmount
      )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
    );

    console.log(`web3 url is : web3://${lock.target}.80001/hello`);

    console.log(
      `web3 url is : https://${lock.target}.80001.w3link.io/hello?returns=(string)`
    );

    console.log(`update script content`);

    const script = `
    
    console.log("hello world");
          window.web3 = {
            pub_time: 123456,    
          }
    
    `;

    await lock.setScriptContent(script);
    console.log(
      `web3 url is : https://${lock.target}.80001.w3link.io/scriptContent`
    );

    await lock.setMapping(
      ethers.toUtf8Bytes("/"),
      `<script>location.href="/index.html";</script>`
    );
  } else {
    console.log("Insufficient funds");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
