/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { ProductTestsContract } = require('..');
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

describe('ProductTestsContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new ProductTestsContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"product tests 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"product tests 1002 value"}'));
    });

    describe('#productTestsExists', () => {

        it('should return true for a product tests', async () => {
            await contract.productTestsExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a product tests that does not exist', async () => {
            await contract.productTestsExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createProductTests', () => {

        it('should create a product tests', async () => {
            await contract.createProductTests(ctx, '1003', 'product tests 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"product tests 1003 value"}'));
        });

        it('should throw an error for a product tests that already exists', async () => {
            await contract.createProductTests(ctx, '1001', 'myvalue').should.be.rejectedWith(/The product tests 1001 already exists/);
        });

    });

    describe('#readProductTests', () => {

        it('should return a product tests', async () => {
            await contract.readProductTests(ctx, '1001').should.eventually.deep.equal({ value: 'product tests 1001 value' });
        });

        it('should throw an error for a product tests that does not exist', async () => {
            await contract.readProductTests(ctx, '1003').should.be.rejectedWith(/The product tests 1003 does not exist/);
        });

    });

    describe('#updateProductTests', () => {

        it('should update a product tests', async () => {
            await contract.updateProductTests(ctx, '1001', 'product tests 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"product tests 1001 new value"}'));
        });

        it('should throw an error for a product tests that does not exist', async () => {
            await contract.updateProductTests(ctx, '1003', 'product tests 1003 new value').should.be.rejectedWith(/The product tests 1003 does not exist/);
        });

    });

    describe('#deleteProductTests', () => {

        it('should delete a product tests', async () => {
            await contract.deleteProductTests(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a product tests that does not exist', async () => {
            await contract.deleteProductTests(ctx, '1003').should.be.rejectedWith(/The product tests 1003 does not exist/);
        });

    });

});