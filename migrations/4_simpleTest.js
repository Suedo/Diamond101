const SimpleTestFacet = artifacts.require('SimpleTestFacet')

module.exports = function (deployer) {
  deployer.deploy(SimpleTestFacet, "buterin");
}
