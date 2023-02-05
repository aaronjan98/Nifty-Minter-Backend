const { expect } = require('chai')
const { ethers } = require('hardhat')

const { ether, gwei, wei } = require('../common/tokens.js')

describe('NFT', () => {
  const NAME = 'Mayday'
  const SYMBOL = 'MD'
  const fee = ether(0.01)
  let URI =
    'https://ai-gen-nft-minter.infura-ipfs.io/ipfs/QmQQbJ4iCcWzJjpSi2QrAv57gyXFxDkDmbGcWJkeqA7zXY/'
  let description = 'test description'

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
    let transaction, result, counter

    describe('Success', async () => {
      beforeEach(async () => {
        counter = 0
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, fee)

        transaction = await nft
          .connect(minter)
          .mint(URI + ++counter, description, { value: fee })
        result = await transaction.wait()
      })

      it('returns amount of NFTs minted by user', async () => {
        let tokenIds = await nft.walletOfOwner(minter.address)
        expect(tokenIds.length).to.equal(1)
        expect(await nft.balanceOf(minter.address)).to.equal(1)
      })

      it('returns the NFT tokenURI', async () => {
        const tokenURI = await nft.tokenURI(1)
        const data = tokenURI.split(',')[1]
        const decodedData = Buffer.from(data, 'base64').toString('utf8')
        const metadata = JSON.parse(decodedData)

        expect(metadata.image).to.equal(`${URI}1`)
      })

      it('returns the NFT metadata', async () => {
        const tokenURI = await nft.tokenURI(1)
        const data = tokenURI.split(',')[1]
        const decodedData = Buffer.from(data, 'base64').toString('utf8')
        const metadata = JSON.parse(decodedData)

        expect(metadata.name).to.equal('Nifty Mint #1')
        expect(metadata.description).to.equal('test description')
      })

      it("updates feeAccount's balance", async () => {
        const amountBeforeMint = await ethers.provider.getBalance(
          deployer.address
        )

        transaction = await nft
          .connect(minter)
          .updateMetadata('test description', URI)
        result = await transaction.wait()

        transaction = await nft
          .connect(minter)
          .mint(URI + ++counter, { value: fee })
        result = await transaction.wait()

        const amountAfterMint = await ethers.provider.getBalance(
          deployer.address
        )
        expect(amountAfterMint).to.equal(
          amountBeforeMint.add(ethers.BigNumber.from(fee))
        )
      })

      it('withdraws minting and gas fees from minter', async () => {
        const amountBeforeMint = await ethers.provider.getBalance(
          minter.address
        )

        const tx = await nft
          .connect(minter)
          .updateMetadata('test description', URI)
        const res = await tx.wait()

        transaction = await nft
          .connect(minter)
          .mint(URI + ++counter, { value: fee })
        result = await transaction.wait()

        const amountAfterMint = await ethers.provider.getBalance(minter.address)

        const metadataGasCost = tx.gasPrice.mul(res.gasUsed)
        const mintGasCost = transaction.gasPrice.mul(result.gasUsed)
        const gasCost = metadataGasCost.add(mintGasCost)

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

    describe('Failure', async () => {
      beforeEach(async () => {
        counter = 0
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, fee)
      })

      it('rejects insufficient payment', async () => {
        await expect(
          nft.connect(minter).mint(URI + ++counter, { value: gwei(1000) })
        ).to.be.reverted
      })

      it('does not return URIs for invalid tokens', async () => {
        nft.connect(minter).mint(URI + ++counter, { value: gwei(10000) })
        await expect(nft.tokenURI(counter)).to.be.reverted
      })
    })

    describe('Displaying NFTs', () => {
      let transaction, result

      beforeEach(async () => {
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, fee)

        for (let i = 0; i < 4; i++) {
          transaction = await nft.connect(minter).mint(URI + i, { value: fee })
          await transaction.wait()
        }
      })

      it('returns all the NFTs for a given owner', async () => {
        let tokenIds = await nft.walletOfOwner(minter.address)

        expect(tokenIds.length).to.equal(4)
        expect(tokenIds[0].toString()).to.equal('1')
        expect(tokenIds[1].toString()).to.equal('2')
        expect(tokenIds[2].toString()).to.equal('3')
        expect(tokenIds[3].toString()).to.equal('4')
      })
    })
  })
})
