const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = n => {
  return ethers.utils.parseUnits(n.toString(), 'ethers')
}

describe('NFT', () => {
  const NAME = 'Mayday'
  const SYMBOL = 'MD'
  const feePercent = 1

  let nft, deployer, minter

  beforeEach(async () => {
    let accounts = await ethers.getSigners()
    deployer = accounts[0]
    minter = accounts[1]
    user1 = accounts[2]
    user2 = accounts[3]
  })

  describe('Deployment', () => {
    beforeEach(async () => {
      const NFT = await ethers.getContractFactory('NFT')
      nft = await NFT.deploy(NAME, SYMBOL, feePercent)
    })

    it('has correct name', async () => {
      expect(await nft.name()).to.equal(NAME)
    })

    it('has correct symbol', async () => {
      expect(await nft.symbol()).to.equal(SYMBOL)
    })

    it('tracks feeAccount', async () => {
      expect(await nft.feeAccount()).to.equal(deployer.address)
    })

    it('has correct fee amount', async () => {
      expect(await nft.feePercent()).to.equal(feePercent)
    })
  })
})
