const hre = require("hardhat");
const assert = require("assert");
const { ethers } = require("hardhat");

async function main() {
  const [multicallAddress, maincardAddress, sampleCards] = {
    mumbai: [
      "0xe23B947762394bCe42C7E2CD12d0C1D62419d323",
      "0x443DBEC6281bA4c2da1Ff49E6fD5ec28332b657B",
      [0]
    ],
    polygon: [
      "0x0196e8a9455a90d392b46df8560c867e7df40b34",
      "0x3D9e6bD43aC6afc78f3D8C8df6811D9aB53678c1",
      [107, 2979, 828]
    ]}[hre.network.name];
  assert(multicallAddress);

  // Not using @1inch/multicall package at all, as it depends on web3js, not ethers.
  const multicallABI = [
    {"inputs":[],"name":"gasLeft","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"gaslimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MultiCall.Call[]","name":"calls","type":"tuple[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MultiCall.Call[]","name":"calls","type":"tuple[]"}],"name":"multicallWithGas","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"},
    {"internalType":"uint256[]","name":"gasUsed","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MultiCall.Call[]","name":"calls","type":"tuple[]"},{"internalType":"uint256","name":"gasBuffer","type":"uint256"}],"name":"multicallWithGasLimitation","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"},{"internalType":"uint256","name":"lastSuccessIndex","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}
  ];

  const maincardABI = [
  { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getLastConsequentWins", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, 
  { "inputs": [{ "internalType": "uint256", "name": "cardId", "type": "uint256" }], "name": "getRarity", "outputs": [{ "internalType": "enum ICard.CardRarity", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, 
  { "inputs": [{ "internalType": "uint256", "name": "cardId", "type": "uint256" }], "name": "livesRemaining", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, 
  ];

  const MainCardContract = new ethers.Contract(maincardAddress, maincardABI, hre.ethers.provider);
  const MultiCallContract = new ethers.Contract(multicallAddress, multicallABI, hre.ethers.provider);

  const maincardcontract = MainCardContract.attach(maincardAddress);
  const multicallcontract = MultiCallContract.attach(multicallAddress);

  const requests = [];
  for (const cardID of sampleCards) {
    let tx = await maincardcontract.populateTransaction.getLastConsequentWins(cardID, {gasLimit: 100000});
    requests.push({
      to: maincardAddress,
      data: tx.data
    })
  
    tx = await maincardcontract.populateTransaction.getRarity(cardID, {gasLimit: 100000});
    requests.push({
      to: maincardAddress,
      data: tx.data
    })
  
    tx = await maincardcontract.populateTransaction.livesRemaining(cardID, {gasLimit: 100000});
    requests.push({
      to: maincardAddress,
      data: tx.data
    })
  } 

  const result = await multicallcontract.callStatic.multicall(requests);
  let i = 0;
  for (const cardID of sampleCards) {
    console.log(`Card ${cardID}:`);
    const getLastConsequentWins = ethers.BigNumber.from(result[i++]);
    console.log(`  getLastConsequentWins: ${getLastConsequentWins.toString()}`);
    const getRarity = ethers.BigNumber.from(result[i++]);
    console.log(`  getRarity: ${getRarity.toString()}`);
    const livesRemaining = ethers.BigNumber.from(result[i++]);
    console.log(`  livesRemaining: ${livesRemaining.toString()}`);
    console.log("")
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
