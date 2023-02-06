# Nifty Minter Dapp - Back End

> This is the back end to [Nifty Minter](https://github.com/aaronjan98/Nifty-Minter-Frontend), a dapp that uses AI to generate images for your NFTs and then goes ahead and mints it on the Goerli testnet.

## Resources

- [Deployed Site](https://nifty-minter.herokuapp.com)
- [Watch tutorial on how to use the Dapp](https://www.youtube.com/watch?v=bSk57Y9tEbs)
- [The Front End Repo](https://github.com/aaronjan98/Nifty-Minter-Frontend)
- [Contract on Etherscan](https://goerli.etherscan.io/address/0x8d20aac997e30de71581ac30240db9ab235acb8b)

## Install

```sh
npm install
```

## Usage

1. Run blockchain node with ganache

```sh
npm run ganache
```

2. Add the network to MetaMask and import the ganache accounts

- you can change the port and chain ID in the package.json scripts,
  but by default the RPC URL is `http://127.0.0.1:9002`,
  the chain ID is `1338`, and the currency symbol is `ETH`.

3. Deploy NFT contract to local blockchain

- If the front end and back end repos are adjacent to each other,
  then the NFT ABI will automatically be written to the front end.
  Otherwise you'll have to change the file path in `common/tokens.js`.

  ```sh
  npx hardhat run scripts/deploy.js --network ganache
  ```

4. Then you'll need to copy the outputted NFT address from the previous
   command and update the NFT address in the front end file `src/config.json`

- Optionally, you can view the ganache/hardhat accounts' Ether balances
  with this command

  ```sh
  npx hardhat run scripts/getBalances.js --network ganache
  ```

5. See [the front end](https://github.com/aaronjan98/Nifty-Minter-Frontend) for starting the web server

## Deployment to public Network

1. Configure API keys in your `.env`

```.env
PRIVATE_KEYS="{private key for the account your deploying with}"
ALCHEMY_API_KEY="{get key by creating a project with Alchemy}"
ETHERSCAN_API_KEY="{do the same with etherscan}"
```

2. Deploy to Goerli or whichever network

```sh
npx hardhat run scripts/deploy.js --network goerli
```

3. Verify Contract

```sh
npx hardhat verify {copy contract address from previous command} '{Name of your dapp}' '{Symbol}' '{Fee cost in wei}' --network goerli
```
