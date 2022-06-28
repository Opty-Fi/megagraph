# Megagraph

The subgraph for the DeFi protocols that are integrated with [OptyFi](https://opty.fi)'s [`earn-protocol`](https://github.com/Opty-Fi/earn-protocol).

## Prerequisites

- Node JS 12.x.x and above
- Install the prerequisite modules:
  ```sh
  yarn install
  ```
- Setup your environment variables:
  ```sh
  cp .env.example .env
  ```
  and populate accordingly.

## Subgraph Studio

- Sign up for [Subgraph Studio](https://thegraph.com/studio/); you may follow the [How to Use](https://thegraph.com/docs/en/studio/subgraph-studio/) guide.
- Connect your wallet and click the `Create a Subgraph` button, then follow the on-screen instructions.
  - Once created, paste the Deploy Key to your `STUDIO_DEPLOY_KEY`.
  - Decide on the new `STUDIO_VERSION` label for this deployment.
- Run
  ```sh
  yarn setup
  ```
  to create the subgraph and deploy to studio from the pre-defined scripts.
  - You may follow the [Deploy](https://thegraph.com/docs/en/studio/deploy-subgraph-studio/) guide.
- After the subgraph becomes 100% synced, you may click on the `Publish` button
  - Choose the network, currently either `Mainnet` or `Rinkeby`.
  - Optionally, if you have a sufficient `GRT` Graph Token balance, you may tick the `Be the first to signal on this subgraph` checkbox.
  - Click the `Publish ⟠` button, and sign the transaction.
