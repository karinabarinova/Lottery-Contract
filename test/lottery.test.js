const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //constructor function
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    //get a list of all accounts
    accounts = await web3.eth.getAccounts();
    //use one of them to deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })
}); 

describe('Lottery Contract', () => {
    it('Deploy a contract', () => {
        assert.ok(lottery.options.address);
    });
    it('Can enter the lottery', async () => {
        await lottery.methods.enter().send({ 
            from: accounts[0], 
            value: web3.utils.toWei('0.02', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(1, players.length);
    });
    it('Multiple accounts can enter the lottery', async () => {
        await lottery.methods.enter().send({ 
            from: accounts[0], 
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({ 
            from: accounts[1], 
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({ 
            from: accounts[2], 
            value: web3.utils.toWei('0.02', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(accounts[1], players[1]);
        assert.strictEqual(accounts[2], players[2]);
        assert.strictEqual(3, players.length);
    });
    it('requires a minimum amount of ether to enter', async() => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 200 //wei
            });
            assert(false);
        } catch(error) {
            assert(error);
        }
    })
    it('only manager can call selectWinner', async () => {
        try {
            await lottery.methods.selectWinner().send({
                from: account[1]
            })
            assert(false);
        } catch(error) {
            assert(error);
        }
    });
    it('send money to the winner, resets the players array, resets contract balance ', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.selectWinner().send({
            from: accounts[0]
        })
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether'));
        
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        
        assert.strictEqual(0, players.length);
        const balance = await web3.eth.getBalance(lottery.options.address);
        assert.notStrictEqual(0, balance);
    })
})

