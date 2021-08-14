const CrowdFundFacet = artifacts.require('CrowdFundFacet')
const SimpleTestFacet = artifacts.require('SimpleTestFacet')

module.exports = function (deployer) {
  const myAddress = "0x61E858A76272196B249b0bF3E17c845b1B425b1c";
  deployer.deploy(CrowdFundFacet, "CrowdFundFacet", 1, 10, myAddress);
  deployer.deploy(SimpleTestFacet, "buterin");
}
