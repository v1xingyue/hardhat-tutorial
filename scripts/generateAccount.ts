import { ethers } from "hardhat";

async function main() {
  const account = ethers.Wallet.createRandom();
  console.log(`privateKey:  ${account.privateKey}`);
  console.log(`address : ${account.address}`);
  const provider = ethers.provider;
  const balance = await provider.getBalance(account.address);
  console.log(`balance : ${balance}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
