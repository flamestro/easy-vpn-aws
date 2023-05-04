#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {VpnCreatorStack} from "../lib/vpn-creator/vpn-creator-stack";
import {Tags} from "aws-cdk-lib";
import 'dotenv/config';

const ACCOUNT = process.env.AWS_ACCOUNT!
const TagKeys = {
    Environment: "Environment"
}

const TagValues = {
    Environment: {
        SDLC: "SDLC"
    }
}
console.log("HERE" + process.env.NEXT_CLOUD_PASSWORD)
const usaVpn =
    {
        region: 'us-east-1',
        props: {
            vpn: {clientName: "usaVpn"},
            nextCloud: {
                username: process.env.NEXT_CLOUD_USERNAME!,
                password: process.env.NEXT_CLOUD_PASSWORD!,
            }
        }
    }

const indiaVpn =
    {
        region: 'ap-south-1',
        props: {
            vpn: {clientName: "indiaVpn"},
            nextCloud: {
                username: process.env.NEXT_CLOUD_USERNAME!,
                password: process.env.NEXT_CLOUD_PASSWORD!,
            }
        }
    }

const vpns = (() => {
    const activeVpns = []
    const vpnsFromConfig: string[]= JSON.parse(process.env.ACTIVE_VPNS!)
    if(vpnsFromConfig.includes("india")) activeVpns.push(indiaVpn)
    if(vpnsFromConfig.includes("usa")) activeVpns.push(usaVpn)
    return activeVpns
})()

const app = new cdk.App();
vpns.forEach(vpn => {
    new VpnCreatorStack(app, `RegionalVPNStack-${vpn.region}`, {
        env: {
            account: ACCOUNT,
            region: vpn.region},
        client: vpn.props
    })
})

Tags.of(app).add(TagKeys.Environment, TagValues.Environment.SDLC);