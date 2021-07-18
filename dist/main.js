/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameHandler.js":
/*!****************************!*\
  !*** ./src/gameHandler.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "storedGameboards": () => (/* binding */ storedGameboards),
/* harmony export */   "gameLoop": () => (/* binding */ gameLoop)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _renderGame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderGame */ "./src/renderGame.js");



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

// hard-coded instantiation of playerFleet
const playerFleet = [
  { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
  { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
  { name: "Destroyer", shipPlacement: [77, 87, 97] },
  { name: "Submarine", shipPlacement: [40, 50, 60] },
  { name: "Patrol Boat", shipPlacement: [58, 59] },
];
const playerBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard)(playerFleet);

const computerFleet = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.placeComputerFleet)();
const computerBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard)(computerFleet);

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
      const attackOutcome = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.receiveAttack)(coordOfAttack, getTurn);
      (0,_renderGame__WEBPACK_IMPORTED_MODULE_1__.renderMove)(getTurn, attackOutcome);
      console.log(getTurn);
      console.log(storedGameboards);
      if (attackOutcome[0]) {
        storedGameboards.filter((item) => {
          if (item[0] === getTurn) {
            isGameOver = item[1].isGameOver();
          }
        });
      }
      if (isGameOver) {
        (0,_renderGame__WEBPACK_IMPORTED_MODULE_1__.deregisterRemainingEventListneners)(getPlayerMovesRemaining);
        alert(`game over! ${getTurn} wins!`);
      }
    }
  }
}

// function gameLoop(playerMove) {
//   let getTurn;
//   let attackOutcome;
//   let isGameOver = false;
//   const indexToSplice = getPlayerMovesRemaining.findIndex(
//     (index) => index === playerMove
//   );
//   getPlayerMovesRemaining.splice(indexToSplice, 1);
//   console.log(getPlayerMovesRemaining);
//   getTurn = turnDriver();
//   if (getTurn === `player`) {
//     const playerAttack = playerMove;
//     attackOutcome = receiveAttack(playerAttack, getTurn);
//     renderMove(getTurn, attackOutcome);
//     console.log(`player move`);
//     console.log(storedGameboards);
//     if (attackOutcome[0]) {
//       storedGameboards.filter((item) => {
//         if (item[0] === getTurn) {
//           isGameOver = item[1].isGameOver();
//         }
//       });
//     }
//     if (isGameOver) {
//       deregisterRemainingEventListneners(getPlayerMovesRemaining);
//       alert(`game over! ${getTurn} wins!`);
//     }
//   }
//   if (!isGameOver) {
//     getTurn = turnDriver();
//     const computerAttack = generateComputerAttack();
//     attackOutcome = receiveAttack(computerAttack, getTurn);
//     renderMove(getTurn, attackOutcome);
//     console.log(`cpu move`);
//     console.log(storedGameboards);
//     if (attackOutcome[0]) {
//       storedGameboards.filter((item) => {
//         if (item[0] === getTurn) {
//           isGameOver = item[1].isGameOver();
//         }
//       });
//     }
//     if (isGameOver) {
//       deregisterRemainingEventListneners(getPlayerMovesRemaining);
//       alert(`game over! ${getTurn} wins!`);
//     }
//   }
// }




/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Gameboard": () => (/* binding */ Gameboard),
/* harmony export */   "placeComputerFleet": () => (/* binding */ placeComputerFleet),
/* harmony export */   "receiveAttack": () => (/* binding */ receiveAttack)
/* harmony export */ });
/* harmony import */ var _shipModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipModule */ "./src/shipModule.js");
/* harmony import */ var _gameHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameHandler */ "./src/gameHandler.js");
/* harmony import */ var _renderGame__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderGame */ "./src/renderGame.js");




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
    return isGameOver;
  };

  return { gameboard, misses, ships, isGameOver };
};

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
  (0,_renderGame__WEBPACK_IMPORTED_MODULE_2__.renderComputerShips)(computerFleet);
  return computerFleet;
}
// END-------- creates a randomly placed board for computer ------- //

const receiveAttack = (attackCoord, user) => {
  let index;
  let attackOutcome = [null, attackCoord];
  if (user === `player`) {
    index = 0;
  } else {
    index = 1;
  }
  const gameboardObject = _gameHandler__WEBPACK_IMPORTED_MODULE_1__.storedGameboards[index][1];
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
  return attackOutcome;
};




/***/ }),

/***/ "./src/renderGame.js":
/*!***************************!*\
  !*** ./src/renderGame.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deregisterRemainingEventListneners": () => (/* binding */ deregisterRemainingEventListneners),
/* harmony export */   "renderMove": () => (/* binding */ renderMove),
/* harmony export */   "renderComputerShips": () => (/* binding */ renderComputerShips)
/* harmony export */ });
/* harmony import */ var _gameHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameHandler */ "./src/gameHandler.js");


function renderGameboard(user) {
  let boardDiv;
  if (user === `player`) {
    boardDiv = document.querySelector(`#player-board`);
  } else {
    boardDiv = document.querySelector(`#cpu-board`);
  }
  const board = document.createElement(`div`);
  board.classList.add(`gameboard`);
  const maxSquares = 100;
  for (let i = 0; i < maxSquares; i++) {
    const square = document.createElement(`div`);
    square.textContent = i;
    square.dataset.indexNumber = i;
    if (user === `player`) {
      square.classList.add(`playerSquare`);
      square.addEventListener(`click`, playerAttack);
    } else {
      square.classList.add(`cpuSquare`);
    }
    board.appendChild(square);
  }
  boardDiv.appendChild(board);
}

const playerAttack = (e) => {
  const coordinateClicked = +e.target.dataset.indexNumber;
  (0,_gameHandler__WEBPACK_IMPORTED_MODULE_0__.gameLoop)(coordinateClicked);
  e.target.removeEventListener(`click`, playerAttack);
};

// renderGameboard(`player`);
renderGameboard(`cpu`);

function deregisterRemainingEventListneners(array) {
  const squares = document.querySelectorAll(`.playerSquare`);
  array.forEach((index) => {
    squares[index].removeEventListener(`click`, playerAttack);
  });
}

function renderMove(whoseTurn, attackArray) {
  let squares;
  const hitIndex = attackArray[1];
  if (whoseTurn === `player`) {
    squares = document.querySelectorAll(`.playerSquare`);
  } else {
    squares = document.querySelectorAll(`.cpuSquare`);
  }
  if (attackArray[0]) {
    squares[hitIndex].classList.add(`hit`);
  } else {
    squares[hitIndex].classList.add(`miss`);
  }
}

function renderComputerShips(cpuFleet) {
  const playerBoard = document.querySelector(`#player-board`);
  let imgSrc;

  cpuFleet.forEach((shipObject) => {
    const container = document.createElement(`div`);
    container.classList.add(`ships-rendered`);
    const shipImage = document.createElement(`img`);
    if (shipObject.name === `Patrol Boat`) {
      imgSrc = `./imgs/patrol.png`;
      shipImage.classList.add(`patrol`);
    } else {
      const shipName = shipObject.name.toLowerCase();
      imgSrc = `./imgs/${shipName}.png`;
      shipImage.classList.add(`${shipName}`);
    }
    shipImage.src = imgSrc;

    const sortAscending = shipObject.shipPlacement.sort((x, y) => x - y);
    const dimensionOfSquare = 35;
    let topOffset;
    let leftOffset;
    if (sortAscending[0] + 1 === sortAscending[1]) {
      // place horizontal ships
      topOffset = Math.floor(sortAscending[0] / 10) * dimensionOfSquare;
      if (sortAscending[0] < 10) {
        leftOffset = sortAscending[0] * dimensionOfSquare;
      } else {
        leftOffset = +sortAscending[0].toString().charAt(1) * dimensionOfSquare;
      }
    } else {
      // place vertical ships
      shipImage.style.transform = `rotate(-90deg)`;
      topOffset =
        Math.floor(sortAscending[0] / 10) * dimensionOfSquare +
        ((sortAscending.length - 1) / 2) * 35;
      if (sortAscending[0] < 10) {
        leftOffset =
          sortAscending[0] * dimensionOfSquare -
          ((sortAscending.length - 1) / 2) * 35;
      } else {
        leftOffset =
          +sortAscending[0].toString().charAt(1) * dimensionOfSquare -
          ((sortAscending.length - 1) / 2) * 35;
      }
    }

    shipImage.style.top = `${topOffset}px`;
    shipImage.style.left = `${leftOffset}px`;
    container.appendChild(shipImage);
    playerBoard.appendChild(container);
  });
  renderGameboard(`player`);
}




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
/* harmony import */ var _gameHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameHandler */ "./src/gameHandler.js");
/* harmony import */ var _renderGame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderGame */ "./src/renderGame.js");



function dragstart_handler(e) {
  // Add the target element's id to the data transfer object
  e.dataTransfer.setData("text/plain", e.target.src);
  console.log(e.target.src);
}

function allowDrag(e) {
  e.preventDefault();
}

function dragdrop_handler(e) {
  e.preventDefault();
  console.log(`drop here`);
  console.log(e.target.dataset.indexNumber);
  const data = e.dataTransfer.getData("text/plain", e.target.src);
  console.log(data);
}

window.addEventListener("DOMContentLoaded", () => {
  // Get the element by id
  const element = document.querySelectorAll("img");
  // Add the ondragstart event listener
  element.forEach((img) => {
    img.addEventListener("dragstart", dragstart_handler);
  });
});

const playerBoard = document.querySelector(`#player-board`);
playerBoard.addEventListener("dragover", allowDrag);
playerBoard.addEventListener("drop", dragdrop_handler);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcmVuZGVyR2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkU7QUFDRzs7QUFFOUU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHLHNEQUFzRDtBQUN6RCxHQUFHLGlEQUFpRDtBQUNwRCxHQUFHLGlEQUFpRDtBQUNwRCxHQUFHLCtDQUErQztBQUNsRDtBQUNBLG9CQUFvQixxREFBUzs7QUFFN0Isc0JBQXNCLDhEQUFrQjtBQUN4QyxzQkFBc0IscURBQVM7O0FBRS9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgeyByZW5kZXJNb3ZlLCBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuXG5jb25zdCBzdG9yZWRHYW1lYm9hcmRzID0gW107XG5cbmxldCB0dXJuQ291bnRlciA9IDE7XG5mdW5jdGlvbiB0dXJuRHJpdmVyKCkge1xuICBsZXQgd2hvc2VNb3ZlO1xuICBpZiAodHVybkNvdW50ZXIgJSAyICE9PSAwKSB7XG4gICAgd2hvc2VNb3ZlID0gYHBsYXllcmA7XG4gIH0gZWxzZSB7XG4gICAgd2hvc2VNb3ZlID0gYGNvbXB1dGVyYDtcbiAgfVxuICB0dXJuQ291bnRlciArPSAxO1xuICByZXR1cm4gd2hvc2VNb3ZlO1xufVxuXG4vLyBoYXJkLWNvZGVkIGluc3RhbnRpYXRpb24gb2YgcGxheWVyRmxlZXRcbmNvbnN0IHBsYXllckZsZWV0ID0gW1xuICB7IG5hbWU6IFwiQ2FycmllclwiLCBzaGlwUGxhY2VtZW50OiBbMSwgMiwgMywgNCwgNV0gfSxcbiAgeyBuYW1lOiBcIkJhdHRsZXNoaXBcIiwgc2hpcFBsYWNlbWVudDogWzEwLCAxMSwgMTIsIDEzXSB9LFxuICB7IG5hbWU6IFwiRGVzdHJveWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFs3NywgODcsIDk3XSB9LFxuICB7IG5hbWU6IFwiU3VibWFyaW5lXCIsIHNoaXBQbGFjZW1lbnQ6IFs0MCwgNTAsIDYwXSB9LFxuICB7IG5hbWU6IFwiUGF0cm9sIEJvYXRcIiwgc2hpcFBsYWNlbWVudDogWzU4LCA1OV0gfSxcbl07XG5jb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVib2FyZChwbGF5ZXJGbGVldCk7XG5cbmNvbnN0IGNvbXB1dGVyRmxlZXQgPSBwbGFjZUNvbXB1dGVyRmxlZXQoKTtcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lYm9hcmQoY29tcHV0ZXJGbGVldCk7XG5cbnN0b3JlZEdhbWVib2FyZHMucHVzaChbYHBsYXllcmAsIGNvbXB1dGVyQm9hcmRdKTtcbnN0b3JlZEdhbWVib2FyZHMucHVzaChbYGNvbXB1dGVyYCwgcGxheWVyQm9hcmRdKTtcbmNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuXG4vLyBCRUdJTiAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5mdW5jdGlvbiBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKSB7XG4gIGNvbnN0IHZhbGlkTW92ZXMgPSBbXTtcbiAgY29uc3QgbWF4TW92ZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4TW92ZXM7IGkrKykge1xuICAgIHZhbGlkTW92ZXMucHVzaChpKTtcbiAgfVxuICByZXR1cm4gdmFsaWRNb3Zlcztcbn1cblxuY29uc3QgZ2V0VmFsaWRNb3ZlcyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuY29uc3QgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpIHtcbiAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnZXRWYWxpZE1vdmVzLmxlbmd0aCk7XG4gIGNvbnN0IHJhbmRvbU1vdmUgPSBnZXRWYWxpZE1vdmVzW3JhbmRvbUluZGV4XTtcbiAgZ2V0VmFsaWRNb3Zlcy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICByZXR1cm4gcmFuZG9tTW92ZTtcbn1cbi8vIEVORCAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIGdhbWVMb29wKHBsYXllck1vdmUpIHtcbiAgbGV0IGdldFR1cm47XG4gIGxldCBjb29yZE9mQXR0YWNrO1xuICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICBjb25zdCBpbmRleFRvU3BsaWNlID0gZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuZmluZEluZGV4KFxuICAgIChpbmRleCkgPT4gaW5kZXggPT09IHBsYXllck1vdmVcbiAgKTtcbiAgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuc3BsaWNlKGluZGV4VG9TcGxpY2UsIDEpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGlmICghaXNHYW1lT3Zlcikge1xuICAgICAgZ2V0VHVybiA9IHR1cm5Ecml2ZXIoKTtcbiAgICAgIGlmIChnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICBjb29yZE9mQXR0YWNrID0gcGxheWVyTW92ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkT2ZBdHRhY2sgPSBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBhdHRhY2tPdXRjb21lID0gcmVjZWl2ZUF0dGFjayhjb29yZE9mQXR0YWNrLCBnZXRUdXJuKTtcbiAgICAgIHJlbmRlck1vdmUoZ2V0VHVybiwgYXR0YWNrT3V0Y29tZSk7XG4gICAgICBjb25zb2xlLmxvZyhnZXRUdXJuKTtcbiAgICAgIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0pIHtcbiAgICAgICAgc3RvcmVkR2FtZWJvYXJkcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoaXRlbVswXSA9PT0gZ2V0VHVybikge1xuICAgICAgICAgICAgaXNHYW1lT3ZlciA9IGl0ZW1bMV0uaXNHYW1lT3ZlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNHYW1lT3Zlcikge1xuICAgICAgICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGdldFBsYXllck1vdmVzUmVtYWluaW5nKTtcbiAgICAgICAgYWxlcnQoYGdhbWUgb3ZlciEgJHtnZXRUdXJufSB3aW5zIWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBmdW5jdGlvbiBnYW1lTG9vcChwbGF5ZXJNb3ZlKSB7XG4vLyAgIGxldCBnZXRUdXJuO1xuLy8gICBsZXQgYXR0YWNrT3V0Y29tZTtcbi8vICAgbGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbi8vICAgY29uc3QgaW5kZXhUb1NwbGljZSA9IGdldFBsYXllck1vdmVzUmVtYWluaW5nLmZpbmRJbmRleChcbi8vICAgICAoaW5kZXgpID0+IGluZGV4ID09PSBwbGF5ZXJNb3ZlXG4vLyAgICk7XG4vLyAgIGdldFBsYXllck1vdmVzUmVtYWluaW5nLnNwbGljZShpbmRleFRvU3BsaWNlLCAxKTtcbi8vICAgY29uc29sZS5sb2coZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcpO1xuLy8gICBnZXRUdXJuID0gdHVybkRyaXZlcigpO1xuLy8gICBpZiAoZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbi8vICAgICBjb25zdCBwbGF5ZXJBdHRhY2sgPSBwbGF5ZXJNb3ZlO1xuLy8gICAgIGF0dGFja091dGNvbWUgPSByZWNlaXZlQXR0YWNrKHBsYXllckF0dGFjaywgZ2V0VHVybik7XG4vLyAgICAgcmVuZGVyTW92ZShnZXRUdXJuLCBhdHRhY2tPdXRjb21lKTtcbi8vICAgICBjb25zb2xlLmxvZyhgcGxheWVyIG1vdmVgKTtcbi8vICAgICBjb25zb2xlLmxvZyhzdG9yZWRHYW1lYm9hcmRzKTtcbi8vICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSkge1xuLy8gICAgICAgc3RvcmVkR2FtZWJvYXJkcy5maWx0ZXIoKGl0ZW0pID0+IHtcbi8vICAgICAgICAgaWYgKGl0ZW1bMF0gPT09IGdldFR1cm4pIHtcbi8vICAgICAgICAgICBpc0dhbWVPdmVyID0gaXRlbVsxXS5pc0dhbWVPdmVyKCk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0pO1xuLy8gICAgIH1cbi8vICAgICBpZiAoaXNHYW1lT3Zlcikge1xuLy8gICAgICAgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyk7XG4vLyAgICAgICBhbGVydChgZ2FtZSBvdmVyISAke2dldFR1cm59IHdpbnMhYCk7XG4vLyAgICAgfVxuLy8gICB9XG4vLyAgIGlmICghaXNHYW1lT3Zlcikge1xuLy8gICAgIGdldFR1cm4gPSB0dXJuRHJpdmVyKCk7XG4vLyAgICAgY29uc3QgY29tcHV0ZXJBdHRhY2sgPSBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCk7XG4vLyAgICAgYXR0YWNrT3V0Y29tZSA9IHJlY2VpdmVBdHRhY2soY29tcHV0ZXJBdHRhY2ssIGdldFR1cm4pO1xuLy8gICAgIHJlbmRlck1vdmUoZ2V0VHVybiwgYXR0YWNrT3V0Y29tZSk7XG4vLyAgICAgY29uc29sZS5sb2coYGNwdSBtb3ZlYCk7XG4vLyAgICAgY29uc29sZS5sb2coc3RvcmVkR2FtZWJvYXJkcyk7XG4vLyAgICAgaWYgKGF0dGFja091dGNvbWVbMF0pIHtcbi8vICAgICAgIHN0b3JlZEdhbWVib2FyZHMuZmlsdGVyKChpdGVtKSA9PiB7XG4vLyAgICAgICAgIGlmIChpdGVtWzBdID09PSBnZXRUdXJuKSB7XG4vLyAgICAgICAgICAgaXNHYW1lT3ZlciA9IGl0ZW1bMV0uaXNHYW1lT3ZlcigpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9KTtcbi8vICAgICB9XG4vLyAgICAgaWYgKGlzR2FtZU92ZXIpIHtcbi8vICAgICAgIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMoZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcpO1xuLy8gICAgICAgYWxlcnQoYGdhbWUgb3ZlciEgJHtnZXRUdXJufSB3aW5zIWApO1xuLy8gICAgIH1cbi8vICAgfVxuLy8gfVxuXG5leHBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzLCBnYW1lTG9vcCB9O1xuIiwiaW1wb3J0IHsgU2hpcHMgfSBmcm9tIFwiLi9zaGlwTW9kdWxlXCI7XG5pbXBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHJlbmRlckNvbXB1dGVyU2hpcHMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmNvbnN0IEdhbWVib2FyZCA9IChmbGVldEFycmF5KSA9PiB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IFtcbiAgICBmbGVldEFycmF5WzBdLFxuICAgIGZsZWV0QXJyYXlbMV0sXG4gICAgZmxlZXRBcnJheVsyXSxcbiAgICBmbGVldEFycmF5WzNdLFxuICAgIGZsZWV0QXJyYXlbNF0sXG4gIF07XG4gIGNvbnN0IG1pc3NlcyA9IFtdO1xuICBjb25zdCBzaGlwcyA9IFNoaXBzKCk7XG5cbiAgY29uc3QgaXNHYW1lT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IHNoaXBzLmZsZWV0O1xuICAgIGxldCBpc0dhbWVPdmVyID0gZmFsc2U7XG4gICAgbGV0IHNoaXBzU3Vua0NvdW50ZXIgPSAwO1xuXG4gICAgYXJyYXkuZmlsdGVyKChvYmopID0+IHtcbiAgICAgIGlmIChvYmouaXNTdW5rKSB7XG4gICAgICAgIHNoaXBzU3Vua0NvdW50ZXIgKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc2hpcHNTdW5rQ291bnRlciA9PT0gNSkge1xuICAgICAgaXNHYW1lT3ZlciA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpc0dhbWVPdmVyO1xuICB9O1xuXG4gIHJldHVybiB7IGdhbWVib2FyZCwgbWlzc2VzLCBzaGlwcywgaXNHYW1lT3ZlciB9O1xufTtcblxuLy8gQkVHSU4tLS0tLS0tLSBjcmVhdGVzIGEgcmFuZG9tbHkgcGxhY2VkIGJvYXJkIGZvciBjb21wdXRlciAtLS0tLS0tIC8vXG5jb25zdCBjb21wdXRlckZsZWV0ID0gW107XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCkge1xuICBjb25zdCBudW1iZXJPZkNvb3JkaW5hdGVzID0gMTAwO1xuICBjb25zdCBvcmllbnRhdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICBjb25zdCBmaXJzdENvb3JkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtYmVyT2ZDb29yZGluYXRlcyk7XG4gIHJldHVybiBbb3JpZW50YXRpb24sIGZpcnN0Q29vcmRdO1xufVxuXG5mdW5jdGlvbiBvcmllbnRTaGlwKHN0YXJ0Q29vcmQsIG9yaWVudGF0aW9uLCBuYW1lLCBsZW5ndGgpIHtcbiAgbGV0IHNoaXBQbGFjZW1lbnQgPSBbXTtcbiAgbGV0IGhvcml6b250YWxMaW1pdDtcbiAgaWYgKHN0YXJ0Q29vcmQgPCAxMCkge1xuICAgIGhvcml6b250YWxMaW1pdCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gKyhzdGFydENvb3JkLnRvU3RyaW5nKCkuY2hhckF0KDApICsgOSk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChvcmllbnRhdGlvbikge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgKiAxMCA8IDEwMCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkgKiAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkgKiAxMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpIDw9IGhvcml6b250YWxMaW1pdCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgbmFtZSwgc2hpcFBsYWNlbWVudCB9O1xufVxuXG5mdW5jdGlvbiB2ZXJpZnlDb29yZHMob2JqZWN0KSB7XG4gIGNvbnN0IHNoaXBUb1ZlcmlmeSA9IG9iamVjdC5zaGlwUGxhY2VtZW50O1xuICBsZXQgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICBpZiAoIWNvbXB1dGVyRmxlZXQubGVuZ3RoKSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG4gIH0gZWxzZSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwVG9WZXJpZnkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXB1dGVyRmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICAgIGlmIChpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXAuc2hpcFBsYWNlbWVudC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICBpZiAoc2hpcFRvVmVyaWZ5W2ldICE9PSBzaGlwLnNoaXBQbGFjZW1lbnRbal0pIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbn1cblxuLy8gdXNlZCBmb3IgdGhlIG5hbWUgYW5kIGxlbmd0aCBwcm9wcyBpbiB0aGUgcGxhY2VDb21wdXRlckZsZWV0IGZ4blxuY29uc3Qgc2hpcENsb25lID0gU2hpcHMoKTtcblxuZnVuY3Rpb24gcGxhY2VDb21wdXRlckZsZWV0KCkge1xuICBzaGlwQ2xvbmUuZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgd2hpbGUgKCFpc1ZhbGlkKSB7XG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICBjb25zdCByYW5kb21WYWx1ZXMgPSBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpO1xuICAgICAgY29uc3QgcGxhY2VtZW50ID0gb3JpZW50U2hpcChcbiAgICAgICAgcmFuZG9tVmFsdWVzWzFdLFxuICAgICAgICByYW5kb21WYWx1ZXNbMF0sXG4gICAgICAgIHNoaXAubmFtZSxcbiAgICAgICAgc2hpcC5sZW5ndGhcbiAgICAgICk7XG4gICAgICBjb25zdCB2ZXJpZnkgPSB2ZXJpZnlDb29yZHMocGxhY2VtZW50KTtcbiAgICAgIGlmICh2ZXJpZnkpIHtcbiAgICAgICAgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIGNvbXB1dGVyRmxlZXQucHVzaChwbGFjZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJlbmRlckNvbXB1dGVyU2hpcHMoY29tcHV0ZXJGbGVldCk7XG4gIHJldHVybiBjb21wdXRlckZsZWV0O1xufVxuLy8gRU5ELS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgY29tcHV0ZXIgLS0tLS0tLSAvL1xuXG5jb25zdCByZWNlaXZlQXR0YWNrID0gKGF0dGFja0Nvb3JkLCB1c2VyKSA9PiB7XG4gIGxldCBpbmRleDtcbiAgbGV0IGF0dGFja091dGNvbWUgPSBbbnVsbCwgYXR0YWNrQ29vcmRdO1xuICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICBpbmRleCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSAxO1xuICB9XG4gIGNvbnN0IGdhbWVib2FyZE9iamVjdCA9IHN0b3JlZEdhbWVib2FyZHNbaW5kZXhdWzFdO1xuICBnYW1lYm9hcmRPYmplY3QuZ2FtZWJvYXJkLmZvckVhY2goKG9iamVjdCkgPT4ge1xuICAgIGlmIChvYmplY3Quc2hpcFBsYWNlbWVudC5pbmNsdWRlcyhhdHRhY2tDb29yZCkpIHtcbiAgICAgIGF0dGFja091dGNvbWUgPSBbb2JqZWN0Lm5hbWUsIGF0dGFja0Nvb3JkXTtcbiAgICB9XG4gIH0pO1xuICBpZiAoIWF0dGFja091dGNvbWVbMF0pIHtcbiAgICBnYW1lYm9hcmRPYmplY3QubWlzc2VzLnB1c2goYXR0YWNrQ29vcmQpO1xuICB9IGVsc2Uge1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5oaXQoYXR0YWNrT3V0Y29tZSk7XG4gICAgZ2FtZWJvYXJkT2JqZWN0LnNoaXBzLmlzU3VuayhhdHRhY2tPdXRjb21lWzBdKTtcbiAgfVxuICByZXR1cm4gYXR0YWNrT3V0Y29tZTtcbn07XG5cbmV4cG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH07XG4iLCJpbXBvcnQgeyBnYW1lTG9vcCB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5cbmZ1bmN0aW9uIHJlbmRlckdhbWVib2FyZCh1c2VyKSB7XG4gIGxldCBib2FyZERpdjtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gIH0gZWxzZSB7XG4gICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gIH1cbiAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgYm9hcmQuY2xhc3NMaXN0LmFkZChgZ2FtZWJvYXJkYCk7XG4gIGNvbnN0IG1heFNxdWFyZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4U3F1YXJlczsgaSsrKSB7XG4gICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgc3F1YXJlLnRleHRDb250ZW50ID0gaTtcbiAgICBzcXVhcmUuZGF0YXNldC5pbmRleE51bWJlciA9IGk7XG4gICAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChgcGxheWVyU3F1YXJlYCk7XG4gICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChgY3B1U3F1YXJlYCk7XG4gICAgfVxuICAgIGJvYXJkLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gIH1cbiAgYm9hcmREaXYuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG5jb25zdCBwbGF5ZXJBdHRhY2sgPSAoZSkgPT4ge1xuICBjb25zdCBjb29yZGluYXRlQ2xpY2tlZCA9ICtlLnRhcmdldC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICBnYW1lTG9vcChjb29yZGluYXRlQ2xpY2tlZCk7XG4gIGUudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbn07XG5cbi8vIHJlbmRlckdhbWVib2FyZChgcGxheWVyYCk7XG5yZW5kZXJHYW1lYm9hcmQoYGNwdWApO1xuXG5mdW5jdGlvbiBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGFycmF5KSB7XG4gIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIGFycmF5LmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgc3F1YXJlc1tpbmRleF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyTW92ZSh3aG9zZVR1cm4sIGF0dGFja0FycmF5KSB7XG4gIGxldCBzcXVhcmVzO1xuICBjb25zdCBoaXRJbmRleCA9IGF0dGFja0FycmF5WzFdO1xuICBpZiAod2hvc2VUdXJuID09PSBgcGxheWVyYCkge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbiAgfVxuICBpZiAoYXR0YWNrQXJyYXlbMF0pIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBoaXRgKTtcbiAgfSBlbHNlIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBtaXNzYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29tcHV0ZXJTaGlwcyhjcHVGbGVldCkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBjcHVGbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYHNoaXBzLXJlbmRlcmVkYCk7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgaWYgKHNoaXBPYmplY3QubmFtZSA9PT0gYFBhdHJvbCBCb2F0YCkge1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy9wYXRyb2wucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBwYXRyb2xgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwT2JqZWN0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvJHtzaGlwTmFtZX0ucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXBOYW1lfWApO1xuICAgIH1cbiAgICBzaGlwSW1hZ2Uuc3JjID0gaW1nU3JjO1xuXG4gICAgY29uc3Qgc29ydEFzY2VuZGluZyA9IHNoaXBPYmplY3Quc2hpcFBsYWNlbWVudC5zb3J0KCh4LCB5KSA9PiB4IC0geSk7XG4gICAgY29uc3QgZGltZW5zaW9uT2ZTcXVhcmUgPSAzNTtcbiAgICBsZXQgdG9wT2Zmc2V0O1xuICAgIGxldCBsZWZ0T2Zmc2V0O1xuICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdICsgMSA9PT0gc29ydEFzY2VuZGluZ1sxXSkge1xuICAgICAgLy8gcGxhY2UgaG9yaXpvbnRhbCBzaGlwc1xuICAgICAgdG9wT2Zmc2V0ID0gTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGxhY2UgdmVydGljYWwgc2hpcHNcbiAgICAgIHNoaXBJbWFnZS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKC05MGRlZylgO1xuICAgICAgdG9wT2Zmc2V0ID1cbiAgICAgICAgTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgK1xuICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBJbWFnZS5zdHlsZS50b3AgPSBgJHt0b3BPZmZzZXR9cHhgO1xuICAgIHNoaXBJbWFnZS5zdHlsZS5sZWZ0ID0gYCR7bGVmdE9mZnNldH1weGA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gICAgcGxheWVyQm9hcmQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfSk7XG4gIHJlbmRlckdhbWVib2FyZChgcGxheWVyYCk7XG59XG5cbmV4cG9ydCB7IGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMsIHJlbmRlck1vdmUsIHJlbmRlckNvbXB1dGVyU2hpcHMgfTtcbiIsImNvbnN0IFNoaXBzID0gKCkgPT4ge1xuICBjb25zdCBmbGVldCA9IFtcbiAgICB7IG5hbWU6IGBDYXJyaWVyYCwgbGVuZ3RoOiA1LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYEJhdHRsZXNoaXBgLCBsZW5ndGg6IDQsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgRGVzdHJveWVyYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFN1Ym1hcmluZWAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBQYXRyb2wgQm9hdGAsIGxlbmd0aDogMiwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgXTtcblxuICBjb25zdCBoaXQgPSAoYXR0YWNrRGF0YSkgPT4ge1xuICAgIGNvbnN0IHNoaXBIaXQgPSBhdHRhY2tEYXRhWzBdO1xuICAgIGNvbnN0IGNvb3JkT2ZIaXQgPSBhdHRhY2tEYXRhWzFdO1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUpIHtcbiAgICAgICAgc2hpcC5oaXRzLnB1c2goY29vcmRPZkhpdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKHNoaXBIaXQpID0+IHtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lICYmIHNoaXAubGVuZ3RoID09PSBzaGlwLmhpdHMubGVuZ3RoKSB7XG4gICAgICAgIHNoaXAuaXNTdW5rID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4geyBmbGVldCwgaGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCB7IFNoaXBzIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCBcIi4vcmVuZGVyR2FtZVwiO1xuXG5mdW5jdGlvbiBkcmFnc3RhcnRfaGFuZGxlcihlKSB7XG4gIC8vIEFkZCB0aGUgdGFyZ2V0IGVsZW1lbnQncyBpZCB0byB0aGUgZGF0YSB0cmFuc2ZlciBvYmplY3RcbiAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgZS50YXJnZXQuc3JjKTtcbiAgY29uc29sZS5sb2coZS50YXJnZXQuc3JjKTtcbn1cblxuZnVuY3Rpb24gYWxsb3dEcmFnKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5mdW5jdGlvbiBkcmFnZHJvcF9oYW5kbGVyKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zb2xlLmxvZyhgZHJvcCBoZXJlYCk7XG4gIGNvbnNvbGUubG9nKGUudGFyZ2V0LmRhdGFzZXQuaW5kZXhOdW1iZXIpO1xuICBjb25zdCBkYXRhID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHQvcGxhaW5cIiwgZS50YXJnZXQuc3JjKTtcbiAgY29uc29sZS5sb2coZGF0YSk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gIC8vIEdldCB0aGUgZWxlbWVudCBieSBpZFxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcbiAgLy8gQWRkIHRoZSBvbmRyYWdzdGFydCBldmVudCBsaXN0ZW5lclxuICBlbGVtZW50LmZvckVhY2goKGltZykgPT4ge1xuICAgIGltZy5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdzdGFydF9oYW5kbGVyKTtcbiAgfSk7XG59KTtcblxuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG5wbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgYWxsb3dEcmFnKTtcbnBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyYWdkcm9wX2hhbmRsZXIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==