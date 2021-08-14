/* eslint-disable prefer-const */
/* global contract artifacts web3 before it assert */
const truffleAssert = require("truffle-assertions");

const Diamond = artifacts.require('Diamond')
const DiamondCutFacet = artifacts.require('DiamondCutFacet')
const DiamondLoupeFacet = artifacts.require('DiamondLoupeFacet')
const OwnershipFacet = artifacts.require('OwnershipFacet')
const SimpleTestFacet = artifacts.require('SimpleTestFacet')
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

contract('SimpleTestFacet Test', async (accounts) => {


  it('should add SimpleTestFacet functions', async () => {
    let facet = await SimpleTestFacet.deployed();
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
    let facet = await SimpleTestFacet.at(diamond.address);
    let name = await facet.getName();

    console.log(`name : ${name}`);
    assert.equal(name, "buterin");
  })

  // these pass, setters are doing their job
  it('setters should set data', async () => {
    let diamond = await Diamond.deployed();
    let facet = await SimpleTestFacet.at(diamond.address);
    const newName = "somjit";
    await facet.setName(newName)
    let newNameResult = await facet.getName();
    console.log(`newName : ${newNameResult}`)
  })

})