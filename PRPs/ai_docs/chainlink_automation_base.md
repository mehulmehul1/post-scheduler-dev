# Chainlink Automation Base

This guide introduces Chainlink Automation fundamentals for this project, including how to register an upkeep, understand costs, and deploy on test networks.

## Upkeep registration
1. Deploy a contract that implements `checkUpkeep` and `performUpkeep`.
2. Register the contract via the [Automation UI](https://automation.chain.link) or CLI.
3. Supply the contract address, gas limit, admin address, and any needed checkData.
4. Fund the upkeep with LINK; a minimum balance (commonly 1 LINK) is required before execution can begin.
5. Costs are deducted per execution: `gasUsed * gasPrice + premium`, paid in LINK from the upkeep balance.

## Sample `performUpkeep` logic
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ExampleUpkeep {
    uint256 public counter;

    function performUpkeep(bytes calldata /* performData */) external {
        // maintenance task
        counter += 1;
    }
}
```

## Testnet deployment tips
- Use a supported test network such as Sepolia.
- Acquire testnet ETH and LINK from faucets and fund the upkeep sufficiently.
- Verify the upkeep registration and monitor execution through block explorers or the Automation UI.
- Start with conservative gas limits and LINK balances, adjusting once behavior is confirmed.
