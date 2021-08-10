import React, { useEffect, useState } from 'react'; 
import './App.css';
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchManager() {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    }
    fetchManager()
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether') //wei
    });
    setMessage('You have been entered!');
  }

  async function pickWinner(e) {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Hold up! We are selecting a winner...');
    await lottery.methods.selectWinner().send({
      from: accounts[0]
    })
    const winner = await lottery.methods.lastWinner().call();
    setMessage(`A winner has been picked! It is ${winner}`);
  }

  return (
    <div>
      <h2>Lottery Contracts</h2>
      <p>This contract is managed by: {manager}</p>
      <p>There are currently {players.length} people entered, 
      competing to win {web3.utils.fromWei(balance.toString(), 'ether')} ether!</p>
      <hr/>

      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input 
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </div>
        <button
        type="submit"
        >Enter</button>
      </form>
      <hr/>

      <h4>Ready to pick a winner?</h4>
      <button onClick={pickWinner}>Pick a winner</button>

      <hr />
      <h2>{message}</h2>
    </div>
  );
}

export default App;
