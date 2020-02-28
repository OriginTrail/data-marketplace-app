# Whitelisting your IP address on OriginTrail node

In order to establish the communication between the Food Data Market Application and your OriginTrail node, it's important that
the IP address from which you are running the Food Data Market application is whitelisted on your node. To whitelist your IP address,
please open your terminal and go through the following steps:

#### Step 1
- Connect to the server where you have your OriginTrail running/installed

#### Step 2
- Open and edit the ".origintrail-noderc" file

In the root of your server you should be able to see the ".origintrail-noderc" file which you created while setting up the OriginTrail node for the first time.

Open .origintrail-noderc file. 


#### Step 3
- Add your IP address to "remoteWhitelist" 
Copy your IP address and add paste it to your ".origintrail-noderc" file under "remoteWhitelist" section. 
Here is the example of how your "remoteWhitelist" should look like.

```
{
   ...
    
        "remoteWhitelist": [
            "127.0.0.1",
            "add your IP address here"
        ],
        
   ...

}
```

After your IP address is added to the ".origintrail-noderc", save it and then close the file.

#### Step 4
In order for your node to implement the changes made to your ".origintrail-noderc" file you need to restart your OriginTrail node by running the following command:
```
docker restart otnode
```
Give your node a couple of minutes to restart and you are good to go.

------------------------------------------------
This infrastructure is part of a project that has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 825268.



