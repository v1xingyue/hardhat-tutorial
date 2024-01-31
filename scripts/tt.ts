import { ethers } from "hardhat";

async function main() {
  // const wallet = ethers.Wallet.createRandom();
  // console.log(wallet.privateKey);

  const provider = ethers.provider;

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await provider.getBalance(deployer.address);
  console.log(`deploy balance is : ${balance}`);
  console.log(ethers.formatEther(balance));

  const lockedAmount = ethers.parseEther("0.001");
  if (balance.valueOf() > lockedAmount.valueOf()) {
    const lock = await ethers.deployContract("Hello", [], {
      value: 0,
    });

    await lock.waitForDeployment();

    const p = await lock.person();

    console.log("Lock deployed to:", await lock.getAddress());
    console.log(p);

    const x = new ethers.AbiCoder().decode(
      ["string", "uint", "uint", "bool"],
      "0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000be0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000a4a6f686e2042726f776e00000000000000000000000000000000000000000000"
    );
    console.log(x);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
