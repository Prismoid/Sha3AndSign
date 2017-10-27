// var ConvertLib = artifacts.require("./ConvertLib.sol"); // artifacts(npm)
// var MetaCoin = artifacts.require("./MetaCoin.sol"); // artifacts(npm)
var Sha3AndSign = artifacts.require("./Sha3AndSign.sol"); // デプロイするコントラクトを入れる

module.exports = function(deployer) {
    //  deployer.deploy(ConvertLib);
    //   deployer.link(ConvertLib, MetaCoin);
    //   deployer.deploy(MetaCoin);
    deployer.deploy(Sha3AndSign); // デプロイするコントラクトを入れる
};
