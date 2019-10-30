/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { BatchFeedContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('BatchFeedContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new BatchFeedContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"batch feed 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"batch feed 1002 value"}'));
    });

    describe('#batchFeedExists', () => {

        it('should return true for a batch feed', async () => {
            await contract.batchFeedExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a batch feed that does not exist', async () => {
            await contract.batchFeedExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createBatchFeed', () => {

        it('should create a batch feed', async () => {
            await contract.createBatchFeed(ctx, '1003', 'batch feed 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"batch feed 1003 value"}'));
        });

        it('should throw an error for a batch feed that already exists', async () => {
            await contract.createBatchFeed(ctx, '1001', 'myvalue').should.be.rejectedWith(/The batch feed 1001 already exists/);
        });

    });

    describe('#readBatchFeed', () => {

        it('should return a batch feed', async () => {
            await contract.readBatchFeed(ctx, '1001').should.eventually.deep.equal({ value: 'batch feed 1001 value' });
        });

        it('should throw an error for a batch feed that does not exist', async () => {
            await contract.readBatchFeed(ctx, '1003').should.be.rejectedWith(/The batch feed 1003 does not exist/);
        });

    });

    describe('#updateBatchFeed', () => {

        it('should update a batch feed', async () => {
            await contract.updateBatchFeed(ctx, '1001', 'batch feed 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"batch feed 1001 new value"}'));
        });

        it('should throw an error for a batch feed that does not exist', async () => {
            await contract.updateBatchFeed(ctx, '1003', 'batch feed 1003 new value').should.be.rejectedWith(/The batch feed 1003 does not exist/);
        });

    });

    describe('#deleteBatchFeed', () => {

        it('should delete a batch feed', async () => {
            await contract.deleteBatchFeed(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a batch feed that does not exist', async () => {
            await contract.deleteBatchFeed(ctx, '1003').should.be.rejectedWith(/The batch feed 1003 does not exist/);
        });

    });

});