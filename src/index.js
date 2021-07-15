import { Ships } from "./shipModule";
import { Gameboard } from "./gameboard";

// hard-coded instantiation of playerFleet
const playerFleet = [
  { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
  { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
  { name: "Destroyer", shipPlacement: [77, 87, 97] },
  { name: "Submarine", shipPlacement: [40, 50, 60] },
  { name: "Patrol Boat", shipPlacement: [58, 59] },
];
const playerBoard = Gameboard(playerFleet);

// const playerShips = Ships();
// const computerShips = Ships();

// console.log(playerShips);
// playerShips.hit([`Submarine`, 30]);
// playerShips.isSunk(`Submarine`);
// console.log(playerShips);
// playerShips.hit([`Patrol Boat`, 15]);
// playerShips.isSunk(`Patrol Boat`);
// console.log(playerShips);
// playerShips.hit([`Patrol Boat`, 16]);
// playerShips.isSunk(`Patrol Boat`);
// console.log(playerShips);

let turnCounter = 1;

const Player = () => {
  const isTurn = () => {
    if (turnCounter % 2 !== 0) {
      return `player`;
    } else {
      return `computer`;
    }
  };
  return { isTurn };
};

const player = Player();
const computer = Player();
// player.data.push(playerBoard);
console.log(player.isTurn());
console.log(computer.isTurn());

// BEGIN ----- generates random move for computer ----------- //
function createNewComputerMoves() {
  const validMoves = [];
  const maxMoves = 100;
  for (let i = 0; i < maxMoves; i++) {
    validMoves.push(i);
  }
  // console.log(validMoves);
  return validMoves;
}

const getValidMoves = createNewComputerMoves();

function generateComputerAttack() {
  const randomIndex = Math.floor(Math.random() * getValidMoves.length);
  const randomMove = getValidMoves[randomIndex];
  console.log(randomIndex);
  console.log(randomMove);
  console.log(getValidMoves);
  getValidMoves.splice(randomIndex, 1);
  console.log(getValidMoves);
  return randomMove;
}
// END ----- generates random move for computer ----------- //
