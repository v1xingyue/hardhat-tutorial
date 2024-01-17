# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
pnpm hardhat help
pnpm hardhat test
REPORT_GAS=true npx hardhat test
pnpm hardhat node
pnpm hardhat run --network mumbai scripts/deploy.ts
pnpm hardhat run scripts/generateAccount.ts

```

Example .env

```shell
PRIVATE_KEY=
ALCHEMY_API_KEY=
```


Use this tool deploy one web3 site : 

1. compile contract

```shell
pnpm run compile 
```

2. deploy your contract, you will get the contract address, remember that

```shell
pnpm run deploy
```

3. build site pages

```shell
cd vite-project 
pnpm run build 
```

3.  upload file content to your contract. 

```shell
pnpm run deploy-site
```

You need also modify deploy-site.ts .