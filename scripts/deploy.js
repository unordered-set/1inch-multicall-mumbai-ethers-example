const hre = require("hardhat");

async function main() {
  const MultiCall = await hre.ethers.getContractFactory("MultiCall");
  const mc = await MultiCall.deploy();

  await mc.deployed();
  console.log(`MultiCall Contract deployed to ${mc.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
