/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { RawmaterialContract } = require('..');
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

describe('RawmaterialContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new RawmaterialContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"rawmaterial 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"rawmaterial 1002 value"}'));
    });

    describe('#rawmaterialExists', () => {

        it('should return true for a rawmaterial', async () => {
            await contract.rawmaterialExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a rawmaterial that does not exist', async () => {
            await contract.rawmaterialExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createRawmaterial', () => {

        it('should create a rawmaterial', async () => {
            await contract.createRawmaterial(ctx, '1003', 'rawmaterial 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"rawmaterial 1003 value"}'));
        });

        it('should throw an error for a rawmaterial that already exists', async () => {
            await contract.createRawmaterial(ctx, '1001', 'myvalue').should.be.rejectedWith(/The rawmaterial 1001 already exists/);
        });

    });

    describe('#readRawmaterial', () => {

        it('should return a rawmaterial', async () => {
            await contract.readRawmaterial(ctx, '1001').should.eventually.deep.equal({ value: 'rawmaterial 1001 value' });
        });

        it('should throw an error for a rawmaterial that does not exist', async () => {
            await contract.readRawmaterial(ctx, '1003').should.be.rejectedWith(/The rawmaterial 1003 does not exist/);
        });

    });

    describe('#updateRawmaterial', () => {

        it('should update a rawmaterial', async () => {
            await contract.updateRawmaterial(ctx, '1001', 'rawmaterial 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"rawmaterial 1001 new value"}'));
        });

        it('should throw an error for a rawmaterial that does not exist', async () => {
            await contract.updateRawmaterial(ctx, '1003', 'rawmaterial 1003 new value').should.be.rejectedWith(/The rawmaterial 1003 does not exist/);
        });

    });

    describe('#deleteRawmaterial', () => {

        it('should delete a rawmaterial', async () => {
            await contract.deleteRawmaterial(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a rawmaterial that does not exist', async () => {
            await contract.deleteRawmaterial(ctx, '1003').should.be.rejectedWith(/The rawmaterial 1003 does not exist/);
        });

    });

});