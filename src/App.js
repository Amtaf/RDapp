import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/wavePortal.json';

export default function App() {

const [currAccount,setCurrentAccount] = React.useState("")
const[allWaves,setAllWaves]=React.useState([])
const[projMessage,setProjMessage]=React.useState("")
const[totalWaves,setTotalWaves]=React.useState(0)

const contractAddress = "0x2E9b70dF5CDfBE6504700d975098d7532Df9DCE8"
const contractABI = abi.abi;

async function getAllWaves(){

 try{
  const {ethereum}=window;

 if(window.ethereum){

  const provider=new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const wavePortalContract = new ethers.Contract(contractAddress,contractABI,signer);

  let waves = await wavePortalContract.getAllWaves()

  let wavesCleaned = []
  waves.forEach(wave =>{
    wavesCleaned.push({
      address: wave.addres,
      timestamp: new Date(wave.timestamp * 1000),
      message:wave.message
    });
  });

  setAllWaves(wavesCleaned);
   wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  const checkIfWalletIsConnected = () => {
    try{

  const {ethereum} = window;
    if (!ethereum){
      console.log("Make sure you have metamask!")
    }else{
      console.log("We have the ethereum object",ethereum)
    }
    ethereum.request({method: 'eth_accounts'})
    .then(accounts =>{
      if(accounts.length !==0){
        const account = accounts[0];
        console.log("Found an authorized account", account)

        setCurrentAccount(account)
        getAllWaves()
      }else{
        console.log("No authorized account found")
      }
    })
    } catch (error) {
      console.log(error);
    }
    }

    const connectWallet = ()=>{
      const {ethereum} = window;
      if(!ethereum){
        alert("Get Metamask")
      }
      ethereum.request({method: 'eth_requestAccounts'})
      .then(accounts => {console.log("Connected",accounts[0])})
      .catch(err=>console.log(err));

    }

    const wave = async () =>{
      try{
        const{ethereum} = window;
        if(ethereum){

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const waveportalContract = new ethers.Contract(contractAddress,contractABI, signer);

      let count = await waveportalContract.getTotalWaves()
      console.log("Retrieved total wave count...",count.toNumber())

      const waveTxn = await waveportalContract.wave(projMessage,{gasLimit : 300000})
      alert("Mining...",waveTxn.hash)
      await waveTxn.wait()
      alert("Mined--",waveTxn.hash)

      count = await waveportalContract.getTotalWaves()
      console.log("Retreived total wave count...",count.toNumber())
      setTotalWaves(count.toNumber())
        }else {
        console.log("Ethereum object doesn't exist!");
      }

      } catch (error) {
      console.log(error);
    }
    }


    React.useEffect(()=>{
      checkIfWalletIsConnected()
      
    },[])

   
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there! Lets exchange Ideas 💡 
        </div>

        <div className="bio">
        I am Fatma and I worked on Dapps,This is a platform where innovators meet and collaborate. Send me a wave and write me a message regarding the project you are working on.
        <p><ul style={{color:"Yellow"}}>🏆 The winning project will be selected by the smart contract and recieve an award of 0.0001 ETh</ul>
        <li>⚠ Ensure you have Metamask browser extension</li>
        <li>⚠ Ensure you have some test Eth</li></p>
        </div>
        <h1>{totalWaves} Projects onChain</h1>
        <div>
        {currAccount ? (
        <textarea name="project" placeholder="Write me a message" value={projMessage} onChange={e=>setProjMessage(e.target.value)} rows="4" cols="77" style={{color:"black", backgroundColor:"white"}}/>
        ) : null

        }
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {currAccount ? null :(
          <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
        </button>
        )}
        {allWaves.map((wave,index)=>{
          return(
            <div style={{backgroundColor: "grey", marginTop: "16px", padding: "8px"}}>
            <div>Address:{wave.address}</div>
            <div>Time: {wave.timestamp.toString()}</div>
            <div>Message:{wave.message}</div>
            </div>
          )
        })}
        
      </div>
    </div>
  );
}
