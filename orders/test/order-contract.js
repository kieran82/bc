/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { OrderContract } = require('..');
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

describe('OrderContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new OrderContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"order 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"order 1002 value"}'));
    });

    describe('#orderExists', () => {

        it('should return true for a order', async () => {
            await contract.orderExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a order that does not exist', async () => {
            await contract.orderExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createOrder', () => {

        it('should create a order', async () => {
            await contract.createOrder(ctx, '1003', 'order 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"order 1003 value"}'));
        });

        it('should throw an error for a order that already exists', async () => {
            await contract.createOrder(ctx, '1001', 'myvalue').should.be.rejectedWith(/The order 1001 already exists/);
        });

    });

    describe('#readOrder', () => {

        it('should return a order', async () => {
            await contract.readOrder(ctx, '1001').should.eventually.deep.equal({ value: 'order 1001 value' });
        });

        it('should throw an error for a order that does not exist', async () => {
            await contract.readOrder(ctx, '1003').should.be.rejectedWith(/The order 1003 does not exist/);
        });

    });

    describe('#updateOrder', () => {

        it('should update a order', async () => {
            await contract.updateOrder(ctx, '1001', 'order 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"order 1001 new value"}'));
        });

        it('should throw an error for a order that does not exist', async () => {
            await contract.updateOrder(ctx, '1003', 'order 1003 new value').should.be.rejectedWith(/The order 1003 does not exist/);
        });

    });

    describe('#deleteOrder', () => {

        it('should delete a order', async () => {
            await contract.deleteOrder(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a order that does not exist', async () => {
            await contract.deleteOrder(ctx, '1003').should.be.rejectedWith(/The order 1003 does not exist/);
        });

    });

});