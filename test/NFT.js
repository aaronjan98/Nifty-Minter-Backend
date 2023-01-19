const { expect } = require('chai')
const { ethers } = require('hardhat')
const { ether, gwei, wei } = require('../common/tokens.js')

describe('NFT', () => {
  const NAME = 'Mayday'
  const SYMBOL = 'MD'
  const fee = gwei(50000)
  let URI =
    'https://ai-gen-nft-minter.infura-ipfs.io/ipfs/QmQQbJ4iCcWzJjpSi2QrAv57gyXFxDkDmbGcWJkeqA7zXY/'

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
      nft = await NFT.deploy(NAME, SYMBOL, fee)
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
      expect(await nft.fee()).to.equal(fee)
    })
  })

  describe('Minting', () => {
    beforeEach(async () => {
      let counter = 0
      const NFT = await ethers.getContractFactory('NFT')
      nft = await NFT.deploy(NAME, SYMBOL, fee)

      transaction = await nft
        .connect(minter)
        .mint(URI + ++counter, { value: fee })
      result = await transaction.wait()
    })

    it('returns amount of NFTs minted by user', async () => {
      let tokenIds = await nft.walletOfOwner(minter.address)
      expect(tokenIds.length).to.equal(1)
    })

    it('returns the NFT tokenURI', async () => {
      expect(await nft.tokenURI(1)).to.equal(`${URI}1`)
    })
  })
})
