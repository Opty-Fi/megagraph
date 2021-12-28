# Megagraph

The subgraph for the DeFi protocols that are integrated with [OptyFi](https://opty.fi)'s [`earn-protocol`](https://github.com/Opty-Fi/earn-protocol).

## Subgraph

### Ethereum

- Build : QmQuCsbeq6YqUby8NHeKxuBJDy2B1E6G54fEPpvK3tmFiL

- Subgraph endpoints:
  - Queries (HTTP): https://api.thegraph.com/subgraphs/name/opty-fi/megagraph
- Link : https://thegraph.com/hosted-service/subgraph/opty-fi/megagraph
- Query : https://api.thegraph.com/subgraphs/name/opty-fi/megagraph
- Subscription : wss://api.thegraph.com/subgraphs/name/opty-fi/megagraph

### Polygon

- Build : QmPYCVceTsLpqNYezZGHEJckB76CUKtaDFioQhLPCnCcCG

- Subgraph endpoints:
  - Queries (HTTP): https://api.thegraph.com/subgraphs/name/opty-fi/megagraph-polygon
- Link : https://thegraph.com/hosted-service/subgraph/opty-fi/megagraph-polygon
- Query : https://api.thegraph.com/subgraphs/name/opty-fi/megagraph-polygon
- Subscription : wss://api.thegraph.com/subgraphs/name/opty-fi/megagraph-polygon

## Development

### Prerequisites:

- Node JS 12.x.x and above
- Install the prerequisite modules:
  ```sh
  yarn
  ```
- Setup your environment variables:
  ```sh
  cp .env.example .env
  ```
  and populate accordingly.

### Naming conventions:

- `./config/` directory:
  - `dev.json` file only:
    - `startBlock` to be omitted, or `"startBlock": 0`, unless you configure your local `graph-node` otherwise (see [`Local Development`](#local-development) below)
  - all`$CONFIG.json` files:
    - format:
      ```json
      {
        "blockchain": "ethereum",
        "network": "$CONFIG",
        "adapters": [
          {
            "adapter": "AdapterName",
            "contracts": [
              {
                "contract": "ContractName",
                "abis": ["AbiName", "SupportingAbiName"],
                "entities": ["<Adapter>EntityName"],
                "events": [
                  {
                    "event-name": "EventName",
                    "event-params": "(list, of, params, from, event, sig)"
                  }
                ],
                "instances": [
                  {
                    "symbol": "SYMBOL", // if multiple
                    "address": "0xAddressValue",
                    "startBlock": 12345 // if present
                  }
                ]
              }
            ]
          }
        ]
      }
      ```
- `./schema.graphql` file:
  ```gql
  type <Adapter><EntityName> @entity {
    id: ID!
    fieldName: DataType
  }
  ```
- `./src/<Adapter>/` directory:

  - `abis/` directory:
    - all `<AbiName>.json` files from `./config/$CONFIG.json` file's `adapters[i].contracts[j].abis`
  - `mappings/` directory:

    - all `<ContractName>.ts` files from `./config/$CONFIG.json` file's `adapters[i].contracts[j].contract`
    - for each `<ContractName>.ts` file, at minimum the generated:

      - WebAssembly typescript reference:
        ```typescript
        import {
          <Adapter><ContractName>
        } from "../../../generated/<Adapter><ContractName><SymbolDAI>/<Adapter><ContractName>";
        ```
      - event handlers:

        ```typescript
        import {
          <EventName> as <EventName>Event,
          ...
        } from "../../../generated/<Adapter><ContractName><symbol>/<Adapter><ContractName>";

        export function handle<EventName>(event: <EventName>Event): void {
          ...
        }
        export function handle...
        ```

      - `graphql` entities:
        ```typescript
        import {
          <Adapter><EntityName>
        } from "../../../generated/schema";
        ```

    - repeat for the next `<ContractName>.ts` file

- The above will leverage the `./package.json` "`yarn mustache-yaml`" script to populate a `./subgraph.yaml` file for use with the `yarn codegen` script.

### Local development:

1. Install [ganache-cli](https://github.com/trufflesuite/ganache-cli)
1. Clone a [graph node](https://github.com/graphprotocol/graph-node) locally
1. In your local `graph-node`:
   - Adjust the `./docker/docker-compose.yaml` file:
     ```
     services:
       graph-node:
         environment:
           ethereum:
     ```
     from `'mainnet:http...'` to `'builderevm:http...'` and save
1. Spin up a `ganache` instance on the side:
   ```sh
   ganache-cli -d -h 0.0.0.0 --networkId 31337
   ```
1. In your local `graph-node`:
   - In the `docker` directory:
     ```sh
     cd ./docker
     ```
   - Initialize the docker container:
     ```sh
     docker-compose up
     ```
1. In the `megagraph` root directory, run:
   ```sh
   yarn setup:local
   ```

### Deploying to [The Graph](https://thegraph.com):

1. Create an account and login, and ensure that your [Access token](https://thegraph.com/explorer/dashboard) is populated in your `.env` file
1. In your local `megagraph` directory, run:
   ```sh
   yarn setup
   ```

## Detailed Instructions

### Generate manifest from mustache template:

- Run the following command:
  ```sh
  yarn mustache-yaml
  ```
  If the execution is successful, you should see a new `./subgraph.yaml` file created from the `./subgraph.template.yaml` file, based on the `./config/$CONFIG.json` file as per the [`Naming conventions`](#naming-conventions) above.

### Generating subgraph code:

- Run the following command:
  ```sh
  yarn codegen
  ```
  If the generation was successful, you should see a new `./generated/` folder.

### Running a build:

- Run the `build` command:
  ```sh
  graph build
  ```
  If the build is successful, you should see a new `./build/` folder.
- Note: this step is performed automatically when running the `yarn deploy` script, or when manually executing the `graph deploy` command.

### Deploying the subgraph:

- To deploy, we can run the `deploy` command using the Graph CLI. To deploy, you will first need to copy the **Access token** for the subgraph you created in the Graph console.
- Next, run the following commands:

  ```sh
  graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>

  yarn deploy
  ```

  Once the subgraph is deployed, you should see it show up in your dashboard.

  When you click on the subgraph, it should open the Graph explorer.

### Example querying:

In the dashboard, we should be able to start querying for data. Run the following query to get a list of tokens and their metadata:

```graphql
{
  tokens {
    id
    tokenID
    contentURI
    metadataURI
  }
}
```

We can also configure the order direction:

```graphql
{
  tokens(orderBy: id, orderDirection: desc) {
    id
    tokenID
    contentURI
    metadataURI
  }
}
```

Or choose to skip forward a certain number of results to implement some basic pagination:

```graphql
{
  tokens(skip: 100, orderBy: id, orderDirection: desc) {
    id
    tokenID
    contentURI
    metadataURI
  }
}
```

Or query for users and their associated content:

```graphql
{
  users {
    id
    tokens {
      id
      contentURI
    }
  }
}
```

### Updating the subgraph:

For example adding the capabilities to sort by the timestamp that an NFT was created.

- Add a new `createdAtTimestamp` field to the `Token` entity:
  ```graphql
  type Token @entity {
    id: ID!
    tokenID: BigInt!
    contentURI: String!
    metadataURI: String!
    creator: User!
    owner: User!
    createdAtTimestamp: BigInt! # added new field
  }
  ```
- Re-run the `yarn codegen` script.

- Update the mapping to save this new field:

  ```typescript
  // update the handleTransfer function to add the createdAtTimestamp to the token object
  export function handleTransfer(event: TransferEvent): void {
    let token = Token.load(event.params.tokenId.toString());
    if (!token) {
      token = new Token(event.params.tokenId.toString());
      token.creator = event.params.to.toHex();
      token.tokenID = event.params.tokenId;

      // Add the createdAtTimestamp to the token object
      token.createdAtTimestamp = event.block.timestamp;

      let tokenContract = TokenContract.bind(event.address);
      token.contentURI = tokenContract.tokenURI(event.params.tokenId);
      token.metadataURI = tokenContract.tokenMetadataURI(event.params.tokenId);
    }
    token.owner = event.params.to.toHex();
    token.save();

    let user = User.load(event.params.to.toHex());
    if (!user) {
      user = new User(event.params.to.toHex());
      user.save();
    }
  }
  ```

- Re-deploy the subgraph:
  ```sh
  yarn deploy
  ```

After redeployment, a query can be made by timestamp to view the most recently created NFTs:

```graphql
{
  tokens(orderBy: createdAtTimestamp, orderDirection: desc) {
    id
    tokenID
    contentURI
    metadataURI
  }
}
```
