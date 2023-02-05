const { ethers } = require('hardhat')

const eth2Wei = n => ethers.utils.parseEther(n.toString())
const eth2Gwei = n => ethers.utils.parseUnits(n.toString(), 9)
const wei2Eth = n => ethers.utils.formatEther(n)

const ether = eth2Wei
const gwei = eth2Gwei
const wei = wei2Eth

function saveABI(nft) {
  const fs = require('fs')
  const abi = artifacts.readArtifactSync('NFT').abi
  const filePath = '../frontend/src/abis/NFT.json'

  if (!fs.existsSync(filePath)) {
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

module.exports = { ether, gwei, wei, saveABI }
