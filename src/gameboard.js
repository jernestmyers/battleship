import { Ship } from "./shipModule";
// need a factory fxn to create both a user and cpu gameboard
// invoke the Ship factory function to instantiate the ship object once coordinates
// are selected for the fleet
// randomly generate CPU gameboard to instantiate its fleet and gameboard
// create a method receiveAttack that takes a coordinate and responds to a hit and to a miss
// create isGameOver method
// track hits and misses to display on gameboards

const Gameboard = (fleet, user) => {
  const createFleet = Ship(fleet);
  // const userFleet = Ship(fleet);
  //   };
  //   console.log(user);
  return { createFleet };
};

// const playerShips = Ship({
//   carrier: [1, 2, 3, 4, 5],
//   battleship: [10, 11, 12, 13],
//   destroyer: [77, 87, 97],
//   submarine: [40, 50, 60],
//   patrol: [58, 59],
// });

const playerFleet = {
  carrier: [1, 2, 3, 4, 5],
  battleship: [10, 11, 12, 13],
  destroyer: [77, 87, 97],
  submarine: [40, 50, 60],
  patrol: [58, 59],
};

const playerBoard = Gameboard(playerFleet, "player");
// console.log(playerBoard);

// random ship placement:
// 1 - randomize orientation: 0 is horiz and 1 is vert
// 2 - randomize placement: generate random number from 0 to 99
// 3 - check if random number exists in computerFleet
// 4 - determine if ship.length must be added or subtracted based on orientation
//     in order to fit on the board
// 5 - check if any of the subsequent coordinates exist
// 6 - if coords exist, discard all and try again
// 6 - if coords do not exist, store coords in the object used to create the CPU fleet

const board = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
  [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
  [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
  [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
  [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
  [80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
  [90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
];

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
  console.log(`${object.name}: ${shipToVerify}`);
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

function placeComputerFleet() {
  ships.forEach((ship) => {
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
  console.log(computerFleet);
}

const ships = [
  { name: `Carrier`, length: 5 },
  { name: `Battleship`, length: 4 },
  { name: `Destroyer`, length: 3 },
  { name: `Submarine`, length: 3 },
  { name: `Patrol Boat`, length: 2 },
];

const computerFleet = [];

placeComputerFleet();
