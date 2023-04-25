import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
const util = require('./utils/util');


function App() {
  const [roundInfo, setRoundInfo] = useState([]);
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [player1Cards, setPlayer1Cards] = useState([]);
  const [player2Cards, setPlayer2Cards] = useState([]);
  const [Winner, setWinner] = useState("");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [prevWarWinner, setPrevWarWinner] = useState("draw");
  const [showNextButton, setShowNextButton] = useState(false);
  

  const handleStartGame = async () => {
    // Call the backend to start a new game and set the state of the component
    // based on the response
    const response = await axios.post(`http://${process.env.SERVER_HOST || 'localhost'}:${process.env.SERVER_PORT || 'localhost'}/start`);
    // Update state with the decks returned by the API
    setRoundInfo([...response.data.rounds]);
    setPlayer1Deck([...response.data.deck1]);
    setPlayer2Deck([...response.data.deck2]);
    setPlayer1Cards([]);
    setPlayer2Cards([]);
    if (!response.data.draw) {
      setWinner(response.data.winner_name);
    } else {
      setWinner("Draw");
    }
    setPrevWarWinner("");
    setShowNextButton(true);

    const getResponse = await axios.get(`http://${process.env.SERVER_HOST || 'localhost'}:${process.env.SERVER_PORT || 'localhost'}/lifetime-wins`);
    setPlayer1Score(getResponse.data[0].wins);
    setPlayer2Score(getResponse.data[1].wins);
  };

  const handleNext = () => {
    if (prevWarWinner !== "draw" && player1Cards.length !== 0 && player2Cards.length !== 0) {
      if (prevWarWinner === "Player 1") {
        let newCards = [...player1Cards.reverse(), ...player2Cards.reverse()];
        // setPlayer1Deck(prev => [...prev, ...newCards]); // this is what the documentation recommends but it doesn't change the state as expected
        player1Deck.push(...newCards);
      } else {
        let newCards = [...player2Cards.reverse(), ...player1Cards.reverse()];
        // setPlayer2Deck(prev => [...prev, ...newCards]); // same as above
        player2Deck.push(...newCards);
      }
    }
    if (roundInfo.length === 0) {
      return;
    }
    const round = roundInfo[0];
    setRoundInfo(roundInfo.slice(1));
    setPlayer1Cards(round.cardCodes1);
    setPlayer2Cards(round.cardCodes2);
    setPrevWarWinner(round.winner);
    if (round.winner !== "draw") {
      setPlayer1Deck(player1Deck.slice(1));
      setPlayer2Deck(player2Deck.slice(1));
    } else {
      setPlayer1Deck(player1Deck.slice(2));
      setPlayer2Deck(player2Deck.slice(2));
    }
    if (roundInfo.length === 0) {
      setShowNextButton(false);
    }
  };

  const handleClearHistory = async() => {
    // Call the backend to clear the history and reset the state of the component
    await axios.delete(`http://${process.env.SERVER_HOST || 'localhost'}:${process.env.SERVER_PORT || 'localhost'}/clear`);
    const getResponse = await axios.get(`http://${process.env.SERVER_HOST || 'localhost'}:${process.env.SERVER_PORT || 'localhost'}/lifetime-wins`);
    setPlayer1Score(getResponse.data[0].wins);
    setPlayer2Score(getResponse.data[1].wins);
    setRoundInfo([]);
    setPlayer1Deck([]);
    setPlayer2Deck([]);
    setPlayer1Cards([]);
    setPlayer2Cards([]);
    setWinner("");
    setPrevWarWinner("");
    setShowNextButton(false);
  };

  return (
    <div className='page'>
      <div className='container'>
        <div className="score-board">Player 1 Score: {player1Score}</div>
        <div className='score-board'>Player 2 Score: {player2Score}</div>
        <div className='score-board'><button onClick={handleClearHistory}>Clear History</button></div>
          
      </div>
      
      
      <hr />
      {showNextButton && <div className='intro'>Click <b><i>Start New Game</i></b> to start a <b>War</b> card game</div> }
      {showNextButton && <div className='intro'>Click <b><i>Next</i></b> to replay the game step by step. Remaining <b>{roundInfo.length}</b> rounds to end</div> }

      {showNextButton && <div>Current round winner: {prevWarWinner}</div>}
      <button onClick={handleStartGame}>Start New Game</button>
      {showNextButton && <button onClick={handleNext}>Next</button>}
      {showNextButton && <div>Final Winner: {Winner} (This is a spoiler. The game below is a replay.)</div>}
      <hr />

      <div className="board">
        <div className="player player1">
          <h2>Player 1</h2>
          <h3>Player 1 Deck Length: {player1Deck.length}</h3>
          <h3>Player 1 Cards: </h3>
          <div className='card'>{player1Cards.map(val => util.getCardUnicode(val)).join('')}</div>
        </div>
        <div className="player player1">
          <h2>Player 2</h2>
          <h3>Player 2 Deck Length: {player2Deck.length}</h3>
          <h3>Player 2 Cards: </h3>
          <div className='card'>{player2Cards.map(val => util.getCardUnicode(val)).join('')}</div>
        </div>
      </div>
      
      <hr />
      
    </div>
  );
}

export default App;



