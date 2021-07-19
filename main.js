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

function renderPlayerShips(fleet) {
  console.log(fleet[0].shipPlacement);
  if (!fleet[0].shipPlacement) {
    return;
  }
  const cpuBoard = document.querySelector(`#cpu-board`);
  let imgSrc;

  fleet.forEach((shipObject) => {
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
  // renderGameboard(`cpu`);
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

const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);
const rotateBtn = document.querySelector(`#btn-rotate-ship`);
const shipImgs = document.querySelectorAll(`.ships-to-place`);

// hides all but the carrier on page load
shipImgs.forEach((ship, index) => {
  if (index !== 0) {
    ship.classList.add(`hide-ship`);
  }
});

rotateBtn.addEventListener(`click`, rotateShip);

function rotateShip(e) {
  shipImgs.forEach((image) => {
    if (!image.style.rotate) {
      image.style.rotate = `-90deg`;
      image.style.top = 30 + ((shipLengths[shipsPlaced] - 1) / 2) * 35 + `px`;
    } else {
      image.style.rotate = ``;
      image.style.top = 30 + `px`;
    }
  });
}

// const carrier = document.querySelector(`#player-carrier`);
// const carrierContainer = document.querySelector(`#carrier-container`);
const playerShipContainers = document.querySelectorAll(
  `.player-ships-container`
);

// console.log(carrierContainer.getBoundingClientRect());
// console.log(carrier.getBoundingClientRect());

let shipsPlaced = 0;

shipImgs.forEach((ship) => {
  ship.addEventListener(`mousedown`, beginShipPlacement);
  ship.ondragstart = function () {
    return false;
  };
});

function beginShipPlacement(event) {
  console.log(shipImgs[shipsPlaced]);
  rotateBtn.style.display = `none`;
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

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    shipImgs[shipsPlaced].hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    shipImgs[shipsPlaced].hidden = false;

    // mousemove events may trigger out of the window (when the ship is dragged off-screen)
    // if clientX/clientY are out of the window, then elementFromPoint returns null
    if (!elemBelow) return;

    // potential droppables are labeled with the class "droppable" (can be other logic)
    let droppableBelow = elemBelow.closest(".cpuSquare");

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

  let shipCoords;
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
      indexOfInitialDropPoint + shipLengths[shipsPlaced] * 10 <= maxVertical
    ) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
          cpuBoardSquares[
            indexOfInitialDropPoint + i * 10
          ].style.backgroundColor = "green";
          shipCoords.push(indexOfInitialDropPoint + i * 10);
        }
      }
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

  // (2) move the carrier on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // (3) drop the carrier, remove unneeded handlers
  shipImgs[shipsPlaced].onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    shipImgs[shipsPlaced].onmouseup = null;
    rotateBtn.style.display = ``;
    console.log(shipCoords);
    if (shipCoords) {
      playerFleet.push({
        name: shipNames[shipsPlaced],
        shipPlacement: shipCoords,
      });
      playerShipContainers[shipsPlaced].removeChild(shipImgs[shipsPlaced]);
      console.log(playerFleet);
      (0,_renderGame__WEBPACK_IMPORTED_MODULE_1__.renderPlayerShips)(playerFleet);
      cpuBoardSquares.forEach((square) => {
        square.style.backgroundColor = `gray`;
      });
      console.log(shipImgs[1]);
      shipImgs.forEach((ship, index) => {
        console.log(index);
        if (index === playerFleet.length) {
          ship.classList.remove(`hide-ship`);
        }
      });
      shipsPlaced += 1;
    }
  };
}

// // hard-coded instantiation of playerFleet
// const playerFleet = [
//   { name: "Carrier", shipPlacement: [1, 2, 3, 4, 5] },
//   { name: "Battleship", shipPlacement: [10, 11, 12, 13] },
//   { name: "Destroyer", shipPlacement: [77, 87, 97] },
//   { name: "Submarine", shipPlacement: [40, 50, 60] },
//   { name: "Patrol Boat", shipPlacement: [58, 59] },
// ];

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcmVuZGVyR2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkU7QUFDRzs7QUFFOUU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHLHNEQUFzRDtBQUN6RCxHQUFHLGlEQUFpRDtBQUNwRCxHQUFHLGlEQUFpRDtBQUNwRCxHQUFHLCtDQUErQztBQUNsRDtBQUNBLG9CQUFvQixxREFBUzs7QUFFN0Isc0JBQXNCLDhEQUFrQjtBQUN4QyxzQkFBc0IscURBQVM7O0FBRS9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsY0FBYztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixPQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsT0FBTztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSLHdCQUF3QixPQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTLGtEQUFrRDtBQUMzRCxTQUFTLHNEQUFzRDtBQUMvRCxTQUFTLGlEQUFpRDtBQUMxRCxTQUFTLGlEQUFpRDtBQUMxRCxTQUFTLCtDQUErQztBQUN4RDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsOEJBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsOEJBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsOEJBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wscUJBQXFCLDhCQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sOERBQWlCO0FBQ3ZCO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLGtEQUFrRDtBQUN4RCxNQUFNLHNEQUFzRDtBQUM1RCxNQUFNLGlEQUFpRDtBQUN2RCxNQUFNLGlEQUFpRDtBQUN2RCxNQUFNLCtDQUErQztBQUNyRCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR2FtZWJvYXJkLCBwbGFjZUNvbXB1dGVyRmxlZXQsIHJlY2VpdmVBdHRhY2sgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCB7IHJlbmRlck1vdmUsIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmNvbnN0IHN0b3JlZEdhbWVib2FyZHMgPSBbXTtcblxubGV0IHR1cm5Db3VudGVyID0gMTtcbmZ1bmN0aW9uIHR1cm5Ecml2ZXIoKSB7XG4gIGxldCB3aG9zZU1vdmU7XG4gIGlmICh0dXJuQ291bnRlciAlIDIgIT09IDApIHtcbiAgICB3aG9zZU1vdmUgPSBgcGxheWVyYDtcbiAgfSBlbHNlIHtcbiAgICB3aG9zZU1vdmUgPSBgY29tcHV0ZXJgO1xuICB9XG4gIHR1cm5Db3VudGVyICs9IDE7XG4gIHJldHVybiB3aG9zZU1vdmU7XG59XG5cbi8vIGhhcmQtY29kZWQgaW5zdGFudGlhdGlvbiBvZiBwbGF5ZXJGbGVldFxuY29uc3QgcGxheWVyRmxlZXQgPSBbXG4gIHsgbmFtZTogXCJDYXJyaWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFsxLCAyLCAzLCA0LCA1XSB9LFxuICB7IG5hbWU6IFwiQmF0dGxlc2hpcFwiLCBzaGlwUGxhY2VtZW50OiBbMTAsIDExLCAxMiwgMTNdIH0sXG4gIHsgbmFtZTogXCJEZXN0cm95ZXJcIiwgc2hpcFBsYWNlbWVudDogWzc3LCA4NywgOTddIH0sXG4gIHsgbmFtZTogXCJTdWJtYXJpbmVcIiwgc2hpcFBsYWNlbWVudDogWzQwLCA1MCwgNjBdIH0sXG4gIHsgbmFtZTogXCJQYXRyb2wgQm9hdFwiLCBzaGlwUGxhY2VtZW50OiBbNTgsIDU5XSB9LFxuXTtcbmNvbnN0IHBsYXllckJvYXJkID0gR2FtZWJvYXJkKHBsYXllckZsZWV0KTtcblxuY29uc3QgY29tcHV0ZXJGbGVldCA9IHBsYWNlQ29tcHV0ZXJGbGVldCgpO1xuY29uc3QgY29tcHV0ZXJCb2FyZCA9IEdhbWVib2FyZChjb21wdXRlckZsZWV0KTtcblxuc3RvcmVkR2FtZWJvYXJkcy5wdXNoKFtgcGxheWVyYCwgY29tcHV0ZXJCb2FyZF0pO1xuc3RvcmVkR2FtZWJvYXJkcy5wdXNoKFtgY29tcHV0ZXJgLCBwbGF5ZXJCb2FyZF0pO1xuXG4vLyBCRUdJTiAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5mdW5jdGlvbiBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKSB7XG4gIGNvbnN0IHZhbGlkTW92ZXMgPSBbXTtcbiAgY29uc3QgbWF4TW92ZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4TW92ZXM7IGkrKykge1xuICAgIHZhbGlkTW92ZXMucHVzaChpKTtcbiAgfVxuICByZXR1cm4gdmFsaWRNb3Zlcztcbn1cblxuY29uc3QgZ2V0VmFsaWRNb3ZlcyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuY29uc3QgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpIHtcbiAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnZXRWYWxpZE1vdmVzLmxlbmd0aCk7XG4gIGNvbnN0IHJhbmRvbU1vdmUgPSBnZXRWYWxpZE1vdmVzW3JhbmRvbUluZGV4XTtcbiAgZ2V0VmFsaWRNb3Zlcy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICByZXR1cm4gcmFuZG9tTW92ZTtcbn1cbi8vIEVORCAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIGdhbWVMb29wKHBsYXllck1vdmUpIHtcbiAgbGV0IGdldFR1cm47XG4gIGxldCBjb29yZE9mQXR0YWNrO1xuICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICBjb25zdCBpbmRleFRvU3BsaWNlID0gZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuZmluZEluZGV4KFxuICAgIChpbmRleCkgPT4gaW5kZXggPT09IHBsYXllck1vdmVcbiAgKTtcbiAgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuc3BsaWNlKGluZGV4VG9TcGxpY2UsIDEpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGlmICghaXNHYW1lT3Zlcikge1xuICAgICAgZ2V0VHVybiA9IHR1cm5Ecml2ZXIoKTtcbiAgICAgIGlmIChnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICBjb29yZE9mQXR0YWNrID0gcGxheWVyTW92ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkT2ZBdHRhY2sgPSBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBhdHRhY2tPdXRjb21lID0gcmVjZWl2ZUF0dGFjayhjb29yZE9mQXR0YWNrLCBnZXRUdXJuKTtcbiAgICAgIHJlbmRlck1vdmUoZ2V0VHVybiwgYXR0YWNrT3V0Y29tZSk7XG4gICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSkge1xuICAgICAgICBzdG9yZWRHYW1lYm9hcmRzLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChpdGVtWzBdID09PSBnZXRUdXJuKSB7XG4gICAgICAgICAgICBpc0dhbWVPdmVyID0gaXRlbVsxXS5pc0dhbWVPdmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0dhbWVPdmVyKSB7XG4gICAgICAgIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMoZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcpO1xuICAgICAgICBhbGVydChgZ2FtZSBvdmVyISAke2dldFR1cm59IHdpbnMhYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7IHN0b3JlZEdhbWVib2FyZHMsIGdhbWVMb29wIH07XG4iLCJpbXBvcnQgeyBTaGlwcyB9IGZyb20gXCIuL3NoaXBNb2R1bGVcIjtcbmltcG9ydCB7IHN0b3JlZEdhbWVib2FyZHMgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuaW1wb3J0IHsgcmVuZGVyQ29tcHV0ZXJTaGlwcyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcblxuY29uc3QgR2FtZWJvYXJkID0gKGZsZWV0QXJyYXkpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gW1xuICAgIGZsZWV0QXJyYXlbMF0sXG4gICAgZmxlZXRBcnJheVsxXSxcbiAgICBmbGVldEFycmF5WzJdLFxuICAgIGZsZWV0QXJyYXlbM10sXG4gICAgZmxlZXRBcnJheVs0XSxcbiAgXTtcbiAgY29uc3QgbWlzc2VzID0gW107XG4gIGNvbnN0IHNoaXBzID0gU2hpcHMoKTtcblxuICBjb25zdCBpc0dhbWVPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGFycmF5ID0gc2hpcHMuZmxlZXQ7XG4gICAgbGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgICBsZXQgc2hpcHNTdW5rQ291bnRlciA9IDA7XG5cbiAgICBhcnJheS5maWx0ZXIoKG9iaikgPT4ge1xuICAgICAgaWYgKG9iai5pc1N1bmspIHtcbiAgICAgICAgc2hpcHNTdW5rQ291bnRlciArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzaGlwc1N1bmtDb3VudGVyID09PSA1KSB7XG4gICAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGlzR2FtZU92ZXI7XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2FtZWJvYXJkLCBtaXNzZXMsIHNoaXBzLCBpc0dhbWVPdmVyIH07XG59O1xuXG4vLyBCRUdJTi0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIGNvbXB1dGVyIC0tLS0tLS0gLy9cbmNvbnN0IGNvbXB1dGVyRmxlZXQgPSBbXTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKSB7XG4gIGNvbnN0IG51bWJlck9mQ29vcmRpbmF0ZXMgPSAxMDA7XG4gIGNvbnN0IG9yaWVudGF0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gIGNvbnN0IGZpcnN0Q29vcmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1iZXJPZkNvb3JkaW5hdGVzKTtcbiAgcmV0dXJuIFtvcmllbnRhdGlvbiwgZmlyc3RDb29yZF07XG59XG5cbmZ1bmN0aW9uIG9yaWVudFNoaXAoc3RhcnRDb29yZCwgb3JpZW50YXRpb24sIG5hbWUsIGxlbmd0aCkge1xuICBsZXQgc2hpcFBsYWNlbWVudCA9IFtdO1xuICBsZXQgaG9yaXpvbnRhbExpbWl0O1xuICBpZiAoc3RhcnRDb29yZCA8IDEwKSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gOTtcbiAgfSBlbHNlIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSArKHN0YXJ0Q29vcmQudG9TdHJpbmcoKS5jaGFyQXQoMCkgKyA5KTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9yaWVudGF0aW9uKSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSAqIDEwIDwgMTAwKSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSAqIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSAqIDEwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgPD0gaG9yaXpvbnRhbExpbWl0KSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4geyBuYW1lLCBzaGlwUGxhY2VtZW50IH07XG59XG5cbmZ1bmN0aW9uIHZlcmlmeUNvb3JkcyhvYmplY3QpIHtcbiAgY29uc3Qgc2hpcFRvVmVyaWZ5ID0gb2JqZWN0LnNoaXBQbGFjZW1lbnQ7XG4gIGxldCBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gIGlmICghY29tcHV0ZXJGbGVldC5sZW5ndGgpIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbiAgfSBlbHNlIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBUb1ZlcmlmeS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcHV0ZXJGbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgICAgaWYgKGlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcC5zaGlwUGxhY2VtZW50Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChzaGlwVG9WZXJpZnlbaV0gIT09IHNoaXAuc2hpcFBsYWNlbWVudFtqXSkge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xufVxuXG4vLyB1c2VkIGZvciB0aGUgbmFtZSBhbmQgbGVuZ3RoIHByb3BzIGluIHRoZSBwbGFjZUNvbXB1dGVyRmxlZXQgZnhuXG5jb25zdCBzaGlwQ2xvbmUgPSBTaGlwcygpO1xuXG5mdW5jdGlvbiBwbGFjZUNvbXB1dGVyRmxlZXQoKSB7XG4gIHNoaXBDbG9uZS5mbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcbiAgICB3aGlsZSAoIWlzVmFsaWQpIHtcbiAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHJhbmRvbVZhbHVlcyA9IGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCk7XG4gICAgICBjb25zdCBwbGFjZW1lbnQgPSBvcmllbnRTaGlwKFxuICAgICAgICByYW5kb21WYWx1ZXNbMV0sXG4gICAgICAgIHJhbmRvbVZhbHVlc1swXSxcbiAgICAgICAgc2hpcC5uYW1lLFxuICAgICAgICBzaGlwLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHZlcmlmeSA9IHZlcmlmeUNvb3JkcyhwbGFjZW1lbnQpO1xuICAgICAgaWYgKHZlcmlmeSkge1xuICAgICAgICBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgY29tcHV0ZXJGbGVldC5wdXNoKHBsYWNlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmVuZGVyQ29tcHV0ZXJTaGlwcyhjb21wdXRlckZsZWV0KTtcbiAgcmV0dXJuIGNvbXB1dGVyRmxlZXQ7XG59XG4vLyBFTkQtLS0tLS0tLSBjcmVhdGVzIGEgcmFuZG9tbHkgcGxhY2VkIGJvYXJkIGZvciBjb21wdXRlciAtLS0tLS0tIC8vXG5cbmNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoYXR0YWNrQ29vcmQsIHVzZXIpID0+IHtcbiAgbGV0IGluZGV4O1xuICBsZXQgYXR0YWNrT3V0Y29tZSA9IFtudWxsLCBhdHRhY2tDb29yZF07XG4gIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgIGluZGV4ID0gMDtcbiAgfSBlbHNlIHtcbiAgICBpbmRleCA9IDE7XG4gIH1cbiAgY29uc3QgZ2FtZWJvYXJkT2JqZWN0ID0gc3RvcmVkR2FtZWJvYXJkc1tpbmRleF1bMV07XG4gIGdhbWVib2FyZE9iamVjdC5nYW1lYm9hcmQuZm9yRWFjaCgob2JqZWN0KSA9PiB7XG4gICAgaWYgKG9iamVjdC5zaGlwUGxhY2VtZW50LmluY2x1ZGVzKGF0dGFja0Nvb3JkKSkge1xuICAgICAgYXR0YWNrT3V0Y29tZSA9IFtvYmplY3QubmFtZSwgYXR0YWNrQ29vcmRdO1xuICAgIH1cbiAgfSk7XG4gIGlmICghYXR0YWNrT3V0Y29tZVswXSkge1xuICAgIGdhbWVib2FyZE9iamVjdC5taXNzZXMucHVzaChhdHRhY2tDb29yZCk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZWJvYXJkT2JqZWN0LnNoaXBzLmhpdChhdHRhY2tPdXRjb21lKTtcbiAgICBnYW1lYm9hcmRPYmplY3Quc2hpcHMuaXNTdW5rKGF0dGFja091dGNvbWVbMF0pO1xuICB9XG4gIHJldHVybiBhdHRhY2tPdXRjb21lO1xufTtcblxuZXhwb3J0IHsgR2FtZWJvYXJkLCBwbGFjZUNvbXB1dGVyRmxlZXQsIHJlY2VpdmVBdHRhY2sgfTtcbiIsImltcG9ydCB7IGdhbWVMb29wIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcblxuZnVuY3Rpb24gcmVuZGVyR2FtZWJvYXJkKHVzZXIpIHtcbiAgbGV0IGJvYXJkRGl2O1xuICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgfSBlbHNlIHtcbiAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgfVxuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICBib2FyZC5jbGFzc0xpc3QuYWRkKGBnYW1lYm9hcmRgKTtcbiAgY29uc3QgbWF4U3F1YXJlcyA9IDEwMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhTcXVhcmVzOyBpKyspIHtcbiAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBzcXVhcmUudGV4dENvbnRlbnQgPSBpO1xuICAgIHNxdWFyZS5kYXRhc2V0LmluZGV4TnVtYmVyID0gaTtcbiAgICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKGBwbGF5ZXJTcXVhcmVgKTtcbiAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKGBjcHVTcXVhcmVgKTtcbiAgICB9XG4gICAgYm9hcmQuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgfVxuICBib2FyZERpdi5hcHBlbmRDaGlsZChib2FyZCk7XG59XG5cbmNvbnN0IHBsYXllckF0dGFjayA9IChlKSA9PiB7XG4gIGNvbnN0IGNvb3JkaW5hdGVDbGlja2VkID0gK2UudGFyZ2V0LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4gIGdhbWVMb29wKGNvb3JkaW5hdGVDbGlja2VkKTtcbiAgZS50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xufTtcblxuLy8gcmVuZGVyR2FtZWJvYXJkKGBwbGF5ZXJgKTtcbnJlbmRlckdhbWVib2FyZChgY3B1YCk7XG5cbmZ1bmN0aW9uIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMoYXJyYXkpIHtcbiAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5wbGF5ZXJTcXVhcmVgKTtcbiAgYXJyYXkuZm9yRWFjaCgoaW5kZXgpID0+IHtcbiAgICBzcXVhcmVzW2luZGV4XS5yZW1vdmVFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJNb3ZlKHdob3NlVHVybiwgYXR0YWNrQXJyYXkpIHtcbiAgbGV0IHNxdWFyZXM7XG4gIGNvbnN0IGhpdEluZGV4ID0gYXR0YWNrQXJyYXlbMV07XG4gIGlmICh3aG9zZVR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5wbGF5ZXJTcXVhcmVgKTtcbiAgfSBlbHNlIHtcbiAgICBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdVNxdWFyZWApO1xuICB9XG4gIGlmIChhdHRhY2tBcnJheVswXSkge1xuICAgIHNxdWFyZXNbaGl0SW5kZXhdLmNsYXNzTGlzdC5hZGQoYGhpdGApO1xuICB9IGVsc2Uge1xuICAgIHNxdWFyZXNbaGl0SW5kZXhdLmNsYXNzTGlzdC5hZGQoYG1pc3NgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJDb21wdXRlclNoaXBzKGNwdUZsZWV0KSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICBsZXQgaW1nU3JjO1xuXG4gIGNwdUZsZWV0LmZvckVhY2goKHNoaXBPYmplY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChgc2hpcHMtcmVuZGVyZWRgKTtcbiAgICBjb25zdCBzaGlwSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBpbWdgKTtcbiAgICBpZiAoc2hpcE9iamVjdC5uYW1lID09PSBgUGF0cm9sIEJvYXRgKSB7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzL3BhdHJvbC5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYHBhdHJvbGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXBPYmplY3QubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy8ke3NoaXBOYW1lfS5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYCR7c2hpcE5hbWV9YCk7XG4gICAgfVxuICAgIHNoaXBJbWFnZS5zcmMgPSBpbWdTcmM7XG5cbiAgICBjb25zdCBzb3J0QXNjZW5kaW5nID0gc2hpcE9iamVjdC5zaGlwUGxhY2VtZW50LnNvcnQoKHgsIHkpID0+IHggLSB5KTtcbiAgICBjb25zdCBkaW1lbnNpb25PZlNxdWFyZSA9IDM1O1xuICAgIGxldCB0b3BPZmZzZXQ7XG4gICAgbGV0IGxlZnRPZmZzZXQ7XG4gICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gKyAxID09PSBzb3J0QXNjZW5kaW5nWzFdKSB7XG4gICAgICAvLyBwbGFjZSBob3Jpem9udGFsIHNoaXBzXG4gICAgICB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9IHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwbGFjZSB2ZXJ0aWNhbCBzaGlwc1xuICAgICAgc2hpcEltYWdlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoLTkwZGVnKWA7XG4gICAgICB0b3BPZmZzZXQgPVxuICAgICAgICBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSArXG4gICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgIHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcEltYWdlLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGA7XG4gICAgc2hpcEltYWdlLnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgICBwbGF5ZXJCb2FyZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9KTtcbiAgcmVuZGVyR2FtZWJvYXJkKGBwbGF5ZXJgKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyUGxheWVyU2hpcHMoZmxlZXQpIHtcbiAgY29uc29sZS5sb2coZmxlZXRbMF0uc2hpcFBsYWNlbWVudCk7XG4gIGlmICghZmxlZXRbMF0uc2hpcFBsYWNlbWVudCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBmbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYHNoaXBzLXJlbmRlcmVkYCk7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgaWYgKHNoaXBPYmplY3QubmFtZSA9PT0gYFBhdHJvbCBCb2F0YCkge1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy9wYXRyb2wucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBwYXRyb2xgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwT2JqZWN0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvJHtzaGlwTmFtZX0ucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXBOYW1lfWApO1xuICAgIH1cbiAgICBzaGlwSW1hZ2Uuc3JjID0gaW1nU3JjO1xuXG4gICAgY29uc3Qgc29ydEFzY2VuZGluZyA9IHNoaXBPYmplY3Quc2hpcFBsYWNlbWVudC5zb3J0KCh4LCB5KSA9PiB4IC0geSk7XG4gICAgY29uc3QgZGltZW5zaW9uT2ZTcXVhcmUgPSAzNTtcbiAgICBsZXQgdG9wT2Zmc2V0O1xuICAgIGxldCBsZWZ0T2Zmc2V0O1xuICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdICsgMSA9PT0gc29ydEFzY2VuZGluZ1sxXSkge1xuICAgICAgLy8gcGxhY2UgaG9yaXpvbnRhbCBzaGlwc1xuICAgICAgdG9wT2Zmc2V0ID0gTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgLSAzNTA7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGxhY2UgdmVydGljYWwgc2hpcHNcbiAgICAgIHNoaXBJbWFnZS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKC05MGRlZylgO1xuICAgICAgdG9wT2Zmc2V0ID1cbiAgICAgICAgTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgK1xuICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1IC1cbiAgICAgICAgMzUwO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBJbWFnZS5zdHlsZS50b3AgPSBgJHt0b3BPZmZzZXR9cHhgO1xuICAgIHNoaXBJbWFnZS5zdHlsZS5sZWZ0ID0gYCR7bGVmdE9mZnNldH1weGA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gICAgY3B1Qm9hcmQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfSk7XG4gIC8vIHJlbmRlckdhbWVib2FyZChgY3B1YCk7XG59XG5cbmV4cG9ydCB7XG4gIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMsXG4gIHJlbmRlck1vdmUsXG4gIHJlbmRlckNvbXB1dGVyU2hpcHMsXG4gIHJlbmRlclBsYXllclNoaXBzLFxufTtcbiIsImNvbnN0IFNoaXBzID0gKCkgPT4ge1xuICBjb25zdCBmbGVldCA9IFtcbiAgICB7IG5hbWU6IGBDYXJyaWVyYCwgbGVuZ3RoOiA1LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYEJhdHRsZXNoaXBgLCBsZW5ndGg6IDQsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgRGVzdHJveWVyYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFN1Ym1hcmluZWAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBQYXRyb2wgQm9hdGAsIGxlbmd0aDogMiwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgXTtcblxuICBjb25zdCBoaXQgPSAoYXR0YWNrRGF0YSkgPT4ge1xuICAgIGNvbnN0IHNoaXBIaXQgPSBhdHRhY2tEYXRhWzBdO1xuICAgIGNvbnN0IGNvb3JkT2ZIaXQgPSBhdHRhY2tEYXRhWzFdO1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUpIHtcbiAgICAgICAgc2hpcC5oaXRzLnB1c2goY29vcmRPZkhpdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKHNoaXBIaXQpID0+IHtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lICYmIHNoaXAubGVuZ3RoID09PSBzaGlwLmhpdHMubGVuZ3RoKSB7XG4gICAgICAgIHNoaXAuaXNTdW5rID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4geyBmbGVldCwgaGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCB7IFNoaXBzIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHJlbmRlclBsYXllclNoaXBzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuXG4vLyAvLyAqKioqKioqKiogLS0tLS0gSEFSRCBDT0RJTkcgVEhFIENBUlJJRVIgRk9SIE5PVyAqKioqKioqICEhISEhISEhISEhJCQkJCQkJCQkJCQkJCQgLS0tLS0tLS1cblxuLy8gY29uc3QgcGxheWVyRmxlZXQgPSBbXTtcblxuLy8gY29uc3QgY3B1Qm9hcmRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdVNxdWFyZWApO1xuLy8gY29uc3QgcGxhY2VTaGlwc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGFjZS1zaGlwcy1jb250YWluZXJgKTtcbi8vIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNidG4tcm90YXRlLXNoaXBgKTtcbi8vIGNvbnN0IHNoaXBJbWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnNoaXBzLXRvLXBsYWNlYCk7XG5cbi8vIC8vIGhpZGVzIGFsbCBidXQgdGhlIGNhcnJpZXIgb24gcGFnZSBsb2FkXG4vLyBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuLy8gICBpZiAoaW5kZXggIT09IDApIHtcbi8vICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoYGhpZGUtc2hpcGApO1xuLy8gICB9XG4vLyB9KTtcblxuLy8gcm90YXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcm90YXRlU2hpcCk7XG5cbi8vIGZ1bmN0aW9uIHJvdGF0ZVNoaXAoZSkge1xuLy8gICBzaGlwSW1ncy5mb3JFYWNoKChpbWFnZSkgPT4ge1xuLy8gICAgIGlmICghaW1hZ2Uuc3R5bGUucm90YXRlKSB7XG4vLyAgICAgICBpbWFnZS5zdHlsZS5yb3RhdGUgPSBgLTkwZGVnYDtcbi8vICAgICAgIGltYWdlLnN0eWxlLnRvcCA9IDMwICsgKCg1IC0gMSkgLyAyKSAqIDM1ICsgYHB4YDtcbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgaW1hZ2Uuc3R5bGUucm90YXRlID0gYGA7XG4vLyAgICAgICBpbWFnZS5zdHlsZS50b3AgPSAzMCArIGBweGA7XG4vLyAgICAgfVxuLy8gICB9KTtcbi8vIH1cblxuLy8gY29uc3QgY2FycmllciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItY2FycmllcmApO1xuLy8gY29uc3QgY2FycmllckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjYXJyaWVyLWNvbnRhaW5lcmApO1xuLy8gY29uc29sZS5sb2coY2FycmllckNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4vLyBjb25zb2xlLmxvZyhjYXJyaWVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcblxuLy8gY2Fycmllci5vbm1vdXNlZG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuLy8gICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbi8vICAgLy8gKDEpIHByZXBhcmUgdG8gbW92ZSBlbGVtZW50OiBtYWtlIGFic29sdXRlIGFuZCBvbiB0b3AgYnkgei1pbmRleFxuLy8gICBjYXJyaWVyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuLy8gICBjYXJyaWVyLnN0eWxlLnpJbmRleCA9IDEwMDA7XG5cbi8vICAgLy8gbW92ZSBpdCBvdXQgb2YgYW55IGN1cnJlbnQgcGFyZW50cyBkaXJlY3RseSBpbnRvIGNwdUJvYXJkXG4vLyAgIGNhcnJpZXJDb250YWluZXIuYXBwZW5kKGNhcnJpZXIpO1xuXG4vLyAgIC8vIGNlbnRlcnMgdGhlIGN1cnNvciBpbiB0aGUgZmlyc3QgXCJzcXVhcmVcIiBvZiB0aGUgc2hpcCBpbWFnZVxuLy8gICBmdW5jdGlvbiBtb3ZlQXQocGFnZVgsIHBhZ2VZKSB7XG4vLyAgICAgaWYgKCFjYXJyaWVyLnN0eWxlLnJvdGF0ZSkge1xuLy8gICAgICAgY2Fycmllci5zdHlsZS5sZWZ0ID1cbi8vICAgICAgICAgcGFnZVggLSAoY2FycmllckNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54ICsgMTcuNSkgKyBcInB4XCI7XG4vLyAgICAgICBjYXJyaWVyLnN0eWxlLnRvcCA9XG4vLyAgICAgICAgIHBhZ2VZIC0gKGNhcnJpZXJDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSArIDE3LjUpICsgXCJweFwiO1xuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICBjYXJyaWVyLnN0eWxlLmxlZnQgPVxuLy8gICAgICAgICBwYWdlWCAtXG4vLyAgICAgICAgIChjYXJyaWVyQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggKyAoKDUgLSAxKSAvIDIpICogMzUpIC1cbi8vICAgICAgICAgMTcuNSArXG4vLyAgICAgICAgIFwicHhcIjtcbi8vICAgICAgIGNhcnJpZXIuc3R5bGUudG9wID1cbi8vICAgICAgICAgcGFnZVkgLVxuLy8gICAgICAgICAoY2FycmllckNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55IC0gKCg1IC0gMSkgLyAyKSAqIDM1KSAtXG4vLyAgICAgICAgIDE3LjUgK1xuLy8gICAgICAgICBcInB4XCI7XG4vLyAgICAgfVxuLy8gICB9XG5cbi8vICAgLy8gbW92ZSBvdXIgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNhcnJpZXIgdW5kZXIgdGhlIHBvaW50ZXJcbi8vICAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbi8vICAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZSB0aGF0IHdlJ3JlIGZseWluZyBvdmVyIHJpZ2h0IG5vd1xuLy8gICBsZXQgY3VycmVudERyb3BwYWJsZSA9IG51bGw7XG5cbi8vICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbi8vICAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcbi8vICAgICBjYXJyaWVyLmhpZGRlbiA9IHRydWU7XG4vLyAgICAgbGV0IGVsZW1CZWxvdyA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4vLyAgICAgY2Fycmllci5oaWRkZW4gPSBmYWxzZTtcblxuLy8gICAgIC8vIG1vdXNlbW92ZSBldmVudHMgbWF5IHRyaWdnZXIgb3V0IG9mIHRoZSB3aW5kb3cgKHdoZW4gdGhlIHNoaXAgaXMgZHJhZ2dlZCBvZmYtc2NyZWVuKVxuLy8gICAgIC8vIGlmIGNsaWVudFgvY2xpZW50WSBhcmUgb3V0IG9mIHRoZSB3aW5kb3csIHRoZW4gZWxlbWVudEZyb21Qb2ludCByZXR1cm5zIG51bGxcbi8vICAgICBpZiAoIWVsZW1CZWxvdykgcmV0dXJuO1xuXG4vLyAgICAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZXMgYXJlIGxhYmVsZWQgd2l0aCB0aGUgY2xhc3MgXCJkcm9wcGFibGVcIiAoY2FuIGJlIG90aGVyIGxvZ2ljKVxuLy8gICAgIGxldCBkcm9wcGFibGVCZWxvdyA9IGVsZW1CZWxvdy5jbG9zZXN0KFwiLmNwdVNxdWFyZVwiKTtcblxuLy8gICAgIGlmIChjdXJyZW50RHJvcHBhYmxlICE9IGRyb3BwYWJsZUJlbG93KSB7XG4vLyAgICAgICAvLyB3ZSdyZSBmbHlpbmcgaW4gb3Igb3V0Li4uXG4vLyAgICAgICAvLyBub3RlOiBib3RoIHZhbHVlcyBjYW4gYmUgbnVsbFxuLy8gICAgICAgLy8gICBjdXJyZW50RHJvcHBhYmxlPW51bGwgaWYgd2Ugd2VyZSBub3Qgb3ZlciBhIGRyb3BwYWJsZSBiZWZvcmUgdGhpcyBldmVudCAoZS5nIG92ZXIgYW4gZW1wdHkgc3BhY2UpXG4vLyAgICAgICAvLyAgIGRyb3BwYWJsZUJlbG93PW51bGwgaWYgd2UncmUgbm90IG92ZXIgYSBkcm9wcGFibGUgbm93LCBkdXJpbmcgdGhpcyBldmVudFxuXG4vLyAgICAgICBpZiAoY3VycmVudERyb3BwYWJsZSkge1xuLy8gICAgICAgICAvLyB0aGUgbG9naWMgdG8gcHJvY2VzcyBcImZseWluZyBvdXRcIiBvZiB0aGUgZHJvcHBhYmxlIChyZW1vdmUgaGlnaGxpZ2h0KVxuLy8gICAgICAgICBsZWF2ZURyb3BwYWJsZUFyZWEoY3VycmVudERyb3BwYWJsZSk7XG4vLyAgICAgICB9XG4vLyAgICAgICBjdXJyZW50RHJvcHBhYmxlID0gZHJvcHBhYmxlQmVsb3c7XG4vLyAgICAgICBpZiAoY3VycmVudERyb3BwYWJsZSkge1xuLy8gICAgICAgICAvLyB0aGUgbG9naWMgdG8gcHJvY2VzcyBcImZseWluZyBpblwiIG9mIHRoZSBkcm9wcGFibGVcbi8vICAgICAgICAgZW50ZXJEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgfVxuXG4vLyAgIGxldCBzaGlwQ29vcmRzO1xuLy8gICBmdW5jdGlvbiBlbnRlckRyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuLy8gICAgIHNoaXBDb29yZHMgPSBbXTtcbi8vICAgICAvLyBpZiAoZWxlbWVudCkge1xuLy8gICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbi8vICAgICBjb25zdCBtYXhIb3Jpem9udGFsID0gKE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKyAxKSAqIDEwO1xuLy8gICAgIGNvbnN0IG1heFZlcnRpY2FsID1cbi8vICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC1cbi8vICAgICAgIE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKiAxMCArXG4vLyAgICAgICA5MDtcbi8vICAgICBpZiAoIWNhcnJpZXIuc3R5bGUucm90YXRlICYmIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgNCA8IG1heEhvcml6b250YWwpIHtcbi8vICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4vLyAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXSkge1xuLy8gICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4vLyAgICAgICAgICAgICBcImdyZWVuXCI7XG4vLyAgICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICB9IGVsc2UgaWYgKFxuLy8gICAgICAgY2Fycmllci5zdHlsZS5yb3RhdGUgJiZcbi8vICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgNDAgPD0gbWF4VmVydGljYWxcbi8vICAgICApIHtcbi8vICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4vLyAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBdKSB7XG4vLyAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW1xuLy8gICAgICAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBcbi8vICAgICAgICAgICBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JlZW5cIjtcbi8vICAgICAgICAgICBzaGlwQ29vcmRzLnB1c2goaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTApO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICAgIC8vIH1cbi8vICAgICBjb25zb2xlLmxvZyhzaGlwQ29vcmRzKTtcbi8vICAgfVxuXG4vLyAgIGZ1bmN0aW9uIGxlYXZlRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4vLyAgICAgc2hpcENvb3JkcyA9IFtdO1xuLy8gICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbi8vICAgICBpZiAoIWNhcnJpZXIuc3R5bGUucm90YXRlKSB7XG4vLyAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuLy8gICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbi8vICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuLy8gICAgICAgICAgICAgXCJncmF5XCI7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbi8vICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbi8vICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4vLyAgICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuLy8gICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmF5XCI7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH1cblxuLy8gICAvLyAoMikgbW92ZSB0aGUgY2FycmllciBvbiBtb3VzZW1vdmVcbi8vICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG5cbi8vICAgLy8gKDMpIGRyb3AgdGhlIGNhcnJpZXIsIHJlbW92ZSB1bm5lZWRlZCBoYW5kbGVyc1xuLy8gICBjYXJyaWVyLm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbi8vICAgICBjYXJyaWVyLm9ubW91c2V1cCA9IG51bGw7XG4vLyAgICAgcm90YXRlQnRuLnN0eWxlLmRpc3BsYXkgPSBgYDtcbi8vICAgICBjb25zb2xlLmxvZyhzaGlwQ29vcmRzKTtcbi8vICAgICBpZiAoc2hpcENvb3Jkcykge1xuLy8gICAgICAgcGxheWVyRmxlZXQucHVzaCh7XG4vLyAgICAgICAgIG5hbWU6IGBDYXJyaWVyYCxcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudDogc2hpcENvb3Jkcyxcbi8vICAgICAgIH0pO1xuLy8gICAgICAgY2FycmllckNvbnRhaW5lci5yZW1vdmVDaGlsZChjYXJyaWVyKTtcbi8vICAgICAgIGNvbnNvbGUubG9nKHBsYXllckZsZWV0KTtcbi8vICAgICAgIHJlbmRlclBsYXllclNoaXBzKHBsYXllckZsZWV0KTtcbi8vICAgICAgIGNwdUJvYXJkU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbi8vICAgICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGBncmF5YDtcbi8vICAgICAgIH0pO1xuLy8gICAgICAgY29uc29sZS5sb2coc2hpcEltZ3NbMV0pO1xuLy8gICAgICAgc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCwgaW5kZXgpID0+IHtcbi8vICAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xuLy8gICAgICAgICBpZiAoaW5kZXggPT09IHBsYXllckZsZWV0Lmxlbmd0aCkge1xuLy8gICAgICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShgaGlkZS1zaGlwYCk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0pO1xuLy8gICAgIH1cbi8vICAgfTtcbi8vIH07XG5cbi8vIGNhcnJpZXIub25kcmFnc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4vLyAgIHJldHVybiBmYWxzZTtcbi8vIH07XG5cbi8vIC8vIC8vIGhhcmQtY29kZWQgaW5zdGFudGlhdGlvbiBvZiBwbGF5ZXJGbGVldFxuLy8gLy8gY29uc3QgcGxheWVyRmxlZXQgPSBbXG4vLyAvLyAgIHsgbmFtZTogXCJDYXJyaWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFsxLCAyLCAzLCA0LCA1XSB9LFxuLy8gLy8gICB7IG5hbWU6IFwiQmF0dGxlc2hpcFwiLCBzaGlwUGxhY2VtZW50OiBbMTAsIDExLCAxMiwgMTNdIH0sXG4vLyAvLyAgIHsgbmFtZTogXCJEZXN0cm95ZXJcIiwgc2hpcFBsYWNlbWVudDogWzc3LCA4NywgOTddIH0sXG4vLyAvLyAgIHsgbmFtZTogXCJTdWJtYXJpbmVcIiwgc2hpcFBsYWNlbWVudDogWzQwLCA1MCwgNjBdIH0sXG4vLyAvLyAgIHsgbmFtZTogXCJQYXRyb2wgQm9hdFwiLCBzaGlwUGxhY2VtZW50OiBbNTgsIDU5XSB9LFxuLy8gLy8gXTtcblxuLy8gQVNPRklKQVNPRklBSlNPRklBSlNPRkFJU0pGT0FTSUZKT0FTSUZKQU9TSUZKQU9TSUZKQVNPRklKQVNPRkFJU0pGT0FTSUZKQU9TRklKQU9TSUZKQVNPRklKQVNPRklBU0pGT0FTSUpGQU9TSUZKQU9TRklKQVNPaUZKQVxuXG4vLyAqKioqKioqKiogLS0tLS0gSEFSRCBDT0RJTkcgVEhFIENBUlJJRVIgRk9SIE5PVyAqKioqKioqICEhISEhISEhISEhJCQkJCQkJCQkJCQkJCQgLS0tLS0tLS1cblxuY29uc3QgcGxheWVyRmxlZXQgPSBbXTtcbmNvbnN0IHNoaXBOYW1lcyA9IFtcbiAgYENhcnJpZXJgLFxuICBgQmF0dGxlc2hpcGAsXG4gIGBEZXN0cm95ZXJgLFxuICBgU3VibWFyaW5lYCxcbiAgYFBhdHJvbCBCb2F0YCxcbl07XG5jb25zdCBzaGlwTGVuZ3RocyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuY29uc3QgY3B1Qm9hcmRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdVNxdWFyZWApO1xuY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2J0bi1yb3RhdGUtc2hpcGApO1xuY29uc3Qgc2hpcEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcblxuLy8gaGlkZXMgYWxsIGJ1dCB0aGUgY2FycmllciBvbiBwYWdlIGxvYWRcbnNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4gIGlmIChpbmRleCAhPT0gMCkge1xuICAgIHNoaXAuY2xhc3NMaXN0LmFkZChgaGlkZS1zaGlwYCk7XG4gIH1cbn0pO1xuXG5yb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCByb3RhdGVTaGlwKTtcblxuZnVuY3Rpb24gcm90YXRlU2hpcChlKSB7XG4gIHNoaXBJbWdzLmZvckVhY2goKGltYWdlKSA9PiB7XG4gICAgaWYgKCFpbWFnZS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgIGltYWdlLnN0eWxlLnJvdGF0ZSA9IGAtOTBkZWdgO1xuICAgICAgaW1hZ2Uuc3R5bGUudG9wID0gMzAgKyAoKHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXSAtIDEpIC8gMikgKiAzNSArIGBweGA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGltYWdlLnN0eWxlLnJvdGF0ZSA9IGBgO1xuICAgICAgaW1hZ2Uuc3R5bGUudG9wID0gMzAgKyBgcHhgO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIGNvbnN0IGNhcnJpZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWNhcnJpZXJgKTtcbi8vIGNvbnN0IGNhcnJpZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY2Fycmllci1jb250YWluZXJgKTtcbmNvbnN0IHBsYXllclNoaXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgYC5wbGF5ZXItc2hpcHMtY29udGFpbmVyYFxuKTtcblxuLy8gY29uc29sZS5sb2coY2FycmllckNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4vLyBjb25zb2xlLmxvZyhjYXJyaWVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcblxubGV0IHNoaXBzUGxhY2VkID0gMDtcblxuc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoYG1vdXNlZG93bmAsIGJlZ2luU2hpcFBsYWNlbWVudCk7XG4gIHNoaXAub25kcmFnc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGJlZ2luU2hpcFBsYWNlbWVudChldmVudCkge1xuICBjb25zb2xlLmxvZyhzaGlwSW1nc1tzaGlwc1BsYWNlZF0pO1xuICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgLy8gKDEpIHByZXBhcmUgdG8gbW92ZSBlbGVtZW50OiBtYWtlIGFic29sdXRlIGFuZCBvbiB0b3AgYnkgei1pbmRleFxuICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS56SW5kZXggPSAxMDAwO1xuXG4gIC8vIG1vdmUgaXQgb3V0IG9mIGFueSBjdXJyZW50IHBhcmVudHMgZGlyZWN0bHkgaW50byBjcHVCb2FyZFxuICBwbGF5ZXJTaGlwQ29udGFpbmVyc1tzaGlwc1BsYWNlZF0uYXBwZW5kKHNoaXBJbWdzW3NoaXBzUGxhY2VkXSk7XG5cbiAgLy8gY2VudGVycyB0aGUgY3Vyc29yIGluIHRoZSBmaXJzdCBcInNxdWFyZVwiIG9mIHRoZSBzaGlwIGltYWdlXG4gIGZ1bmN0aW9uIG1vdmVBdChwYWdlWCwgcGFnZVkpIHtcbiAgICBpZiAoIXNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgcGFnZVggLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggKyAxNy41KSArXG4gICAgICAgIFwicHhcIjtcbiAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS50b3AgPVxuICAgICAgICBwYWdlWSAtXG4gICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1tzaGlwc1BsYWNlZF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSArIDE3LjUpICtcbiAgICAgICAgXCJweFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUubGVmdCA9XG4gICAgICAgIHBhZ2VYIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54ICtcbiAgICAgICAgICAoKHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXSAtIDEpIC8gMikgKiAzNSkgLVxuICAgICAgICAxNy41ICtcbiAgICAgICAgXCJweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnRvcCA9XG4gICAgICAgIHBhZ2VZIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55IC1cbiAgICAgICAgICAoKHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXSAtIDEpIC8gMikgKiAzNSkgLVxuICAgICAgICAxNy41ICtcbiAgICAgICAgXCJweFwiO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1vdmUgb3VyIGFic29sdXRlbHkgcG9zaXRpb25lZCBjYXJyaWVyIHVuZGVyIHRoZSBwb2ludGVyXG4gIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuXG4gIC8vIHBvdGVudGlhbCBkcm9wcGFibGUgdGhhdCB3ZSdyZSBmbHlpbmcgb3ZlciByaWdodCBub3dcbiAgbGV0IGN1cnJlbnREcm9wcGFibGUgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG4gICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLmhpZGRlbiA9IHRydWU7XG4gICAgbGV0IGVsZW1CZWxvdyA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLmhpZGRlbiA9IGZhbHNlO1xuXG4gICAgLy8gbW91c2Vtb3ZlIGV2ZW50cyBtYXkgdHJpZ2dlciBvdXQgb2YgdGhlIHdpbmRvdyAod2hlbiB0aGUgc2hpcCBpcyBkcmFnZ2VkIG9mZi1zY3JlZW4pXG4gICAgLy8gaWYgY2xpZW50WC9jbGllbnRZIGFyZSBvdXQgb2YgdGhlIHdpbmRvdywgdGhlbiBlbGVtZW50RnJvbVBvaW50IHJldHVybnMgbnVsbFxuICAgIGlmICghZWxlbUJlbG93KSByZXR1cm47XG5cbiAgICAvLyBwb3RlbnRpYWwgZHJvcHBhYmxlcyBhcmUgbGFiZWxlZCB3aXRoIHRoZSBjbGFzcyBcImRyb3BwYWJsZVwiIChjYW4gYmUgb3RoZXIgbG9naWMpXG4gICAgbGV0IGRyb3BwYWJsZUJlbG93ID0gZWxlbUJlbG93LmNsb3Nlc3QoXCIuY3B1U3F1YXJlXCIpO1xuXG4gICAgaWYgKGN1cnJlbnREcm9wcGFibGUgIT0gZHJvcHBhYmxlQmVsb3cpIHtcbiAgICAgIC8vIHdlJ3JlIGZseWluZyBpbiBvciBvdXQuLi5cbiAgICAgIC8vIG5vdGU6IGJvdGggdmFsdWVzIGNhbiBiZSBudWxsXG4gICAgICAvLyAgIGN1cnJlbnREcm9wcGFibGU9bnVsbCBpZiB3ZSB3ZXJlIG5vdCBvdmVyIGEgZHJvcHBhYmxlIGJlZm9yZSB0aGlzIGV2ZW50IChlLmcgb3ZlciBhbiBlbXB0eSBzcGFjZSlcbiAgICAgIC8vICAgZHJvcHBhYmxlQmVsb3c9bnVsbCBpZiB3ZSdyZSBub3Qgb3ZlciBhIGRyb3BwYWJsZSBub3csIGR1cmluZyB0aGlzIGV2ZW50XG5cbiAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlKSB7XG4gICAgICAgIC8vIHRoZSBsb2dpYyB0byBwcm9jZXNzIFwiZmx5aW5nIG91dFwiIG9mIHRoZSBkcm9wcGFibGUgKHJlbW92ZSBoaWdobGlnaHQpXG4gICAgICAgIGxlYXZlRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnREcm9wcGFibGUgPSBkcm9wcGFibGVCZWxvdztcbiAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlKSB7XG4gICAgICAgIC8vIHRoZSBsb2dpYyB0byBwcm9jZXNzIFwiZmx5aW5nIGluXCIgb2YgdGhlIGRyb3BwYWJsZVxuICAgICAgICBlbnRlckRyb3BwYWJsZUFyZWEoY3VycmVudERyb3BwYWJsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbGV0IHNoaXBDb29yZHM7XG4gIGZ1bmN0aW9uIGVudGVyRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4gICAgc2hpcENvb3JkcyA9IFtdO1xuICAgIC8vIGlmIChlbGVtZW50KSB7XG4gICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICAgIGNvbnN0IG1heEhvcml6b250YWwgPSAoTWF0aC5mbG9vcihpbmRleE9mSW5pdGlhbERyb3BQb2ludCAvIDEwKSArIDEpICogMTA7XG4gICAgY29uc3QgbWF4VmVydGljYWwgPVxuICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLVxuICAgICAgTWF0aC5mbG9vcihpbmRleE9mSW5pdGlhbERyb3BQb2ludCAvIDEwKSAqIDEwICtcbiAgICAgIDkwO1xuICAgIGlmIChcbiAgICAgICFzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlICYmXG4gICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIChzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF0gLSAxKSA8IG1heEhvcml6b250YWxcbiAgICApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldKSB7XG4gICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbiAgICAgICAgICAgIFwiZ3JlZW5cIjtcbiAgICAgICAgICBzaGlwQ29vcmRzLnB1c2goaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlICYmXG4gICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXSAqIDEwIDw9IG1heFZlcnRpY2FsXG4gICAgKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXTsgaSsrKSB7XG4gICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBdKSB7XG4gICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW1xuICAgICAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBcbiAgICAgICAgICBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JlZW5cIjtcbiAgICAgICAgICBzaGlwQ29vcmRzLnB1c2goaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIH1cbiAgICBjb25zb2xlLmxvZyhzaGlwQ29vcmRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYXZlRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4gICAgc2hpcENvb3JkcyA9IFtdO1xuICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICBpZiAoIXNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldKSB7XG4gICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbiAgICAgICAgICAgIFwiZ3JheVwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmF5XCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyAoMikgbW92ZSB0aGUgY2FycmllciBvbiBtb3VzZW1vdmVcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG5cbiAgLy8gKDMpIGRyb3AgdGhlIGNhcnJpZXIsIHJlbW92ZSB1bm5lZWRlZCBoYW5kbGVyc1xuICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0ub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5vbm1vdXNldXAgPSBudWxsO1xuICAgIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYGA7XG4gICAgY29uc29sZS5sb2coc2hpcENvb3Jkcyk7XG4gICAgaWYgKHNoaXBDb29yZHMpIHtcbiAgICAgIHBsYXllckZsZWV0LnB1c2goe1xuICAgICAgICBuYW1lOiBzaGlwTmFtZXNbc2hpcHNQbGFjZWRdLFxuICAgICAgICBzaGlwUGxhY2VtZW50OiBzaGlwQ29vcmRzLFxuICAgICAgfSk7XG4gICAgICBwbGF5ZXJTaGlwQ29udGFpbmVyc1tzaGlwc1BsYWNlZF0ucmVtb3ZlQ2hpbGQoc2hpcEltZ3Nbc2hpcHNQbGFjZWRdKTtcbiAgICAgIGNvbnNvbGUubG9nKHBsYXllckZsZWV0KTtcbiAgICAgIHJlbmRlclBsYXllclNoaXBzKHBsYXllckZsZWV0KTtcbiAgICAgIGNwdUJvYXJkU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbiAgICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGBncmF5YDtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coc2hpcEltZ3NbMV0pO1xuICAgICAgc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xuICAgICAgICBpZiAoaW5kZXggPT09IHBsYXllckZsZWV0Lmxlbmd0aCkge1xuICAgICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShgaGlkZS1zaGlwYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2hpcHNQbGFjZWQgKz0gMTtcbiAgICB9XG4gIH07XG59XG5cbi8vIC8vIGhhcmQtY29kZWQgaW5zdGFudGlhdGlvbiBvZiBwbGF5ZXJGbGVldFxuLy8gY29uc3QgcGxheWVyRmxlZXQgPSBbXG4vLyAgIHsgbmFtZTogXCJDYXJyaWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFsxLCAyLCAzLCA0LCA1XSB9LFxuLy8gICB7IG5hbWU6IFwiQmF0dGxlc2hpcFwiLCBzaGlwUGxhY2VtZW50OiBbMTAsIDExLCAxMiwgMTNdIH0sXG4vLyAgIHsgbmFtZTogXCJEZXN0cm95ZXJcIiwgc2hpcFBsYWNlbWVudDogWzc3LCA4NywgOTddIH0sXG4vLyAgIHsgbmFtZTogXCJTdWJtYXJpbmVcIiwgc2hpcFBsYWNlbWVudDogWzQwLCA1MCwgNjBdIH0sXG4vLyAgIHsgbmFtZTogXCJQYXRyb2wgQm9hdFwiLCBzaGlwUGxhY2VtZW50OiBbNTgsIDU5XSB9LFxuLy8gXTtcbiJdLCJzb3VyY2VSb290IjoiIn0=