# AWS VPN Infrastructure

## Requirements 
- node.js 18

## Get Started
This project allows you to simply setup aws vpn ec2 instances without a hassle.

It will deploy a openVPN setup for you. If you have a nextcloud server you can publish your openVPN directly to the server by setting your Nextcloud env variables (see table below).

Otherwise you will need to ssh onto the server and copy the .ovpn files from the root users home directory (they are called like \<country\>Vpn.ovpn).
They will allow you to easier connect to the vpn.

You need to have the following environment variables in a .env file:


| Name                | Value                                                              |
|---------------------|--------------------------------------------------------------------|
| NEXT_CLOUD_USERNAME | A next cloud user name to upload the openVpn certificate           |
| NEXT_CLOUD_PASSWORD | A next cloud user password to upload the openVpn certificate       |
| NEXT_CLOUD_DOMAIN   | Your nextcloud domain name (without protocol e.g. data.domain.com) |
| AWS_ACCOUNT         | Account ID                                                         |
| ACTIVE_VPNS         | ["india","usa"]                                                    |


Active VPNs currently only supports usa and india. Other values are ignored.

After deploying your infrastructure a OpenVPN certificate file will be uploaded to nextcloud. 
You can download it and connect to the vpn with an official OpenVPN client.

This is a pay per use solution. It will be more expensive than other vpn providers if you do not kill your instances accordingly.  
But if you destroy the infrastructure afterward, the cost is considerably low (a few cents per hour)

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk destroy`     destroy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
