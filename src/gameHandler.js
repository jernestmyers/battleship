import { Gameboard, placeComputerFleet, receiveAttack } from "./gameboard";
import { renderMove, deregisterRemainingEventListneners } from "./renderGame";
import { setDragAndDrop } from "./dragAndDrop";

const storedGameboards = [];

let turnCounter = 1;
function turnDriver() {
  let whoseMove;
  if (turnCounter % 2 !== 0) {
    whoseMove = `player`;
  } else {
    whoseMove = `computer`;
  }
  turnCounter += 1;
  return whoseMove;
}

const randomizePlayerFleetBtn = document.querySelector(
  `#randomize-player-fleet`
);
randomizePlayerFleetBtn.addEventListener(`click`, randomizePlayerFleet);

function randomizePlayerFleet() {
  setDragAndDrop.hideShipsToPlace();
  const startBtn = document.querySelector(`#start-game-btn`);
  startBtn.style.display = "flex";
  if (storedGameboards[1]) {
    storedGameboards.pop();
    const cpuBoard = document.querySelector(`#cpu-board`);
    const renderedPlayerShips = document.querySelectorAll(
      `.player-ships-rendered`
    );
    for (let i = 0; i < 5; i++) {
      cpuBoard.removeChild(renderedPlayerShips[i]);
    }
  }
  const playerFleetArray = [];
  const playerFleet = placeComputerFleet(`user`, playerFleetArray);
  createPlayerObjects(playerFleet);
}

function createPlayerObjects(fleet) {
  const playerBoard = Gameboard(fleet);
  storedGameboards.push([`computer`, playerBoard]);
}

function createComputerObjects() {
  const cpuFleetArray = [];
  const computerFleet = placeComputerFleet(`cpu`, cpuFleetArray);
  const computerBoard = Gameboard(computerFleet);
  storedGameboards.push([`player`, computerBoard]);
}
createComputerObjects();

let getValidMoves = createValidMovesArray();
let getPlayerMovesRemaining = createValidMovesArray();

function handleState() {
  if (storedGameboards.length === 2) {
    storedGameboards.shift();
  }
  storedGameboards.shift();
  createComputerObjects();
  getValidMoves = createValidMovesArray();
  getPlayerMovesRemaining = createValidMovesArray();
}

// BEGIN ----- generates random move for computer ----------- //
function createValidMovesArray() {
  const validMoves = [];
  const maxMoves = 100;
  for (let i = 0; i < maxMoves; i++) {
    validMoves.push(i);
  }
  return validMoves;
}

function generateComputerAttack() {
  const randomIndex = Math.floor(Math.random() * getValidMoves.length);
  const randomMove = getValidMoves[randomIndex];
  getValidMoves.splice(randomIndex, 1);
  return randomMove;
}
// END ----- generates random move for computer ----------- //

function gameLoop(playerMove) {
  let getTurn;
  let coordOfAttack;
  let isGameOver = false;
  const indexToSplice = getPlayerMovesRemaining.findIndex(
    (index) => index === playerMove
  );
  getPlayerMovesRemaining.splice(indexToSplice, 1);
  for (let i = 0; i < 2; i++) {
    if (!isGameOver) {
      getTurn = turnDriver();
      if (getTurn === `player`) {
        coordOfAttack = playerMove;
      } else {
        coordOfAttack = generateComputerAttack();
      }
      const attackOutcome = receiveAttack(coordOfAttack, getTurn);
      console.log(attackOutcome);
      renderMove(getTurn, attackOutcome);
      if (attackOutcome[0]) {
        console.log(storedGameboards);
        storedGameboards.filter((item) => {
          if (item[0] === getTurn) {
            isGameOver = item[1].isGameOver();
          }
        });
      }
      if (attackOutcome[0] && getTurn === `player`) {
        let isShipSunk;
        let arrayIndex;
        storedGameboards[0][1].ships.fleet.filter((object, index) => {
          if (attackOutcome[0] === object.name) {
            isShipSunk = object.isSunk;
            arrayIndex = index;
            if (isShipSunk) {
              const cpuHiddenShips =
                document.querySelectorAll(`.cpu-ships-rendered`);
              cpuHiddenShips[index].style.display = `block`;
              cpuHiddenShips[index].style.zIndex = `1`;
            }
          }
        });
      }
      if (isGameOver) {
        const gameOverModal = document.querySelector(`#game-over-modal`);
        const displayWinnerText = document.querySelector(`#display-winner`);
        deregisterRemainingEventListneners(getPlayerMovesRemaining);
        if (getTurn === `player`) {
          displayWinnerText.textContent = `You win!`;
        } else {
          displayWinnerText.textContent = `You lose!`;
        }
        gameOverModal.style.display = "block";
      }
    }
  }
}

export { storedGameboards, gameLoop, createPlayerObjects, handleState };
