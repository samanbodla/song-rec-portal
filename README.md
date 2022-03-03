

## The Song Recommendation Portal
Am app that takes in entries of song recommendations and communicates with the blockchain with the following smart contract:
https://github.com/samanbodla/song-rec-smart-contract

### Description
After connecting to a wallet, the app allows the user to recommend songs which requires a transaction since the songs are stored in the blockchain. All recommended songs are displayed and can be clicked to open it's spotify page. 
The app also communicates with the Spotify API to retrieve each song's title, artist, and cover image so it can be displayed in the list.
<!-- ![screenshot](https://github.com/samanbodla/song-rec-portal/blob/master/src/assets/screenshot.PNG | width=100) -->
<img src="https://github.com/samanbodla/song-rec-portal/blob/master/src/assets/screenshot.PNG" width="1000" />

### Installation
You will first need to create a spotify development account and create your credentials to use for the app. To recommend songs you will need a metamask wallet which commmunicates on the Rinkeby test network. To start the app, in the terminal you must run
``` 
npm install 
```
and then 
```
npm start
```
