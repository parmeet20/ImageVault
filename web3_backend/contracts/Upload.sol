// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Upload {
    struct Access {
        address user;
        bool access;
    }
    struct Item{
        string name;
        string description;
        string uri;
    }
    mapping(address => Item[]) items;
    mapping(address => mapping(address => bool)) ownership;
    mapping(address => Access[]) accessList;
    mapping(address => mapping(address => bool)) prevData;

    function add(address _user, string memory _name,string memory _description,string calldata _URI) external {
        items[_user].push(Item(_name,_description,_URI));
    }

    function allow(address _user) external {
        ownership[msg.sender][_user] = true;
        if (prevData[msg.sender][_user] == true) {
            for (uint256 i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == _user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(_user, true));
            prevData[msg.sender][_user] = true;
        }
    }

    function disAllow(address _user) external {
        ownership[msg.sender][_user] = false;
        for (uint256 i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == _user) {
                accessList[msg.sender][i].access = false;
            }
        }
    }
    function display(address _user)external view returns(Item[] memory){
        require(_user == msg.sender || ownership[_user][msg.sender],"You do not have access to this");
        return items[_user];
    }
    function shareAccess()public view returns (Access[] memory){
        return accessList[msg.sender];
    }
}
