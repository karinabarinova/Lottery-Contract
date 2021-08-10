import React, { useEffect, useState } from 'react'; 
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState('');
  
  useEffect(() => {
    async function fetchManager() {
      const response = await lottery.methods.manager().call();
      setManager(response);
    }
    fetchManager()
  }, []);


  return (
    <div>
      <h2>Lottery Contracts</h2>
      <p>This contract is managed by: {manager}</p>
    </div>
  );
}

export default App;
