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

// function generateComputerAttack() {
//   const randomIndex = Math.floor(Math.random() * getValidMoves.length);
//   const randomMove = getValidMoves[randomIndex];
//   getValidMoves.splice(randomIndex, 1);
//   return randomMove;
// }
let isAITriggered = false;
let initialCPUHitArray = [];

function getValidAdjacentCPUMoves(initialHit) {
  console.log(initialHit);
  getMovesRight(initialHit);
  getMovesLeft(initialHit);
  getMovesDown(initialHit);
  getMovesUp(initialHit);
}

function getMovesRight(hit) {
  const getIndex = getValidMoves.indexOf(hit);
  const movesRight = getValidMoves.slice(getIndex).filter((item, index) => {
    if (item - hit - index === 0 && item < (Math.floor(hit / 10) + 1) * 10) {
      return item;
    }
  });
  movesRight.shift();
  console.log({ movesRight });
}

function getMovesLeft(hit) {
  const getIndex = getValidMoves.indexOf(hit);
  const mapValidMoves = getValidMoves.map((item) => {
    return item;
  });
  const movesLeft = [];
  mapValidMoves.splice(getIndex, mapValidMoves.length - 1);
  mapValidMoves.reverse().filter((item, index) => {
    if (hit === item + index + 1 && item >= Math.floor(hit / 10) * 10) {
      movesLeft.push(item);
    }
  });
  console.log({ movesLeft });
}

function getMovesDown(hit) {
  const verticalMoves = getValidMoves.filter((coord) => {
    if (
      hit - Math.floor(hit / 10) * 10 ===
      coord - Math.floor(coord / 10) * 10
    ) {
      return coord;
    }
  });
  const movesDown = verticalMoves
    .slice(verticalMoves.indexOf(hit))
    .filter((coord, index) => {
      if (coord - hit - index * 10 === 0) {
        return coord;
      }
    });
  movesDown.shift();
  console.log({ movesDown });
}

function getMovesUp(hit) {
  const verticalMoves = getValidMoves.filter((coord) => {
    if (hit % 10 === coord % 10) {
      return coord;
    }
  });
  verticalMoves.reverse();

  const movesUp = verticalMoves
    .slice(verticalMoves.indexOf(hit))
    .filter((coord, index) => {
      if (hit === coord + index * 10) {
        return coord;
      }
    });
  if (
    hit % 10 === 0 &&
    getValidMoves.includes(0) &&
    hit === movesUp.length * 10
  ) {
    movesUp.push(0);
  }
  movesUp.shift();
  console.log({ movesUp });
}

function generateComputerAttack() {
  let cpuMove;
  if (!isAITriggered) {
    const randomIndex = Math.floor(Math.random() * getValidMoves.length);
    cpuMove = getValidMoves[randomIndex];
    // getValidMoves.splice(randomIndex, 1);
  } else {
    console.log(`begin smart move`);
    // console.log(initialCPUHitArray);
    // cpuMove = getSmartCPUMove();
    // getValidMoves.splice(getValidMoves.indexOf(cpuMove), 1);
  }
  return cpuMove;
}

// let isVert;
// let areShipsAdjacent;
// function getSmartCPUMove() {
//   if (
//     getValidMoves.includes(initialCPUHitArray[1] + 1) &&
//     initialCPUHitArray[1] + 1 <
//       (Math.floor(initialCPUHitArray[1] / 10) + 1) * 10
//   ) {
//     return initialCPUHitArray[1] + 1;
//   } else if (
//     getValidMoves.includes(initialCPUHitArray[1] - 1) &&
//     initialCPUHitArray[1] - 1 > Math.floor(initialCPUHitArray[1] / 10) * 10
//   ) {
//     return initialCPUHitArray[1] - 1;
//   }
// }
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
      // console.log(attackOutcome);
      renderMove(getTurn, attackOutcome);
      if (attackOutcome[0]) {
        // console.log(attackOutcome);
        // console.log(storedGameboards);
        storedGameboards.filter((item) => {
          if (item[0] === getTurn) {
            isGameOver = item[1].isGameOver();
          }
        });
      }
      if (getTurn === `computer`) {
        if (attackOutcome[0] && getTurn === `computer`) {
          isAITriggered = true;
          storedGameboards[1][1].ships.fleet.filter((object) => {
            if (attackOutcome[0] === object.name && object.hits.length === 1)
              console.log(`first hit`);
            initialCPUHitArray = [object, attackOutcome[1]];
          });
          const validSmartMoves = getValidAdjacentCPUMoves(attackOutcome[1]);
          // console.log(validSmartMoves);
        }
        getValidMoves.splice(getValidMoves.indexOf(attackOutcome[1]), 1);
      }

      if (attackOutcome[0] && getTurn === `player`) {
        let isShipSunk;
        // let arrayIndex;
        storedGameboards[0][1].ships.fleet.filter((object, index) => {
          if (attackOutcome[0] === object.name) {
            isShipSunk = object.isSunk;
            // arrayIndex = index;
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
