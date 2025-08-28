// test/TheTruth.test.js
const{ expect } = require("chai"); const{ ethers } = require("hardhat");

describe("TheTruth NFT", function () { let TheTruth; let contract; let owner; let addr1; let addr2; let treasury;

const PRICE = ethers.utils.parseEther("0.16954848170098370"); const baseURI = "ipfs://QmTest/";

beforeEach(async function () { [owner, addr1, addr2, treasury] = await ethers.getSigners();

});

describe("Deployment", function () { it("Should set the correct owner", async function () { expect(await contract.owner()).to.equal(owner.address); });

});

describe("Minting", function () { beforeEach(async function () { await contract.toggleMinting(); });

});

describe("Supply Management", function () { beforeEach(async function () { await contract.toggleMinting(); });

});

describe("Provenance", function () { it("Should allow owner to set provenance once", async function () { const provenanceHash = "0x" + "a".repeat(64); await contract.setProvenance(provenanceHash); expect(await contract.provenance()).to.equal(provenanceHash); });

});

describe("Treasury", function () { it("Should allow owner to update treasury", async function () { await contract.setTreasury(addr1.address, true); expect(await contract.treasury()).to.equal(addr1.address); expect(await contract.treasuryIsMultisig()).to.equal(true); });

});

describe("Withdrawals", function () { beforeEach(async function () { await contract.toggleMinting(); await contract.connect(addr1).mintTruth({ value: PRICE }); await contract.connect(addr2).mintTruth({ value: PRICE }); });

});

describe("Metadata", function () { it("Should return correct tokenURI", async function () { expect(await contract.tokenURI(77)).to.equal(baseURI + "77.json"); });

});

describe("Royalties (ERC-2981)", function () { it("Should support ERC-2981 interface", async function () { const interfaceId = "0x2a55205a"; // ERC-2981 interface ID expect(await contract.supportsInterface(interfaceId)).to.equal(true); });

}); });
