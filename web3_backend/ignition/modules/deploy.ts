import { ethers } from "hardhat"

const main = async () => {
    const Upload = await ethers.getContractFactory("Upload");
    const deployed = await Upload.deploy();
    console.log(`DEPLOYED TO ADDRESS -> ${await deployed.getAddress()}`)
}
main().then(() => console.log("SUCCESS")).catch((err) => console.log(err));