/* eslint-disable prefer-const */
/* global contract artifacts web3 before it assert */

const Diamond = artifacts.require('Diamond')
const DiamondCutFacet = artifacts.require('DiamondCutFacet')
const DiamondLoupeFacet = artifacts.require('DiamondLoupeFacet')
const OwnershipFacet = artifacts.require('OwnershipFacet')
const CrowdFundFacet = artifacts.require('CrowdFundFacet')
const FacetCutAction = {
  Add: 0,
  Replace: 1,
  Remove: 2
}


const zeroAddress = '0x0000000000000000000000000000000000000000';

function getSelectors(contract) {
  const selectors = contract.abi.reduce((acc, val) => {
    if (val.type === 'function') {
      acc.push(val.signature)
      return acc
    } else {
      return acc
    }
  }, [])
  return selectors
}

contract('CrowdFundFacet Test', async (accounts) => {
  let contract;
  let contractCreator = accounts[0];
  let beneficiary = accounts[1];

  const ONE_ETH = 1000000000000000000;

  it('should add CrowdFundFacet functions', async () => {
    let facet = await CrowdFundFacet.deployed();
    let selectors = getSelectors(facet);
    let addresses = [];
    addresses.push(facet.address);
    let diamond = await Diamond.deployed();
    let diamondCutFacet = await DiamondCutFacet.at(diamond.address);
    await diamondCutFacet.diamondCut([[facet.address, FacetCutAction.Add, selectors]], zeroAddress, '0x');

    let diamondLoupeFacet = await DiamondLoupeFacet.at(diamond.address);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0]);
    console.log(`selectors :\n${selectors}`)
    assert.sameMembers(result, selectors)
  })

  // These tests are failing. Constructor data not being set
  it('constructor data should be present', async () => {
    let diamond = await Diamond.deployed();
    let facet = await CrowdFundFacet.at(diamond.address);
    let targetAmt = await facet.getTargetAmount();
    let name = await facet.getName();

    console.log(`targetAmt: ${targetAmt}, name : ${name}`);
    assert.equal(name, "CrowdFundFacet");
    assert.equal(targetAmt, ONE_ETH)
  })

  // these pass, setters are doing their job
  it('setters should set data', async () => {
    let diamond = await Diamond.deployed();
    let facet = await CrowdFundFacet.at(diamond.address);
    const newName = "Test123";
    await facet.setName(newName)
    let newNameResult = await facet.getName();
    console.log(`newName : ${newNameResult}`)
  })

})