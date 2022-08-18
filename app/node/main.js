/*
 * SPDX-License-Identifier: Apache-2.0
 */
var express = require('express')
var app = express()
const port  = 3000
app.use(express.json())
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '.', 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join('/vars/profiles/vscode/wallets', 'org0.example.com');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('Admin');
        if (! identity) {
            console.log('Admin identity can not be found in the wallet');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('simple');

        // Submit the specified transaction.
        // await contract.submitTransaction('adddata', '123',"i1");
        // console.log('Transaction has been submitted');

        // API---
        app.post('/add',(req,res)=>{
            var id = req.body['id']
            var newinfo = req.body['newinfo']
            contract.submitTransaction('adddata',id,newinfo)
            res.json({"Message":"Data has been updated on hyperledger!!!"})
        })

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}
app.listen(port, ()=> {console.log("Running on",port)})
main();