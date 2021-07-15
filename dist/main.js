/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Gameboard": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _shipModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipModule */ "./src/shipModule.js");


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
  const ships = (0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.Ships)();

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
const shipClone = (0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.Ships)();

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



/***/ }),

/***/ "./src/shipModule.js":
/*!***************************!*\
  !*** ./src/shipModule.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ships": () => (/* binding */ Ships)
/* harmony export */ });
const Ships = () => {
  const fleet = [
    { name: `Carrier`, length: 5, hits: [], isSunk: false },
    { name: `Battleship`, length: 4, hits: [], isSunk: false },
    { name: `Destroyer`, length: 3, hits: [], isSunk: false },
    { name: `Submarine`, length: 3, hits: [], isSunk: false },
    { name: `Patrol Boat`, length: 2, hits: [], isSunk: false },
  ];

  const hit = (attackData) => {
    const shipHit = attackData[0];
    const coordOfHit = attackData[1];
    fleet.forEach((ship) => {
      if (shipHit === ship.name) {
        ship.hits.push(coordOfHit);
      }
    });
  };

  const isSunk = (shipHit) => {
    fleet.forEach((ship) => {
      if (shipHit === ship.name && ship.length === ship.hits.length) {
        ship.isSunk = true;
      }
    });
  };

  return { fleet, hit, isSunk };
};

// module.exports = { hit, isSunk };



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shipModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipModule */ "./src/shipModule.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");



// hard-coded instantiation of playerFleet
const playerFleet = [
  { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
  { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
  { name: "Destroyer", shipPlacement: [77, 87, 97] },
  { name: "Submarine", shipPlacement: [40, 50, 60] },
  { name: "Patrol Boat", shipPlacement: [58, 59] },
];
const playerBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_1__.Gameboard)(playerFleet);

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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDOztBQUVyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isa0RBQUs7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBLEdBQUcsa0RBQWtEO0FBQ3JELEdBQUcsc0RBQXNEO0FBQ3pELEdBQUcsaURBQWlEO0FBQ3BELEdBQUcsaURBQWlEO0FBQ3BELEdBQUcsK0NBQStDO0FBQ2xEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLFlBQVksSUFBSSxhQUFhO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsbUJBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSwyQkFBMkIsK0JBQStCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0Isa0RBQUs7O0FBRXZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDcUI7Ozs7Ozs7Ozs7Ozs7OztBQ3ROckI7QUFDQTtBQUNBLEtBQUssc0RBQXNEO0FBQzNELEtBQUsseURBQXlEO0FBQzlELEtBQUssd0RBQXdEO0FBQzdELEtBQUssd0RBQXdEO0FBQzdELEtBQUssMERBQTBEO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsVUFBVTtBQUNWOztBQUVBLHFCQUFxQjtBQUNKOzs7Ozs7O1VDL0JqQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNOcUM7QUFDRzs7QUFFeEM7QUFDQTtBQUNBLEdBQUcsa0RBQWtEO0FBQ3JELEdBQUcsc0RBQXNEO0FBQ3pELEdBQUcsaURBQWlEO0FBQ3BELEdBQUcsaURBQWlEO0FBQ3BELEdBQUcsK0NBQStDO0FBQ2xEO0FBQ0Esb0JBQW9CLHFEQUFTOztBQUU3QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaGlwcyB9IGZyb20gXCIuL3NoaXBNb2R1bGVcIjtcblxuY29uc3Qgc3RvcmVkR2FtZWJvYXJkcyA9IFtdO1xuXG5jb25zdCBHYW1lYm9hcmQgPSAoZmxlZXRBcnJheSkgPT4ge1xuICBjb25zdCBnYW1lYm9hcmQgPSBbXG4gICAgZmxlZXRBcnJheVswXSxcbiAgICBmbGVldEFycmF5WzFdLFxuICAgIGZsZWV0QXJyYXlbMl0sXG4gICAgZmxlZXRBcnJheVszXSxcbiAgICBmbGVldEFycmF5WzRdLFxuICBdO1xuICBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBTaGlwcygpO1xuXG4gIGNvbnN0IGlzR2FtZU92ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBzaGlwcy5mbGVldDtcbiAgICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgIGxldCBzaGlwc1N1bmtDb3VudGVyID0gMDtcblxuICAgIGFycmF5LmZpbHRlcigob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLmlzU3Vuaykge1xuICAgICAgICBzaGlwc1N1bmtDb3VudGVyICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHNoaXBzU3Vua0NvdW50ZXIgPT09IDUpIHtcbiAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhzaGlwc1N1bmtDb3VudGVyKTtcbiAgICByZXR1cm4gaXNHYW1lT3ZlcjtcbiAgfTtcblxuICByZXR1cm4geyBnYW1lYm9hcmQsIG1pc3Nlcywgc2hpcHMsIGlzR2FtZU92ZXIgfTtcbn07XG5cbi8vIGhhcmQtY29kZWQgaW5zdGFudGlhdGlvbiBvZiBwbGF5ZXJGbGVldFxuY29uc3QgcGxheWVyRmxlZXQgPSBbXG4gIHsgbmFtZTogXCJDYXJyaWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFsxLCAyLCAzLCA0LCA1XSB9LFxuICB7IG5hbWU6IFwiQmF0dGxlc2hpcFwiLCBzaGlwUGxhY2VtZW50OiBbMTAsIDExLCAxMiwgMTNdIH0sXG4gIHsgbmFtZTogXCJEZXN0cm95ZXJcIiwgc2hpcFBsYWNlbWVudDogWzc3LCA4NywgOTddIH0sXG4gIHsgbmFtZTogXCJTdWJtYXJpbmVcIiwgc2hpcFBsYWNlbWVudDogWzQwLCA1MCwgNjBdIH0sXG4gIHsgbmFtZTogXCJQYXRyb2wgQm9hdFwiLCBzaGlwUGxhY2VtZW50OiBbNTgsIDU5XSB9LFxuXTtcblxuY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lYm9hcmQocGxheWVyRmxlZXQpO1xuc3RvcmVkR2FtZWJvYXJkcy5wdXNoKFtgcGxheWVyYCwgcGxheWVyQm9hcmRdKTtcblxuLy8gQkVHSU4tLS0tLS0tLSBjcmVhdGVzIGEgcmFuZG9tbHkgcGxhY2VkIGJvYXJkIGZvciBjb21wdXRlciAtLS0tLS0tIC8vXG5jb25zdCBjb21wdXRlckZsZWV0ID0gW107XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCkge1xuICBjb25zdCBudW1iZXJPZkNvb3JkaW5hdGVzID0gMTAwO1xuICBjb25zdCBvcmllbnRhdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICBjb25zdCBmaXJzdENvb3JkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtYmVyT2ZDb29yZGluYXRlcyk7XG4gIHJldHVybiBbb3JpZW50YXRpb24sIGZpcnN0Q29vcmRdO1xufVxuXG5mdW5jdGlvbiBvcmllbnRTaGlwKHN0YXJ0Q29vcmQsIG9yaWVudGF0aW9uLCBuYW1lLCBsZW5ndGgpIHtcbiAgbGV0IHNoaXBQbGFjZW1lbnQgPSBbXTtcbiAgbGV0IGhvcml6b250YWxMaW1pdDtcbiAgaWYgKHN0YXJ0Q29vcmQgPCAxMCkge1xuICAgIGhvcml6b250YWxMaW1pdCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gKyhzdGFydENvb3JkLnRvU3RyaW5nKCkuY2hhckF0KDApICsgOSk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChvcmllbnRhdGlvbikge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgKiAxMCA8IDEwMCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkgKiAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkgKiAxMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpIDw9IGhvcml6b250YWxMaW1pdCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgbmFtZSwgc2hpcFBsYWNlbWVudCB9O1xufVxuXG5mdW5jdGlvbiB2ZXJpZnlDb29yZHMob2JqZWN0KSB7XG4gIGNvbnN0IHNoaXBUb1ZlcmlmeSA9IG9iamVjdC5zaGlwUGxhY2VtZW50O1xuICAvLyAgIGNvbnNvbGUubG9nKGAke29iamVjdC5uYW1lfTogJHtzaGlwVG9WZXJpZnl9YCk7XG4gIGxldCBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gIGlmICghY29tcHV0ZXJGbGVldC5sZW5ndGgpIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbiAgfSBlbHNlIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBUb1ZlcmlmeS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcHV0ZXJGbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgICAgaWYgKGlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcC5zaGlwUGxhY2VtZW50Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChzaGlwVG9WZXJpZnlbaV0gIT09IHNoaXAuc2hpcFBsYWNlbWVudFtqXSkge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xufVxuXG4vLyB1c2VkIGZvciB0aGUgbmFtZSBhbmQgbGVuZ3RoIHByb3BzIGluIHRoZSBwbGFjZUNvbXB1dGVyRmxlZXQgZnhuXG5jb25zdCBzaGlwQ2xvbmUgPSBTaGlwcygpO1xuXG5mdW5jdGlvbiBwbGFjZUNvbXB1dGVyRmxlZXQoKSB7XG4gIHNoaXBDbG9uZS5mbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcbiAgICB3aGlsZSAoIWlzVmFsaWQpIHtcbiAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHJhbmRvbVZhbHVlcyA9IGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCk7XG4gICAgICBjb25zdCBwbGFjZW1lbnQgPSBvcmllbnRTaGlwKFxuICAgICAgICByYW5kb21WYWx1ZXNbMV0sXG4gICAgICAgIHJhbmRvbVZhbHVlc1swXSxcbiAgICAgICAgc2hpcC5uYW1lLFxuICAgICAgICBzaGlwLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHZlcmlmeSA9IHZlcmlmeUNvb3JkcyhwbGFjZW1lbnQpO1xuICAgICAgaWYgKHZlcmlmeSkge1xuICAgICAgICBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgY29tcHV0ZXJGbGVldC5wdXNoKHBsYWNlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgLy8gICBjb25zb2xlLmxvZyhjb21wdXRlckZsZWV0KTtcbn1cblxucGxhY2VDb21wdXRlckZsZWV0KCk7XG5cbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lYm9hcmQoY29tcHV0ZXJGbGVldCk7XG5zdG9yZWRHYW1lYm9hcmRzLnB1c2goW2Bjb21wdXRlcmAsIGNvbXB1dGVyQm9hcmRdKTtcbmNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuLy8gRU5ELS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgY29tcHV0ZXIgLS0tLS0tLSAvL1xuXG5jb25zdCByZWNlaXZlQXR0YWNrID0gKGF0dGFja0Nvb3JkLCB1c2VyKSA9PiB7XG4gIGxldCBpbmRleDtcbiAgbGV0IGF0dGFja091dGNvbWUgPSBbbnVsbCwgYXR0YWNrQ29vcmRdO1xuICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICBpbmRleCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSAxO1xuICB9XG4gIGNvbnN0IGdhbWVib2FyZE9iamVjdCA9IHN0b3JlZEdhbWVib2FyZHNbaW5kZXhdWzFdO1xuICBnYW1lYm9hcmRPYmplY3QuZ2FtZWJvYXJkLmZvckVhY2goKG9iamVjdCkgPT4ge1xuICAgIGlmIChvYmplY3Quc2hpcFBsYWNlbWVudC5pbmNsdWRlcyhhdHRhY2tDb29yZCkpIHtcbiAgICAgIGF0dGFja091dGNvbWUgPSBbb2JqZWN0Lm5hbWUsIGF0dGFja0Nvb3JkXTtcbiAgICB9XG4gIH0pO1xuICBpZiAoIWF0dGFja091dGNvbWVbMF0pIHtcbiAgICBnYW1lYm9hcmRPYmplY3QubWlzc2VzLnB1c2goYXR0YWNrQ29vcmQpO1xuICB9IGVsc2Uge1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5oaXQoYXR0YWNrT3V0Y29tZSk7XG4gICAgZ2FtZWJvYXJkT2JqZWN0LnNoaXBzLmlzU3VuayhhdHRhY2tPdXRjb21lWzBdKTtcbiAgfVxuICBjb25zb2xlLmxvZyhhdHRhY2tPdXRjb21lKTtcbiAgY29uc29sZS5sb2coc3RvcmVkR2FtZWJvYXJkcyk7XG4gIGNvbnNvbGUubG9nKGdhbWVib2FyZE9iamVjdCk7XG4gIHJldHVybiBhdHRhY2tPdXRjb21lO1xufTtcblxuLy8gcmVjZWl2ZUF0dGFjaygzMCwgYHBsYXllcmApO1xuLy8gcmVjZWl2ZUF0dGFjaygxMywgYGNvbXB1dGVyYCk7XG4vLyByZWNlaXZlQXR0YWNrKDUwLCBgcGxheWVyYCk7XG4vLyByZWNlaXZlQXR0YWNrKDI4LCBgY29tcHV0ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soMjEsIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soNDAsIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soNjAsIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soODksIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soMTIsIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soMTksIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soNzMsIGBwbGF5ZXJgKTtcblxuLy8gZnVuY3Rpb24gaXNHYW1lT3ZlcihpbmRleCkge1xuLy8gICBjb25zdCBhcnJheSA9IHN0b3JlZEdhbWVib2FyZHNbaW5kZXhdWzFdLnNoaXBzLmZsZWV0O1xuLy8gICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuLy8gICBsZXQgc2hpcHNTdW5rQ291bnRlciA9IDA7XG4vLyAgIGFycmF5LmZpbHRlcigob2JqKSA9PiB7XG4vLyAgICAgaWYgKG9iai5pc1N1bmspIHtcbi8vICAgICAgIHNoaXBzU3Vua0NvdW50ZXIgKz0gMTtcbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gICBpZiAoc2hpcHNTdW5rQ291bnRlciA9PT0gNSkge1xuLy8gICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xuLy8gICB9XG4vLyAgIGNvbnNvbGUubG9nKHNoaXBzU3Vua0NvdW50ZXIpO1xuLy8gICByZXR1cm4gaXNHYW1lT3Zlcjtcbi8vIH1cbmNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHNbMF1bMV0uaXNHYW1lT3ZlcigwKSk7XG5cbi8vIGNvbnN0IGJvYXJkID0gW1xuLy8gICBbMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV0sXG4vLyAgIFsxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOV0sXG4vLyAgIFsyMCwgMjEsIDIyLCAyMywgMjQsIDI1LCAyNiwgMjcsIDI4LCAyOV0sXG4vLyAgIFszMCwgMzEsIDMyLCAzMywgMzQsIDM1LCAzNiwgMzcsIDM4LCAzOV0sXG4vLyAgIFs0MCwgNDEsIDQyLCA0MywgNDQsIDQ1LCA0NiwgNDcsIDQ4LCA0OV0sXG4vLyAgIFs1MCwgNTEsIDUyLCA1MywgNTQsIDU1LCA1NiwgNTcsIDU4LCA1OV0sXG4vLyAgIFs2MCwgNjEsIDYyLCA2MywgNjQsIDY1LCA2NiwgNjcsIDY4LCA2OV0sXG4vLyAgIFs3MCwgNzEsIDcyLCA3MywgNzQsIDc1LCA3NiwgNzcsIDc4LCA3OV0sXG4vLyAgIFs4MCwgODEsIDgyLCA4MywgODQsIDg1LCA4NiwgODcsIDg4LCA4OV0sXG4vLyAgIFs5MCwgOTEsIDkyLCA5MywgOTQsIDk1LCA5NiwgOTcsIDk4LCA5OV0sXG4vLyBdO1xuZXhwb3J0IHsgR2FtZWJvYXJkIH07XG4iLCJjb25zdCBTaGlwcyA9ICgpID0+IHtcbiAgY29uc3QgZmxlZXQgPSBbXG4gICAgeyBuYW1lOiBgQ2FycmllcmAsIGxlbmd0aDogNSwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBCYXR0bGVzaGlwYCwgbGVuZ3RoOiA0LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYERlc3Ryb3llcmAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBTdWJtYXJpbmVgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgUGF0cm9sIEJvYXRgLCBsZW5ndGg6IDIsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gIF07XG5cbiAgY29uc3QgaGl0ID0gKGF0dGFja0RhdGEpID0+IHtcbiAgICBjb25zdCBzaGlwSGl0ID0gYXR0YWNrRGF0YVswXTtcbiAgICBjb25zdCBjb29yZE9mSGl0ID0gYXR0YWNrRGF0YVsxXTtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lKSB7XG4gICAgICAgIHNoaXAuaGl0cy5wdXNoKGNvb3JkT2ZIaXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9IChzaGlwSGl0KSA9PiB7XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSAmJiBzaGlwLmxlbmd0aCA9PT0gc2hpcC5oaXRzLmxlbmd0aCkge1xuICAgICAgICBzaGlwLmlzU3VuayA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgZmxlZXQsIGhpdCwgaXNTdW5rIH07XG59O1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHsgaGl0LCBpc1N1bmsgfTtcbmV4cG9ydCB7IFNoaXBzIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFNoaXBzIH0gZnJvbSBcIi4vc2hpcE1vZHVsZVwiO1xuaW1wb3J0IHsgR2FtZWJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbi8vIGhhcmQtY29kZWQgaW5zdGFudGlhdGlvbiBvZiBwbGF5ZXJGbGVldFxuY29uc3QgcGxheWVyRmxlZXQgPSBbXG4gIHsgbmFtZTogXCJDYXJyaWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFsxLCAyLCAzLCA0LCA1XSB9LFxuICB7IG5hbWU6IFwiQmF0dGxlc2hpcFwiLCBzaGlwUGxhY2VtZW50OiBbMTAsIDExLCAxMiwgMTNdIH0sXG4gIHsgbmFtZTogXCJEZXN0cm95ZXJcIiwgc2hpcFBsYWNlbWVudDogWzc3LCA4NywgOTddIH0sXG4gIHsgbmFtZTogXCJTdWJtYXJpbmVcIiwgc2hpcFBsYWNlbWVudDogWzQwLCA1MCwgNjBdIH0sXG4gIHsgbmFtZTogXCJQYXRyb2wgQm9hdFwiLCBzaGlwUGxhY2VtZW50OiBbNTgsIDU5XSB9LFxuXTtcbmNvbnN0IHBsYXllckJvYXJkID0gR2FtZWJvYXJkKHBsYXllckZsZWV0KTtcblxuLy8gY29uc3QgcGxheWVyU2hpcHMgPSBTaGlwcygpO1xuLy8gY29uc3QgY29tcHV0ZXJTaGlwcyA9IFNoaXBzKCk7XG5cbi8vIGNvbnNvbGUubG9nKHBsYXllclNoaXBzKTtcbi8vIHBsYXllclNoaXBzLmhpdChbYFN1Ym1hcmluZWAsIDMwXSk7XG4vLyBwbGF5ZXJTaGlwcy5pc1N1bmsoYFN1Ym1hcmluZWApO1xuLy8gY29uc29sZS5sb2cocGxheWVyU2hpcHMpO1xuLy8gcGxheWVyU2hpcHMuaGl0KFtgUGF0cm9sIEJvYXRgLCAxNV0pO1xuLy8gcGxheWVyU2hpcHMuaXNTdW5rKGBQYXRyb2wgQm9hdGApO1xuLy8gY29uc29sZS5sb2cocGxheWVyU2hpcHMpO1xuLy8gcGxheWVyU2hpcHMuaGl0KFtgUGF0cm9sIEJvYXRgLCAxNl0pO1xuLy8gcGxheWVyU2hpcHMuaXNTdW5rKGBQYXRyb2wgQm9hdGApO1xuLy8gY29uc29sZS5sb2cocGxheWVyU2hpcHMpO1xuXG5sZXQgdHVybkNvdW50ZXIgPSAxO1xuXG5jb25zdCBQbGF5ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGlzVHVybiA9ICgpID0+IHtcbiAgICBpZiAodHVybkNvdW50ZXIgJSAyICE9PSAwKSB7XG4gICAgICByZXR1cm4gYHBsYXllcmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgY29tcHV0ZXJgO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHsgaXNUdXJuIH07XG59O1xuXG5jb25zdCBwbGF5ZXIgPSBQbGF5ZXIoKTtcbmNvbnN0IGNvbXB1dGVyID0gUGxheWVyKCk7XG4vLyBwbGF5ZXIuZGF0YS5wdXNoKHBsYXllckJvYXJkKTtcbmNvbnNvbGUubG9nKHBsYXllci5pc1R1cm4oKSk7XG5jb25zb2xlLmxvZyhjb21wdXRlci5pc1R1cm4oKSk7XG5cbi8vIEJFR0lOIC0tLS0tIGdlbmVyYXRlcyByYW5kb20gbW92ZSBmb3IgY29tcHV0ZXIgLS0tLS0tLS0tLS0gLy9cbmZ1bmN0aW9uIGNyZWF0ZU5ld0NvbXB1dGVyTW92ZXMoKSB7XG4gIGNvbnN0IHZhbGlkTW92ZXMgPSBbXTtcbiAgY29uc3QgbWF4TW92ZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4TW92ZXM7IGkrKykge1xuICAgIHZhbGlkTW92ZXMucHVzaChpKTtcbiAgfVxuICAvLyBjb25zb2xlLmxvZyh2YWxpZE1vdmVzKTtcbiAgcmV0dXJuIHZhbGlkTW92ZXM7XG59XG5cbmNvbnN0IGdldFZhbGlkTW92ZXMgPSBjcmVhdGVOZXdDb21wdXRlck1vdmVzKCk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKSB7XG4gIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ2V0VmFsaWRNb3Zlcy5sZW5ndGgpO1xuICBjb25zdCByYW5kb21Nb3ZlID0gZ2V0VmFsaWRNb3Zlc1tyYW5kb21JbmRleF07XG4gIGNvbnNvbGUubG9nKHJhbmRvbUluZGV4KTtcbiAgY29uc29sZS5sb2cocmFuZG9tTW92ZSk7XG4gIGNvbnNvbGUubG9nKGdldFZhbGlkTW92ZXMpO1xuICBnZXRWYWxpZE1vdmVzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gIGNvbnNvbGUubG9nKGdldFZhbGlkTW92ZXMpO1xuICByZXR1cm4gcmFuZG9tTW92ZTtcbn1cbi8vIEVORCAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG4iXSwic291cmNlUm9vdCI6IiJ9