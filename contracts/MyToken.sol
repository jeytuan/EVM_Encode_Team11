// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Nonces.sol";

contract MyToken is ERC20, ERC20Permit, ERC20Votes {
    uint256 public maxSupply = 1_000_000 * 10 ** 18;

    constructor()
        ERC20("MyToken", "MTK")
        ERC20Permit("MyToken")
    {}

    function mint(address to, uint256 amount) public {
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        // Call internal function directly; not overriding
        super._update(address(0), to, amount);
    }

    function burn(address from, uint256 amount) public {
        // Custom burn wrapper (same logic: call _update)
        super._update(from, address(0), amount);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
