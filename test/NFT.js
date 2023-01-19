const { expect } = require('chai')
const { ethers } = require('hardhat')
const { ether, gwei, wei } = require('../common/tokens.js')

describe('NFT', () => {
  const NAME = 'Mayday'
  const SYMBOL = 'MD'
  const fee = ether(0.01)
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
    let counter

    beforeEach(async () => {
      counter = 0
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
      expect(await nft.balanceOf(minter.address)).to.equal(1)
    })

    it('returns the NFT tokenURI', async () => {
      expect(await nft.tokenURI(1)).to.equal(`${URI}1`)
    })

    it("updates feeAccount's balance", async () => {
      const amountBeforeMint = await ethers.provider.getBalance(
        deployer.address
      )

      transaction = await nft
        .connect(minter)
        .mint(URI + ++counter, { value: fee })
      result = await transaction.wait()

      const amountAfterMint = await ethers.provider.getBalance(deployer.address)
      expect(amountAfterMint).to.equal(
        amountBeforeMint.add(ethers.BigNumber.from(fee))
      )
    })

    it('withdraws minting and gas fees from minter', async () => {
      const amountBeforeMint = await ethers.provider.getBalance(minter.address)

      transaction = await nft
        .connect(minter)
        .mint(URI + ++counter, { value: fee })
      result = await transaction.wait()

      const amountAfterMint = await ethers.provider.getBalance(minter.address)

      const gasCost = transaction.gasPrice.mul(result.gasUsed)

      expect(amountAfterMint).to.equal(
        amountBeforeMint.sub(gasCost.add(ethers.BigNumber.from(fee)))
      )
    })

    it('emits Mint event', async () => {
      await expect(transaction)
        .to.emit(nft, 'Transfer')
        .withArgs(
          '0x0000000000000000000000000000000000000000',
          minter.address,
          1
        )
    })
  })
})
