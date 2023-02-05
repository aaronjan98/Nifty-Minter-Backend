// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')
const { ether, saveABI } = require('../common/tokens.js')

async function main() {
  const NAME = 'Nifty Minter'
  const SYMBOL = 'NM'
  const fee = ether(0.01)

  let nft, deployer, minter

  // Deploy Token
  const NFT = await ethers.getContractFactory('NFT')
  nft = await NFT.deploy(NAME, SYMBOL, fee)

  await nft.deployed()
  console.log(`\nNFT deployed to: ${ethers.utils.getAddress(nft.address)}\n`)

  // save contract ABI to front end
  saveABI(nft)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
