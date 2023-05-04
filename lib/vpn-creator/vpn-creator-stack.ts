import * as cdk from 'aws-cdk-lib';
import {aws_ec2, aws_iam, CfnOutput} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Client} from "../types";

const NEXT_CLOUD_DOMAIN = process.env.NEXT_CLOUD_DOMAIN!

interface Props extends cdk.StackProps {
    client: Client,
}

export class VpnCreatorStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props)
        const defaultVpc = aws_ec2.Vpc.fromLookup(this, 'VPC', {isDefault: true})

        const securityGroup = new aws_ec2.SecurityGroup(
            this,
            'vpn-security-group',
            {
                vpc: defaultVpc,
                allowAllOutbound: true,
                securityGroupName: 'vpn-security-group',
            }
        )

        securityGroup.addIngressRule(
            aws_ec2.Peer.anyIpv4(),
            aws_ec2.Port.udp(1194),
            'Allows connection to Port 1194 via UDP'
        )
        securityGroup.addIngressRule(
            aws_ec2.Peer.anyIpv4(),
            aws_ec2.Port.tcp(22),
            'ssh'
        )

        const role = new aws_iam.Role(
            this,
            'vpn-instance-1-role', 
            {assumedBy: new aws_iam.ServicePrincipal('ec2.amazonaws.com')}
        )


        const instance = new aws_ec2.Instance(this, 'simple-instance-1', {
            vpc: defaultVpc,
            role: role,
            securityGroup: securityGroup,
            instanceName: 'vpn-instance',
            instanceType: aws_ec2.InstanceType.of(
                aws_ec2.InstanceClass.T2,
                aws_ec2.InstanceSize.NANO
            ),
            machineImage: aws_ec2.MachineImage.latestAmazonLinux({
                generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
        })

        instance.addUserData(
            '#!/bin/bash',
            'curl -O https://raw.githubusercontent.com/angristan/openvpn-install/master/openvpn-install.sh',
            'chmod +x openvpn-install.sh',
            'export MENU_OPTION="1"',
            `export CLIENT="${props.client.vpn.clientName}"`,
            `export PASS="1"`,
            `export AUTO_INSTALL=y`,
            './openvpn-install.sh',
            `curl -u ${props.client.nextCloud.username}:${props.client.nextCloud.password} -T ~/${props.client.vpn.clientName}.ovpn https://${NEXT_CLOUD_DOMAIN}/remote.php/dav/files/${props.client.nextCloud.username}/`
        )

        new CfnOutput(
            this,
            "PublicIp",
            {
                value: instance.instancePublicIp,
                description: "public ip of my instance",
                exportName: "ec2-public-ip"
            })
    }
}
