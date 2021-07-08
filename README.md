# DeFi protocol subgraph
The subgraph for the DeFi protocols with which [OptyFi](https://opty.fi)'s [`earn-protocol`](https://github.com/Opty-Fi/earn-protocol) integrates natively.

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
  and populate accordingly

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
     from `'mainnet:[...]'` to `'builderevm:[...]'` and save
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
1. In the `defi-protocol-subgraph` root directory, run the following command:
   ```sh
   yarn setup:local
   ```

### Deploying to [TheGraph](https://thegraph.com):
1. Create an account and login, and ensure that your [Access token](https://thegraph.com/explorer/dashboard) is populated in your `.env` file
1. In your local `defi-protocol-subgraph` directory, run the `yarn setup` command:
   ```sh
   yarn setup
   ```

## Detailed Instructions

### Mustache template:
- Run the following command:
  ```sh
  yarn mustache-yaml
  ```
  If the execution is successful, you should see a new `subgraph.yaml` file created from the `$BLOCKCHAIN.subgraph.template.yaml` file.

### Generating subgraph code:
- Run the following command:
  ```sh
  yarn codegen
  ```
  If the generation was successful, you should see a new `generated` folder in your root directory.

### Running a build:
- Run the `build` command:
  ```sh
  graph build
  ```
  If the build is successful, you should see a new `build` folder generated in your root directory.

### Deploying the subgraph:
- To deploy, we can run the `deploy` command using the Graph CLI. To deploy, you will first need to copy the __Access token__ for the subgraph you created in the Graph console.

- Next, run the following commands:
  ```sh
  graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>

  yarn deploy
  ```
  
  Once the subgraph is deployed, you should see it show up in your dashboard.
  
  When you click on the subgraph, it should open the Graph explorer.

### Querying for data:
Now that we are in the dashboard, we should be able to start querying for data. Run the following query to get a list of tokens and their metadata:
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
  tokens(
    orderBy:id,
    orderDirection: desc
  ) {
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
  tokens(
    skip: 100,
    orderBy:id,
    orderDirection: desc
  ) {
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
For example adding the capabilities to sort by the timestamp that the NFT was created.

Add a new `createdAtTimestamp` field to the `Token` entity:
```graphql
type Token @entity {
  id: ID!
  tokenID: BigInt!
  contentURI: String!
  metadataURI: String!
  creator: User!
  owner: User!
  "Add new createdAtTimesamp field"
  createdAtTimestamp: BigInt!
}
```

Re-run the codegen:
```sh
graph codegen
```

Update the mapping to save this new field:
```typescript
// update the handleTransfer function to add the createdAtTimestamp to the token object
export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.creator = event.params.to.toHexString();
    token.tokenID = event.params.tokenId;
    // Add the createdAtTimestamp to the token object
    token.createdAtTimestamp = event.block.timestamp;

    let tokenContract = TokenContract.bind(event.address);
    token.contentURI = tokenContract.tokenURI(event.params.tokenId);
    token.metadataURI = tokenContract.tokenMetadataURI(event.params.tokenId);
  }
  token.owner = event.params.to.toHexString();
  token.save();

  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}
```

Re-deploy the subgraph:
```sh
yarn deploy
```

After redeployment of the graph, query can be made by timestamp to view the most recently created NFTs:
```graphql
{
  tokens(
    orderBy:createdAtTimestamp,
    orderDirection: desc
  ) {
    id
    tokenID
    contentURI
    metadataURI
  }
}
```
