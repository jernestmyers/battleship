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


const playerShips = (0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.Ships)();
const computerShips = (0,_shipModule__WEBPACK_IMPORTED_MODULE_0__.Ships)();

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
  return { gameboard, misses };
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
storedGameboards.push(playerBoard);

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

function placeComputerFleet() {
  computerShips.fleet.forEach((ship) => {
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
storedGameboards.push(computerBoard);
// console.log(storedGameboards);
// END-------- creates a randomly placed board for computer ------- //

const receiveAttack = (attackCoord, user) => {
  let index;
  let shipObject;
  let attackOutcome = [null, attackCoord];
  if (user === `player`) {
    shipObject = playerShips;
    index = 0;
  } else {
    shipObject = computerShips;
    index = 1;
  }
  const gameboardObject = storedGameboards[index].gameboard;
  gameboardObject.forEach((object) => {
    if (object.shipPlacement.includes(attackCoord)) {
      attackOutcome = [object.name, attackCoord];
    }
  });
  if (!attackOutcome[0]) {
    storedGameboards[index].misses.push(attackCoord);
  } else {
    shipObject.hit(attackOutcome);
    shipObject.isSunk(attackOutcome[0]);
  }
  console.log(attackOutcome);
  console.log(storedGameboards);
  console.log(playerShips);
  console.log(computerShips);
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQXFDOztBQUVyQyxvQkFBb0Isa0RBQUs7QUFDekIsc0JBQXNCLGtEQUFLOztBQUUzQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBLEdBQUcsa0RBQWtEO0FBQ3JELEdBQUcsc0RBQXNEO0FBQ3pELEdBQUcsaURBQWlEO0FBQ3BELEdBQUcsaURBQWlEO0FBQ3BELEdBQUcsK0NBQStDO0FBQ2xEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLFlBQVksSUFBSSxhQUFhO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsbUJBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSwyQkFBMkIsK0JBQStCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDckxBO0FBQ0E7QUFDQSxLQUFLLHNEQUFzRDtBQUMzRCxLQUFLLHlEQUF5RDtBQUM5RCxLQUFLLHdEQUF3RDtBQUM3RCxLQUFLLHdEQUF3RDtBQUM3RCxLQUFLLDBEQUEwRDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFVBQVU7QUFDVjs7QUFFQSxxQkFBcUI7QUFDSjs7Ozs7OztVQy9CakI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7O0FDTnFDO0FBQ2hCOztBQUVyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaGlwcyB9IGZyb20gXCIuL3NoaXBNb2R1bGVcIjtcblxuY29uc3QgcGxheWVyU2hpcHMgPSBTaGlwcygpO1xuY29uc3QgY29tcHV0ZXJTaGlwcyA9IFNoaXBzKCk7XG5cbmNvbnN0IHN0b3JlZEdhbWVib2FyZHMgPSBbXTtcblxuY29uc3QgR2FtZWJvYXJkID0gKGZsZWV0QXJyYXkpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gW1xuICAgIGZsZWV0QXJyYXlbMF0sXG4gICAgZmxlZXRBcnJheVsxXSxcbiAgICBmbGVldEFycmF5WzJdLFxuICAgIGZsZWV0QXJyYXlbM10sXG4gICAgZmxlZXRBcnJheVs0XSxcbiAgXTtcbiAgY29uc3QgbWlzc2VzID0gW107XG4gIHJldHVybiB7IGdhbWVib2FyZCwgbWlzc2VzIH07XG59O1xuXG4vLyBoYXJkLWNvZGVkIGluc3RhbnRpYXRpb24gb2YgcGxheWVyRmxlZXRcbmNvbnN0IHBsYXllckZsZWV0ID0gW1xuICB7IG5hbWU6IFwiQ2FycmllclwiLCBzaGlwUGxhY2VtZW50OiBbMSwgMiwgMywgNCwgNV0gfSxcbiAgeyBuYW1lOiBcIkJhdHRsZXNoaXBcIiwgc2hpcFBsYWNlbWVudDogWzEwLCAxMSwgMTIsIDEzXSB9LFxuICB7IG5hbWU6IFwiRGVzdHJveWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFs3NywgODcsIDk3XSB9LFxuICB7IG5hbWU6IFwiU3VibWFyaW5lXCIsIHNoaXBQbGFjZW1lbnQ6IFs0MCwgNTAsIDYwXSB9LFxuICB7IG5hbWU6IFwiUGF0cm9sIEJvYXRcIiwgc2hpcFBsYWNlbWVudDogWzU4LCA1OV0gfSxcbl07XG5cbmNvbnN0IHBsYXllckJvYXJkID0gR2FtZWJvYXJkKHBsYXllckZsZWV0KTtcbnN0b3JlZEdhbWVib2FyZHMucHVzaChwbGF5ZXJCb2FyZCk7XG5cbi8vIEJFR0lOLS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgY29tcHV0ZXIgLS0tLS0tLSAvL1xuY29uc3QgY29tcHV0ZXJGbGVldCA9IFtdO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpIHtcbiAgY29uc3QgbnVtYmVyT2ZDb29yZGluYXRlcyA9IDEwMDtcbiAgY29uc3Qgb3JpZW50YXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgY29uc3QgZmlyc3RDb29yZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bWJlck9mQ29vcmRpbmF0ZXMpO1xuICByZXR1cm4gW29yaWVudGF0aW9uLCBmaXJzdENvb3JkXTtcbn1cblxuZnVuY3Rpb24gb3JpZW50U2hpcChzdGFydENvb3JkLCBvcmllbnRhdGlvbiwgbmFtZSwgbGVuZ3RoKSB7XG4gIGxldCBzaGlwUGxhY2VtZW50ID0gW107XG4gIGxldCBob3Jpem9udGFsTGltaXQ7XG4gIGlmIChzdGFydENvb3JkIDwgMTApIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSA5O1xuICB9IGVsc2Uge1xuICAgIGhvcml6b250YWxMaW1pdCA9ICsoc3RhcnRDb29yZC50b1N0cmluZygpLmNoYXJBdCgwKSArIDkpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3JpZW50YXRpb24pIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpICogMTAgPCAxMDApIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpICogMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpICogMTApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSA8PSBob3Jpem9udGFsTGltaXQpIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7IG5hbWUsIHNoaXBQbGFjZW1lbnQgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5Q29vcmRzKG9iamVjdCkge1xuICBjb25zdCBzaGlwVG9WZXJpZnkgPSBvYmplY3Quc2hpcFBsYWNlbWVudDtcbiAgLy8gICBjb25zb2xlLmxvZyhgJHtvYmplY3QubmFtZX06ICR7c2hpcFRvVmVyaWZ5fWApO1xuICBsZXQgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICBpZiAoIWNvbXB1dGVyRmxlZXQubGVuZ3RoKSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG4gIH0gZWxzZSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwVG9WZXJpZnkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXB1dGVyRmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICAgIGlmIChpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXAuc2hpcFBsYWNlbWVudC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICBpZiAoc2hpcFRvVmVyaWZ5W2ldICE9PSBzaGlwLnNoaXBQbGFjZW1lbnRbal0pIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbn1cblxuZnVuY3Rpb24gcGxhY2VDb21wdXRlckZsZWV0KCkge1xuICBjb21wdXRlclNoaXBzLmZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuICAgIHdoaWxlICghaXNWYWxpZCkge1xuICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgY29uc3QgcmFuZG9tVmFsdWVzID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKTtcbiAgICAgIGNvbnN0IHBsYWNlbWVudCA9IG9yaWVudFNoaXAoXG4gICAgICAgIHJhbmRvbVZhbHVlc1sxXSxcbiAgICAgICAgcmFuZG9tVmFsdWVzWzBdLFxuICAgICAgICBzaGlwLm5hbWUsXG4gICAgICAgIHNoaXAubGVuZ3RoXG4gICAgICApO1xuICAgICAgY29uc3QgdmVyaWZ5ID0gdmVyaWZ5Q29vcmRzKHBsYWNlbWVudCk7XG4gICAgICBpZiAodmVyaWZ5KSB7XG4gICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICBjb21wdXRlckZsZWV0LnB1c2gocGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICAvLyAgIGNvbnNvbGUubG9nKGNvbXB1dGVyRmxlZXQpO1xufVxuXG5wbGFjZUNvbXB1dGVyRmxlZXQoKTtcblxuY29uc3QgY29tcHV0ZXJCb2FyZCA9IEdhbWVib2FyZChjb21wdXRlckZsZWV0KTtcbnN0b3JlZEdhbWVib2FyZHMucHVzaChjb21wdXRlckJvYXJkKTtcbi8vIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuLy8gRU5ELS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgY29tcHV0ZXIgLS0tLS0tLSAvL1xuXG5jb25zdCByZWNlaXZlQXR0YWNrID0gKGF0dGFja0Nvb3JkLCB1c2VyKSA9PiB7XG4gIGxldCBpbmRleDtcbiAgbGV0IHNoaXBPYmplY3Q7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIGF0dGFja0Nvb3JkXTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgc2hpcE9iamVjdCA9IHBsYXllclNoaXBzO1xuICAgIGluZGV4ID0gMDtcbiAgfSBlbHNlIHtcbiAgICBzaGlwT2JqZWN0ID0gY29tcHV0ZXJTaGlwcztcbiAgICBpbmRleCA9IDE7XG4gIH1cbiAgY29uc3QgZ2FtZWJvYXJkT2JqZWN0ID0gc3RvcmVkR2FtZWJvYXJkc1tpbmRleF0uZ2FtZWJvYXJkO1xuICBnYW1lYm9hcmRPYmplY3QuZm9yRWFjaCgob2JqZWN0KSA9PiB7XG4gICAgaWYgKG9iamVjdC5zaGlwUGxhY2VtZW50LmluY2x1ZGVzKGF0dGFja0Nvb3JkKSkge1xuICAgICAgYXR0YWNrT3V0Y29tZSA9IFtvYmplY3QubmFtZSwgYXR0YWNrQ29vcmRdO1xuICAgIH1cbiAgfSk7XG4gIGlmICghYXR0YWNrT3V0Y29tZVswXSkge1xuICAgIHN0b3JlZEdhbWVib2FyZHNbaW5kZXhdLm1pc3Nlcy5wdXNoKGF0dGFja0Nvb3JkKTtcbiAgfSBlbHNlIHtcbiAgICBzaGlwT2JqZWN0LmhpdChhdHRhY2tPdXRjb21lKTtcbiAgICBzaGlwT2JqZWN0LmlzU3VuayhhdHRhY2tPdXRjb21lWzBdKTtcbiAgfVxuICBjb25zb2xlLmxvZyhhdHRhY2tPdXRjb21lKTtcbiAgY29uc29sZS5sb2coc3RvcmVkR2FtZWJvYXJkcyk7XG4gIGNvbnNvbGUubG9nKHBsYXllclNoaXBzKTtcbiAgY29uc29sZS5sb2coY29tcHV0ZXJTaGlwcyk7XG4gIHJldHVybiBhdHRhY2tPdXRjb21lO1xufTtcblxuLy8gcmVjZWl2ZUF0dGFjaygzMCwgYHBsYXllcmApO1xuLy8gcmVjZWl2ZUF0dGFjaygxMywgYGNvbXB1dGVyYCk7XG4vLyByZWNlaXZlQXR0YWNrKDUwLCBgcGxheWVyYCk7XG4vLyByZWNlaXZlQXR0YWNrKDI4LCBgY29tcHV0ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soMjEsIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soNDAsIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soNjAsIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soODksIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soMTIsIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soMTksIGBwbGF5ZXJgKTtcbi8vIHJlY2VpdmVBdHRhY2soNzMsIGBwbGF5ZXJgKTtcblxuLy8gY29uc3QgYm9hcmQgPSBbXG4vLyAgIFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XSxcbi8vICAgWzEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbi8vICAgWzIwLCAyMSwgMjIsIDIzLCAyNCwgMjUsIDI2LCAyNywgMjgsIDI5XSxcbi8vICAgWzMwLCAzMSwgMzIsIDMzLCAzNCwgMzUsIDM2LCAzNywgMzgsIDM5XSxcbi8vICAgWzQwLCA0MSwgNDIsIDQzLCA0NCwgNDUsIDQ2LCA0NywgNDgsIDQ5XSxcbi8vICAgWzUwLCA1MSwgNTIsIDUzLCA1NCwgNTUsIDU2LCA1NywgNTgsIDU5XSxcbi8vICAgWzYwLCA2MSwgNjIsIDYzLCA2NCwgNjUsIDY2LCA2NywgNjgsIDY5XSxcbi8vICAgWzcwLCA3MSwgNzIsIDczLCA3NCwgNzUsIDc2LCA3NywgNzgsIDc5XSxcbi8vICAgWzgwLCA4MSwgODIsIDgzLCA4NCwgODUsIDg2LCA4NywgODgsIDg5XSxcbi8vICAgWzkwLCA5MSwgOTIsIDkzLCA5NCwgOTUsIDk2LCA5NywgOTgsIDk5XSxcbi8vIF07XG4iLCJjb25zdCBTaGlwcyA9ICgpID0+IHtcbiAgY29uc3QgZmxlZXQgPSBbXG4gICAgeyBuYW1lOiBgQ2FycmllcmAsIGxlbmd0aDogNSwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBCYXR0bGVzaGlwYCwgbGVuZ3RoOiA0LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYERlc3Ryb3llcmAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBTdWJtYXJpbmVgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgUGF0cm9sIEJvYXRgLCBsZW5ndGg6IDIsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gIF07XG5cbiAgY29uc3QgaGl0ID0gKGF0dGFja0RhdGEpID0+IHtcbiAgICBjb25zdCBzaGlwSGl0ID0gYXR0YWNrRGF0YVswXTtcbiAgICBjb25zdCBjb29yZE9mSGl0ID0gYXR0YWNrRGF0YVsxXTtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lKSB7XG4gICAgICAgIHNoaXAuaGl0cy5wdXNoKGNvb3JkT2ZIaXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9IChzaGlwSGl0KSA9PiB7XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSAmJiBzaGlwLmxlbmd0aCA9PT0gc2hpcC5oaXRzLmxlbmd0aCkge1xuICAgICAgICBzaGlwLmlzU3VuayA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgZmxlZXQsIGhpdCwgaXNTdW5rIH07XG59O1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHsgaGl0LCBpc1N1bmsgfTtcbmV4cG9ydCB7IFNoaXBzIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFNoaXBzIH0gZnJvbSBcIi4vc2hpcE1vZHVsZVwiO1xuaW1wb3J0IFwiLi9nYW1lYm9hcmRcIjtcblxuLy8gY29uc3QgcGxheWVyU2hpcHMgPSBTaGlwcygpO1xuLy8gY29uc3QgY29tcHV0ZXJTaGlwcyA9IFNoaXBzKCk7XG5cbi8vIGNvbnNvbGUubG9nKHBsYXllclNoaXBzKTtcbi8vIHBsYXllclNoaXBzLmhpdChbYFN1Ym1hcmluZWAsIDMwXSk7XG4vLyBwbGF5ZXJTaGlwcy5pc1N1bmsoYFN1Ym1hcmluZWApO1xuLy8gY29uc29sZS5sb2cocGxheWVyU2hpcHMpO1xuLy8gcGxheWVyU2hpcHMuaGl0KFtgUGF0cm9sIEJvYXRgLCAxNV0pO1xuLy8gcGxheWVyU2hpcHMuaXNTdW5rKGBQYXRyb2wgQm9hdGApO1xuLy8gY29uc29sZS5sb2cocGxheWVyU2hpcHMpO1xuLy8gcGxheWVyU2hpcHMuaGl0KFtgUGF0cm9sIEJvYXRgLCAxNl0pO1xuLy8gcGxheWVyU2hpcHMuaXNTdW5rKGBQYXRyb2wgQm9hdGApO1xuLy8gY29uc29sZS5sb2cocGxheWVyU2hpcHMpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==