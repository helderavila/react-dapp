import { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'


import './App.css';

const greeterAddress = "0x8F4Db159a3ED3CAEDeb1b256a69b57027957F228"
const tokenAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"


function App() {
  const [greetingValue, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState(0)

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)

      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log('Error: ', err)
      }
    } else {
      console.log('Error: Metamask not installed')
    }
  }

  async function setGreeting() {
    if (!greetingValue) return

    if (typeof window.ethereum !== 'undefined') {
     try {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greetingValue)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
     } catch (err) {
       console.log(err)
     }
    }
  } 

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>
          Fetch Greeting
        </button>
        <button onClick={setGreeting}>
          Set Greeting
        </button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" value={greetingValue}/>

        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>
  );
}

export default App;
