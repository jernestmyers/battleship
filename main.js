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

// // hard-coded instantiation of playerFleet
// const playerFleet = [
//   { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
//   { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
//   { name: "Destroyer", shipPlacement: [77, 87, 97] },
//   { name: "Submarine", shipPlacement: [40, 50, 60] },
//   { name: "Patrol Boat", shipPlacement: [58, 59] },
// ];
const randomizePlayerFleetBtn = document.querySelector(
  `#randomize-player-fleet`
);
randomizePlayerFleetBtn.addEventListener(`click`, randomizePlayerFleet);

function randomizePlayerFleet() {
  if (storedGameboards[1]) {
    storedGameboards.pop();
    const cpuBoard = document.querySelector(`#cpu-board`);
    const renderedPlayerShips = document.querySelectorAll(
      `.player-ships-rendered`
    );
    for (let i = 0; i < 5; i++) {
      cpuBoard.removeChild(renderedPlayerShips[i]);
    }
    // console.log(storedGameboards);
  }
  const playerFleetArray = [];
  const playerFleet = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.placeComputerFleet)(`user`, playerFleetArray);
  const playerBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard)(playerFleet);
  storedGameboards.push([`computer`, playerBoard]);
}

const cpuFleetArray = [];
const computerFleet = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.placeComputerFleet)(`cpu`, cpuFleetArray);
const computerBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard)(computerFleet);
storedGameboards.push([`player`, computerBoard]);

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

// // BEGIN-------- creates a randomly placed board for computer ------- //
// const computerFleet = [];

// function generateRandomPlacement() {
//   const numberOfCoordinates = 100;
//   const orientation = Math.floor(Math.random() * 2);
//   const firstCoord = Math.floor(Math.random() * numberOfCoordinates);
//   return [orientation, firstCoord];
// }

// function orientShip(startCoord, orientation, name, length) {
//   let shipPlacement = [];
//   let horizontalLimit;
//   if (startCoord < 10) {
//     horizontalLimit = 9;
//   } else {
//     horizontalLimit = +(startCoord.toString().charAt(0) + 9);
//   }
//   for (let i = 0; i < length; i++) {
//     if (orientation) {
//       if (startCoord + (length - 1) * 10 < 100) {
//         shipPlacement.push(startCoord + i * 10);
//       } else {
//         shipPlacement.push(startCoord - i * 10);
//       }
//     } else {
//       if (startCoord + (length - 1) <= horizontalLimit) {
//         shipPlacement.push(startCoord + i);
//       } else {
//         shipPlacement.push(startCoord - i);
//       }
//     }
//   }
//   return { name, shipPlacement };
// }

// function verifyCoords(object) {
//   const shipToVerify = object.shipPlacement;
//   let isPlacementValid = false;
//   if (!computerFleet.length) {
//     isPlacementValid = true;
//     return isPlacementValid;
//   } else {
//     isPlacementValid = true;
//     for (let i = 0; i < shipToVerify.length; i++) {
//       if (!isPlacementValid) {
//         break;
//       } else {
//         computerFleet.forEach((ship) => {
//           if (isPlacementValid) {
//             for (let j = 0; j < ship.shipPlacement.length; j++) {
//               if (shipToVerify[i] !== ship.shipPlacement[j]) {
//                 isPlacementValid = true;
//                 continue;
//               } else {
//                 isPlacementValid = false;
//                 break;
//               }
//             }
//           }
//         });
//       }
//     }
//   }
//   return isPlacementValid;
// }

// // used for the name and length props in the placeComputerFleet fxn
// const shipClone = Ships();

// function placeComputerFleet() {
//   shipClone.fleet.forEach((ship) => {
//     let isValid = false;
//     while (!isValid) {
//       isValid = false;
//       const randomValues = generateRandomPlacement();
//       const placement = orientShip(
//         randomValues[1],
//         randomValues[0],
//         ship.name,
//         ship.length
//       );
//       const verify = verifyCoords(placement);
//       if (verify) {
//         isValid = true;
//         computerFleet.push(placement);
//       }
//     }
//   });
//   renderComputerShips(computerFleet);
//   return computerFleet;
// }
// // END-------- creates a randomly placed board for computer ------- //

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

// BEGIN-------- creates a randomly placed board for player ------- //
// const computerFleet = [];
// const playerFleet = [];

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

function verifyCoords(array, object) {
  const shipToVerify = object.shipPlacement;
  let isPlacementValid = false;
  if (!array.length) {
    isPlacementValid = true;
    return isPlacementValid;
  } else {
    isPlacementValid = true;
    for (let i = 0; i < shipToVerify.length; i++) {
      if (!isPlacementValid) {
        break;
      } else {
        array.forEach((ship) => {
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

function placeComputerFleet(user, array) {
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
      const verify = verifyCoords(array, placement);
      if (verify) {
        isValid = true;
        array.push(placement);
      }
    }
  });
  if (user === `cpu`) {
    (0,_renderGame__WEBPACK_IMPORTED_MODULE_2__.renderComputerShips)(array);
  } else {
    (0,_renderGame__WEBPACK_IMPORTED_MODULE_2__.renderPlayerShips)(array);
  }
  return array;
}
// END-------- creates a randomly placed board for player ------- //




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
/* harmony export */   "renderComputerShips": () => (/* binding */ renderComputerShips),
/* harmony export */   "renderPlayerShips": () => (/* binding */ renderPlayerShips)
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
    container.classList.add(`cpu-ships-rendered`);
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

function renderPlayerShips(fleet) {
  // console.log(!fleet[0].shipPlacement);
  // console.log(fleet[0].shipPlacement);
  // console.log(fleet[0].shipPlacement[0] === undefined);
  if (fleet[0].shipPlacement[0] === undefined) {
    return;
  }
  const cpuBoard = document.querySelector(`#cpu-board`);
  let imgSrc;

  fleet.forEach((shipObject) => {
    const container = document.createElement(`div`);
    container.classList.add(`player-ships-rendered`);
    const shipImage = document.createElement(`img`);
    if (shipObject.name === `Patrol Boat`) {
      imgSrc = `./imgs/patrol.png`;
      shipImage.classList.add(`patrol`);
    } else {
      const shipName = shipObject.name.toLowerCase();
      imgSrc = `./imgs/${shipName}.png`;
      shipImage.classList.add(`${shipName}`);
    }
    shipImage.classList.add(`invalid`);
    shipImage.src = imgSrc;

    const sortAscending = shipObject.shipPlacement.sort((x, y) => x - y);
    const dimensionOfSquare = 35;
    let topOffset;
    let leftOffset;
    if (sortAscending[0] + 1 === sortAscending[1]) {
      // place horizontal ships
      topOffset = Math.floor(sortAscending[0] / 10) * dimensionOfSquare - 350;
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
        ((sortAscending.length - 1) / 2) * 35 -
        350;
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
    cpuBoard.appendChild(container);
  });
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



// // ********* ----- HARD CODING THE CARRIER FOR NOW ******* !!!!!!!!!!!$$$$$$$$$$$$$$ --------

// const playerFleet = [];

// const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);
// const placeShipsContainer = document.querySelector(`#place-ships-container`);
// const rotateBtn = document.querySelector(`#btn-rotate-ship`);
// const shipImgs = document.querySelectorAll(`.ships-to-place`);

// // hides all but the carrier on page load
// shipImgs.forEach((ship, index) => {
//   if (index !== 0) {
//     ship.classList.add(`hide-ship`);
//   }
// });

// rotateBtn.addEventListener(`click`, rotateShip);

// function rotateShip(e) {
//   shipImgs.forEach((image) => {
//     if (!image.style.rotate) {
//       image.style.rotate = `-90deg`;
//       image.style.top = 30 + ((5 - 1) / 2) * 35 + `px`;
//     } else {
//       image.style.rotate = ``;
//       image.style.top = 30 + `px`;
//     }
//   });
// }

// const carrier = document.querySelector(`#player-carrier`);
// const carrierContainer = document.querySelector(`#carrier-container`);
// console.log(carrierContainer.getBoundingClientRect());
// console.log(carrier.getBoundingClientRect());

// carrier.onmousedown = function (event) {
//   rotateBtn.style.display = `none`;
//   // (1) prepare to move element: make absolute and on top by z-index
//   carrier.style.position = "absolute";
//   carrier.style.zIndex = 1000;

//   // move it out of any current parents directly into cpuBoard
//   carrierContainer.append(carrier);

//   // centers the cursor in the first "square" of the ship image
//   function moveAt(pageX, pageY) {
//     if (!carrier.style.rotate) {
//       carrier.style.left =
//         pageX - (carrierContainer.getBoundingClientRect().x + 17.5) + "px";
//       carrier.style.top =
//         pageY - (carrierContainer.getBoundingClientRect().y + 17.5) + "px";
//     } else {
//       carrier.style.left =
//         pageX -
//         (carrierContainer.getBoundingClientRect().x + ((5 - 1) / 2) * 35) -
//         17.5 +
//         "px";
//       carrier.style.top =
//         pageY -
//         (carrierContainer.getBoundingClientRect().y - ((5 - 1) / 2) * 35) -
//         17.5 +
//         "px";
//     }
//   }

//   // move our absolutely positioned carrier under the pointer
//   moveAt(event.pageX, event.pageY);

//   // potential droppable that we're flying over right now
//   let currentDroppable = null;

//   function onMouseMove(event) {
//     moveAt(event.pageX, event.pageY);
//     carrier.hidden = true;
//     let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
//     carrier.hidden = false;

//     // mousemove events may trigger out of the window (when the ship is dragged off-screen)
//     // if clientX/clientY are out of the window, then elementFromPoint returns null
//     if (!elemBelow) return;

//     // potential droppables are labeled with the class "droppable" (can be other logic)
//     let droppableBelow = elemBelow.closest(".cpuSquare");

//     if (currentDroppable != droppableBelow) {
//       // we're flying in or out...
//       // note: both values can be null
//       //   currentDroppable=null if we were not over a droppable before this event (e.g over an empty space)
//       //   droppableBelow=null if we're not over a droppable now, during this event

//       if (currentDroppable) {
//         // the logic to process "flying out" of the droppable (remove highlight)
//         leaveDroppableArea(currentDroppable);
//       }
//       currentDroppable = droppableBelow;
//       if (currentDroppable) {
//         // the logic to process "flying in" of the droppable
//         enterDroppableArea(currentDroppable);
//       }
//     }
//   }

//   let shipCoords;
//   function enterDroppableArea(element) {
//     shipCoords = [];
//     // if (element) {
//     const indexOfInitialDropPoint = +element.dataset.indexNumber;
//     const maxHorizontal = (Math.floor(indexOfInitialDropPoint / 10) + 1) * 10;
//     const maxVertical =
//       indexOfInitialDropPoint -
//       Math.floor(indexOfInitialDropPoint / 10) * 10 +
//       90;
//     if (!carrier.style.rotate && indexOfInitialDropPoint + 4 < maxHorizontal) {
//       for (let i = 0; i < 5; i++) {
//         if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
//           cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
//             "green";
//           shipCoords.push(indexOfInitialDropPoint + i);
//         }
//       }
//     } else if (
//       carrier.style.rotate &&
//       indexOfInitialDropPoint + 40 <= maxVertical
//     ) {
//       for (let i = 0; i < 5; i++) {
//         if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
//           cpuBoardSquares[
//             indexOfInitialDropPoint + i * 10
//           ].style.backgroundColor = "green";
//           shipCoords.push(indexOfInitialDropPoint + i * 10);
//         }
//       }
//     }
//     // }
//     console.log(shipCoords);
//   }

//   function leaveDroppableArea(element) {
//     shipCoords = [];
//     const indexOfInitialDropPoint = +element.dataset.indexNumber;
//     if (!carrier.style.rotate) {
//       for (let i = 0; i < 5; i++) {
//         if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
//           cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
//             "gray";
//         }
//       }
//     } else {
//       for (let i = 0; i < 5; i++) {
//         if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
//           cpuBoardSquares[
//             indexOfInitialDropPoint + i * 10
//           ].style.backgroundColor = "gray";
//         }
//       }
//     }
//   }

//   // (2) move the carrier on mousemove
//   document.addEventListener("mousemove", onMouseMove);

//   // (3) drop the carrier, remove unneeded handlers
//   carrier.onmouseup = function () {
//     document.removeEventListener("mousemove", onMouseMove);
//     carrier.onmouseup = null;
//     rotateBtn.style.display = ``;
//     console.log(shipCoords);
//     if (shipCoords) {
//       playerFleet.push({
//         name: `Carrier`,
//         shipPlacement: shipCoords,
//       });
//       carrierContainer.removeChild(carrier);
//       console.log(playerFleet);
//       renderPlayerShips(playerFleet);
//       cpuBoardSquares.forEach((square) => {
//         square.style.backgroundColor = `gray`;
//       });
//       console.log(shipImgs[1]);
//       shipImgs.forEach((ship, index) => {
//         console.log(index);
//         if (index === playerFleet.length) {
//           ship.classList.remove(`hide-ship`);
//         }
//       });
//     }
//   };
// };

// carrier.ondragstart = function () {
//   return false;
// };

// // // hard-coded instantiation of playerFleet
// // const playerFleet = [
// //   { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
// //   { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
// //   { name: "Destroyer", shipPlacement: [77, 87, 97] },
// //   { name: "Submarine", shipPlacement: [40, 50, 60] },
// //   { name: "Patrol Boat", shipPlacement: [58, 59] },
// // ];

// ASOFIJASOFIAJSOFIAJSOFAISJFOASIFJOASIFJAOSIFJAOSIFJASOFIJASOFAISJFOASIFJAOSFIJAOSIFJASOFIJASOFIASJFOASIJFAOSIFJAOSFIJASOiFJA

// ********* ----- HARD CODING THE CARRIER FOR NOW ******* !!!!!!!!!!!$$$$$$$$$$$$$$ --------

const playerFleet = [];

const shipNames = [
  `Carrier`,
  `Battleship`,
  `Destroyer`,
  `Submarine`,
  `Patrol Boat`,
];
const shipLengths = [5, 4, 3, 3, 2];
let shipsPlaced = 0;
let shipCoords = [];

const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);
const rotateBtn = document.querySelector(`#btn-rotate-ship`);
const placeShipsContainer = document.querySelector(`#place-ships-container`);
const playerShipContainers = document.querySelectorAll(
  `.player-ships-container`
);
const shipImgs = document.querySelectorAll(`.ships-to-place`);

// hides all but the carrier on page load
shipImgs.forEach((ship, index) => {
  if (index !== 0) {
    ship.classList.add(`hide-ship`);
  }
});

rotateBtn.addEventListener(`click`, rotateShip);

function rotateShip(e) {
  if (!shipImgs[shipsPlaced].style.rotate) {
    shipImgs[shipsPlaced].style.rotate = `-90deg`;
    shipImgs[shipsPlaced].style.top =
      81 + ((shipLengths[shipsPlaced] - 1) / 2) * 35 + `px`;
  } else {
    shipImgs[shipsPlaced].style.rotate = ``;
    shipImgs[shipsPlaced].style.top = 81 + `px`;
  }
}

shipImgs.forEach((ship) => {
  ship.addEventListener(`mousedown`, beginShipPlacement);
  ship.style.cursor = `grab`;
  ship.ondragstart = function () {
    return false;
  };
});

function beginShipPlacement(event) {
  // (1) prepare to move element: make absolute and on top by z-index
  shipImgs[shipsPlaced].style.position = "absolute";
  shipImgs[shipsPlaced].style.zIndex = 1000;

  // move it out of any current parents directly into cpuBoard
  playerShipContainers[shipsPlaced].append(shipImgs[shipsPlaced]);

  // centers the cursor in the first "square" of the ship image
  function moveAt(pageX, pageY) {
    if (!shipImgs[shipsPlaced].style.rotate) {
      shipImgs[shipsPlaced].style.left =
        pageX -
        (playerShipContainers[shipsPlaced].getBoundingClientRect().x + 17.5) +
        "px";
      shipImgs[shipsPlaced].style.top =
        pageY -
        (playerShipContainers[shipsPlaced].getBoundingClientRect().y + 17.5) +
        "px";
    } else {
      shipImgs[shipsPlaced].style.left =
        pageX -
        (playerShipContainers[shipsPlaced].getBoundingClientRect().x +
          ((shipLengths[shipsPlaced] - 1) / 2) * 35) -
        17.5 +
        "px";
      shipImgs[shipsPlaced].style.top =
        pageY -
        (playerShipContainers[shipsPlaced].getBoundingClientRect().y -
          ((shipLengths[shipsPlaced] - 1) / 2) * 35) -
        17.5 +
        "px";
    }
  }

  // move our absolutely positioned carrier under the pointer
  moveAt(event.pageX, event.pageY);

  // potential droppable that we're flying over right now
  let currentDroppable = null;
  let droppableBelow = null;

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    shipImgs[shipsPlaced].hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

    // FOIHDFOIFHSOIFHDF ----- attempting to validate drop ----- FOJDSIFHF //
    let isDropValid;
    let elemBelowArray = [];
    elemBelowArray.shift();
    for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
      let checker;
      if (shipImgs[shipsPlaced].style.rotate) {
        checker = document
          .elementFromPoint(event.clientX, event.clientY + i * 35)
          .getAttribute(`class`);
      } else {
        checker = document
          .elementFromPoint(event.clientX + i * 35, event.clientY)
          .getAttribute(`class`);
      }
      elemBelowArray.push(checker);
      if (elemBelowArray[0]) {
        let counter = 0;
        elemBelowArray.forEach((item) => {
          if ((item && item.includes(`invalid`)) || item === null) {
            counter += 1;
          }
        });
        if (counter) {
          isDropValid = false;
        } else {
          isDropValid = true;
        }
        console.log(isDropValid);
      }
    }
    console.log(elemBelowArray);
    // FOIHDFOIFHSOIFHDF ----- attempting to validate drop ----- FOJDSIFHF //

    shipImgs[shipsPlaced].hidden = false;

    // mousemove events may trigger out of the window (when the ship is dragged off-screen)
    // if clientX/clientY are out of the window, then elementFromPoint returns null
    if (!elemBelow) return;

    // potential droppables are labeled with the class "droppable" (can be other logic)
    droppableBelow = elemBelow.closest(".cpuSquare");
    // console.log(droppableBelow);

    if (!droppableBelow) {
      shipImgs[shipsPlaced].style.cursor = `no-drop`;
    } else {
      shipImgs[shipsPlaced].style.cursor = `grabbing`;
    }

    if (currentDroppable != droppableBelow) {
      // we're flying in or out...
      // note: both values can be null
      //   currentDroppable=null if we were not over a droppable before this event (e.g over an empty space)
      //   droppableBelow=null if we're not over a droppable now, during this event

      if (currentDroppable) {
        // the logic to process "flying out" of the droppable (remove highlight)
        leaveDroppableArea(currentDroppable);
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        // the logic to process "flying in" of the droppable
        enterDroppableArea(currentDroppable);
      }
    }
  }

  function enterDroppableArea(element) {
    shipCoords = [];
    // if (element) {
    const indexOfInitialDropPoint = +element.dataset.indexNumber;
    const maxHorizontal = (Math.floor(indexOfInitialDropPoint / 10) + 1) * 10;
    const maxVertical =
      indexOfInitialDropPoint -
      Math.floor(indexOfInitialDropPoint / 10) * 10 +
      90;
    if (
      !shipImgs[shipsPlaced].style.rotate &&
      indexOfInitialDropPoint + (shipLengths[shipsPlaced] - 1) < maxHorizontal
    ) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
          cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
            "green";
          shipCoords.push(indexOfInitialDropPoint + i);
        }
      }
    } else if (
      shipImgs[shipsPlaced].style.rotate &&
      indexOfInitialDropPoint + (shipLengths[shipsPlaced] - 1) * 10 <=
        maxVertical
    ) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
          cpuBoardSquares[
            indexOfInitialDropPoint + i * 10
          ].style.backgroundColor = "green";
          shipCoords.push(indexOfInitialDropPoint + i * 10);
        }
      }
    } else {
      console.log(`here`);
      droppableBelow = null;
      shipCoords = [];
    }
    // }
    console.log(shipCoords);
  }

  function leaveDroppableArea(element) {
    shipCoords = [];
    const indexOfInitialDropPoint = +element.dataset.indexNumber;
    if (!shipImgs[shipsPlaced].style.rotate) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
          cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
            "gray";
        }
      }
    } else {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
          cpuBoardSquares[
            indexOfInitialDropPoint + i * 10
          ].style.backgroundColor = "gray";
        }
      }
    }
  }

  // (2) move the ship on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // (3) drop the ship, remove unneeded handlers
  shipImgs[shipsPlaced].onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    shipImgs[shipsPlaced].onmouseup = null;
    console.log(shipCoords);
    if (shipCoords.length !== 0 && droppableBelow) {
      playerFleet.push({
        name: shipNames[shipsPlaced],
        shipPlacement: shipCoords,
      });
      playerShipContainers[shipsPlaced].removeChild(shipImgs[shipsPlaced]);
      (0,_renderGame__WEBPACK_IMPORTED_MODULE_1__.renderPlayerShips)([playerFleet[shipsPlaced]]);
      cpuBoardSquares.forEach((square) => {
        square.style.backgroundColor = `gray`;
      });
      shipImgs.forEach((ship, index) => {
        if (index === playerFleet.length) {
          ship.classList.remove(`hide-ship`);
        }
      });
      shipsPlaced += 1;
      if (shipsPlaced !== 5) {
      }
      // } else if (!droppableBelow) {
    } else {
      placeShipsContainer.insertBefore(
        shipImgs[shipsPlaced],
        shipImgs[shipsPlaced + 1]
      );
      if (shipImgs[shipsPlaced].style.rotate) {
        shipImgs[shipsPlaced].style.rotate = ``;
      }
      shipImgs[shipsPlaced].style.position = "absolute";
      shipImgs[shipsPlaced].style.top = "81px";
      shipImgs[shipsPlaced].style.left = "0px";
      shipImgs[shipsPlaced].style.zIndex = 0;
      shipImgs[shipsPlaced].style.cursor = `grab`;
    }
    rotateBtn.style.display = ``;
  };
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcmVuZGVyR2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkU7QUFLckQ7O0FBRXRCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSxrREFBa0Q7QUFDeEQsTUFBTSxzREFBc0Q7QUFDNUQsTUFBTSxpREFBaUQ7QUFDdkQsTUFBTSxpREFBaUQ7QUFDdkQsTUFBTSwrQ0FBK0M7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsOERBQWtCO0FBQ3hDLHNCQUFzQixxREFBUztBQUMvQjtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLDhEQUFrQjtBQUN4QyxzQkFBc0IscURBQVM7QUFDL0I7O0FBRUE7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiw4QkFBOEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDhCQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsOEJBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDhCQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHFCQUFxQiw4QkFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE1BQU0sOERBQWlCO0FBQ3ZCO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR2FtZWJvYXJkLCBwbGFjZUNvbXB1dGVyRmxlZXQsIHJlY2VpdmVBdHRhY2sgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCB7XG4gIHJlbmRlck1vdmUsXG4gIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMsXG4gIHJlbmRlclBsYXllclNoaXBzLFxufSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmNvbnN0IHN0b3JlZEdhbWVib2FyZHMgPSBbXTtcblxubGV0IHR1cm5Db3VudGVyID0gMTtcbmZ1bmN0aW9uIHR1cm5Ecml2ZXIoKSB7XG4gIGxldCB3aG9zZU1vdmU7XG4gIGlmICh0dXJuQ291bnRlciAlIDIgIT09IDApIHtcbiAgICB3aG9zZU1vdmUgPSBgcGxheWVyYDtcbiAgfSBlbHNlIHtcbiAgICB3aG9zZU1vdmUgPSBgY29tcHV0ZXJgO1xuICB9XG4gIHR1cm5Db3VudGVyICs9IDE7XG4gIHJldHVybiB3aG9zZU1vdmU7XG59XG5cbi8vIC8vIGhhcmQtY29kZWQgaW5zdGFudGlhdGlvbiBvZiBwbGF5ZXJGbGVldFxuLy8gY29uc3QgcGxheWVyRmxlZXQgPSBbXG4vLyAgIHsgbmFtZTogXCJDYXJyaWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFsxLCAyLCAzLCA0LCA1XSB9LFxuLy8gICB7IG5hbWU6IFwiQmF0dGxlc2hpcFwiLCBzaGlwUGxhY2VtZW50OiBbMTAsIDExLCAxMiwgMTNdIH0sXG4vLyAgIHsgbmFtZTogXCJEZXN0cm95ZXJcIiwgc2hpcFBsYWNlbWVudDogWzc3LCA4NywgOTddIH0sXG4vLyAgIHsgbmFtZTogXCJTdWJtYXJpbmVcIiwgc2hpcFBsYWNlbWVudDogWzQwLCA1MCwgNjBdIH0sXG4vLyAgIHsgbmFtZTogXCJQYXRyb2wgQm9hdFwiLCBzaGlwUGxhY2VtZW50OiBbNTgsIDU5XSB9LFxuLy8gXTtcbmNvbnN0IHJhbmRvbWl6ZVBsYXllckZsZWV0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgYCNyYW5kb21pemUtcGxheWVyLWZsZWV0YFxuKTtcbnJhbmRvbWl6ZVBsYXllckZsZWV0QnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcmFuZG9taXplUGxheWVyRmxlZXQpO1xuXG5mdW5jdGlvbiByYW5kb21pemVQbGF5ZXJGbGVldCgpIHtcbiAgaWYgKHN0b3JlZEdhbWVib2FyZHNbMV0pIHtcbiAgICBzdG9yZWRHYW1lYm9hcmRzLnBvcCgpO1xuICAgIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICAgIGNvbnN0IHJlbmRlcmVkUGxheWVyU2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5wbGF5ZXItc2hpcHMtcmVuZGVyZWRgXG4gICAgKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgY3B1Qm9hcmQucmVtb3ZlQ2hpbGQocmVuZGVyZWRQbGF5ZXJTaGlwc1tpXSk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuICB9XG4gIGNvbnN0IHBsYXllckZsZWV0QXJyYXkgPSBbXTtcbiAgY29uc3QgcGxheWVyRmxlZXQgPSBwbGFjZUNvbXB1dGVyRmxlZXQoYHVzZXJgLCBwbGF5ZXJGbGVldEFycmF5KTtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lYm9hcmQocGxheWVyRmxlZXQpO1xuICBzdG9yZWRHYW1lYm9hcmRzLnB1c2goW2Bjb21wdXRlcmAsIHBsYXllckJvYXJkXSk7XG59XG5cbmNvbnN0IGNwdUZsZWV0QXJyYXkgPSBbXTtcbmNvbnN0IGNvbXB1dGVyRmxlZXQgPSBwbGFjZUNvbXB1dGVyRmxlZXQoYGNwdWAsIGNwdUZsZWV0QXJyYXkpO1xuY29uc3QgY29tcHV0ZXJCb2FyZCA9IEdhbWVib2FyZChjb21wdXRlckZsZWV0KTtcbnN0b3JlZEdhbWVib2FyZHMucHVzaChbYHBsYXllcmAsIGNvbXB1dGVyQm9hcmRdKTtcblxuLy8gQkVHSU4gLS0tLS0gZ2VuZXJhdGVzIHJhbmRvbSBtb3ZlIGZvciBjb21wdXRlciAtLS0tLS0tLS0tLSAvL1xuZnVuY3Rpb24gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCkge1xuICBjb25zdCB2YWxpZE1vdmVzID0gW107XG4gIGNvbnN0IG1heE1vdmVzID0gMTAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1heE1vdmVzOyBpKyspIHtcbiAgICB2YWxpZE1vdmVzLnB1c2goaSk7XG4gIH1cbiAgcmV0dXJuIHZhbGlkTW92ZXM7XG59XG5cbmNvbnN0IGdldFZhbGlkTW92ZXMgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcbmNvbnN0IGdldFBsYXllck1vdmVzUmVtYWluaW5nID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKSB7XG4gIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ2V0VmFsaWRNb3Zlcy5sZW5ndGgpO1xuICBjb25zdCByYW5kb21Nb3ZlID0gZ2V0VmFsaWRNb3Zlc1tyYW5kb21JbmRleF07XG4gIGdldFZhbGlkTW92ZXMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgcmV0dXJuIHJhbmRvbU1vdmU7XG59XG4vLyBFTkQgLS0tLS0gZ2VuZXJhdGVzIHJhbmRvbSBtb3ZlIGZvciBjb21wdXRlciAtLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBnYW1lTG9vcChwbGF5ZXJNb3ZlKSB7XG4gIGxldCBnZXRUdXJuO1xuICBsZXQgY29vcmRPZkF0dGFjaztcbiAgbGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgY29uc3QgaW5kZXhUb1NwbGljZSA9IGdldFBsYXllck1vdmVzUmVtYWluaW5nLmZpbmRJbmRleChcbiAgICAoaW5kZXgpID0+IGluZGV4ID09PSBwbGF5ZXJNb3ZlXG4gICk7XG4gIGdldFBsYXllck1vdmVzUmVtYWluaW5nLnNwbGljZShpbmRleFRvU3BsaWNlLCAxKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcbiAgICAgIGdldFR1cm4gPSB0dXJuRHJpdmVyKCk7XG4gICAgICBpZiAoZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbiAgICAgICAgY29vcmRPZkF0dGFjayA9IHBsYXllck1vdmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZE9mQXR0YWNrID0gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpO1xuICAgICAgfVxuICAgICAgY29uc3QgYXR0YWNrT3V0Y29tZSA9IHJlY2VpdmVBdHRhY2soY29vcmRPZkF0dGFjaywgZ2V0VHVybik7XG4gICAgICByZW5kZXJNb3ZlKGdldFR1cm4sIGF0dGFja091dGNvbWUpO1xuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0pIHtcbiAgICAgICAgc3RvcmVkR2FtZWJvYXJkcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoaXRlbVswXSA9PT0gZ2V0VHVybikge1xuICAgICAgICAgICAgaXNHYW1lT3ZlciA9IGl0ZW1bMV0uaXNHYW1lT3ZlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNHYW1lT3Zlcikge1xuICAgICAgICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGdldFBsYXllck1vdmVzUmVtYWluaW5nKTtcbiAgICAgICAgYWxlcnQoYGdhbWUgb3ZlciEgJHtnZXRUdXJufSB3aW5zIWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzLCBnYW1lTG9vcCB9O1xuIiwiaW1wb3J0IHsgU2hpcHMgfSBmcm9tIFwiLi9zaGlwTW9kdWxlXCI7XG5pbXBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHJlbmRlckNvbXB1dGVyU2hpcHMsIHJlbmRlclBsYXllclNoaXBzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuXG5jb25zdCBHYW1lYm9hcmQgPSAoZmxlZXRBcnJheSkgPT4ge1xuICBjb25zdCBnYW1lYm9hcmQgPSBbXG4gICAgZmxlZXRBcnJheVswXSxcbiAgICBmbGVldEFycmF5WzFdLFxuICAgIGZsZWV0QXJyYXlbMl0sXG4gICAgZmxlZXRBcnJheVszXSxcbiAgICBmbGVldEFycmF5WzRdLFxuICBdO1xuICBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBTaGlwcygpO1xuXG4gIGNvbnN0IGlzR2FtZU92ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBzaGlwcy5mbGVldDtcbiAgICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgIGxldCBzaGlwc1N1bmtDb3VudGVyID0gMDtcblxuICAgIGFycmF5LmZpbHRlcigob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLmlzU3Vuaykge1xuICAgICAgICBzaGlwc1N1bmtDb3VudGVyICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHNoaXBzU3Vua0NvdW50ZXIgPT09IDUpIHtcbiAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNHYW1lT3ZlcjtcbiAgfTtcblxuICByZXR1cm4geyBnYW1lYm9hcmQsIG1pc3Nlcywgc2hpcHMsIGlzR2FtZU92ZXIgfTtcbn07XG5cbi8vIC8vIEJFR0lOLS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgY29tcHV0ZXIgLS0tLS0tLSAvL1xuLy8gY29uc3QgY29tcHV0ZXJGbGVldCA9IFtdO1xuXG4vLyBmdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpIHtcbi8vICAgY29uc3QgbnVtYmVyT2ZDb29yZGluYXRlcyA9IDEwMDtcbi8vICAgY29uc3Qgb3JpZW50YXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbi8vICAgY29uc3QgZmlyc3RDb29yZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bWJlck9mQ29vcmRpbmF0ZXMpO1xuLy8gICByZXR1cm4gW29yaWVudGF0aW9uLCBmaXJzdENvb3JkXTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gb3JpZW50U2hpcChzdGFydENvb3JkLCBvcmllbnRhdGlvbiwgbmFtZSwgbGVuZ3RoKSB7XG4vLyAgIGxldCBzaGlwUGxhY2VtZW50ID0gW107XG4vLyAgIGxldCBob3Jpem9udGFsTGltaXQ7XG4vLyAgIGlmIChzdGFydENvb3JkIDwgMTApIHtcbi8vICAgICBob3Jpem9udGFsTGltaXQgPSA5O1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIGhvcml6b250YWxMaW1pdCA9ICsoc3RhcnRDb29yZC50b1N0cmluZygpLmNoYXJBdCgwKSArIDkpO1xuLy8gICB9XG4vLyAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbi8vICAgICBpZiAob3JpZW50YXRpb24pIHtcbi8vICAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpICogMTAgPCAxMDApIHtcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpICogMTApO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpICogMTApO1xuLy8gICAgICAgfVxuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSA8PSBob3Jpem9udGFsTGltaXQpIHtcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSk7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG4vLyAgIHJldHVybiB7IG5hbWUsIHNoaXBQbGFjZW1lbnQgfTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gdmVyaWZ5Q29vcmRzKG9iamVjdCkge1xuLy8gICBjb25zdCBzaGlwVG9WZXJpZnkgPSBvYmplY3Quc2hpcFBsYWNlbWVudDtcbi8vICAgbGV0IGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbi8vICAgaWYgKCFjb21wdXRlckZsZWV0Lmxlbmd0aCkge1xuLy8gICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuLy8gICAgIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFRvVmVyaWZ5Lmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICBpZiAoIWlzUGxhY2VtZW50VmFsaWQpIHtcbi8vICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBjb21wdXRlckZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbi8vICAgICAgICAgICBpZiAoaXNQbGFjZW1lbnRWYWxpZCkge1xuLy8gICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLnNoaXBQbGFjZW1lbnQubGVuZ3RoOyBqKyspIHtcbi8vICAgICAgICAgICAgICAgaWYgKHNoaXBUb1ZlcmlmeVtpXSAhPT0gc2hpcC5zaGlwUGxhY2VtZW50W2pdKSB7XG4vLyAgICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4vLyAgICAgICAgICAgICAgICAgY29udGludWU7XG4vLyAgICAgICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuLy8gICAgICAgICAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9KTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH1cbi8vICAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG4vLyB9XG5cbi8vIC8vIHVzZWQgZm9yIHRoZSBuYW1lIGFuZCBsZW5ndGggcHJvcHMgaW4gdGhlIHBsYWNlQ29tcHV0ZXJGbGVldCBmeG5cbi8vIGNvbnN0IHNoaXBDbG9uZSA9IFNoaXBzKCk7XG5cbi8vIGZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJGbGVldCgpIHtcbi8vICAgc2hpcENsb25lLmZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbi8vICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuLy8gICAgIHdoaWxlICghaXNWYWxpZCkge1xuLy8gICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuLy8gICAgICAgY29uc3QgcmFuZG9tVmFsdWVzID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKTtcbi8vICAgICAgIGNvbnN0IHBsYWNlbWVudCA9IG9yaWVudFNoaXAoXG4vLyAgICAgICAgIHJhbmRvbVZhbHVlc1sxXSxcbi8vICAgICAgICAgcmFuZG9tVmFsdWVzWzBdLFxuLy8gICAgICAgICBzaGlwLm5hbWUsXG4vLyAgICAgICAgIHNoaXAubGVuZ3RoXG4vLyAgICAgICApO1xuLy8gICAgICAgY29uc3QgdmVyaWZ5ID0gdmVyaWZ5Q29vcmRzKHBsYWNlbWVudCk7XG4vLyAgICAgICBpZiAodmVyaWZ5KSB7XG4vLyAgICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuLy8gICAgICAgICBjb21wdXRlckZsZWV0LnB1c2gocGxhY2VtZW50KTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gICByZW5kZXJDb21wdXRlclNoaXBzKGNvbXB1dGVyRmxlZXQpO1xuLy8gICByZXR1cm4gY29tcHV0ZXJGbGVldDtcbi8vIH1cbi8vIC8vIEVORC0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIGNvbXB1dGVyIC0tLS0tLS0gLy9cblxuY29uc3QgcmVjZWl2ZUF0dGFjayA9IChhdHRhY2tDb29yZCwgdXNlcikgPT4ge1xuICBsZXQgaW5kZXg7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIGF0dGFja0Nvb3JkXTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgaW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gMTtcbiAgfVxuICBjb25zdCBnYW1lYm9hcmRPYmplY3QgPSBzdG9yZWRHYW1lYm9hcmRzW2luZGV4XVsxXTtcbiAgZ2FtZWJvYXJkT2JqZWN0LmdhbWVib2FyZC5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICBpZiAob2JqZWN0LnNoaXBQbGFjZW1lbnQuaW5jbHVkZXMoYXR0YWNrQ29vcmQpKSB7XG4gICAgICBhdHRhY2tPdXRjb21lID0gW29iamVjdC5uYW1lLCBhdHRhY2tDb29yZF07XG4gICAgfVxuICB9KTtcbiAgaWYgKCFhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgZ2FtZWJvYXJkT2JqZWN0Lm1pc3Nlcy5wdXNoKGF0dGFja0Nvb3JkKTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lYm9hcmRPYmplY3Quc2hpcHMuaGl0KGF0dGFja091dGNvbWUpO1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5pc1N1bmsoYXR0YWNrT3V0Y29tZVswXSk7XG4gIH1cbiAgcmV0dXJuIGF0dGFja091dGNvbWU7XG59O1xuXG4vLyBCRUdJTi0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIHBsYXllciAtLS0tLS0tIC8vXG4vLyBjb25zdCBjb21wdXRlckZsZWV0ID0gW107XG4vLyBjb25zdCBwbGF5ZXJGbGVldCA9IFtdO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpIHtcbiAgY29uc3QgbnVtYmVyT2ZDb29yZGluYXRlcyA9IDEwMDtcbiAgY29uc3Qgb3JpZW50YXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgY29uc3QgZmlyc3RDb29yZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bWJlck9mQ29vcmRpbmF0ZXMpO1xuICByZXR1cm4gW29yaWVudGF0aW9uLCBmaXJzdENvb3JkXTtcbn1cblxuZnVuY3Rpb24gb3JpZW50U2hpcChzdGFydENvb3JkLCBvcmllbnRhdGlvbiwgbmFtZSwgbGVuZ3RoKSB7XG4gIGxldCBzaGlwUGxhY2VtZW50ID0gW107XG4gIGxldCBob3Jpem9udGFsTGltaXQ7XG4gIGlmIChzdGFydENvb3JkIDwgMTApIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSA5O1xuICB9IGVsc2Uge1xuICAgIGhvcml6b250YWxMaW1pdCA9ICsoc3RhcnRDb29yZC50b1N0cmluZygpLmNoYXJBdCgwKSArIDkpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3JpZW50YXRpb24pIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpICogMTAgPCAxMDApIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpICogMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpICogMTApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSA8PSBob3Jpem9udGFsTGltaXQpIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7IG5hbWUsIHNoaXBQbGFjZW1lbnQgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5Q29vcmRzKGFycmF5LCBvYmplY3QpIHtcbiAgY29uc3Qgc2hpcFRvVmVyaWZ5ID0gb2JqZWN0LnNoaXBQbGFjZW1lbnQ7XG4gIGxldCBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gIGlmICghYXJyYXkubGVuZ3RoKSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG4gIH0gZWxzZSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwVG9WZXJpZnkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgICBpZiAoaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLnNoaXBQbGFjZW1lbnQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNoaXBUb1ZlcmlmeVtpXSAhPT0gc2hpcC5zaGlwUGxhY2VtZW50W2pdKSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG59XG5cbi8vIHVzZWQgZm9yIHRoZSBuYW1lIGFuZCBsZW5ndGggcHJvcHMgaW4gdGhlIHBsYWNlQ29tcHV0ZXJGbGVldCBmeG5cbmNvbnN0IHNoaXBDbG9uZSA9IFNoaXBzKCk7XG5cbmZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJGbGVldCh1c2VyLCBhcnJheSkge1xuICBzaGlwQ2xvbmUuZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgd2hpbGUgKCFpc1ZhbGlkKSB7XG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICBjb25zdCByYW5kb21WYWx1ZXMgPSBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpO1xuICAgICAgY29uc3QgcGxhY2VtZW50ID0gb3JpZW50U2hpcChcbiAgICAgICAgcmFuZG9tVmFsdWVzWzFdLFxuICAgICAgICByYW5kb21WYWx1ZXNbMF0sXG4gICAgICAgIHNoaXAubmFtZSxcbiAgICAgICAgc2hpcC5sZW5ndGhcbiAgICAgICk7XG4gICAgICBjb25zdCB2ZXJpZnkgPSB2ZXJpZnlDb29yZHMoYXJyYXksIHBsYWNlbWVudCk7XG4gICAgICBpZiAodmVyaWZ5KSB7XG4gICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICBhcnJheS5wdXNoKHBsYWNlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKHVzZXIgPT09IGBjcHVgKSB7XG4gICAgcmVuZGVyQ29tcHV0ZXJTaGlwcyhhcnJheSk7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyUGxheWVyU2hpcHMoYXJyYXkpO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cbi8vIEVORC0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIHBsYXllciAtLS0tLS0tIC8vXG5cbmV4cG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH07XG4iLCJpbXBvcnQgeyBnYW1lTG9vcCB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5cbmZ1bmN0aW9uIHJlbmRlckdhbWVib2FyZCh1c2VyKSB7XG4gIGxldCBib2FyZERpdjtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gIH0gZWxzZSB7XG4gICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gIH1cbiAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgYm9hcmQuY2xhc3NMaXN0LmFkZChgZ2FtZWJvYXJkYCk7XG4gIGNvbnN0IG1heFNxdWFyZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4U3F1YXJlczsgaSsrKSB7XG4gICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgc3F1YXJlLnRleHRDb250ZW50ID0gaTtcbiAgICBzcXVhcmUuZGF0YXNldC5pbmRleE51bWJlciA9IGk7XG4gICAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChgcGxheWVyU3F1YXJlYCk7XG4gICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChgY3B1U3F1YXJlYCk7XG4gICAgfVxuICAgIGJvYXJkLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gIH1cbiAgYm9hcmREaXYuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG5jb25zdCBwbGF5ZXJBdHRhY2sgPSAoZSkgPT4ge1xuICBjb25zdCBjb29yZGluYXRlQ2xpY2tlZCA9ICtlLnRhcmdldC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICBnYW1lTG9vcChjb29yZGluYXRlQ2xpY2tlZCk7XG4gIGUudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbn07XG5cbi8vIHJlbmRlckdhbWVib2FyZChgcGxheWVyYCk7XG5yZW5kZXJHYW1lYm9hcmQoYGNwdWApO1xuXG5mdW5jdGlvbiBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGFycmF5KSB7XG4gIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIGFycmF5LmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgc3F1YXJlc1tpbmRleF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyTW92ZSh3aG9zZVR1cm4sIGF0dGFja0FycmF5KSB7XG4gIGxldCBzcXVhcmVzO1xuICBjb25zdCBoaXRJbmRleCA9IGF0dGFja0FycmF5WzFdO1xuICBpZiAod2hvc2VUdXJuID09PSBgcGxheWVyYCkge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbiAgfVxuICBpZiAoYXR0YWNrQXJyYXlbMF0pIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBoaXRgKTtcbiAgfSBlbHNlIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBtaXNzYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29tcHV0ZXJTaGlwcyhjcHVGbGVldCkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBjcHVGbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYGNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLnNyYyA9IGltZ1NyYztcblxuICAgIGNvbnN0IHNvcnRBc2NlbmRpbmcgPSBzaGlwT2JqZWN0LnNoaXBQbGFjZW1lbnQuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuICAgIGNvbnN0IGRpbWVuc2lvbk9mU3F1YXJlID0gMzU7XG4gICAgbGV0IHRvcE9mZnNldDtcbiAgICBsZXQgbGVmdE9mZnNldDtcbiAgICBpZiAoc29ydEFzY2VuZGluZ1swXSArIDEgPT09IHNvcnRBc2NlbmRpbmdbMV0pIHtcbiAgICAgIC8vIHBsYWNlIGhvcml6b250YWwgc2hpcHNcbiAgICAgIHRvcE9mZnNldCA9IE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9ICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBsYWNlIHZlcnRpY2FsIHNoaXBzXG4gICAgICBzaGlwSW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgtOTBkZWcpYDtcbiAgICAgIHRvcE9mZnNldCA9XG4gICAgICAgIE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlICtcbiAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwSW1hZ2Uuc3R5bGUudG9wID0gYCR7dG9wT2Zmc2V0fXB4YDtcbiAgICBzaGlwSW1hZ2Uuc3R5bGUubGVmdCA9IGAke2xlZnRPZmZzZXR9cHhgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH0pO1xuICByZW5kZXJHYW1lYm9hcmQoYHBsYXllcmApO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQbGF5ZXJTaGlwcyhmbGVldCkge1xuICAvLyBjb25zb2xlLmxvZyghZmxlZXRbMF0uc2hpcFBsYWNlbWVudCk7XG4gIC8vIGNvbnNvbGUubG9nKGZsZWV0WzBdLnNoaXBQbGFjZW1lbnQpO1xuICAvLyBjb25zb2xlLmxvZyhmbGVldFswXS5zaGlwUGxhY2VtZW50WzBdID09PSB1bmRlZmluZWQpO1xuICBpZiAoZmxlZXRbMF0uc2hpcFBsYWNlbWVudFswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICBsZXQgaW1nU3JjO1xuXG4gIGZsZWV0LmZvckVhY2goKHNoaXBPYmplY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChgcGxheWVyLXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgaWYgKHNoaXBPYmplY3QubmFtZSA9PT0gYFBhdHJvbCBCb2F0YCkge1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy9wYXRyb2wucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBwYXRyb2xgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwT2JqZWN0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvJHtzaGlwTmFtZX0ucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXBOYW1lfWApO1xuICAgIH1cbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgaW52YWxpZGApO1xuICAgIHNoaXBJbWFnZS5zcmMgPSBpbWdTcmM7XG5cbiAgICBjb25zdCBzb3J0QXNjZW5kaW5nID0gc2hpcE9iamVjdC5zaGlwUGxhY2VtZW50LnNvcnQoKHgsIHkpID0+IHggLSB5KTtcbiAgICBjb25zdCBkaW1lbnNpb25PZlNxdWFyZSA9IDM1O1xuICAgIGxldCB0b3BPZmZzZXQ7XG4gICAgbGV0IGxlZnRPZmZzZXQ7XG4gICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gKyAxID09PSBzb3J0QXNjZW5kaW5nWzFdKSB7XG4gICAgICAvLyBwbGFjZSBob3Jpem9udGFsIHNoaXBzXG4gICAgICB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSAtIDM1MDtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9IHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwbGFjZSB2ZXJ0aWNhbCBzaGlwc1xuICAgICAgc2hpcEltYWdlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoLTkwZGVnKWA7XG4gICAgICB0b3BPZmZzZXQgPVxuICAgICAgICBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSArXG4gICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzUgLVxuICAgICAgICAzNTA7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgIHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcEltYWdlLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGA7XG4gICAgc2hpcEltYWdlLnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgICBjcHVCb2FyZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9KTtcbn1cblxuZXhwb3J0IHtcbiAgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyxcbiAgcmVuZGVyTW92ZSxcbiAgcmVuZGVyQ29tcHV0ZXJTaGlwcyxcbiAgcmVuZGVyUGxheWVyU2hpcHMsXG59O1xuIiwiY29uc3QgU2hpcHMgPSAoKSA9PiB7XG4gIGNvbnN0IGZsZWV0ID0gW1xuICAgIHsgbmFtZTogYENhcnJpZXJgLCBsZW5ndGg6IDUsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgQmF0dGxlc2hpcGAsIGxlbmd0aDogNCwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBEZXN0cm95ZXJgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgU3VibWFyaW5lYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFBhdHJvbCBCb2F0YCwgbGVuZ3RoOiAyLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICBdO1xuXG4gIGNvbnN0IGhpdCA9IChhdHRhY2tEYXRhKSA9PiB7XG4gICAgY29uc3Qgc2hpcEhpdCA9IGF0dGFja0RhdGFbMF07XG4gICAgY29uc3QgY29vcmRPZkhpdCA9IGF0dGFja0RhdGFbMV07XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSkge1xuICAgICAgICBzaGlwLmhpdHMucHVzaChjb29yZE9mSGl0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoc2hpcEhpdCkgPT4ge1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUgJiYgc2hpcC5sZW5ndGggPT09IHNoaXAuaGl0cy5sZW5ndGgpIHtcbiAgICAgICAgc2hpcC5pc1N1bmsgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGZsZWV0LCBoaXQsIGlzU3VuayB9O1xufTtcblxuZXhwb3J0IHsgU2hpcHMgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9nYW1lSGFuZGxlclwiO1xuaW1wb3J0IHsgcmVuZGVyUGxheWVyU2hpcHMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbi8vIC8vICoqKioqKioqKiAtLS0tLSBIQVJEIENPRElORyBUSEUgQ0FSUklFUiBGT1IgTk9XICoqKioqKiogISEhISEhISEhISEkJCQkJCQkJCQkJCQkJCAtLS0tLS0tLVxuXG4vLyBjb25zdCBwbGF5ZXJGbGVldCA9IFtdO1xuXG4vLyBjb25zdCBjcHVCb2FyZFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG4vLyBjb25zdCBwbGFjZVNoaXBzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYWNlLXNoaXBzLWNvbnRhaW5lcmApO1xuLy8gY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2J0bi1yb3RhdGUtc2hpcGApO1xuLy8gY29uc3Qgc2hpcEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcblxuLy8gLy8gaGlkZXMgYWxsIGJ1dCB0aGUgY2FycmllciBvbiBwYWdlIGxvYWRcbi8vIHNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4vLyAgIGlmIChpbmRleCAhPT0gMCkge1xuLy8gICAgIHNoaXAuY2xhc3NMaXN0LmFkZChgaGlkZS1zaGlwYCk7XG4vLyAgIH1cbi8vIH0pO1xuXG4vLyByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCByb3RhdGVTaGlwKTtcblxuLy8gZnVuY3Rpb24gcm90YXRlU2hpcChlKSB7XG4vLyAgIHNoaXBJbWdzLmZvckVhY2goKGltYWdlKSA9PiB7XG4vLyAgICAgaWYgKCFpbWFnZS5zdHlsZS5yb3RhdGUpIHtcbi8vICAgICAgIGltYWdlLnN0eWxlLnJvdGF0ZSA9IGAtOTBkZWdgO1xuLy8gICAgICAgaW1hZ2Uuc3R5bGUudG9wID0gMzAgKyAoKDUgLSAxKSAvIDIpICogMzUgKyBgcHhgO1xuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICBpbWFnZS5zdHlsZS5yb3RhdGUgPSBgYDtcbi8vICAgICAgIGltYWdlLnN0eWxlLnRvcCA9IDMwICsgYHB4YDtcbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gfVxuXG4vLyBjb25zdCBjYXJyaWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1jYXJyaWVyYCk7XG4vLyBjb25zdCBjYXJyaWVyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NhcnJpZXItY29udGFpbmVyYCk7XG4vLyBjb25zb2xlLmxvZyhjYXJyaWVyQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbi8vIGNvbnNvbGUubG9nKGNhcnJpZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuXG4vLyBjYXJyaWVyLm9ubW91c2Vkb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuLy8gICAvLyAoMSkgcHJlcGFyZSB0byBtb3ZlIGVsZW1lbnQ6IG1ha2UgYWJzb2x1dGUgYW5kIG9uIHRvcCBieSB6LWluZGV4XG4vLyAgIGNhcnJpZXIuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4vLyAgIGNhcnJpZXIuc3R5bGUuekluZGV4ID0gMTAwMDtcblxuLy8gICAvLyBtb3ZlIGl0IG91dCBvZiBhbnkgY3VycmVudCBwYXJlbnRzIGRpcmVjdGx5IGludG8gY3B1Qm9hcmRcbi8vICAgY2FycmllckNvbnRhaW5lci5hcHBlbmQoY2Fycmllcik7XG5cbi8vICAgLy8gY2VudGVycyB0aGUgY3Vyc29yIGluIHRoZSBmaXJzdCBcInNxdWFyZVwiIG9mIHRoZSBzaGlwIGltYWdlXG4vLyAgIGZ1bmN0aW9uIG1vdmVBdChwYWdlWCwgcGFnZVkpIHtcbi8vICAgICBpZiAoIWNhcnJpZXIuc3R5bGUucm90YXRlKSB7XG4vLyAgICAgICBjYXJyaWVyLnN0eWxlLmxlZnQgPVxuLy8gICAgICAgICBwYWdlWCAtIChjYXJyaWVyQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggKyAxNy41KSArIFwicHhcIjtcbi8vICAgICAgIGNhcnJpZXIuc3R5bGUudG9wID1cbi8vICAgICAgICAgcGFnZVkgLSAoY2FycmllckNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55ICsgMTcuNSkgKyBcInB4XCI7XG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgIGNhcnJpZXIuc3R5bGUubGVmdCA9XG4vLyAgICAgICAgIHBhZ2VYIC1cbi8vICAgICAgICAgKGNhcnJpZXJDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArICgoNSAtIDEpIC8gMikgKiAzNSkgLVxuLy8gICAgICAgICAxNy41ICtcbi8vICAgICAgICAgXCJweFwiO1xuLy8gICAgICAgY2Fycmllci5zdHlsZS50b3AgPVxuLy8gICAgICAgICBwYWdlWSAtXG4vLyAgICAgICAgIChjYXJyaWVyQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkgLSAoKDUgLSAxKSAvIDIpICogMzUpIC1cbi8vICAgICAgICAgMTcuNSArXG4vLyAgICAgICAgIFwicHhcIjtcbi8vICAgICB9XG4vLyAgIH1cblxuLy8gICAvLyBtb3ZlIG91ciBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgY2FycmllciB1bmRlciB0aGUgcG9pbnRlclxuLy8gICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcblxuLy8gICAvLyBwb3RlbnRpYWwgZHJvcHBhYmxlIHRoYXQgd2UncmUgZmx5aW5nIG92ZXIgcmlnaHQgbm93XG4vLyAgIGxldCBjdXJyZW50RHJvcHBhYmxlID0gbnVsbDtcblxuLy8gICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuLy8gICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuLy8gICAgIGNhcnJpZXIuaGlkZGVuID0gdHJ1ZTtcbi8vICAgICBsZXQgZWxlbUJlbG93ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbi8vICAgICBjYXJyaWVyLmhpZGRlbiA9IGZhbHNlO1xuXG4vLyAgICAgLy8gbW91c2Vtb3ZlIGV2ZW50cyBtYXkgdHJpZ2dlciBvdXQgb2YgdGhlIHdpbmRvdyAod2hlbiB0aGUgc2hpcCBpcyBkcmFnZ2VkIG9mZi1zY3JlZW4pXG4vLyAgICAgLy8gaWYgY2xpZW50WC9jbGllbnRZIGFyZSBvdXQgb2YgdGhlIHdpbmRvdywgdGhlbiBlbGVtZW50RnJvbVBvaW50IHJldHVybnMgbnVsbFxuLy8gICAgIGlmICghZWxlbUJlbG93KSByZXR1cm47XG5cbi8vICAgICAvLyBwb3RlbnRpYWwgZHJvcHBhYmxlcyBhcmUgbGFiZWxlZCB3aXRoIHRoZSBjbGFzcyBcImRyb3BwYWJsZVwiIChjYW4gYmUgb3RoZXIgbG9naWMpXG4vLyAgICAgbGV0IGRyb3BwYWJsZUJlbG93ID0gZWxlbUJlbG93LmNsb3Nlc3QoXCIuY3B1U3F1YXJlXCIpO1xuXG4vLyAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUgIT0gZHJvcHBhYmxlQmVsb3cpIHtcbi8vICAgICAgIC8vIHdlJ3JlIGZseWluZyBpbiBvciBvdXQuLi5cbi8vICAgICAgIC8vIG5vdGU6IGJvdGggdmFsdWVzIGNhbiBiZSBudWxsXG4vLyAgICAgICAvLyAgIGN1cnJlbnREcm9wcGFibGU9bnVsbCBpZiB3ZSB3ZXJlIG5vdCBvdmVyIGEgZHJvcHBhYmxlIGJlZm9yZSB0aGlzIGV2ZW50IChlLmcgb3ZlciBhbiBlbXB0eSBzcGFjZSlcbi8vICAgICAgIC8vICAgZHJvcHBhYmxlQmVsb3c9bnVsbCBpZiB3ZSdyZSBub3Qgb3ZlciBhIGRyb3BwYWJsZSBub3csIGR1cmluZyB0aGlzIGV2ZW50XG5cbi8vICAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlKSB7XG4vLyAgICAgICAgIC8vIHRoZSBsb2dpYyB0byBwcm9jZXNzIFwiZmx5aW5nIG91dFwiIG9mIHRoZSBkcm9wcGFibGUgKHJlbW92ZSBoaWdobGlnaHQpXG4vLyAgICAgICAgIGxlYXZlRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbi8vICAgICAgIH1cbi8vICAgICAgIGN1cnJlbnREcm9wcGFibGUgPSBkcm9wcGFibGVCZWxvdztcbi8vICAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlKSB7XG4vLyAgICAgICAgIC8vIHRoZSBsb2dpYyB0byBwcm9jZXNzIFwiZmx5aW5nIGluXCIgb2YgdGhlIGRyb3BwYWJsZVxuLy8gICAgICAgICBlbnRlckRyb3BwYWJsZUFyZWEoY3VycmVudERyb3BwYWJsZSk7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG5cbi8vICAgbGV0IHNoaXBDb29yZHM7XG4vLyAgIGZ1bmN0aW9uIGVudGVyRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4vLyAgICAgc2hpcENvb3JkcyA9IFtdO1xuLy8gICAgIC8vIGlmIChlbGVtZW50KSB7XG4vLyAgICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuLy8gICAgIGNvbnN0IG1heEhvcml6b250YWwgPSAoTWF0aC5mbG9vcihpbmRleE9mSW5pdGlhbERyb3BQb2ludCAvIDEwKSArIDEpICogMTA7XG4vLyAgICAgY29uc3QgbWF4VmVydGljYWwgPVxuLy8gICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLVxuLy8gICAgICAgTWF0aC5mbG9vcihpbmRleE9mSW5pdGlhbERyb3BQb2ludCAvIDEwKSAqIDEwICtcbi8vICAgICAgIDkwO1xuLy8gICAgIGlmICghY2Fycmllci5zdHlsZS5yb3RhdGUgJiYgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyA0IDwgbWF4SG9yaXpvbnRhbCkge1xuLy8gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbi8vICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldKSB7XG4vLyAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbi8vICAgICAgICAgICAgIFwiZ3JlZW5cIjtcbi8vICAgICAgICAgICBzaGlwQ29vcmRzLnB1c2goaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgIH0gZWxzZSBpZiAoXG4vLyAgICAgICBjYXJyaWVyLnN0eWxlLnJvdGF0ZSAmJlxuLy8gICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyA0MCA8PSBtYXhWZXJ0aWNhbFxuLy8gICAgICkge1xuLy8gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbi8vICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbi8vICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4vLyAgICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuLy8gICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmVlblwiO1xuLy8gICAgICAgICAgIHNoaXBDb29yZHMucHVzaChpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMCk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgICAgLy8gfVxuLy8gICAgIGNvbnNvbGUubG9nKHNoaXBDb29yZHMpO1xuLy8gICB9XG5cbi8vICAgZnVuY3Rpb24gbGVhdmVEcm9wcGFibGVBcmVhKGVsZW1lbnQpIHtcbi8vICAgICBzaGlwQ29vcmRzID0gW107XG4vLyAgICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuLy8gICAgIGlmICghY2Fycmllci5zdHlsZS5yb3RhdGUpIHtcbi8vICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4vLyAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXSkge1xuLy8gICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4vLyAgICAgICAgICAgICBcImdyYXlcIjtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuLy8gICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuLy8gICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tcbi8vICAgICAgICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXG4vLyAgICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyYXlcIjtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgfVxuXG4vLyAgIC8vICgyKSBtb3ZlIHRoZSBjYXJyaWVyIG9uIG1vdXNlbW92ZVxuLy8gICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcblxuLy8gICAvLyAoMykgZHJvcCB0aGUgY2FycmllciwgcmVtb3ZlIHVubmVlZGVkIGhhbmRsZXJzXG4vLyAgIGNhcnJpZXIub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuLy8gICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuLy8gICAgIGNhcnJpZXIub25tb3VzZXVwID0gbnVsbDtcbi8vICAgICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBgO1xuLy8gICAgIGNvbnNvbGUubG9nKHNoaXBDb29yZHMpO1xuLy8gICAgIGlmIChzaGlwQ29vcmRzKSB7XG4vLyAgICAgICBwbGF5ZXJGbGVldC5wdXNoKHtcbi8vICAgICAgICAgbmFtZTogYENhcnJpZXJgLFxuLy8gICAgICAgICBzaGlwUGxhY2VtZW50OiBzaGlwQ29vcmRzLFxuLy8gICAgICAgfSk7XG4vLyAgICAgICBjYXJyaWVyQ29udGFpbmVyLnJlbW92ZUNoaWxkKGNhcnJpZXIpO1xuLy8gICAgICAgY29uc29sZS5sb2cocGxheWVyRmxlZXQpO1xuLy8gICAgICAgcmVuZGVyUGxheWVyU2hpcHMocGxheWVyRmxlZXQpO1xuLy8gICAgICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuLy8gICAgICAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYGdyYXlgO1xuLy8gICAgICAgfSk7XG4vLyAgICAgICBjb25zb2xlLmxvZyhzaGlwSW1nc1sxXSk7XG4vLyAgICAgICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XG4vLyAgICAgICAgIGlmIChpbmRleCA9PT0gcGxheWVyRmxlZXQubGVuZ3RoKSB7XG4vLyAgICAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKGBoaWRlLXNoaXBgKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfSk7XG4vLyAgICAgfVxuLy8gICB9O1xuLy8gfTtcblxuLy8gY2Fycmllci5vbmRyYWdzdGFydCA9IGZ1bmN0aW9uICgpIHtcbi8vICAgcmV0dXJuIGZhbHNlO1xuLy8gfTtcblxuLy8gLy8gLy8gaGFyZC1jb2RlZCBpbnN0YW50aWF0aW9uIG9mIHBsYXllckZsZWV0XG4vLyAvLyBjb25zdCBwbGF5ZXJGbGVldCA9IFtcbi8vIC8vICAgeyBuYW1lOiBcIkNhcnJpZXJcIiwgc2hpcFBsYWNlbWVudDogWzEsIDIsIDMsIDQsIDVdIH0sXG4vLyAvLyAgIHsgbmFtZTogXCJCYXR0bGVzaGlwXCIsIHNoaXBQbGFjZW1lbnQ6IFsxMCwgMTEsIDEyLCAxM10gfSxcbi8vIC8vICAgeyBuYW1lOiBcIkRlc3Ryb3llclwiLCBzaGlwUGxhY2VtZW50OiBbNzcsIDg3LCA5N10gfSxcbi8vIC8vICAgeyBuYW1lOiBcIlN1Ym1hcmluZVwiLCBzaGlwUGxhY2VtZW50OiBbNDAsIDUwLCA2MF0gfSxcbi8vIC8vICAgeyBuYW1lOiBcIlBhdHJvbCBCb2F0XCIsIHNoaXBQbGFjZW1lbnQ6IFs1OCwgNTldIH0sXG4vLyAvLyBdO1xuXG4vLyBBU09GSUpBU09GSUFKU09GSUFKU09GQUlTSkZPQVNJRkpPQVNJRkpBT1NJRkpBT1NJRkpBU09GSUpBU09GQUlTSkZPQVNJRkpBT1NGSUpBT1NJRkpBU09GSUpBU09GSUFTSkZPQVNJSkZBT1NJRkpBT1NGSUpBU09pRkpBXG5cbi8vICoqKioqKioqKiAtLS0tLSBIQVJEIENPRElORyBUSEUgQ0FSUklFUiBGT1IgTk9XICoqKioqKiogISEhISEhISEhISEkJCQkJCQkJCQkJCQkJCAtLS0tLS0tLVxuXG5jb25zdCBwbGF5ZXJGbGVldCA9IFtdO1xuXG5jb25zdCBzaGlwTmFtZXMgPSBbXG4gIGBDYXJyaWVyYCxcbiAgYEJhdHRsZXNoaXBgLFxuICBgRGVzdHJveWVyYCxcbiAgYFN1Ym1hcmluZWAsXG4gIGBQYXRyb2wgQm9hdGAsXG5dO1xuY29uc3Qgc2hpcExlbmd0aHMgPSBbNSwgNCwgMywgMywgMl07XG5sZXQgc2hpcHNQbGFjZWQgPSAwO1xubGV0IHNoaXBDb29yZHMgPSBbXTtcblxuY29uc3QgY3B1Qm9hcmRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdVNxdWFyZWApO1xuY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2J0bi1yb3RhdGUtc2hpcGApO1xuY29uc3QgcGxhY2VTaGlwc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGFjZS1zaGlwcy1jb250YWluZXJgKTtcbmNvbnN0IHBsYXllclNoaXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgYC5wbGF5ZXItc2hpcHMtY29udGFpbmVyYFxuKTtcbmNvbnN0IHNoaXBJbWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnNoaXBzLXRvLXBsYWNlYCk7XG5cbi8vIGhpZGVzIGFsbCBidXQgdGhlIGNhcnJpZXIgb24gcGFnZSBsb2FkXG5zaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICBpZiAoaW5kZXggIT09IDApIHtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoYGhpZGUtc2hpcGApO1xuICB9XG59KTtcblxucm90YXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcm90YXRlU2hpcCk7XG5cbmZ1bmN0aW9uIHJvdGF0ZVNoaXAoZSkge1xuICBpZiAoIXNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUpIHtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlID0gYC05MGRlZ2A7XG4gICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnRvcCA9XG4gICAgICA4MSArICgoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgLyAyKSAqIDM1ICsgYHB4YDtcbiAgfSBlbHNlIHtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlID0gYGA7XG4gICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnRvcCA9IDgxICsgYHB4YDtcbiAgfVxufVxuXG5zaGlwSW1ncy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihgbW91c2Vkb3duYCwgYmVnaW5TaGlwUGxhY2VtZW50KTtcbiAgc2hpcC5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gIHNoaXAub25kcmFnc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGJlZ2luU2hpcFBsYWNlbWVudChldmVudCkge1xuICAvLyAoMSkgcHJlcGFyZSB0byBtb3ZlIGVsZW1lbnQ6IG1ha2UgYWJzb2x1dGUgYW5kIG9uIHRvcCBieSB6LWluZGV4XG4gIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnpJbmRleCA9IDEwMDA7XG5cbiAgLy8gbW92ZSBpdCBvdXQgb2YgYW55IGN1cnJlbnQgcGFyZW50cyBkaXJlY3RseSBpbnRvIGNwdUJvYXJkXG4gIHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5hcHBlbmQoc2hpcEltZ3Nbc2hpcHNQbGFjZWRdKTtcblxuICAvLyBjZW50ZXJzIHRoZSBjdXJzb3IgaW4gdGhlIGZpcnN0IFwic3F1YXJlXCIgb2YgdGhlIHNoaXAgaW1hZ2VcbiAgZnVuY3Rpb24gbW92ZUF0KHBhZ2VYLCBwYWdlWSkge1xuICAgIGlmICghc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLmxlZnQgPVxuICAgICAgICBwYWdlWCAtXG4gICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1tzaGlwc1BsYWNlZF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArIDE3LjUpICtcbiAgICAgICAgXCJweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnRvcCA9XG4gICAgICAgIHBhZ2VZIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55ICsgMTcuNSkgK1xuICAgICAgICBcInB4XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgcGFnZVggLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggK1xuICAgICAgICAgICgoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID1cbiAgICAgICAgcGFnZVkgLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkgLVxuICAgICAgICAgICgoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgfVxuICB9XG5cbiAgLy8gbW92ZSBvdXIgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNhcnJpZXIgdW5kZXIgdGhlIHBvaW50ZXJcbiAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbiAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZSB0aGF0IHdlJ3JlIGZseWluZyBvdmVyIHJpZ2h0IG5vd1xuICBsZXQgY3VycmVudERyb3BwYWJsZSA9IG51bGw7XG4gIGxldCBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uaGlkZGVuID0gdHJ1ZTtcbiAgICBsZXQgZWxlbUJlbG93ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcblxuICAgIC8vIEZPSUhERk9JRkhTT0lGSERGIC0tLS0tIGF0dGVtcHRpbmcgdG8gdmFsaWRhdGUgZHJvcCAtLS0tLSBGT0pEU0lGSEYgLy9cbiAgICBsZXQgaXNEcm9wVmFsaWQ7XG4gICAgbGV0IGVsZW1CZWxvd0FycmF5ID0gW107XG4gICAgZWxlbUJlbG93QXJyYXkuc2hpZnQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXTsgaSsrKSB7XG4gICAgICBsZXQgY2hlY2tlcjtcbiAgICAgIGlmIChzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlKSB7XG4gICAgICAgIGNoZWNrZXIgPSBkb2N1bWVudFxuICAgICAgICAgIC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgKyBpICogMzUpXG4gICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoZWNrZXIgPSBkb2N1bWVudFxuICAgICAgICAgIC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFggKyBpICogMzUsIGV2ZW50LmNsaWVudFkpXG4gICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgIH1cbiAgICAgIGVsZW1CZWxvd0FycmF5LnB1c2goY2hlY2tlcik7XG4gICAgICBpZiAoZWxlbUJlbG93QXJyYXlbMF0pIHtcbiAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICBlbGVtQmVsb3dBcnJheS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKChpdGVtICYmIGl0ZW0uaW5jbHVkZXMoYGludmFsaWRgKSkgfHwgaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjb3VudGVyKSB7XG4gICAgICAgICAgaXNEcm9wVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc0Ryb3BWYWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coaXNEcm9wVmFsaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhlbGVtQmVsb3dBcnJheSk7XG4gICAgLy8gRk9JSERGT0lGSFNPSUZIREYgLS0tLS0gYXR0ZW1wdGluZyB0byB2YWxpZGF0ZSBkcm9wIC0tLS0tIEZPSkRTSUZIRiAvL1xuXG4gICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLmhpZGRlbiA9IGZhbHNlO1xuXG4gICAgLy8gbW91c2Vtb3ZlIGV2ZW50cyBtYXkgdHJpZ2dlciBvdXQgb2YgdGhlIHdpbmRvdyAod2hlbiB0aGUgc2hpcCBpcyBkcmFnZ2VkIG9mZi1zY3JlZW4pXG4gICAgLy8gaWYgY2xpZW50WC9jbGllbnRZIGFyZSBvdXQgb2YgdGhlIHdpbmRvdywgdGhlbiBlbGVtZW50RnJvbVBvaW50IHJldHVybnMgbnVsbFxuICAgIGlmICghZWxlbUJlbG93KSByZXR1cm47XG5cbiAgICAvLyBwb3RlbnRpYWwgZHJvcHBhYmxlcyBhcmUgbGFiZWxlZCB3aXRoIHRoZSBjbGFzcyBcImRyb3BwYWJsZVwiIChjYW4gYmUgb3RoZXIgbG9naWMpXG4gICAgZHJvcHBhYmxlQmVsb3cgPSBlbGVtQmVsb3cuY2xvc2VzdChcIi5jcHVTcXVhcmVcIik7XG4gICAgLy8gY29uc29sZS5sb2coZHJvcHBhYmxlQmVsb3cpO1xuXG4gICAgaWYgKCFkcm9wcGFibGVCZWxvdykge1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLmN1cnNvciA9IGBuby1kcm9wYDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLmN1cnNvciA9IGBncmFiYmluZ2A7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnREcm9wcGFibGUgIT0gZHJvcHBhYmxlQmVsb3cpIHtcbiAgICAgIC8vIHdlJ3JlIGZseWluZyBpbiBvciBvdXQuLi5cbiAgICAgIC8vIG5vdGU6IGJvdGggdmFsdWVzIGNhbiBiZSBudWxsXG4gICAgICAvLyAgIGN1cnJlbnREcm9wcGFibGU9bnVsbCBpZiB3ZSB3ZXJlIG5vdCBvdmVyIGEgZHJvcHBhYmxlIGJlZm9yZSB0aGlzIGV2ZW50IChlLmcgb3ZlciBhbiBlbXB0eSBzcGFjZSlcbiAgICAgIC8vICAgZHJvcHBhYmxlQmVsb3c9bnVsbCBpZiB3ZSdyZSBub3Qgb3ZlciBhIGRyb3BwYWJsZSBub3csIGR1cmluZyB0aGlzIGV2ZW50XG5cbiAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlKSB7XG4gICAgICAgIC8vIHRoZSBsb2dpYyB0byBwcm9jZXNzIFwiZmx5aW5nIG91dFwiIG9mIHRoZSBkcm9wcGFibGUgKHJlbW92ZSBoaWdobGlnaHQpXG4gICAgICAgIGxlYXZlRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnREcm9wcGFibGUgPSBkcm9wcGFibGVCZWxvdztcbiAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlKSB7XG4gICAgICAgIC8vIHRoZSBsb2dpYyB0byBwcm9jZXNzIFwiZmx5aW5nIGluXCIgb2YgdGhlIGRyb3BwYWJsZVxuICAgICAgICBlbnRlckRyb3BwYWJsZUFyZWEoY3VycmVudERyb3BwYWJsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW50ZXJEcm9wcGFibGVBcmVhKGVsZW1lbnQpIHtcbiAgICBzaGlwQ29vcmRzID0gW107XG4gICAgLy8gaWYgKGVsZW1lbnQpIHtcbiAgICBjb25zdCBpbmRleE9mSW5pdGlhbERyb3BQb2ludCA9ICtlbGVtZW50LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4gICAgY29uc3QgbWF4SG9yaXpvbnRhbCA9IChNYXRoLmZsb29yKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC8gMTApICsgMSkgKiAxMDtcbiAgICBjb25zdCBtYXhWZXJ0aWNhbCA9XG4gICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCAtXG4gICAgICBNYXRoLmZsb29yKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC8gMTApICogMTAgK1xuICAgICAgOTA7XG4gICAgaWYgKFxuICAgICAgIXNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgKHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXSAtIDEpIDwgbWF4SG9yaXpvbnRhbFxuICAgICkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgXCJncmVlblwiO1xuICAgICAgICAgIHNoaXBDb29yZHMucHVzaChpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgKHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXSAtIDEpICogMTAgPD1cbiAgICAgICAgbWF4VmVydGljYWxcbiAgICApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmVlblwiO1xuICAgICAgICAgIHNoaXBDb29yZHMucHVzaChpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coYGhlcmVgKTtcbiAgICAgIGRyb3BwYWJsZUJlbG93ID0gbnVsbDtcbiAgICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICB9XG4gICAgLy8gfVxuICAgIGNvbnNvbGUubG9nKHNoaXBDb29yZHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhdmVEcm9wcGFibGVBcmVhKGVsZW1lbnQpIHtcbiAgICBzaGlwQ29vcmRzID0gW107XG4gICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICAgIGlmICghc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgXCJncmF5XCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tcbiAgICAgICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXG4gICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyYXlcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vICgyKSBtb3ZlIHRoZSBzaGlwIG9uIG1vdXNlbW92ZVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcblxuICAvLyAoMykgZHJvcCB0aGUgc2hpcCwgcmVtb3ZlIHVubmVlZGVkIGhhbmRsZXJzXG4gIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5vbm1vdXNldXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG4gICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLm9ubW91c2V1cCA9IG51bGw7XG4gICAgY29uc29sZS5sb2coc2hpcENvb3Jkcyk7XG4gICAgaWYgKHNoaXBDb29yZHMubGVuZ3RoICE9PSAwICYmIGRyb3BwYWJsZUJlbG93KSB7XG4gICAgICBwbGF5ZXJGbGVldC5wdXNoKHtcbiAgICAgICAgbmFtZTogc2hpcE5hbWVzW3NoaXBzUGxhY2VkXSxcbiAgICAgICAgc2hpcFBsYWNlbWVudDogc2hpcENvb3JkcyxcbiAgICAgIH0pO1xuICAgICAgcGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLnJlbW92ZUNoaWxkKHNoaXBJbWdzW3NoaXBzUGxhY2VkXSk7XG4gICAgICByZW5kZXJQbGF5ZXJTaGlwcyhbcGxheWVyRmxlZXRbc2hpcHNQbGFjZWRdXSk7XG4gICAgICBjcHVCb2FyZFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgZ3JheWA7XG4gICAgICB9KTtcbiAgICAgIHNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gcGxheWVyRmxlZXQubGVuZ3RoKSB7XG4gICAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKGBoaWRlLXNoaXBgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzaGlwc1BsYWNlZCArPSAxO1xuICAgICAgaWYgKHNoaXBzUGxhY2VkICE9PSA1KSB7XG4gICAgICB9XG4gICAgICAvLyB9IGVsc2UgaWYgKCFkcm9wcGFibGVCZWxvdykge1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGFjZVNoaXBzQ29udGFpbmVyLmluc2VydEJlZm9yZShcbiAgICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLFxuICAgICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZCArIDFdXG4gICAgICApO1xuICAgICAgaWYgKHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSA9IGBgO1xuICAgICAgfVxuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnRvcCA9IFwiODFweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnpJbmRleCA9IDA7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuY3Vyc29yID0gYGdyYWJgO1xuICAgIH1cbiAgICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBgO1xuICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==