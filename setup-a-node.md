# Node Setup

In order to be able to use the Food Data Market Application, you first need to setup your OriginTrail node which you will later connect to the interface.

General instructions for installation and configuration of OriginTrail Node can be found on the following link: 

- [API and technical documentation](http://docs.origintrail.io/en/latest/)

## Pre-requirements

Please note that all of the following requirements shall be met in order for You to be able to set up an OriginTrail node.

### Hardware Recommendation
- The recommended minimum specifications are 1CPU, 2GB RAM with at least 10GB storage space.

### Ethereum Wallet
- Before setting up a node, you must own a valid Ethereum wallet with at least 4000 ATRAC tokens and at least 0.05 Ethers. 
If you don’t have Ethers or ATRACs, you can go and fetch some at the [Rinkeby Faucet](https://faucet.rinkeby.io) for test  Ethers and [OriginTrail Faucet](https://origintrail.io/faucet) for ATRAC tokens.
  
## Public IP or Open Communication
- It is required to have a public IP address, domain name or open network communication with internet. If behind NAT please manually setup port forwarding to all the node’s ports.

## Docker Installed
- The host machine needs to have Docker installed to be able to run the Docker commands specified below. You can find instructions on how to install Docker here:

- [Install for Windows](https://docs.docker.com/docker-for-windows/install/)

- [Install on Mac](https://docs.docker.com/docker-for-mac/install/)

- [Install on Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

## Open Ports  

By default Docker container will use 8900, 5278 and 3000 ports. These can be mapped differently in Docker container initialization command. Make sure they’re not blocked by firewall and open to the public. Please note: port 8900 is used for REST access which is not available until OT node is fully started. This can be concluded after following log message is displayed.


## Configuring the node

To properly configure the node you will need to create a config file in JSON format and provide some basic information about how the node should work. This file will then be passed to the Docker container and it should be placed in the root of your server.

Let’s create the file .origintrail_noderc and store all the information about what kind of configuration we want to set up. The bare minimum of settings that needs to be provided is a valid Ethereum wallet and public address or domain name.

If you wish your node to connect to the Food Data Marketplace network, you should create the .origintrail_noderc file with the following content:


```
{
    "network": {
        "id": "testnet-marketplace-vwbuqoytks",
        "bootstraps": [
        "https://testnet-marketplace-br-ayden-purdy-66.origin-trail.network:5278/#0c0031eb38d780d3eac8c698144cfc7e7a5d7825"],
        "remoteWhitelist": [
            "127.0.0.1",
        ],
        "hostname": "your external IP or domain name here"
    },
    "management_wallet": "your management wallet goes here",
    "dh_max_holding_time_in_minutes": 525600,
    "dh_min_token_price": "20000000000000000000",
    "initial_deposit_amount": "5000000000000000000000",
    "litigationEnabled": true,
    "blockchain": {
        "rpc_server_url": "url to your RPC server i.e. Infura or own Geth",
        "hub_contract_address": "0xcef138B88Da797094AD1704AF53B5A8F3f63855B"
    },
    "dc_holding_time_in_minutes": 525600,
    "dc_choose_time": 300000,
    "dc_litigation_interval_in_minutes": 1,
    "dh_min_litigation_interval_in_minutes": 1,
    "logs_level_debug": true,
    "commandExecutorVerboseLoggingEnabled": true,
    "autoUpdater": {
        "enabled": true,
        "packageJsonUrl": "https://raw.githubusercontent.com/OriginTrail/ot-node/release/testnet-marketplace/package.json",
        "archiveUrl": "https://github.com/OriginTrail/ot-node/archive/release/testnet-marketplace.zip"
    },
    "node_wallet": "your operational wallet address",
    "node_private_key": "private key of your operational wallet"
}

```

- **node_wallet and node_private_key** - Node operational Ethereum wallet address and its private key.

- **management_wallet** - Node Ethereum management wallet address

- **hostname** is the public network address or hostname that will be used in P2P communication with other nodes for node’s self identification.

- **remoteWhitelist** - list of IPs or hosts of the machines (“host.domain.com”) that are allowed to communicate with REST API.

- **rpc_server_url** - an URL to RPC host server, usually Infura or own hosted Geth server. For more check our [documentation](http://docs.origintrail.io/en/latest/rpc-server-host.html).

You can find more detailed wallets explanation [here](https://knowledge-base.origintrail.io/en/articles/2572277-management-wallet-operational-wallets).

(**_DISCLAIMER_**: Your private key is needed for the node operational wallet to be able to sign transactions to the blockchain. The node management wallet takes care of your rewards and its private key is not stored on the node. The operational wallet private key is not in any way sent to the OriginTrail team or stored in any other location, other than this config file and locations you decide to keep it. Please, be aware that you are required to keep all your keys and node safe, and that the OriginTrail team does not have any ability to help you recover the private key if lost).


# Running a Docker container

Everything is prepared for the Docker to create and run a container. Let’s just point Docker to the right image and configuration file with the following command:

```
sudo docker create -i --log-driver json-file --log-opt max-size=1g --name=otnode -p 8900:8900 -p 5278:5278 -p 3000:3000 -v ~/origintrail_noderc:/ot-node/.origintrail_noderc quay.io/origintrail/otnode:release_testnet-marketplace
```

### Useful OriginTrail node commands:


- Starting OriginTrail node:

```
docker start otnode
```

- Stopping OriginTrail node:

```
docker stop otnode
```

- Check if the container is running:

```
docker ps
```



------------------------------------------------
This infrastructure is part of a project that has received funding from the 
European Union’s Horizon 2020 research and innovation programme under grant agreement No 825268.
