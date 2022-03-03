import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/EntryPortal.json";
import loadingwhite from "./assets/loadingwhite.gif";
import { makeReq, testToken } from "./utils/spotifyHelper";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const contractAddress = "0x811A1A735fe279b6dcCB8cDf81e350BF38ab2a95";
  const contractABI = abi.abi;
  var entryPortalContract;
  var link = "";
  var token = "";


  // connect to contract
  try {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    entryPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  } catch (error) {
    console.log(error)
  }

  // get all the song entries
  const getAllEntries = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const entries = await entryPortalContract.getAllEntries();
        // create list of track ids and then add to entries after.
        let entriesMap = new Map();
        let trackIds = "";
        let finalEntries = [];
        const ress = testToken();
        ress.then((ans) => { token = ans });
        entries.forEach(entry => {
          const trackId = getTrack(entry.message).split("?")[0];
          if (trackId !== "") {
            if (entriesMap.has(trackId)) {
              let temp = entriesMap.get(trackId);
              console.log(temp);
              temp.push(entry);
              entriesMap.set(trackId, temp)
            } else {
              entriesMap.set(trackId, [entry]);
            }
            trackIds = trackIds.concat(trackId + ",");
          }
        });

        const res = makeReq(trackIds, token);
        res.then((data) => {
          var tracks = data["tracks"];
          console.log(data);
          if (tracks) {
            for (var i = 0; i < tracks.length; i++) {
              var entries = entriesMap.get(tracks[i]["id"])
              entries.forEach((entry) => {
                finalEntries.push({
                  address: entry.person,
                  timestamp: new Date(entry.timestamp * 1000),
                  message: entry.message,
                  title: tracks[i]["name"],
                  artist: tracks[i]["artists"][0]["name"],
                  image: tracks[i]["album"]["images"][0]["url"]
                })
              })
            }
            console.log(finalEntries);
            setAllEntries(finalEntries.reverse());
          }
        })

      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  // parse url to find track ID
  const getTrack = (url) => {
    const temp = url.split("/")
    if (temp.find(val => val === "track")) {
      return temp[temp.length - 1];
    } else {
      return "";
    }
  }

  // handle adding a new song recommendation 
  const enter = async () => {

    link = document.getElementById("link").value;

    try {
      const { ethereum } = window;

      if (ethereum) {
        let count = await entryPortalContract.getEntries();
        console.log("Retrieved total entry count...", count.toNumber());
        const entryTxn = await entryPortalContract.enter(link, { gasLimit: 300000 });
        setLoading(true);
        console.log("Mining...", entryTxn.hash);

        await entryTxn.wait();
        console.log("Mined -- ", entryTxn.hash);

        

        count = await entryPortalContract.getEntries();
        console.log("Retrieved total entry count...", count.toNumber());
        getAllEntries();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setLoading(false);

  }

  // self explanatory
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("found account: ", account);
      } else {
        console.log("no account found");
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // also self explanatory
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("you need metamask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllEntries();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    const res = testToken();
    res.then((ans) => { token = ans });
    getAllEntries();
  }, [])


  return (
    <div className="mainContainer">

      <div className="dataContainer">
        {!currentAccount && (
          <button className="btn-connect" onClick={connectWallet}>
            connect wallet
          </button>
        )}
        {currentAccount && (
          <button className="btn-connect">
            connected!
          </button>
        )}
        <div className="header">
          <span role="img" aria-label="hello">👋</span> hey i'm saman!
        </div>

        <div className="bio">
          connect your ethereum wallet and rec songs to me through the blockchain!
          There is a <b>50% chance</b> of winning 0.0001 ether <span role="img" aria-label="smile">😄</span>
        </div>
        <div className="bio">
          i've received a total of <b>{allEntries.length}</b> song(s) so far
        </div>

        {currentAccount && (
          <div className="dataContainer">
            <input className="input" type="text" id="link" placeholder="enter spotify link"></input>
            <button className="btn-else" onClick={enter}>
              recommend!
            </button>
          </div>
        )}


        {loading && (
          <img src={loadingwhite} className="loadingcat" alt="loading gif" />
        )}

        <div className="scrollable">
          {allEntries.map((entry, index) => {
            return (
              <a href={entry.message} className="link">
                <div key={index} className="disp-rec songContainer">
                  <div className="songTitle">{entry.title}</div>
                  <div className="songArtist">By: {entry.artist} </div>
                  <img src={entry.image} alt="song cover" className="songImage" />
                  <div>From: {entry.address}</div>
                </div>
              </a>)
          })}
        </div>


      </div>
    </div>
  );
}
