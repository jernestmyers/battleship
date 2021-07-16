import { Gameboard, placeComputerFleet, receiveAttack } from "./gameboard";
import { deregisterRemainingEventListneners } from "./renderGame";

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

// const Player = () => {
//   const isTurn = () => {
//     if (turnCounter % 2 !== 0) {
//       return `player`;
//     } else {
//       return `computer`;
//     }
//   };
//   return { isTurn };
// };

// const player = Player();
// const computer = Player();

// hard-coded instantiation of playerFleet
const playerFleet = [
  { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
  { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
  { name: "Destroyer", shipPlacement: [77, 87, 97] },
  { name: "Submarine", shipPlacement: [40, 50, 60] },
  { name: "Patrol Boat", shipPlacement: [58, 59] },
];
const playerBoard = Gameboard(playerFleet);

const computerFleet = placeComputerFleet();
const computerBoard = Gameboard(computerFleet);

storedGameboards.push([`player`, computerBoard]);
storedGameboards.push([`computer`, playerBoard]);
console.log(storedGameboards);

// BEGIN ----- generates random move for computer ----------- //
function createValidMovesArray() {
  const validMoves = [];
  const maxMoves = 100;
  for (let i = 0; i < maxMoves; i++) {
    validMoves.push(i);
  }
  return validMoves;
}

const getValidMoves = createValidMovesArray();
const getPlayerMovesRemaining = createValidMovesArray();

function generateComputerAttack() {
  const randomIndex = Math.floor(Math.random() * getValidMoves.length);
  const randomMove = getValidMoves[randomIndex];
  getValidMoves.splice(randomIndex, 1);
  return randomMove;
}
// END ----- generates random move for computer ----------- //

function gameLoop(playerMove) {
  let getTurn;
  let attackOutcome;
  let isGameOver = false;
  const indexToSplice = getPlayerMovesRemaining.findIndex(
    (index) => index === playerMove
  );
  getPlayerMovesRemaining.splice(indexToSplice, 1);
  console.log(getPlayerMovesRemaining);
  //   for (let i = 0; i < 2; i++) {
  getTurn = turnDriver();
  //   if (!isGameOver) {
  if (getTurn === `player`) {
    const playerAttack = playerMove;
    attackOutcome = receiveAttack(playerAttack, getTurn);
    console.log(`player move`);
    console.log(storedGameboards);
    if (attackOutcome[0]) {
      storedGameboards.filter((item) => {
        if (item[0] === getTurn) {
          isGameOver = item[1].isGameOver();
        }
      });
    }
    if (isGameOver) {
      deregisterRemainingEventListneners(getPlayerMovesRemaining);
      alert(`game over! ${getTurn} wins!`);
    }
  }
  // } else {
  if (!isGameOver) {
    getTurn = turnDriver();
    const computerAttack = generateComputerAttack();
    attackOutcome = receiveAttack(computerAttack, getTurn);
    console.log(`cpu move`);
    console.log(storedGameboards);
    if (attackOutcome[0]) {
      storedGameboards.filter((item) => {
        if (item[0] === getTurn) {
          isGameOver = item[1].isGameOver();
        }
      });
    }
  } else {
    alert(`game over! ${getTurn} wins!`);
  }
  // if (attackOutcome[0]) {
  //   storedGameboards.filter((item) => {
  //     if (item[0] === getTurn) {
  //       isGameOver = item[1].isGameOver();
  //     }
  //   });
  // }
  //   } else {
  //   }
  //   }
}

export { storedGameboards, gameLoop };
