const hre = require("hardhat");

async function main(name, symbol, manager) {
  const NFT = await hre.ethers.getContractFactory("SimpleERC721");
  const nft = await NFT.deploy(name, symbol, manager);

  await nft.deployed();

  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
