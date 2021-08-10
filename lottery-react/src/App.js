import React, { useEffect, useState } from 'react'; 
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('0');
  useEffect(() => {
    async function fetchManager() {
      const response = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setManager(response);
      setPlayers(players);
      setBalance(balance);
    }
    fetchManager()
  }, []);


  return (
    <div>
      <h2>Lottery Contracts</h2>
      <p>This contract is managed by: {manager}</p>
      <p>There are currently {players.length} people entered, 
      competing to win {web3.utils.fromWei(balance, 'ether')} ether!</p>
      <h3>Want to try your luck?</h3>
    </div>
  );
}

export default App;
