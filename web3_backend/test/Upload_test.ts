import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { Upload } from "../typechain-types";

describe("Upload Contract", function () {
    let upload: Upload;
    let owner: Signer;
    let user1: Signer;
    let user2: Signer;
    let ownerAddress: string;
    let user1Address: string;
    let user2Address: string;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        ownerAddress = await owner.getAddress();
        user1Address = await user1.getAddress();
        user2Address = await user2.getAddress();

        const UploadFactory = await ethers.getContractFactory("Upload");
        upload = await UploadFactory.deploy();
    });

    describe("add", function () {
        it("should add an item for the user", async function () {
            const itemURI = "https://example.com/item1";
            const name = "example";
            const description = "This is example description file";

            // Add item to the owner's items
            await upload.connect(owner).add(ownerAddress, name, description, itemURI);

            const items = await upload.connect(owner).display(ownerAddress);
            expect(items.length).to.equal(1);
            expect(items[0].name).to.equal(name);
            expect(items[0].description).to.equal(description);
            expect(items[0].uri).to.equal(itemURI);
        });
    });

    describe("allow", function () {
        it("should grant access to another user", async function () {
            await upload.connect(owner).allow(user1Address);

            const accessList = await upload.connect(owner).shareAccess();
            expect(accessList.length).to.equal(1);
            expect(accessList[0].user).to.equal(user1Address);
            expect(accessList[0].access).to.be.true;
        });

        it("should not allow access if the user has not been granted", async function () {
            await expect(upload.connect(user1).display(ownerAddress))
                .to.be.revertedWith("You do not have access to this");
        });

        it("should allow access after permission is granted", async function () {
            // Grant access
            await upload.connect(owner).allow(user1Address);

            const items = await upload.connect(user1).display(ownerAddress);
            expect(items).to.be.an("array");
        });

        it("should update access in the access list", async function () {
            await upload.connect(owner).allow(user1Address);

            const accessList = await upload.connect(owner).shareAccess();
            const userAccess = accessList.find((access) => access.user === user1Address);
            expect(userAccess).to.not.be.undefined;
            expect(userAccess?.access).to.be.true;
        });
    });

    describe("disAllow", function () {
        it("should revoke access from another user", async function () {
            await upload.connect(owner).allow(user1Address);

            await upload.connect(owner).disAllow(user1Address);

            const accessList = await upload.connect(owner).shareAccess();
            const userAccess = accessList.find((access) => access.user === user1Address);
            expect(userAccess?.access).to.be.false;
        });

        it("should not allow access after it is revoked", async function () {
            await upload.connect(owner).allow(user1Address);
            await upload.connect(owner).disAllow(user1Address);

            await expect(upload.connect(user1).display(ownerAddress))
                .to.be.revertedWith("You do not have access to this");
        });
    });

    describe("display", function () {
        it("should allow the owner to view their items", async function () {
            const itemURI = "https://example.com/item1";
            const name = "example";
            const description = "This is example description file";

            await upload.connect(owner).add(ownerAddress, name, description, itemURI);

            const items = await upload.connect(owner).display(ownerAddress);
            expect(items.length).to.equal(1);
            expect(items[0].uri).to.equal(itemURI);
        });

        it("should allow users with access to view items", async function () {
            const itemURI = "https://example.com/item1";
            const name = "example";
            const description = "This is example description file";

            await upload.connect(owner).add(ownerAddress, name, description, itemURI);
            await upload.connect(owner).allow(user1Address);

            const items = await upload.connect(user1).display(ownerAddress);
            expect(items.length).to.equal(1);
            expect(items[0].uri).to.equal(itemURI);
        });

        it("should not allow non-owners to view another user's items without permission", async function () {
            const itemURI = "https://example.com/item1";
            const name = "example";
            const description = "This is example description file";

            await upload.connect(owner).add(ownerAddress, name, description, itemURI);

            await expect(upload.connect(user1).display(ownerAddress))
                .to.be.revertedWith("You do not have access to this");
        });
    });

    describe("shareAccess", function () {
        it("should return the correct access list", async function () {
            await upload.connect(owner).allow(user1Address);

            const accessList = await upload.connect(owner).shareAccess();
            expect(accessList.length).to.equal(1);
            expect(accessList[0].user).to.equal(user1Address);
            expect(accessList[0].access).to.be.true;
        });

        it("should return an empty list if no one has access", async function () {
            const accessList = await upload.connect(owner).shareAccess();
            expect(accessList).to.be.an("array").that.is.empty;
        });
    });
});
