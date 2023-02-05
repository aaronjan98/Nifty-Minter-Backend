const config = require('../../frontend/src/config.json')

async function main() {
  let accounts, deployer
  let account, deployerBalance

  // Create the accounts
  accounts = await ethers.getSigners()
  deployer = accounts[0]

  // print all users balances
  console.log('₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪ Ether token balances ₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪')
  for (let i = 0; i < accounts.length; i++) {
    account = accounts[i].address
    deployerBalance = await ethers.provider.getBalance(account)
    console.log(
      `${i}: ${account} ${await ethers.utils.formatEther(
        deployerBalance.toString()
      )}`
    )
  }

  /* Fetch deployed contracts */
  // Fetch network
  const { chainId } = await ethers.provider.getNetwork()
  const nft = await ethers.getContractAt('NFT', config[chainId].nft.address)

  // print all contracts addresses
  console.log('₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪ Contract Addresses ₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪')
  console.log(`NFT address: ${nft.address}`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
