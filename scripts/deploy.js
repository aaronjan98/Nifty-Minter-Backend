// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')
const { ether } = require('../common/tokens.js')

async function main() {
  const NAME = 'Mayday'
  const SYMBOL = 'MD'
  const fee = ether(0.01)
  let URI =
    'https://ai-gen-nft-minter.infura-ipfs.io/ipfs/QmQQbJ4iCcWzJjpSi2QrAv57gyXFxDkDmbGcWJkeqA7zXY/'

  let nft, deployer, minter

  // Deploy Token
  const NFT = await ethers.getContractFactory('NFT')
  nft = await NFT.deploy(NAME, SYMBOL, fee)

  await nft.deployed()
  console.log(`\nNFT deployed to: ${nft.address}\n`)

  // save contract ABI to front end
  saveABI(nft)
}

function saveABI(nft) {
  const fs = require('fs')
  const abi = artifacts.readArtifactSync('NFT').abi
  const filePath = '../frontend/src/abis/NFT.json'

  // check if the file already exists
  if (!fs.existsSync(filePath)) {
    // create the file if it doesn't exist
    fs.openSync(filePath, 'w')
  }

  fs.writeFile(filePath, JSON.stringify(abi, null, 2), 'utf8', err => {
    if (err) {
      console.log(err)
    } else {
      console.log('ABI saved to frontend directory')
    }
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
