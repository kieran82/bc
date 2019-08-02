/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { BatchContract } = require('..');
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

describe('BatchContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new BatchContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"batch 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"batch 1002 value"}'));
    });

    describe('#batchExists', () => {

        it('should return true for a batch', async () => {
            await contract.batchExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a batch that does not exist', async () => {
            await contract.batchExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createBatch', () => {

        it('should create a batch', async () => {
            await contract.createBatch(ctx, '1003', 'batch 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"batch 1003 value"}'));
        });

        it('should throw an error for a batch that already exists', async () => {
            await contract.createBatch(ctx, '1001', 'myvalue').should.be.rejectedWith(/The batch 1001 already exists/);
        });

    });

    describe('#readBatch', () => {

        it('should return a batch', async () => {
            await contract.readBatch(ctx, '1001').should.eventually.deep.equal({ value: 'batch 1001 value' });
        });

        it('should throw an error for a batch that does not exist', async () => {
            await contract.readBatch(ctx, '1003').should.be.rejectedWith(/The batch 1003 does not exist/);
        });

    });

    describe('#updateBatch', () => {

        it('should update a batch', async () => {
            await contract.updateBatch(ctx, '1001', 'batch 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"batch 1001 new value"}'));
        });

        it('should throw an error for a batch that does not exist', async () => {
            await contract.updateBatch(ctx, '1003', 'batch 1003 new value').should.be.rejectedWith(/The batch 1003 does not exist/);
        });

    });

    describe('#deleteBatch', () => {

        it('should delete a batch', async () => {
            await contract.deleteBatch(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a batch that does not exist', async () => {
            await contract.deleteBatch(ctx, '1003').should.be.rejectedWith(/The batch 1003 does not exist/);
        });

    });

});