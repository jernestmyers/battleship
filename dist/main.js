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
  console.log(!fleet[0].shipPlacement);
  console.log(fleet[0].shipPlacement);
  console.log(fleet[0].shipPlacement[0] === undefined);
  if (fleet[0].shipPlacement[0] === undefined) {
    console.log(`here`);
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
      30 + ((shipLengths[shipsPlaced] - 1) / 2) * 35 + `px`;
  } else {
    shipImgs[shipsPlaced].style.rotate = ``;
    shipImgs[shipsPlaced].style.top = 30 + `px`;
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
  let droppableBelow = null;

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    shipImgs[shipsPlaced].hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    shipImgs[shipsPlaced].hidden = false;

    // mousemove events may trigger out of the window (when the ship is dragged off-screen)
    // if clientX/clientY are out of the window, then elementFromPoint returns null
    if (!elemBelow) return;

    // potential droppables are labeled with the class "droppable" (can be other logic)
    droppableBelow = elemBelow.closest(".cpuSquare");
    console.log(droppableBelow);

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
      console.log(shipImgs[1]);
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
      shipImgs[shipsPlaced].style.top = "30px";
      shipImgs[shipsPlaced].style.left = "0px";
      shipImgs[shipsPlaced].style.zIndex = 0;
      shipImgs[shipsPlaced].style.cursor = `grab`;
    }
    rotateBtn.style.display = ``;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcmVuZGVyR2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkU7QUFDRzs7QUFFOUU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHLGtEQUFrRDtBQUNyRCxHQUFHLHNEQUFzRDtBQUN6RCxHQUFHLGlEQUFpRDtBQUNwRCxHQUFHLGlEQUFpRDtBQUNwRCxHQUFHLCtDQUErQztBQUNsRDtBQUNBLG9CQUFvQixxREFBUzs7QUFFN0Isc0JBQXNCLDhEQUFrQjtBQUN4QyxzQkFBc0IscURBQVM7O0FBRS9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsY0FBYztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUyxrREFBa0Q7QUFDM0QsU0FBUyxzREFBc0Q7QUFDL0QsU0FBUyxpREFBaUQ7QUFDMUQsU0FBUyxpREFBaUQ7QUFDMUQsU0FBUywrQ0FBK0M7QUFDeEQ7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsOEJBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw4QkFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsOEJBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wscUJBQXFCLDhCQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsTUFBTSw4REFBaUI7QUFDdkI7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sa0RBQWtEO0FBQ3hELE1BQU0sc0RBQXNEO0FBQzVELE1BQU0saURBQWlEO0FBQ3ZELE1BQU0saURBQWlEO0FBQ3ZELE1BQU0sK0NBQStDO0FBQ3JEIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHYW1lYm9hcmQsIHBsYWNlQ29tcHV0ZXJGbGVldCwgcmVjZWl2ZUF0dGFjayB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IHsgcmVuZGVyTW92ZSwgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcblxuY29uc3Qgc3RvcmVkR2FtZWJvYXJkcyA9IFtdO1xuXG5sZXQgdHVybkNvdW50ZXIgPSAxO1xuZnVuY3Rpb24gdHVybkRyaXZlcigpIHtcbiAgbGV0IHdob3NlTW92ZTtcbiAgaWYgKHR1cm5Db3VudGVyICUgMiAhPT0gMCkge1xuICAgIHdob3NlTW92ZSA9IGBwbGF5ZXJgO1xuICB9IGVsc2Uge1xuICAgIHdob3NlTW92ZSA9IGBjb21wdXRlcmA7XG4gIH1cbiAgdHVybkNvdW50ZXIgKz0gMTtcbiAgcmV0dXJuIHdob3NlTW92ZTtcbn1cblxuLy8gaGFyZC1jb2RlZCBpbnN0YW50aWF0aW9uIG9mIHBsYXllckZsZWV0XG5jb25zdCBwbGF5ZXJGbGVldCA9IFtcbiAgeyBuYW1lOiBcIkNhcnJpZXJcIiwgc2hpcFBsYWNlbWVudDogWzEsIDIsIDMsIDQsIDVdIH0sXG4gIHsgbmFtZTogXCJCYXR0bGVzaGlwXCIsIHNoaXBQbGFjZW1lbnQ6IFsxMCwgMTEsIDEyLCAxM10gfSxcbiAgeyBuYW1lOiBcIkRlc3Ryb3llclwiLCBzaGlwUGxhY2VtZW50OiBbNzcsIDg3LCA5N10gfSxcbiAgeyBuYW1lOiBcIlN1Ym1hcmluZVwiLCBzaGlwUGxhY2VtZW50OiBbNDAsIDUwLCA2MF0gfSxcbiAgeyBuYW1lOiBcIlBhdHJvbCBCb2F0XCIsIHNoaXBQbGFjZW1lbnQ6IFs1OCwgNTldIH0sXG5dO1xuY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lYm9hcmQocGxheWVyRmxlZXQpO1xuXG5jb25zdCBjb21wdXRlckZsZWV0ID0gcGxhY2VDb21wdXRlckZsZWV0KCk7XG5jb25zdCBjb21wdXRlckJvYXJkID0gR2FtZWJvYXJkKGNvbXB1dGVyRmxlZXQpO1xuXG5zdG9yZWRHYW1lYm9hcmRzLnB1c2goW2BwbGF5ZXJgLCBjb21wdXRlckJvYXJkXSk7XG5zdG9yZWRHYW1lYm9hcmRzLnB1c2goW2Bjb21wdXRlcmAsIHBsYXllckJvYXJkXSk7XG5cbi8vIEJFR0lOIC0tLS0tIGdlbmVyYXRlcyByYW5kb20gbW92ZSBmb3IgY29tcHV0ZXIgLS0tLS0tLS0tLS0gLy9cbmZ1bmN0aW9uIGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpIHtcbiAgY29uc3QgdmFsaWRNb3ZlcyA9IFtdO1xuICBjb25zdCBtYXhNb3ZlcyA9IDEwMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhNb3ZlczsgaSsrKSB7XG4gICAgdmFsaWRNb3Zlcy5wdXNoKGkpO1xuICB9XG4gIHJldHVybiB2YWxpZE1vdmVzO1xufVxuXG5jb25zdCBnZXRWYWxpZE1vdmVzID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG5jb25zdCBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCkge1xuICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdldFZhbGlkTW92ZXMubGVuZ3RoKTtcbiAgY29uc3QgcmFuZG9tTW92ZSA9IGdldFZhbGlkTW92ZXNbcmFuZG9tSW5kZXhdO1xuICBnZXRWYWxpZE1vdmVzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gIHJldHVybiByYW5kb21Nb3ZlO1xufVxuLy8gRU5EIC0tLS0tIGdlbmVyYXRlcyByYW5kb20gbW92ZSBmb3IgY29tcHV0ZXIgLS0tLS0tLS0tLS0gLy9cblxuZnVuY3Rpb24gZ2FtZUxvb3AocGxheWVyTW92ZSkge1xuICBsZXQgZ2V0VHVybjtcbiAgbGV0IGNvb3JkT2ZBdHRhY2s7XG4gIGxldCBpc0dhbWVPdmVyID0gZmFsc2U7XG4gIGNvbnN0IGluZGV4VG9TcGxpY2UgPSBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZy5maW5kSW5kZXgoXG4gICAgKGluZGV4KSA9PiBpbmRleCA9PT0gcGxheWVyTW92ZVxuICApO1xuICBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZy5zcGxpY2UoaW5kZXhUb1NwbGljZSwgMSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XG4gICAgICBnZXRUdXJuID0gdHVybkRyaXZlcigpO1xuICAgICAgaWYgKGdldFR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgICAgIGNvb3JkT2ZBdHRhY2sgPSBwbGF5ZXJNb3ZlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRPZkF0dGFjayA9IGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF0dGFja091dGNvbWUgPSByZWNlaXZlQXR0YWNrKGNvb3JkT2ZBdHRhY2ssIGdldFR1cm4pO1xuICAgICAgcmVuZGVyTW92ZShnZXRUdXJuLCBhdHRhY2tPdXRjb21lKTtcbiAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgICAgIHN0b3JlZEdhbWVib2FyZHMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW1bMF0gPT09IGdldFR1cm4pIHtcbiAgICAgICAgICAgIGlzR2FtZU92ZXIgPSBpdGVtWzFdLmlzR2FtZU92ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGlzR2FtZU92ZXIpIHtcbiAgICAgICAgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyk7XG4gICAgICAgIGFsZXJ0KGBnYW1lIG92ZXIhICR7Z2V0VHVybn0gd2lucyFgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgc3RvcmVkR2FtZWJvYXJkcywgZ2FtZUxvb3AgfTtcbiIsImltcG9ydCB7IFNoaXBzIH0gZnJvbSBcIi4vc2hpcE1vZHVsZVwiO1xuaW1wb3J0IHsgc3RvcmVkR2FtZWJvYXJkcyB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyByZW5kZXJDb21wdXRlclNoaXBzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuXG5jb25zdCBHYW1lYm9hcmQgPSAoZmxlZXRBcnJheSkgPT4ge1xuICBjb25zdCBnYW1lYm9hcmQgPSBbXG4gICAgZmxlZXRBcnJheVswXSxcbiAgICBmbGVldEFycmF5WzFdLFxuICAgIGZsZWV0QXJyYXlbMl0sXG4gICAgZmxlZXRBcnJheVszXSxcbiAgICBmbGVldEFycmF5WzRdLFxuICBdO1xuICBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBTaGlwcygpO1xuXG4gIGNvbnN0IGlzR2FtZU92ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBzaGlwcy5mbGVldDtcbiAgICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgIGxldCBzaGlwc1N1bmtDb3VudGVyID0gMDtcblxuICAgIGFycmF5LmZpbHRlcigob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLmlzU3Vuaykge1xuICAgICAgICBzaGlwc1N1bmtDb3VudGVyICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHNoaXBzU3Vua0NvdW50ZXIgPT09IDUpIHtcbiAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNHYW1lT3ZlcjtcbiAgfTtcblxuICByZXR1cm4geyBnYW1lYm9hcmQsIG1pc3Nlcywgc2hpcHMsIGlzR2FtZU92ZXIgfTtcbn07XG5cbi8vIEJFR0lOLS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgY29tcHV0ZXIgLS0tLS0tLSAvL1xuY29uc3QgY29tcHV0ZXJGbGVldCA9IFtdO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpIHtcbiAgY29uc3QgbnVtYmVyT2ZDb29yZGluYXRlcyA9IDEwMDtcbiAgY29uc3Qgb3JpZW50YXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgY29uc3QgZmlyc3RDb29yZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bWJlck9mQ29vcmRpbmF0ZXMpO1xuICByZXR1cm4gW29yaWVudGF0aW9uLCBmaXJzdENvb3JkXTtcbn1cblxuZnVuY3Rpb24gb3JpZW50U2hpcChzdGFydENvb3JkLCBvcmllbnRhdGlvbiwgbmFtZSwgbGVuZ3RoKSB7XG4gIGxldCBzaGlwUGxhY2VtZW50ID0gW107XG4gIGxldCBob3Jpem9udGFsTGltaXQ7XG4gIGlmIChzdGFydENvb3JkIDwgMTApIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSA5O1xuICB9IGVsc2Uge1xuICAgIGhvcml6b250YWxMaW1pdCA9ICsoc3RhcnRDb29yZC50b1N0cmluZygpLmNoYXJBdCgwKSArIDkpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3JpZW50YXRpb24pIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpICogMTAgPCAxMDApIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpICogMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpICogMTApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSA8PSBob3Jpem9udGFsTGltaXQpIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7IG5hbWUsIHNoaXBQbGFjZW1lbnQgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5Q29vcmRzKG9iamVjdCkge1xuICBjb25zdCBzaGlwVG9WZXJpZnkgPSBvYmplY3Quc2hpcFBsYWNlbWVudDtcbiAgbGV0IGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgaWYgKCFjb21wdXRlckZsZWV0Lmxlbmd0aCkge1xuICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xuICB9IGVsc2Uge1xuICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFRvVmVyaWZ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wdXRlckZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgICBpZiAoaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLnNoaXBQbGFjZW1lbnQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNoaXBUb1ZlcmlmeVtpXSAhPT0gc2hpcC5zaGlwUGxhY2VtZW50W2pdKSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG59XG5cbi8vIHVzZWQgZm9yIHRoZSBuYW1lIGFuZCBsZW5ndGggcHJvcHMgaW4gdGhlIHBsYWNlQ29tcHV0ZXJGbGVldCBmeG5cbmNvbnN0IHNoaXBDbG9uZSA9IFNoaXBzKCk7XG5cbmZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJGbGVldCgpIHtcbiAgc2hpcENsb25lLmZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuICAgIHdoaWxlICghaXNWYWxpZCkge1xuICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgY29uc3QgcmFuZG9tVmFsdWVzID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKTtcbiAgICAgIGNvbnN0IHBsYWNlbWVudCA9IG9yaWVudFNoaXAoXG4gICAgICAgIHJhbmRvbVZhbHVlc1sxXSxcbiAgICAgICAgcmFuZG9tVmFsdWVzWzBdLFxuICAgICAgICBzaGlwLm5hbWUsXG4gICAgICAgIHNoaXAubGVuZ3RoXG4gICAgICApO1xuICAgICAgY29uc3QgdmVyaWZ5ID0gdmVyaWZ5Q29vcmRzKHBsYWNlbWVudCk7XG4gICAgICBpZiAodmVyaWZ5KSB7XG4gICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICBjb21wdXRlckZsZWV0LnB1c2gocGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZW5kZXJDb21wdXRlclNoaXBzKGNvbXB1dGVyRmxlZXQpO1xuICByZXR1cm4gY29tcHV0ZXJGbGVldDtcbn1cbi8vIEVORC0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIGNvbXB1dGVyIC0tLS0tLS0gLy9cblxuY29uc3QgcmVjZWl2ZUF0dGFjayA9IChhdHRhY2tDb29yZCwgdXNlcikgPT4ge1xuICBsZXQgaW5kZXg7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIGF0dGFja0Nvb3JkXTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgaW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gMTtcbiAgfVxuICBjb25zdCBnYW1lYm9hcmRPYmplY3QgPSBzdG9yZWRHYW1lYm9hcmRzW2luZGV4XVsxXTtcbiAgZ2FtZWJvYXJkT2JqZWN0LmdhbWVib2FyZC5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICBpZiAob2JqZWN0LnNoaXBQbGFjZW1lbnQuaW5jbHVkZXMoYXR0YWNrQ29vcmQpKSB7XG4gICAgICBhdHRhY2tPdXRjb21lID0gW29iamVjdC5uYW1lLCBhdHRhY2tDb29yZF07XG4gICAgfVxuICB9KTtcbiAgaWYgKCFhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgZ2FtZWJvYXJkT2JqZWN0Lm1pc3Nlcy5wdXNoKGF0dGFja0Nvb3JkKTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lYm9hcmRPYmplY3Quc2hpcHMuaGl0KGF0dGFja091dGNvbWUpO1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5pc1N1bmsoYXR0YWNrT3V0Y29tZVswXSk7XG4gIH1cbiAgcmV0dXJuIGF0dGFja091dGNvbWU7XG59O1xuXG5leHBvcnQgeyBHYW1lYm9hcmQsIHBsYWNlQ29tcHV0ZXJGbGVldCwgcmVjZWl2ZUF0dGFjayB9O1xuIiwiaW1wb3J0IHsgZ2FtZUxvb3AgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuXG5mdW5jdGlvbiByZW5kZXJHYW1lYm9hcmQodXNlcikge1xuICBsZXQgYm9hcmREaXY7XG4gIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICB9IGVsc2Uge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICB9XG4gIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gIGJvYXJkLmNsYXNzTGlzdC5hZGQoYGdhbWVib2FyZGApO1xuICBjb25zdCBtYXhTcXVhcmVzID0gMTAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1heFNxdWFyZXM7IGkrKykge1xuICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIHNxdWFyZS50ZXh0Q29udGVudCA9IGk7XG4gICAgc3F1YXJlLmRhdGFzZXQuaW5kZXhOdW1iZXIgPSBpO1xuICAgIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYHBsYXllclNxdWFyZWApO1xuICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYGNwdVNxdWFyZWApO1xuICAgIH1cbiAgICBib2FyZC5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICB9XG4gIGJvYXJkRGl2LmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuY29uc3QgcGxheWVyQXR0YWNrID0gKGUpID0+IHtcbiAgY29uc3QgY29vcmRpbmF0ZUNsaWNrZWQgPSArZS50YXJnZXQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgZ2FtZUxvb3AoY29vcmRpbmF0ZUNsaWNrZWQpO1xuICBlLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG59O1xuXG4vLyByZW5kZXJHYW1lYm9hcmQoYHBsYXllcmApO1xucmVuZGVyR2FtZWJvYXJkKGBjcHVgKTtcblxuZnVuY3Rpb24gZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhhcnJheSkge1xuICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICBhcnJheS5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgIHNxdWFyZXNbaW5kZXhdLnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlck1vdmUod2hvc2VUdXJuLCBhdHRhY2tBcnJheSkge1xuICBsZXQgc3F1YXJlcztcbiAgY29uc3QgaGl0SW5kZXggPSBhdHRhY2tBcnJheVsxXTtcbiAgaWYgKHdob3NlVHVybiA9PT0gYHBsYXllcmApIHtcbiAgICBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICB9IGVsc2Uge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG4gIH1cbiAgaWYgKGF0dGFja0FycmF5WzBdKSB7XG4gICAgc3F1YXJlc1toaXRJbmRleF0uY2xhc3NMaXN0LmFkZChgaGl0YCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlc1toaXRJbmRleF0uY2xhc3NMaXN0LmFkZChgbWlzc2ApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckNvbXB1dGVyU2hpcHMoY3B1RmxlZXQpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gIGxldCBpbWdTcmM7XG5cbiAgY3B1RmxlZXQuZm9yRWFjaCgoc2hpcE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGBzaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLnNyYyA9IGltZ1NyYztcblxuICAgIGNvbnN0IHNvcnRBc2NlbmRpbmcgPSBzaGlwT2JqZWN0LnNoaXBQbGFjZW1lbnQuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuICAgIGNvbnN0IGRpbWVuc2lvbk9mU3F1YXJlID0gMzU7XG4gICAgbGV0IHRvcE9mZnNldDtcbiAgICBsZXQgbGVmdE9mZnNldDtcbiAgICBpZiAoc29ydEFzY2VuZGluZ1swXSArIDEgPT09IHNvcnRBc2NlbmRpbmdbMV0pIHtcbiAgICAgIC8vIHBsYWNlIGhvcml6b250YWwgc2hpcHNcbiAgICAgIHRvcE9mZnNldCA9IE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9ICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBsYWNlIHZlcnRpY2FsIHNoaXBzXG4gICAgICBzaGlwSW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgtOTBkZWcpYDtcbiAgICAgIHRvcE9mZnNldCA9XG4gICAgICAgIE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlICtcbiAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwSW1hZ2Uuc3R5bGUudG9wID0gYCR7dG9wT2Zmc2V0fXB4YDtcbiAgICBzaGlwSW1hZ2Uuc3R5bGUubGVmdCA9IGAke2xlZnRPZmZzZXR9cHhgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH0pO1xuICByZW5kZXJHYW1lYm9hcmQoYHBsYXllcmApO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQbGF5ZXJTaGlwcyhmbGVldCkge1xuICBjb25zb2xlLmxvZyghZmxlZXRbMF0uc2hpcFBsYWNlbWVudCk7XG4gIGNvbnNvbGUubG9nKGZsZWV0WzBdLnNoaXBQbGFjZW1lbnQpO1xuICBjb25zb2xlLmxvZyhmbGVldFswXS5zaGlwUGxhY2VtZW50WzBdID09PSB1bmRlZmluZWQpO1xuICBpZiAoZmxlZXRbMF0uc2hpcFBsYWNlbWVudFswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc29sZS5sb2coYGhlcmVgKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgY3B1Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gIGxldCBpbWdTcmM7XG5cbiAgZmxlZXQuZm9yRWFjaCgoc2hpcE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGBzaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLnNyYyA9IGltZ1NyYztcblxuICAgIGNvbnN0IHNvcnRBc2NlbmRpbmcgPSBzaGlwT2JqZWN0LnNoaXBQbGFjZW1lbnQuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuICAgIGNvbnN0IGRpbWVuc2lvbk9mU3F1YXJlID0gMzU7XG4gICAgbGV0IHRvcE9mZnNldDtcbiAgICBsZXQgbGVmdE9mZnNldDtcbiAgICBpZiAoc29ydEFzY2VuZGluZ1swXSArIDEgPT09IHNvcnRBc2NlbmRpbmdbMV0pIHtcbiAgICAgIC8vIHBsYWNlIGhvcml6b250YWwgc2hpcHNcbiAgICAgIHRvcE9mZnNldCA9IE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC0gMzUwO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9ICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBsYWNlIHZlcnRpY2FsIHNoaXBzXG4gICAgICBzaGlwSW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgtOTBkZWcpYDtcbiAgICAgIHRvcE9mZnNldCA9XG4gICAgICAgIE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlICtcbiAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNSAtXG4gICAgICAgIDM1MDtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwSW1hZ2Uuc3R5bGUudG9wID0gYCR7dG9wT2Zmc2V0fXB4YDtcbiAgICBzaGlwSW1hZ2Uuc3R5bGUubGVmdCA9IGAke2xlZnRPZmZzZXR9cHhgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICAgIGNwdUJvYXJkLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH0pO1xufVxuXG5leHBvcnQge1xuICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzLFxuICByZW5kZXJNb3ZlLFxuICByZW5kZXJDb21wdXRlclNoaXBzLFxuICByZW5kZXJQbGF5ZXJTaGlwcyxcbn07XG4iLCJjb25zdCBTaGlwcyA9ICgpID0+IHtcbiAgY29uc3QgZmxlZXQgPSBbXG4gICAgeyBuYW1lOiBgQ2FycmllcmAsIGxlbmd0aDogNSwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBCYXR0bGVzaGlwYCwgbGVuZ3RoOiA0LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYERlc3Ryb3llcmAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBTdWJtYXJpbmVgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgUGF0cm9sIEJvYXRgLCBsZW5ndGg6IDIsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gIF07XG5cbiAgY29uc3QgaGl0ID0gKGF0dGFja0RhdGEpID0+IHtcbiAgICBjb25zdCBzaGlwSGl0ID0gYXR0YWNrRGF0YVswXTtcbiAgICBjb25zdCBjb29yZE9mSGl0ID0gYXR0YWNrRGF0YVsxXTtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lKSB7XG4gICAgICAgIHNoaXAuaGl0cy5wdXNoKGNvb3JkT2ZIaXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9IChzaGlwSGl0KSA9PiB7XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSAmJiBzaGlwLmxlbmd0aCA9PT0gc2hpcC5oaXRzLmxlbmd0aCkge1xuICAgICAgICBzaGlwLmlzU3VuayA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgZmxlZXQsIGhpdCwgaXNTdW5rIH07XG59O1xuXG5leHBvcnQgeyBTaGlwcyB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyByZW5kZXJQbGF5ZXJTaGlwcyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcblxuLy8gLy8gKioqKioqKioqIC0tLS0tIEhBUkQgQ09ESU5HIFRIRSBDQVJSSUVSIEZPUiBOT1cgKioqKioqKiAhISEhISEhISEhISQkJCQkJCQkJCQkJCQkIC0tLS0tLS0tXG5cbi8vIGNvbnN0IHBsYXllckZsZWV0ID0gW107XG5cbi8vIGNvbnN0IGNwdUJvYXJkU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbi8vIGNvbnN0IHBsYWNlU2hpcHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxhY2Utc2hpcHMtY29udGFpbmVyYCk7XG4vLyBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjYnRuLXJvdGF0ZS1zaGlwYCk7XG4vLyBjb25zdCBzaGlwSW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuXG4vLyAvLyBoaWRlcyBhbGwgYnV0IHRoZSBjYXJyaWVyIG9uIHBhZ2UgbG9hZFxuLy8gc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCwgaW5kZXgpID0+IHtcbi8vICAgaWYgKGluZGV4ICE9PSAwKSB7XG4vLyAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKGBoaWRlLXNoaXBgKTtcbi8vICAgfVxuLy8gfSk7XG5cbi8vIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHJvdGF0ZVNoaXApO1xuXG4vLyBmdW5jdGlvbiByb3RhdGVTaGlwKGUpIHtcbi8vICAgc2hpcEltZ3MuZm9yRWFjaCgoaW1hZ2UpID0+IHtcbi8vICAgICBpZiAoIWltYWdlLnN0eWxlLnJvdGF0ZSkge1xuLy8gICAgICAgaW1hZ2Uuc3R5bGUucm90YXRlID0gYC05MGRlZ2A7XG4vLyAgICAgICBpbWFnZS5zdHlsZS50b3AgPSAzMCArICgoNSAtIDEpIC8gMikgKiAzNSArIGBweGA7XG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgIGltYWdlLnN0eWxlLnJvdGF0ZSA9IGBgO1xuLy8gICAgICAgaW1hZ2Uuc3R5bGUudG9wID0gMzAgKyBgcHhgO1xuLy8gICAgIH1cbi8vICAgfSk7XG4vLyB9XG5cbi8vIGNvbnN0IGNhcnJpZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWNhcnJpZXJgKTtcbi8vIGNvbnN0IGNhcnJpZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY2Fycmllci1jb250YWluZXJgKTtcbi8vIGNvbnNvbGUubG9nKGNhcnJpZXJDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuLy8gY29uc29sZS5sb2coY2Fycmllci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG5cbi8vIGNhcnJpZXIub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbi8vICAgcm90YXRlQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4vLyAgIC8vICgxKSBwcmVwYXJlIHRvIG1vdmUgZWxlbWVudDogbWFrZSBhYnNvbHV0ZSBhbmQgb24gdG9wIGJ5IHotaW5kZXhcbi8vICAgY2Fycmllci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbi8vICAgY2Fycmllci5zdHlsZS56SW5kZXggPSAxMDAwO1xuXG4vLyAgIC8vIG1vdmUgaXQgb3V0IG9mIGFueSBjdXJyZW50IHBhcmVudHMgZGlyZWN0bHkgaW50byBjcHVCb2FyZFxuLy8gICBjYXJyaWVyQ29udGFpbmVyLmFwcGVuZChjYXJyaWVyKTtcblxuLy8gICAvLyBjZW50ZXJzIHRoZSBjdXJzb3IgaW4gdGhlIGZpcnN0IFwic3F1YXJlXCIgb2YgdGhlIHNoaXAgaW1hZ2Vcbi8vICAgZnVuY3Rpb24gbW92ZUF0KHBhZ2VYLCBwYWdlWSkge1xuLy8gICAgIGlmICghY2Fycmllci5zdHlsZS5yb3RhdGUpIHtcbi8vICAgICAgIGNhcnJpZXIuc3R5bGUubGVmdCA9XG4vLyAgICAgICAgIHBhZ2VYIC0gKGNhcnJpZXJDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArIDE3LjUpICsgXCJweFwiO1xuLy8gICAgICAgY2Fycmllci5zdHlsZS50b3AgPVxuLy8gICAgICAgICBwYWdlWSAtIChjYXJyaWVyQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkgKyAxNy41KSArIFwicHhcIjtcbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgY2Fycmllci5zdHlsZS5sZWZ0ID1cbi8vICAgICAgICAgcGFnZVggLVxuLy8gICAgICAgICAoY2FycmllckNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54ICsgKCg1IC0gMSkgLyAyKSAqIDM1KSAtXG4vLyAgICAgICAgIDE3LjUgK1xuLy8gICAgICAgICBcInB4XCI7XG4vLyAgICAgICBjYXJyaWVyLnN0eWxlLnRvcCA9XG4vLyAgICAgICAgIHBhZ2VZIC1cbi8vICAgICAgICAgKGNhcnJpZXJDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSAtICgoNSAtIDEpIC8gMikgKiAzNSkgLVxuLy8gICAgICAgICAxNy41ICtcbi8vICAgICAgICAgXCJweFwiO1xuLy8gICAgIH1cbi8vICAgfVxuXG4vLyAgIC8vIG1vdmUgb3VyIGFic29sdXRlbHkgcG9zaXRpb25lZCBjYXJyaWVyIHVuZGVyIHRoZSBwb2ludGVyXG4vLyAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuXG4vLyAgIC8vIHBvdGVudGlhbCBkcm9wcGFibGUgdGhhdCB3ZSdyZSBmbHlpbmcgb3ZlciByaWdodCBub3dcbi8vICAgbGV0IGN1cnJlbnREcm9wcGFibGUgPSBudWxsO1xuXG4vLyAgIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4vLyAgICAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG4vLyAgICAgY2Fycmllci5oaWRkZW4gPSB0cnVlO1xuLy8gICAgIGxldCBlbGVtQmVsb3cgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuLy8gICAgIGNhcnJpZXIuaGlkZGVuID0gZmFsc2U7XG5cbi8vICAgICAvLyBtb3VzZW1vdmUgZXZlbnRzIG1heSB0cmlnZ2VyIG91dCBvZiB0aGUgd2luZG93ICh3aGVuIHRoZSBzaGlwIGlzIGRyYWdnZWQgb2ZmLXNjcmVlbilcbi8vICAgICAvLyBpZiBjbGllbnRYL2NsaWVudFkgYXJlIG91dCBvZiB0aGUgd2luZG93LCB0aGVuIGVsZW1lbnRGcm9tUG9pbnQgcmV0dXJucyBudWxsXG4vLyAgICAgaWYgKCFlbGVtQmVsb3cpIHJldHVybjtcblxuLy8gICAgIC8vIHBvdGVudGlhbCBkcm9wcGFibGVzIGFyZSBsYWJlbGVkIHdpdGggdGhlIGNsYXNzIFwiZHJvcHBhYmxlXCIgKGNhbiBiZSBvdGhlciBsb2dpYylcbi8vICAgICBsZXQgZHJvcHBhYmxlQmVsb3cgPSBlbGVtQmVsb3cuY2xvc2VzdChcIi5jcHVTcXVhcmVcIik7XG5cbi8vICAgICBpZiAoY3VycmVudERyb3BwYWJsZSAhPSBkcm9wcGFibGVCZWxvdykge1xuLy8gICAgICAgLy8gd2UncmUgZmx5aW5nIGluIG9yIG91dC4uLlxuLy8gICAgICAgLy8gbm90ZTogYm90aCB2YWx1ZXMgY2FuIGJlIG51bGxcbi8vICAgICAgIC8vICAgY3VycmVudERyb3BwYWJsZT1udWxsIGlmIHdlIHdlcmUgbm90IG92ZXIgYSBkcm9wcGFibGUgYmVmb3JlIHRoaXMgZXZlbnQgKGUuZyBvdmVyIGFuIGVtcHR5IHNwYWNlKVxuLy8gICAgICAgLy8gICBkcm9wcGFibGVCZWxvdz1udWxsIGlmIHdlJ3JlIG5vdCBvdmVyIGEgZHJvcHBhYmxlIG5vdywgZHVyaW5nIHRoaXMgZXZlbnRcblxuLy8gICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbi8vICAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgb3V0XCIgb2YgdGhlIGRyb3BwYWJsZSAocmVtb3ZlIGhpZ2hsaWdodClcbi8vICAgICAgICAgbGVhdmVEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuLy8gICAgICAgfVxuLy8gICAgICAgY3VycmVudERyb3BwYWJsZSA9IGRyb3BwYWJsZUJlbG93O1xuLy8gICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbi8vICAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgaW5cIiBvZiB0aGUgZHJvcHBhYmxlXG4vLyAgICAgICAgIGVudGVyRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH1cblxuLy8gICBsZXQgc2hpcENvb3Jkcztcbi8vICAgZnVuY3Rpb24gZW50ZXJEcm9wcGFibGVBcmVhKGVsZW1lbnQpIHtcbi8vICAgICBzaGlwQ29vcmRzID0gW107XG4vLyAgICAgLy8gaWYgKGVsZW1lbnQpIHtcbi8vICAgICBjb25zdCBpbmRleE9mSW5pdGlhbERyb3BQb2ludCA9ICtlbGVtZW50LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4vLyAgICAgY29uc3QgbWF4SG9yaXpvbnRhbCA9IChNYXRoLmZsb29yKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC8gMTApICsgMSkgKiAxMDtcbi8vICAgICBjb25zdCBtYXhWZXJ0aWNhbCA9XG4vLyAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCAtXG4vLyAgICAgICBNYXRoLmZsb29yKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC8gMTApICogMTAgK1xuLy8gICAgICAgOTA7XG4vLyAgICAgaWYgKCFjYXJyaWVyLnN0eWxlLnJvdGF0ZSAmJiBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIDQgPCBtYXhIb3Jpem9udGFsKSB7XG4vLyAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuLy8gICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbi8vICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuLy8gICAgICAgICAgICAgXCJncmVlblwiO1xuLy8gICAgICAgICAgIHNoaXBDb29yZHMucHVzaChpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfSBlbHNlIGlmIChcbi8vICAgICAgIGNhcnJpZXIuc3R5bGUucm90YXRlICYmXG4vLyAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIDQwIDw9IG1heFZlcnRpY2FsXG4vLyAgICAgKSB7XG4vLyAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuLy8gICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuLy8gICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tcbi8vICAgICAgICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXG4vLyAgICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyZWVuXCI7XG4vLyAgICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgICAvLyB9XG4vLyAgICAgY29uc29sZS5sb2coc2hpcENvb3Jkcyk7XG4vLyAgIH1cblxuLy8gICBmdW5jdGlvbiBsZWF2ZURyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuLy8gICAgIHNoaXBDb29yZHMgPSBbXTtcbi8vICAgICBjb25zdCBpbmRleE9mSW5pdGlhbERyb3BQb2ludCA9ICtlbGVtZW50LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4vLyAgICAgaWYgKCFjYXJyaWVyLnN0eWxlLnJvdGF0ZSkge1xuLy8gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbi8vICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldKSB7XG4vLyAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbi8vICAgICAgICAgICAgIFwiZ3JheVwiO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4vLyAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBdKSB7XG4vLyAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW1xuLy8gICAgICAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBcbi8vICAgICAgICAgICBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JheVwiO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG5cbi8vICAgLy8gKDIpIG1vdmUgdGhlIGNhcnJpZXIgb24gbW91c2Vtb3ZlXG4vLyAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuXG4vLyAgIC8vICgzKSBkcm9wIHRoZSBjYXJyaWVyLCByZW1vdmUgdW5uZWVkZWQgaGFuZGxlcnNcbi8vICAgY2Fycmllci5vbm1vdXNldXAgPSBmdW5jdGlvbiAoKSB7XG4vLyAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG4vLyAgICAgY2Fycmllci5vbm1vdXNldXAgPSBudWxsO1xuLy8gICAgIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYGA7XG4vLyAgICAgY29uc29sZS5sb2coc2hpcENvb3Jkcyk7XG4vLyAgICAgaWYgKHNoaXBDb29yZHMpIHtcbi8vICAgICAgIHBsYXllckZsZWV0LnB1c2goe1xuLy8gICAgICAgICBuYW1lOiBgQ2FycmllcmAsXG4vLyAgICAgICAgIHNoaXBQbGFjZW1lbnQ6IHNoaXBDb29yZHMsXG4vLyAgICAgICB9KTtcbi8vICAgICAgIGNhcnJpZXJDb250YWluZXIucmVtb3ZlQ2hpbGQoY2Fycmllcik7XG4vLyAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXJGbGVldCk7XG4vLyAgICAgICByZW5kZXJQbGF5ZXJTaGlwcyhwbGF5ZXJGbGVldCk7XG4vLyAgICAgICBjcHVCb2FyZFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4vLyAgICAgICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgZ3JheWA7XG4vLyAgICAgICB9KTtcbi8vICAgICAgIGNvbnNvbGUubG9nKHNoaXBJbWdzWzFdKTtcbi8vICAgICAgIHNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4KTtcbi8vICAgICAgICAgaWYgKGluZGV4ID09PSBwbGF5ZXJGbGVldC5sZW5ndGgpIHtcbi8vICAgICAgICAgICBzaGlwLmNsYXNzTGlzdC5yZW1vdmUoYGhpZGUtc2hpcGApO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9KTtcbi8vICAgICB9XG4vLyAgIH07XG4vLyB9O1xuXG4vLyBjYXJyaWVyLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuLy8gICByZXR1cm4gZmFsc2U7XG4vLyB9O1xuXG4vLyAvLyAvLyBoYXJkLWNvZGVkIGluc3RhbnRpYXRpb24gb2YgcGxheWVyRmxlZXRcbi8vIC8vIGNvbnN0IHBsYXllckZsZWV0ID0gW1xuLy8gLy8gICB7IG5hbWU6IFwiQ2FycmllclwiLCBzaGlwUGxhY2VtZW50OiBbMSwgMiwgMywgNCwgNV0gfSxcbi8vIC8vICAgeyBuYW1lOiBcIkJhdHRsZXNoaXBcIiwgc2hpcFBsYWNlbWVudDogWzEwLCAxMSwgMTIsIDEzXSB9LFxuLy8gLy8gICB7IG5hbWU6IFwiRGVzdHJveWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFs3NywgODcsIDk3XSB9LFxuLy8gLy8gICB7IG5hbWU6IFwiU3VibWFyaW5lXCIsIHNoaXBQbGFjZW1lbnQ6IFs0MCwgNTAsIDYwXSB9LFxuLy8gLy8gICB7IG5hbWU6IFwiUGF0cm9sIEJvYXRcIiwgc2hpcFBsYWNlbWVudDogWzU4LCA1OV0gfSxcbi8vIC8vIF07XG5cbi8vIEFTT0ZJSkFTT0ZJQUpTT0ZJQUpTT0ZBSVNKRk9BU0lGSk9BU0lGSkFPU0lGSkFPU0lGSkFTT0ZJSkFTT0ZBSVNKRk9BU0lGSkFPU0ZJSkFPU0lGSkFTT0ZJSkFTT0ZJQVNKRk9BU0lKRkFPU0lGSkFPU0ZJSkFTT2lGSkFcblxuLy8gKioqKioqKioqIC0tLS0tIEhBUkQgQ09ESU5HIFRIRSBDQVJSSUVSIEZPUiBOT1cgKioqKioqKiAhISEhISEhISEhISQkJCQkJCQkJCQkJCQkIC0tLS0tLS0tXG5cbmNvbnN0IHBsYXllckZsZWV0ID0gW107XG5cbmNvbnN0IHNoaXBOYW1lcyA9IFtcbiAgYENhcnJpZXJgLFxuICBgQmF0dGxlc2hpcGAsXG4gIGBEZXN0cm95ZXJgLFxuICBgU3VibWFyaW5lYCxcbiAgYFBhdHJvbCBCb2F0YCxcbl07XG5jb25zdCBzaGlwTGVuZ3RocyA9IFs1LCA0LCAzLCAzLCAyXTtcbmxldCBzaGlwc1BsYWNlZCA9IDA7XG5sZXQgc2hpcENvb3JkcyA9IFtdO1xuXG5jb25zdCBjcHVCb2FyZFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG5jb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjYnRuLXJvdGF0ZS1zaGlwYCk7XG5jb25zdCBwbGFjZVNoaXBzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYWNlLXNoaXBzLWNvbnRhaW5lcmApO1xuY29uc3QgcGxheWVyU2hpcENvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICBgLnBsYXllci1zaGlwcy1jb250YWluZXJgXG4pO1xuY29uc3Qgc2hpcEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcblxuLy8gaGlkZXMgYWxsIGJ1dCB0aGUgY2FycmllciBvbiBwYWdlIGxvYWRcbnNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4gIGlmIChpbmRleCAhPT0gMCkge1xuICAgIHNoaXAuY2xhc3NMaXN0LmFkZChgaGlkZS1zaGlwYCk7XG4gIH1cbn0pO1xuXG5yb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCByb3RhdGVTaGlwKTtcblxuZnVuY3Rpb24gcm90YXRlU2hpcChlKSB7XG4gIGlmICghc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSkge1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUgPSBgLTkwZGVnYDtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID1cbiAgICAgIDMwICsgKChzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF0gLSAxKSAvIDIpICogMzUgKyBgcHhgO1xuICB9IGVsc2Uge1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUgPSBgYDtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID0gMzAgKyBgcHhgO1xuICB9XG59XG5cbnNoaXBJbWdzLmZvckVhY2goKHNoaXApID0+IHtcbiAgc2hpcC5hZGRFdmVudExpc3RlbmVyKGBtb3VzZWRvd25gLCBiZWdpblNoaXBQbGFjZW1lbnQpO1xuICBzaGlwLnN0eWxlLmN1cnNvciA9IGBncmFiYDtcbiAgc2hpcC5vbmRyYWdzdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59KTtcblxuZnVuY3Rpb24gYmVnaW5TaGlwUGxhY2VtZW50KGV2ZW50KSB7XG4gIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICAvLyAoMSkgcHJlcGFyZSB0byBtb3ZlIGVsZW1lbnQ6IG1ha2UgYWJzb2x1dGUgYW5kIG9uIHRvcCBieSB6LWluZGV4XG4gIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnpJbmRleCA9IDEwMDA7XG5cbiAgLy8gbW92ZSBpdCBvdXQgb2YgYW55IGN1cnJlbnQgcGFyZW50cyBkaXJlY3RseSBpbnRvIGNwdUJvYXJkXG4gIHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5hcHBlbmQoc2hpcEltZ3Nbc2hpcHNQbGFjZWRdKTtcblxuICAvLyBjZW50ZXJzIHRoZSBjdXJzb3IgaW4gdGhlIGZpcnN0IFwic3F1YXJlXCIgb2YgdGhlIHNoaXAgaW1hZ2VcbiAgZnVuY3Rpb24gbW92ZUF0KHBhZ2VYLCBwYWdlWSkge1xuICAgIGlmICghc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLmxlZnQgPVxuICAgICAgICBwYWdlWCAtXG4gICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1tzaGlwc1BsYWNlZF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArIDE3LjUpICtcbiAgICAgICAgXCJweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnRvcCA9XG4gICAgICAgIHBhZ2VZIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55ICsgMTcuNSkgK1xuICAgICAgICBcInB4XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgcGFnZVggLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggK1xuICAgICAgICAgICgoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID1cbiAgICAgICAgcGFnZVkgLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkgLVxuICAgICAgICAgICgoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgfVxuICB9XG5cbiAgLy8gbW92ZSBvdXIgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNhcnJpZXIgdW5kZXIgdGhlIHBvaW50ZXJcbiAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbiAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZSB0aGF0IHdlJ3JlIGZseWluZyBvdmVyIHJpZ2h0IG5vd1xuICBsZXQgY3VycmVudERyb3BwYWJsZSA9IG51bGw7XG4gIGxldCBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uaGlkZGVuID0gdHJ1ZTtcbiAgICBsZXQgZWxlbUJlbG93ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uaGlkZGVuID0gZmFsc2U7XG5cbiAgICAvLyBtb3VzZW1vdmUgZXZlbnRzIG1heSB0cmlnZ2VyIG91dCBvZiB0aGUgd2luZG93ICh3aGVuIHRoZSBzaGlwIGlzIGRyYWdnZWQgb2ZmLXNjcmVlbilcbiAgICAvLyBpZiBjbGllbnRYL2NsaWVudFkgYXJlIG91dCBvZiB0aGUgd2luZG93LCB0aGVuIGVsZW1lbnRGcm9tUG9pbnQgcmV0dXJucyBudWxsXG4gICAgaWYgKCFlbGVtQmVsb3cpIHJldHVybjtcblxuICAgIC8vIHBvdGVudGlhbCBkcm9wcGFibGVzIGFyZSBsYWJlbGVkIHdpdGggdGhlIGNsYXNzIFwiZHJvcHBhYmxlXCIgKGNhbiBiZSBvdGhlciBsb2dpYylcbiAgICBkcm9wcGFibGVCZWxvdyA9IGVsZW1CZWxvdy5jbG9zZXN0KFwiLmNwdVNxdWFyZVwiKTtcbiAgICBjb25zb2xlLmxvZyhkcm9wcGFibGVCZWxvdyk7XG5cbiAgICBpZiAoIWRyb3BwYWJsZUJlbG93KSB7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuY3Vyc29yID0gYG5vLWRyb3BgO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuY3Vyc29yID0gYGdyYWJiaW5nYDtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudERyb3BwYWJsZSAhPSBkcm9wcGFibGVCZWxvdykge1xuICAgICAgLy8gd2UncmUgZmx5aW5nIGluIG9yIG91dC4uLlxuICAgICAgLy8gbm90ZTogYm90aCB2YWx1ZXMgY2FuIGJlIG51bGxcbiAgICAgIC8vICAgY3VycmVudERyb3BwYWJsZT1udWxsIGlmIHdlIHdlcmUgbm90IG92ZXIgYSBkcm9wcGFibGUgYmVmb3JlIHRoaXMgZXZlbnQgKGUuZyBvdmVyIGFuIGVtcHR5IHNwYWNlKVxuICAgICAgLy8gICBkcm9wcGFibGVCZWxvdz1udWxsIGlmIHdlJ3JlIG5vdCBvdmVyIGEgZHJvcHBhYmxlIG5vdywgZHVyaW5nIHRoaXMgZXZlbnRcblxuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgb3V0XCIgb2YgdGhlIGRyb3BwYWJsZSAocmVtb3ZlIGhpZ2hsaWdodClcbiAgICAgICAgbGVhdmVEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuICAgICAgfVxuICAgICAgY3VycmVudERyb3BwYWJsZSA9IGRyb3BwYWJsZUJlbG93O1xuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgaW5cIiBvZiB0aGUgZHJvcHBhYmxlXG4gICAgICAgIGVudGVyRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbnRlckRyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICAvLyBpZiAoZWxlbWVudCkge1xuICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICBjb25zdCBtYXhIb3Jpem9udGFsID0gKE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKyAxKSAqIDEwO1xuICAgIGNvbnN0IG1heFZlcnRpY2FsID1cbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC1cbiAgICAgIE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKiAxMCArXG4gICAgICA5MDtcbiAgICBpZiAoXG4gICAgICAhc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSAmJlxuICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgPCBtYXhIb3Jpem9udGFsXG4gICAgKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXTsgaSsrKSB7XG4gICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXSkge1xuICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICBcImdyZWVuXCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSAmJlxuICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgKiAxMCA8PVxuICAgICAgICBtYXhWZXJ0aWNhbFxuICAgICkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tcbiAgICAgICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXG4gICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyZWVuXCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhgaGVyZWApO1xuICAgICAgZHJvcHBhYmxlQmVsb3cgPSBudWxsO1xuICAgICAgc2hpcENvb3JkcyA9IFtdO1xuICAgIH1cbiAgICAvLyB9XG4gICAgY29uc29sZS5sb2coc2hpcENvb3Jkcyk7XG4gIH1cblxuICBmdW5jdGlvbiBsZWF2ZURyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICBjb25zdCBpbmRleE9mSW5pdGlhbERyb3BQb2ludCA9ICtlbGVtZW50LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4gICAgaWYgKCFzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXTsgaSsrKSB7XG4gICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXSkge1xuICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICBcImdyYXlcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3NoaXBzUGxhY2VkXTsgaSsrKSB7XG4gICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBdKSB7XG4gICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW1xuICAgICAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBcbiAgICAgICAgICBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JheVwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gKDIpIG1vdmUgdGhlIHNoaXAgb24gbW91c2Vtb3ZlXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuXG4gIC8vICgzKSBkcm9wIHRoZSBzaGlwLCByZW1vdmUgdW5uZWVkZWQgaGFuZGxlcnNcbiAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0ub25tb3VzZXVwID0gbnVsbDtcbiAgICBjb25zb2xlLmxvZyhzaGlwQ29vcmRzKTtcbiAgICBpZiAoc2hpcENvb3Jkcy5sZW5ndGggIT09IDAgJiYgZHJvcHBhYmxlQmVsb3cpIHtcbiAgICAgIHBsYXllckZsZWV0LnB1c2goe1xuICAgICAgICBuYW1lOiBzaGlwTmFtZXNbc2hpcHNQbGFjZWRdLFxuICAgICAgICBzaGlwUGxhY2VtZW50OiBzaGlwQ29vcmRzLFxuICAgICAgfSk7XG4gICAgICBwbGF5ZXJTaGlwQ29udGFpbmVyc1tzaGlwc1BsYWNlZF0ucmVtb3ZlQ2hpbGQoc2hpcEltZ3Nbc2hpcHNQbGFjZWRdKTtcbiAgICAgIHJlbmRlclBsYXllclNoaXBzKFtwbGF5ZXJGbGVldFtzaGlwc1BsYWNlZF1dKTtcbiAgICAgIGNwdUJvYXJkU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbiAgICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGBncmF5YDtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coc2hpcEltZ3NbMV0pO1xuICAgICAgc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4ID09PSBwbGF5ZXJGbGVldC5sZW5ndGgpIHtcbiAgICAgICAgICBzaGlwLmNsYXNzTGlzdC5yZW1vdmUoYGhpZGUtc2hpcGApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNoaXBzUGxhY2VkICs9IDE7XG4gICAgICBpZiAoc2hpcHNQbGFjZWQgIT09IDUpIHtcbiAgICAgIH1cbiAgICAgIC8vIH0gZWxzZSBpZiAoIWRyb3BwYWJsZUJlbG93KSB7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYWNlU2hpcHNDb250YWluZXIuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0sXG4gICAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkICsgMV1cbiAgICAgICk7XG4gICAgICBpZiAoc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlID0gYGA7XG4gICAgICB9XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID0gXCIzMHB4XCI7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuekluZGV4ID0gMDtcbiAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gICAgfVxuICAgIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYGA7XG4gIH07XG59XG5cbi8vIC8vIGhhcmQtY29kZWQgaW5zdGFudGlhdGlvbiBvZiBwbGF5ZXJGbGVldFxuLy8gY29uc3QgcGxheWVyRmxlZXQgPSBbXG4vLyAgIHsgbmFtZTogXCJDYXJyaWVyXCIsIHNoaXBQbGFjZW1lbnQ6IFsxLCAyLCAzLCA0LCA1XSB9LFxuLy8gICB7IG5hbWU6IFwiQmF0dGxlc2hpcFwiLCBzaGlwUGxhY2VtZW50OiBbMTAsIDExLCAxMiwgMTNdIH0sXG4vLyAgIHsgbmFtZTogXCJEZXN0cm95ZXJcIiwgc2hpcFBsYWNlbWVudDogWzc3LCA4NywgOTddIH0sXG4vLyAgIHsgbmFtZTogXCJTdWJtYXJpbmVcIiwgc2hpcFBsYWNlbWVudDogWzQwLCA1MCwgNjBdIH0sXG4vLyAgIHsgbmFtZTogXCJQYXRyb2wgQm9hdFwiLCBzaGlwUGxhY2VtZW50OiBbNTgsIDU5XSB9LFxuLy8gXTtcbiJdLCJzb3VyY2VSb290IjoiIn0=