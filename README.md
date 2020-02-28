# Data Marketplace

The Data Marketplace consists of the open source Data Marketplace Application (hosted on this repository), and the Data Marketplace open source infrastructure. The following is a guide on how to utilize the first of the Data marketplaces - the Food Data Market.

The Data Marketplace open source infrastructure consists of:
- the Consensus layer, utilizing a set of smart contracts, implemented on the Ethereum blockchain and Solidity smart contract programming language
- The Peer-to-peer Data exchange network infrastructure (OriginTrail Decentralized Network) for direct dataset sharing between data sellers and data buyers systems'

To establish a trusted marketplace mechanism, the smart contracts implement the [FairSwap protocol](https://eprint.iacr.org/2018/740.pdf), which enables two main guarantees:
- The data seller can be guaranteed to receive compensation for a sold dataset
- The data buyer can be guaranteed to receive a verifiable dataset requested in the purchase

Note: The Data Marketplace is in beta stage. The current operational environment is the OriginTrail Marketplace Testnet.


   
# Setup guidelines

The Data Marketplace operates on decentralized infrastructure and is completely permissionless. It is not hosted anywhere, rather the users need to setup their own interface to connect to the marketplace. This means that no third party is able to monitor your usage of the Data marketplace, and is not able to intercept datasets as they are exchanged via an encrypted channel on the OriginTrail Decentralized Network infrastructure. 

Each dataset exchanged has cryptographically provable integrity which is automatically checked by the OriginTrail nodes of the data buyers and data sellers, utilizing the features of the OriginTrail protocol and knowledge graph.   

#### Step 1 - Setup an OriginTrail node
In order to run the Data Marketplace application, you will first have to setup an OriginTrail node on the marketplace testnet.
Instructions available here: [Node Setup Instructions](https://github.com/OriginTrail/data-marketplace-app/blob/master/setup-a-node.md)

   
#### Step 2 - Enable the connection between the Data Marketplace application and the node
In order to establish the communication between the node and the application interface, you will need to update your .origintrail_noderc file. 
Instructions available here: [Whitelist your IP on originTrail node](https://github.com/OriginTrail/data-marketplace-app/blob/master/whitelist.md)

#### Step 3 - Download and install the Data Marketplace application
Instructions available here: [Download and install the UI](https://github.com/OriginTrail/data-marketplace-app/blob/master/install-the-ui.md)

------------------------------------------------
This infrastructure is part of a project that has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 825268.

