const { ethers } = require('hardhat')

const eth2Wei = n => ethers.utils.parseEther(n.toString())
const eth2Gwei = n => ethers.utils.parseUnits(n.toString(), 9)
const wei2Eth = n => ethers.utils.formatEther(n)

const ether = eth2Wei
const gwei = eth2Gwei
const wei = wei2Eth

module.exports = { ether, gwei, wei }
