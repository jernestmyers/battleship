/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shipModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipModule */ "./src/shipModule.js");

// need a factory fxn to create both a user and cpu gameboard
// invoke the Ship factory function to instantiate the ship object once coordinates
// are selected for the fleet
// randomly generate CPU gameboard to instantiate its fleet and gameboard
// create a method receiveAttack that takes a coordinate and responds to a hit and to a miss
// create isGameOver method
// track hits and misses to display on gameboards

const Gameboard = (fleet, user) => {
  const createFleet = (0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.Ship)(fleet);
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


/***/ }),

/***/ "./src/shipModule.js":
/*!***************************!*\
  !*** ./src/shipModule.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ship": () => (/* binding */ Ship),
/* harmony export */   "hit": () => (/* binding */ hit),
/* harmony export */   "isSunk": () => (/* binding */ isSunk)
/* harmony export */ });
const Ship = (fleetObject) => {
  const fleet = {
    carrier: fleetObject.carrier,
    battleship: fleetObject.battleship,
    destroyer: fleetObject.destroyer,
    submarine: fleetObject.submarine,
    patrol: fleetObject.patrol,
  };
  return { fleet };
};

const hit = (attackCoord) => {
  const fleetMap = new Map(Object.entries(playerShips.fleet));
  let attackOutcome = [null, null, attackCoord];
  fleetMap.forEach((shipCoordinates, ship) => {
    if (Array.from(shipCoordinates).includes(attackCoord)) {
      attackOutcome = [ship, shipCoordinates, attackCoord];
      //   isSunk(attackOutcome);
    }
  });
  return attackOutcome;
};

const isSunk = (array) => {
  if (!array[0]) {
    return;
  } else {
    let isSunk = false;
    const fleetHitsRemaining = new Map(Object.entries(playerShips.fleet));
    const shipHitsRemaining = fleetHitsRemaining.get(array[0]);
    shipHitsRemaining.splice(shipHitsRemaining.indexOf(array[2]), 1);
    fleetHitsRemaining.delete(array[0]);
    if (!shipHitsRemaining.length) {
      isSunk = true;
    } else {
      fleetHitsRemaining.set(array[0], shipHitsRemaining);
    }
    // console.log(fleetHitsRemaining);
    // console.log(isSunk);
    return [isSunk, array[0]];
  }
};

// hard coded insantiation of a player's fleet object
const playerShips = Ship({
  carrier: [1, 2, 3, 4, 5],
  battleship: [10, 11, 12, 13],
  destroyer: [77, 87, 97],
  submarine: [40, 50, 60],
  patrol: [58, 59],
});

// module.exports = { hit, isSunk };


// const Ship = (fleetObject) => {
//   const fleet = [
//     { name: `Carrier`, length: 5, hits: [], isSunk: false },
//     { name: `Battleship`, length: 4, hits: [], isSunk: false },
//     { name: `Destroyer`, length: 3, hits: [], isSunk: false },
//     { name: `Submarine`, length: 3, hits: [], isSunk: false },
//     { name: `Patrol Boat`, length: 2, hits: [], isSunk: false },
//   ];
//   return { fleet };
// };


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



// console.log(hit(50));
// console.log(hit(66));

// console.log(isSunk([`submarine`, [40, 50, 60], 50]));
// console.log(isSunk([`submarine`, [40, 50, 60], 40]));
// console.log(isSunk([`submarine`, [40, 50, 60], 60]));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLGlEQUFJO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLFlBQVksSUFBSSxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsbUJBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSwyQkFBMkIsK0JBQStCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQSxHQUFHLDZCQUE2QjtBQUNoQyxHQUFHLGdDQUFnQztBQUNuQyxHQUFHLCtCQUErQjtBQUNsQyxHQUFHLCtCQUErQjtBQUNsQyxHQUFHLGlDQUFpQztBQUNwQzs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxxQkFBcUI7QUFDUTs7QUFFN0I7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlELFFBQVEseURBQXlEO0FBQ2pFLFFBQVEsd0RBQXdEO0FBQ2hFLFFBQVEsd0RBQXdEO0FBQ2hFLFFBQVEsMERBQTBEO0FBQ2xFO0FBQ0EsYUFBYTtBQUNiOzs7Ozs7O1VDaEVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7OztBQ04yQztBQUN0Qjs7QUFFckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNoaXAgfSBmcm9tIFwiLi9zaGlwTW9kdWxlXCI7XG4vLyBuZWVkIGEgZmFjdG9yeSBmeG4gdG8gY3JlYXRlIGJvdGggYSB1c2VyIGFuZCBjcHUgZ2FtZWJvYXJkXG4vLyBpbnZva2UgdGhlIFNoaXAgZmFjdG9yeSBmdW5jdGlvbiB0byBpbnN0YW50aWF0ZSB0aGUgc2hpcCBvYmplY3Qgb25jZSBjb29yZGluYXRlc1xuLy8gYXJlIHNlbGVjdGVkIGZvciB0aGUgZmxlZXRcbi8vIHJhbmRvbWx5IGdlbmVyYXRlIENQVSBnYW1lYm9hcmQgdG8gaW5zdGFudGlhdGUgaXRzIGZsZWV0IGFuZCBnYW1lYm9hcmRcbi8vIGNyZWF0ZSBhIG1ldGhvZCByZWNlaXZlQXR0YWNrIHRoYXQgdGFrZXMgYSBjb29yZGluYXRlIGFuZCByZXNwb25kcyB0byBhIGhpdCBhbmQgdG8gYSBtaXNzXG4vLyBjcmVhdGUgaXNHYW1lT3ZlciBtZXRob2Rcbi8vIHRyYWNrIGhpdHMgYW5kIG1pc3NlcyB0byBkaXNwbGF5IG9uIGdhbWVib2FyZHNcblxuY29uc3QgR2FtZWJvYXJkID0gKGZsZWV0LCB1c2VyKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZUZsZWV0ID0gU2hpcChmbGVldCk7XG4gIC8vIGNvbnN0IHVzZXJGbGVldCA9IFNoaXAoZmxlZXQpO1xuICAvLyAgIH07XG4gIC8vICAgY29uc29sZS5sb2codXNlcik7XG4gIHJldHVybiB7IGNyZWF0ZUZsZWV0IH07XG59O1xuXG4vLyBjb25zdCBwbGF5ZXJTaGlwcyA9IFNoaXAoe1xuLy8gICBjYXJyaWVyOiBbMSwgMiwgMywgNCwgNV0sXG4vLyAgIGJhdHRsZXNoaXA6IFsxMCwgMTEsIDEyLCAxM10sXG4vLyAgIGRlc3Ryb3llcjogWzc3LCA4NywgOTddLFxuLy8gICBzdWJtYXJpbmU6IFs0MCwgNTAsIDYwXSxcbi8vICAgcGF0cm9sOiBbNTgsIDU5XSxcbi8vIH0pO1xuXG5jb25zdCBwbGF5ZXJGbGVldCA9IHtcbiAgY2FycmllcjogWzEsIDIsIDMsIDQsIDVdLFxuICBiYXR0bGVzaGlwOiBbMTAsIDExLCAxMiwgMTNdLFxuICBkZXN0cm95ZXI6IFs3NywgODcsIDk3XSxcbiAgc3VibWFyaW5lOiBbNDAsIDUwLCA2MF0sXG4gIHBhdHJvbDogWzU4LCA1OV0sXG59O1xuXG5jb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVib2FyZChwbGF5ZXJGbGVldCwgXCJwbGF5ZXJcIik7XG4vLyBjb25zb2xlLmxvZyhwbGF5ZXJCb2FyZCk7XG5cbi8vIHJhbmRvbSBzaGlwIHBsYWNlbWVudDpcbi8vIDEgLSByYW5kb21pemUgb3JpZW50YXRpb246IDAgaXMgaG9yaXogYW5kIDEgaXMgdmVydFxuLy8gMiAtIHJhbmRvbWl6ZSBwbGFjZW1lbnQ6IGdlbmVyYXRlIHJhbmRvbSBudW1iZXIgZnJvbSAwIHRvIDk5XG4vLyAzIC0gY2hlY2sgaWYgcmFuZG9tIG51bWJlciBleGlzdHMgaW4gY29tcHV0ZXJGbGVldFxuLy8gNCAtIGRldGVybWluZSBpZiBzaGlwLmxlbmd0aCBtdXN0IGJlIGFkZGVkIG9yIHN1YnRyYWN0ZWQgYmFzZWQgb24gb3JpZW50YXRpb25cbi8vICAgICBpbiBvcmRlciB0byBmaXQgb24gdGhlIGJvYXJkXG4vLyA1IC0gY2hlY2sgaWYgYW55IG9mIHRoZSBzdWJzZXF1ZW50IGNvb3JkaW5hdGVzIGV4aXN0XG4vLyA2IC0gaWYgY29vcmRzIGV4aXN0LCBkaXNjYXJkIGFsbCBhbmQgdHJ5IGFnYWluXG4vLyA2IC0gaWYgY29vcmRzIGRvIG5vdCBleGlzdCwgc3RvcmUgY29vcmRzIGluIHRoZSBvYmplY3QgdXNlZCB0byBjcmVhdGUgdGhlIENQVSBmbGVldFxuXG5jb25zdCBib2FyZCA9IFtcbiAgWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldLFxuICBbMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICBbMjAsIDIxLCAyMiwgMjMsIDI0LCAyNSwgMjYsIDI3LCAyOCwgMjldLFxuICBbMzAsIDMxLCAzMiwgMzMsIDM0LCAzNSwgMzYsIDM3LCAzOCwgMzldLFxuICBbNDAsIDQxLCA0MiwgNDMsIDQ0LCA0NSwgNDYsIDQ3LCA0OCwgNDldLFxuICBbNTAsIDUxLCA1MiwgNTMsIDU0LCA1NSwgNTYsIDU3LCA1OCwgNTldLFxuICBbNjAsIDYxLCA2MiwgNjMsIDY0LCA2NSwgNjYsIDY3LCA2OCwgNjldLFxuICBbNzAsIDcxLCA3MiwgNzMsIDc0LCA3NSwgNzYsIDc3LCA3OCwgNzldLFxuICBbODAsIDgxLCA4MiwgODMsIDg0LCA4NSwgODYsIDg3LCA4OCwgODldLFxuICBbOTAsIDkxLCA5MiwgOTMsIDk0LCA5NSwgOTYsIDk3LCA5OCwgOTldLFxuXTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKSB7XG4gIGNvbnN0IG51bWJlck9mQ29vcmRpbmF0ZXMgPSAxMDA7XG4gIGNvbnN0IG9yaWVudGF0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gIGNvbnN0IGZpcnN0Q29vcmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1iZXJPZkNvb3JkaW5hdGVzKTtcbiAgcmV0dXJuIFtvcmllbnRhdGlvbiwgZmlyc3RDb29yZF07XG59XG5cbmZ1bmN0aW9uIG9yaWVudFNoaXAoc3RhcnRDb29yZCwgb3JpZW50YXRpb24sIG5hbWUsIGxlbmd0aCkge1xuICBsZXQgc2hpcFBsYWNlbWVudCA9IFtdO1xuICBsZXQgaG9yaXpvbnRhbExpbWl0O1xuICBpZiAoc3RhcnRDb29yZCA8IDEwKSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gOTtcbiAgfSBlbHNlIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSArKHN0YXJ0Q29vcmQudG9TdHJpbmcoKS5jaGFyQXQoMCkgKyA5KTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9yaWVudGF0aW9uKSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSAqIDEwIDwgMTAwKSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSAqIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSAqIDEwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgPD0gaG9yaXpvbnRhbExpbWl0KSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4geyBuYW1lLCBzaGlwUGxhY2VtZW50IH07XG59XG5cbmZ1bmN0aW9uIHZlcmlmeUNvb3JkcyhvYmplY3QpIHtcbiAgY29uc3Qgc2hpcFRvVmVyaWZ5ID0gb2JqZWN0LnNoaXBQbGFjZW1lbnQ7XG4gIGNvbnNvbGUubG9nKGAke29iamVjdC5uYW1lfTogJHtzaGlwVG9WZXJpZnl9YCk7XG4gIGxldCBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gIGlmICghY29tcHV0ZXJGbGVldC5sZW5ndGgpIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbiAgfSBlbHNlIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBUb1ZlcmlmeS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcHV0ZXJGbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgICAgaWYgKGlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcC5zaGlwUGxhY2VtZW50Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChzaGlwVG9WZXJpZnlbaV0gIT09IHNoaXAuc2hpcFBsYWNlbWVudFtqXSkge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xufVxuXG5mdW5jdGlvbiBwbGFjZUNvbXB1dGVyRmxlZXQoKSB7XG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuICAgIHdoaWxlICghaXNWYWxpZCkge1xuICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgY29uc3QgcmFuZG9tVmFsdWVzID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKTtcbiAgICAgIGNvbnN0IHBsYWNlbWVudCA9IG9yaWVudFNoaXAoXG4gICAgICAgIHJhbmRvbVZhbHVlc1sxXSxcbiAgICAgICAgcmFuZG9tVmFsdWVzWzBdLFxuICAgICAgICBzaGlwLm5hbWUsXG4gICAgICAgIHNoaXAubGVuZ3RoXG4gICAgICApO1xuICAgICAgY29uc3QgdmVyaWZ5ID0gdmVyaWZ5Q29vcmRzKHBsYWNlbWVudCk7XG4gICAgICBpZiAodmVyaWZ5KSB7XG4gICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICBjb21wdXRlckZsZWV0LnB1c2gocGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBjb25zb2xlLmxvZyhjb21wdXRlckZsZWV0KTtcbn1cblxuY29uc3Qgc2hpcHMgPSBbXG4gIHsgbmFtZTogYENhcnJpZXJgLCBsZW5ndGg6IDUgfSxcbiAgeyBuYW1lOiBgQmF0dGxlc2hpcGAsIGxlbmd0aDogNCB9LFxuICB7IG5hbWU6IGBEZXN0cm95ZXJgLCBsZW5ndGg6IDMgfSxcbiAgeyBuYW1lOiBgU3VibWFyaW5lYCwgbGVuZ3RoOiAzIH0sXG4gIHsgbmFtZTogYFBhdHJvbCBCb2F0YCwgbGVuZ3RoOiAyIH0sXG5dO1xuXG5jb25zdCBjb21wdXRlckZsZWV0ID0gW107XG5cbnBsYWNlQ29tcHV0ZXJGbGVldCgpO1xuIiwiY29uc3QgU2hpcCA9IChmbGVldE9iamVjdCkgPT4ge1xuICBjb25zdCBmbGVldCA9IHtcbiAgICBjYXJyaWVyOiBmbGVldE9iamVjdC5jYXJyaWVyLFxuICAgIGJhdHRsZXNoaXA6IGZsZWV0T2JqZWN0LmJhdHRsZXNoaXAsXG4gICAgZGVzdHJveWVyOiBmbGVldE9iamVjdC5kZXN0cm95ZXIsXG4gICAgc3VibWFyaW5lOiBmbGVldE9iamVjdC5zdWJtYXJpbmUsXG4gICAgcGF0cm9sOiBmbGVldE9iamVjdC5wYXRyb2wsXG4gIH07XG4gIHJldHVybiB7IGZsZWV0IH07XG59O1xuXG5jb25zdCBoaXQgPSAoYXR0YWNrQ29vcmQpID0+IHtcbiAgY29uc3QgZmxlZXRNYXAgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHBsYXllclNoaXBzLmZsZWV0KSk7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIG51bGwsIGF0dGFja0Nvb3JkXTtcbiAgZmxlZXRNYXAuZm9yRWFjaCgoc2hpcENvb3JkaW5hdGVzLCBzaGlwKSA9PiB7XG4gICAgaWYgKEFycmF5LmZyb20oc2hpcENvb3JkaW5hdGVzKS5pbmNsdWRlcyhhdHRhY2tDb29yZCkpIHtcbiAgICAgIGF0dGFja091dGNvbWUgPSBbc2hpcCwgc2hpcENvb3JkaW5hdGVzLCBhdHRhY2tDb29yZF07XG4gICAgICAvLyAgIGlzU3VuayhhdHRhY2tPdXRjb21lKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXR0YWNrT3V0Y29tZTtcbn07XG5cbmNvbnN0IGlzU3VuayA9IChhcnJheSkgPT4ge1xuICBpZiAoIWFycmF5WzBdKSB7XG4gICAgcmV0dXJuO1xuICB9IGVsc2Uge1xuICAgIGxldCBpc1N1bmsgPSBmYWxzZTtcbiAgICBjb25zdCBmbGVldEhpdHNSZW1haW5pbmcgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHBsYXllclNoaXBzLmZsZWV0KSk7XG4gICAgY29uc3Qgc2hpcEhpdHNSZW1haW5pbmcgPSBmbGVldEhpdHNSZW1haW5pbmcuZ2V0KGFycmF5WzBdKTtcbiAgICBzaGlwSGl0c1JlbWFpbmluZy5zcGxpY2Uoc2hpcEhpdHNSZW1haW5pbmcuaW5kZXhPZihhcnJheVsyXSksIDEpO1xuICAgIGZsZWV0SGl0c1JlbWFpbmluZy5kZWxldGUoYXJyYXlbMF0pO1xuICAgIGlmICghc2hpcEhpdHNSZW1haW5pbmcubGVuZ3RoKSB7XG4gICAgICBpc1N1bmsgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGVldEhpdHNSZW1haW5pbmcuc2V0KGFycmF5WzBdLCBzaGlwSGl0c1JlbWFpbmluZyk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKGZsZWV0SGl0c1JlbWFpbmluZyk7XG4gICAgLy8gY29uc29sZS5sb2coaXNTdW5rKTtcbiAgICByZXR1cm4gW2lzU3VuaywgYXJyYXlbMF1dO1xuICB9XG59O1xuXG4vLyBoYXJkIGNvZGVkIGluc2FudGlhdGlvbiBvZiBhIHBsYXllcidzIGZsZWV0IG9iamVjdFxuY29uc3QgcGxheWVyU2hpcHMgPSBTaGlwKHtcbiAgY2FycmllcjogWzEsIDIsIDMsIDQsIDVdLFxuICBiYXR0bGVzaGlwOiBbMTAsIDExLCAxMiwgMTNdLFxuICBkZXN0cm95ZXI6IFs3NywgODcsIDk3XSxcbiAgc3VibWFyaW5lOiBbNDAsIDUwLCA2MF0sXG4gIHBhdHJvbDogWzU4LCA1OV0sXG59KTtcblxuLy8gbW9kdWxlLmV4cG9ydHMgPSB7IGhpdCwgaXNTdW5rIH07XG5leHBvcnQgeyBTaGlwLCBoaXQsIGlzU3VuayB9O1xuXG4vLyBjb25zdCBTaGlwID0gKGZsZWV0T2JqZWN0KSA9PiB7XG4vLyAgIGNvbnN0IGZsZWV0ID0gW1xuLy8gICAgIHsgbmFtZTogYENhcnJpZXJgLCBsZW5ndGg6IDUsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4vLyAgICAgeyBuYW1lOiBgQmF0dGxlc2hpcGAsIGxlbmd0aDogNCwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbi8vICAgICB7IG5hbWU6IGBEZXN0cm95ZXJgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4vLyAgICAgeyBuYW1lOiBgU3VibWFyaW5lYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuLy8gICAgIHsgbmFtZTogYFBhdHJvbCBCb2F0YCwgbGVuZ3RoOiAyLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuLy8gICBdO1xuLy8gICByZXR1cm4geyBmbGVldCB9O1xuLy8gfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgaGl0LCBpc1N1bmsgfSBmcm9tIFwiLi9zaGlwTW9kdWxlXCI7XG5pbXBvcnQgXCIuL2dhbWVib2FyZFwiO1xuXG4vLyBjb25zb2xlLmxvZyhoaXQoNTApKTtcbi8vIGNvbnNvbGUubG9nKGhpdCg2NikpO1xuXG4vLyBjb25zb2xlLmxvZyhpc1N1bmsoW2BzdWJtYXJpbmVgLCBbNDAsIDUwLCA2MF0sIDUwXSkpO1xuLy8gY29uc29sZS5sb2coaXNTdW5rKFtgc3VibWFyaW5lYCwgWzQwLCA1MCwgNjBdLCA0MF0pKTtcbi8vIGNvbnNvbGUubG9nKGlzU3VuayhbYHN1Ym1hcmluZWAsIFs0MCwgNTAsIDYwXSwgNjBdKSk7XG4iXSwic291cmNlUm9vdCI6IiJ9