/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const util = require('util');

var Chaincode = class {

  async adddata(ctx, id, newinfo) {
    console.info('============= START : changeCarOwner ===========');

    const dataAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
    if (!dataAsBytes || dataAsBytes.length === 0) {
        const data = {
            newinfo   
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(data)));
    }
    else{
        const data = JSON.parse(dataAsBytes.toString());
        data.newinfo += "," + newinfo

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(data)));
        console.info('============= END : changeCarOwner ===========');
    }    
}
  
};

shim.start(new Chaincode());
