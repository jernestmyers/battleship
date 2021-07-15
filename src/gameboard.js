import { Ships } from "./shipModule";

const storedGameboards = [];

const Gameboard = (fleetArray) => {
  const gameboard = [
    fleetArray[0],
    fleetArray[1],
    fleetArray[2],
    fleetArray[3],
    fleetArray[4],
  ];
  const misses = [];
  const ships = Ships();

  const isGameOver = () => {
    const array = ships.fleet;
    let isGameOver = false;
    let shipsSunkCounter = 0;

    array.filter((obj) => {
      if (obj.isSunk) {
        shipsSunkCounter += 1;
      }
    });
    if (shipsSunkCounter === 5) {
      isGameOver = true;
    }
    console.log(shipsSunkCounter);
    return isGameOver;
  };

  return { gameboard, misses, ships, isGameOver };
};

// hard-coded instantiation of playerFleet
const playerFleet = [
  { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
  { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
  { name: "Destroyer", shipPlacement: [77, 87, 97] },
  { name: "Submarine", shipPlacement: [40, 50, 60] },
  { name: "Patrol Boat", shipPlacement: [58, 59] },
];

const playerBoard = Gameboard(playerFleet);
storedGameboards.push([`player`, playerBoard]);

// BEGIN-------- creates a randomly placed board for computer ------- //
const computerFleet = [];

function generateRandomPlacement() {
  const numberOfCoordinates = 100;
  const orientation = Math.floor(Math.random() * 2);
  const firstCoord = Math.floor(Math.random() * numberOfCoordinates);
  return [orientation, firstCoord];
}

function orientShip(startCoord, orientation, name, length) {
  let shipPlacement = [];
  let horizontalLimit;
  if (startCoord < 10) {
    horizontalLimit = 9;
  } else {
    horizontalLimit = +(startCoord.toString().charAt(0) + 9);
  }
  for (let i = 0; i < length; i++) {
    if (orientation) {
      if (startCoord + (length - 1) * 10 < 100) {
        shipPlacement.push(startCoord + i * 10);
      } else {
        shipPlacement.push(startCoord - i * 10);
      }
    } else {
      if (startCoord + (length - 1) <= horizontalLimit) {
        shipPlacement.push(startCoord + i);
      } else {
        shipPlacement.push(startCoord - i);
      }
    }
  }
  return { name, shipPlacement };
}

function verifyCoords(object) {
  const shipToVerify = object.shipPlacement;
  //   console.log(`${object.name}: ${shipToVerify}`);
  let isPlacementValid = false;
  if (!computerFleet.length) {
    isPlacementValid = true;
    return isPlacementValid;
  } else {
    isPlacementValid = true;
    for (let i = 0; i < shipToVerify.length; i++) {
      if (!isPlacementValid) {
        break;
      } else {
        computerFleet.forEach((ship) => {
          if (isPlacementValid) {
            for (let j = 0; j < ship.shipPlacement.length; j++) {
              if (shipToVerify[i] !== ship.shipPlacement[j]) {
                isPlacementValid = true;
                continue;
              } else {
                isPlacementValid = false;
                break;
              }
            }
          }
        });
      }
    }
  }
  return isPlacementValid;
}

// used for the name and length props in the placeComputerFleet fxn
const shipClone = Ships();

function placeComputerFleet() {
  shipClone.fleet.forEach((ship) => {
    let isValid = false;
    while (!isValid) {
      isValid = false;
      const randomValues = generateRandomPlacement();
      const placement = orientShip(
        randomValues[1],
        randomValues[0],
        ship.name,
        ship.length
      );
      const verify = verifyCoords(placement);
      if (verify) {
        isValid = true;
        computerFleet.push(placement);
      }
    }
  });
  //   console.log(computerFleet);
}

placeComputerFleet();

const computerBoard = Gameboard(computerFleet);
storedGameboards.push([`computer`, computerBoard]);
console.log(storedGameboards);
// END-------- creates a randomly placed board for computer ------- //

const receiveAttack = (attackCoord, user) => {
  let index;
  let attackOutcome = [null, attackCoord];
  if (user === `player`) {
    index = 0;
  } else {
    index = 1;
  }
  const gameboardObject = storedGameboards[index][1];
  gameboardObject.gameboard.forEach((object) => {
    if (object.shipPlacement.includes(attackCoord)) {
      attackOutcome = [object.name, attackCoord];
    }
  });
  if (!attackOutcome[0]) {
    gameboardObject.misses.push(attackCoord);
  } else {
    gameboardObject.ships.hit(attackOutcome);
    gameboardObject.ships.isSunk(attackOutcome[0]);
  }
  console.log(attackOutcome);
  console.log(storedGameboards);
  console.log(gameboardObject);
  return attackOutcome;
};

// receiveAttack(30, `player`);
// receiveAttack(13, `computer`);
// receiveAttack(50, `player`);
// receiveAttack(28, `computer`);
// receiveAttack(21, `player`);
// receiveAttack(40, `player`);
// receiveAttack(60, `player`);
// receiveAttack(89, `player`);
// receiveAttack(12, `player`);
// receiveAttack(19, `player`);
// receiveAttack(73, `player`);

// function isGameOver(index) {
//   const array = storedGameboards[index][1].ships.fleet;
//   let isGameOver = false;
//   let shipsSunkCounter = 0;
//   array.filter((obj) => {
//     if (obj.isSunk) {
//       shipsSunkCounter += 1;
//     }
//   });
//   if (shipsSunkCounter === 5) {
//     isGameOver = true;
//   }
//   console.log(shipsSunkCounter);
//   return isGameOver;
// }
console.log(storedGameboards[0][1].isGameOver(0));

// const board = [
//   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
//   [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
//   [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
//   [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
//   [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
//   [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
//   [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
//   [80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
//   [90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
// ];
export { Gameboard };
