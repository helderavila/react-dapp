import { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

import './App.css';

const greeterAddress = "0x8F4Db159a3ED3CAEDeb1b256a69b57027957F228"

function App() {
  const [greetingValue, setGreetingValue] = useState('')

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
      </header>
    </div>
  );
}

export default App;
