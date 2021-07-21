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
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.js */ "./src/index.js");




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
  (0,_index_js__WEBPACK_IMPORTED_MODULE_2__.hideShipsToPlace)();
  const startBtn = document.querySelector(`#start-game-btn`);
  startBtn.style.display = "flex";
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
  console.log(storedGameboards);
  console.log(storedGameboards[0][1].ships.fleet);
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
      console.log(attackOutcome);
      (0,_renderGame__WEBPACK_IMPORTED_MODULE_1__.renderMove)(getTurn, attackOutcome);
      if (attackOutcome[0]) {
        storedGameboards.filter((item) => {
          if (item[0] === getTurn) {
            isGameOver = item[1].isGameOver();
          }
        });
      }
      if (attackOutcome[0] && getTurn === `player`) {
        let isShipSunk;
        let arrayIndex;
        storedGameboards[0][1].ships.fleet.filter((object, index) => {
          if (attackOutcome[0] === object.name) {
            console.log(`here with ` + object.name);
            isShipSunk = object.isSunk;
            arrayIndex = index;
            if (isShipSunk) {
              const cpuHiddenShips =
                document.querySelectorAll(`.cpu-ships-rendered`);
              cpuHiddenShips[index].style.display = `block`;
              cpuHiddenShips[index].style.zIndex = `1`;
            }
            console.log(isShipSunk);
            console.log(arrayIndex);
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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hideShipsToPlace": () => (/* binding */ hideShipsToPlace)
/* harmony export */ });
/* harmony import */ var _gameHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameHandler */ "./src/gameHandler.js");
/* harmony import */ var _renderGame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderGame */ "./src/renderGame.js");



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

const cpuGameBoardTitle = document.querySelector(`#cpu-board-header`);
const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);
const rotateBtn = document.querySelector(`#btn-rotate-ship`);
const placeShipsContainer = document.querySelector(`#place-ships-container`);
const playerShipContainers = document.querySelectorAll(
  `.player-ships-container`
);
const shipImgs = document.querySelectorAll(`.ships-to-place`);

function hideShipsToPlace() {
  shipImgs.forEach((ship) => {
    ship.classList.add(`hide-ship`);
  });
  rotateBtn.style.display = `none`;
}

// hides all but the carrier on page load
shipImgs.forEach((ship, index) => {
  if (index !== 0) {
    ship.classList.add(`hide-ship`);
  }
});

// labels the computer gameboard on page load
cpuGameBoardTitle.textContent = `PLACE YOUR SHIPS`;

// start game button
const startBtn = document.querySelector(`#start-game-btn`);
startBtn.addEventListener(`click`, beginGame);

function beginGame() {
  const playerBoard = document.querySelector(`#player-board`);
  cpuGameBoardTitle.textContent = `Computer`;
  playerBoard.style.display = `block`;
  placeShipsContainer.style.display = `none`;
}

rotateBtn.addEventListener(`click`, rotateShip);

function rotateShip(e) {
  if (!shipImgs[shipsPlaced].style.rotate) {
    shipImgs[shipsPlaced].style.rotate = `-90deg`;
    shipImgs[shipsPlaced].style.top =
      100 + ((shipLengths[shipsPlaced] - 1) / 2) * 35 + `px`;
  } else {
    shipImgs[shipsPlaced].style.rotate = ``;
    shipImgs[shipsPlaced].style.top = 100 + `px`;
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
  let isDropValid;

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    shipImgs[shipsPlaced].hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

    // mousemove events may trigger out of the window (when the ship is dragged off-screen)
    // if clientX/clientY are out of the window, then elementFromPoint returns null
    // const maxPageX = window.innerWidth - (shipLengths[shipsPlaced] - 1) * 35;
    // const maxPageY = window.innerHeight - (shipLengths[shipsPlaced] - 1) * 35;
    // console.log("X: " + maxPageX + ", Y: " + maxPageY);

    if (!elemBelow) return;

    // if (!shipImgs[shipsPlaced].style.rotate && event.pageX >= maxPageX) {
    //   isDropValid = false;
    //   return;
    // } else if (shipImgs[shipsPlaced].style.rotate && event.pageY >= maxPageY) {
    //   isDropValid = false;
    //   return;
    // }

    // console.log(window.innerWidth);
    // console.log(window.innerHeight);
    // console.log(event.pageX, event.pageY);

    // BEGIN ---- checks validity of the drop
    let arrayOfElementsBelowToCheckValidity = [];
    arrayOfElementsBelowToCheckValidity.shift();
    for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
      let getClassToCheckValidity;
      if (shipImgs[shipsPlaced].style.rotate) {
        getClassToCheckValidity = document
          .elementFromPoint(event.clientX, event.clientY + i * 35)
          .getAttribute(`class`);
      } else {
        getClassToCheckValidity = document
          .elementFromPoint(event.clientX + i * 35, event.clientY)
          .getAttribute(`class`);
      }
      arrayOfElementsBelowToCheckValidity.push(getClassToCheckValidity);
      if (arrayOfElementsBelowToCheckValidity[0]) {
        let counter = 0;
        arrayOfElementsBelowToCheckValidity.forEach((item) => {
          if ((item && item.includes(`invalid`)) || item === null) {
            counter += 1;
          }
        });
        if (counter) {
          isDropValid = false;
        } else {
          isDropValid = true;
        }
        // console.log(isDropValid);
      }
    }
    // console.log(arrayOfElementsBelowToCheckValidity);
    // END ---- checks validity of the drop

    shipImgs[shipsPlaced].hidden = false;

    // // mousemove events may trigger out of the window (when the ship is dragged off-screen)
    // // if clientX/clientY are out of the window, then elementFromPoint returns null
    // if (!elemBelow) return;

    // potential droppables are labeled with the class "droppable" (can be other logic)
    droppableBelow = elemBelow.closest(".cpuSquare");
    // console.log(droppableBelow);

    if (!droppableBelow || !isDropValid) {
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
      indexOfInitialDropPoint + (shipLengths[shipsPlaced] - 1) <
        maxHorizontal &&
      isDropValid
    ) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
          cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
            "#829E76";
          shipCoords.push(indexOfInitialDropPoint + i);
        }
      }
    } else if (
      shipImgs[shipsPlaced].style.rotate &&
      indexOfInitialDropPoint + (shipLengths[shipsPlaced] - 1) * 10 <=
        maxVertical &&
      isDropValid
    ) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
          cpuBoardSquares[
            indexOfInitialDropPoint + i * 10
          ].style.backgroundColor = "#829E76";
          shipCoords.push(indexOfInitialDropPoint + i * 10);
        }
      }
    } else {
      console.log(`here`);
      droppableBelow = null;
      shipCoords = [];
    }
    // console.log(shipCoords);
  }

  function leaveDroppableArea(element) {
    shipCoords = [];
    const indexOfInitialDropPoint = +element.dataset.indexNumber;
    if (!shipImgs[shipsPlaced].style.rotate) {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
          cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
            "#c1c1c1";
        }
      }
    } else {
      for (let i = 0; i < shipLengths[shipsPlaced]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
          cpuBoardSquares[
            indexOfInitialDropPoint + i * 10
          ].style.backgroundColor = "#c1c1c1";
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
    // console.log(shipCoords);
    if (shipCoords.length !== 0 && droppableBelow && isDropValid) {
      playerFleet.push({
        name: shipNames[shipsPlaced],
        shipPlacement: shipCoords,
      });
      playerShipContainers[shipsPlaced].removeChild(shipImgs[shipsPlaced]);
      (0,_renderGame__WEBPACK_IMPORTED_MODULE_1__.renderPlayerShips)([playerFleet[shipsPlaced]]);
      cpuBoardSquares.forEach((square) => {
        square.style.backgroundColor = `#c1c1c1`;
      });
      shipImgs.forEach((ship, index) => {
        if (index === playerFleet.length) {
          ship.classList.remove(`hide-ship`);
        }
      });
      shipsPlaced += 1;
      const clearBtn = document.querySelector(`#clear-board-btn`);
      if (shipsPlaced === 1) {
        const randomizeBtn = document.querySelector(`#randomize-player-fleet`);
        randomizeBtn.style.display = `none `;
        clearBtn.style.display = "flex";
      }
      if (shipsPlaced === 5) {
        startBtn.style.display = "flex";
        clearBtn.style.display = `none`;
        rotateBtn.style.display = `none`;
      }
    } else {
      placeShipsContainer.insertBefore(
        shipImgs[shipsPlaced],
        shipImgs[shipsPlaced + 1]
      );
      if (shipImgs[shipsPlaced].style.rotate) {
        shipImgs[shipsPlaced].style.rotate = ``;
      }
      shipImgs[shipsPlaced].style.position = "absolute";
      shipImgs[shipsPlaced].style.top = "100px";
      shipImgs[shipsPlaced].style.left = "0px";
      shipImgs[shipsPlaced].style.zIndex = 0;
      shipImgs[shipsPlaced].style.cursor = `grab`;
    }
  };
}




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
    // square.textContent = i;
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZW5kZXJHYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQTJFO0FBS3JEO0FBQ3dCOztBQUU5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sa0RBQWtEO0FBQ3hELE1BQU0sc0RBQXNEO0FBQzVELE1BQU0saURBQWlEO0FBQ3ZELE1BQU0saURBQWlEO0FBQ3ZELE1BQU0sK0NBQStDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFLDJEQUFnQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiw4REFBa0I7QUFDeEMsc0JBQXNCLHFEQUFT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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGtEQUFLOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxJQUFJLGdFQUFtQjtBQUN2QixHQUFHO0FBQ0gsSUFBSSw4REFBaUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRXdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQzFQakM7QUFDMEI7O0FBRWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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QVM7QUFDbEMsaUNBQWlDLFNBQVM7QUFDMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCLFVBQVU7QUFDdkMsOEJBQThCLFdBQVc7QUFDekM7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFPRTs7Ozs7Ozs7Ozs7Ozs7O0FDcExGO0FBQ0E7QUFDQSxLQUFLLHNEQUFzRDtBQUMzRCxLQUFLLHlEQUF5RDtBQUM5RCxLQUFLLHdEQUF3RDtBQUM3RCxLQUFLLHdEQUF3RDtBQUM3RCxLQUFLLDBEQUEwRDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFVBQVU7QUFDVjs7QUFFaUI7Ozs7Ozs7VUM5QmpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR2FtZWJvYXJkLCBwbGFjZUNvbXB1dGVyRmxlZXQsIHJlY2VpdmVBdHRhY2sgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCB7XG4gIHJlbmRlck1vdmUsXG4gIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMsXG4gIHJlbmRlclBsYXllclNoaXBzLFxufSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5pbXBvcnQgeyBoaWRlU2hpcHNUb1BsYWNlIH0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuY29uc3Qgc3RvcmVkR2FtZWJvYXJkcyA9IFtdO1xuXG5sZXQgdHVybkNvdW50ZXIgPSAxO1xuZnVuY3Rpb24gdHVybkRyaXZlcigpIHtcbiAgbGV0IHdob3NlTW92ZTtcbiAgaWYgKHR1cm5Db3VudGVyICUgMiAhPT0gMCkge1xuICAgIHdob3NlTW92ZSA9IGBwbGF5ZXJgO1xuICB9IGVsc2Uge1xuICAgIHdob3NlTW92ZSA9IGBjb21wdXRlcmA7XG4gIH1cbiAgdHVybkNvdW50ZXIgKz0gMTtcbiAgcmV0dXJuIHdob3NlTW92ZTtcbn1cblxuLy8gLy8gaGFyZC1jb2RlZCBpbnN0YW50aWF0aW9uIG9mIHBsYXllckZsZWV0XG4vLyBjb25zdCBwbGF5ZXJGbGVldCA9IFtcbi8vICAgeyBuYW1lOiBcIkNhcnJpZXJcIiwgc2hpcFBsYWNlbWVudDogWzEsIDIsIDMsIDQsIDVdIH0sXG4vLyAgIHsgbmFtZTogXCJCYXR0bGVzaGlwXCIsIHNoaXBQbGFjZW1lbnQ6IFsxMCwgMTEsIDEyLCAxM10gfSxcbi8vICAgeyBuYW1lOiBcIkRlc3Ryb3llclwiLCBzaGlwUGxhY2VtZW50OiBbNzcsIDg3LCA5N10gfSxcbi8vICAgeyBuYW1lOiBcIlN1Ym1hcmluZVwiLCBzaGlwUGxhY2VtZW50OiBbNDAsIDUwLCA2MF0gfSxcbi8vICAgeyBuYW1lOiBcIlBhdHJvbCBCb2F0XCIsIHNoaXBQbGFjZW1lbnQ6IFs1OCwgNTldIH0sXG4vLyBdO1xuY29uc3QgcmFuZG9taXplUGxheWVyRmxlZXRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICBgI3JhbmRvbWl6ZS1wbGF5ZXItZmxlZXRgXG4pO1xucmFuZG9taXplUGxheWVyRmxlZXRCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCByYW5kb21pemVQbGF5ZXJGbGVldCk7XG5cbmZ1bmN0aW9uIHJhbmRvbWl6ZVBsYXllckZsZWV0KCkge1xuICBoaWRlU2hpcHNUb1BsYWNlKCk7XG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3N0YXJ0LWdhbWUtYnRuYCk7XG4gIHN0YXJ0QnRuLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgaWYgKHN0b3JlZEdhbWVib2FyZHNbMV0pIHtcbiAgICBzdG9yZWRHYW1lYm9hcmRzLnBvcCgpO1xuICAgIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICAgIGNvbnN0IHJlbmRlcmVkUGxheWVyU2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5wbGF5ZXItc2hpcHMtcmVuZGVyZWRgXG4gICAgKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgY3B1Qm9hcmQucmVtb3ZlQ2hpbGQocmVuZGVyZWRQbGF5ZXJTaGlwc1tpXSk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuICB9XG4gIGNvbnN0IHBsYXllckZsZWV0QXJyYXkgPSBbXTtcbiAgY29uc3QgcGxheWVyRmxlZXQgPSBwbGFjZUNvbXB1dGVyRmxlZXQoYHVzZXJgLCBwbGF5ZXJGbGVldEFycmF5KTtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lYm9hcmQocGxheWVyRmxlZXQpO1xuICBzdG9yZWRHYW1lYm9hcmRzLnB1c2goW2Bjb21wdXRlcmAsIHBsYXllckJvYXJkXSk7XG4gIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuICBjb25zb2xlLmxvZyhzdG9yZWRHYW1lYm9hcmRzWzBdWzFdLnNoaXBzLmZsZWV0KTtcbn1cblxuY29uc3QgY3B1RmxlZXRBcnJheSA9IFtdO1xuY29uc3QgY29tcHV0ZXJGbGVldCA9IHBsYWNlQ29tcHV0ZXJGbGVldChgY3B1YCwgY3B1RmxlZXRBcnJheSk7XG5jb25zdCBjb21wdXRlckJvYXJkID0gR2FtZWJvYXJkKGNvbXB1dGVyRmxlZXQpO1xuc3RvcmVkR2FtZWJvYXJkcy5wdXNoKFtgcGxheWVyYCwgY29tcHV0ZXJCb2FyZF0pO1xuXG4vLyBCRUdJTiAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5mdW5jdGlvbiBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKSB7XG4gIGNvbnN0IHZhbGlkTW92ZXMgPSBbXTtcbiAgY29uc3QgbWF4TW92ZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4TW92ZXM7IGkrKykge1xuICAgIHZhbGlkTW92ZXMucHVzaChpKTtcbiAgfVxuICByZXR1cm4gdmFsaWRNb3Zlcztcbn1cblxuY29uc3QgZ2V0VmFsaWRNb3ZlcyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuY29uc3QgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpIHtcbiAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnZXRWYWxpZE1vdmVzLmxlbmd0aCk7XG4gIGNvbnN0IHJhbmRvbU1vdmUgPSBnZXRWYWxpZE1vdmVzW3JhbmRvbUluZGV4XTtcbiAgZ2V0VmFsaWRNb3Zlcy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICByZXR1cm4gcmFuZG9tTW92ZTtcbn1cbi8vIEVORCAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIGdhbWVMb29wKHBsYXllck1vdmUpIHtcbiAgbGV0IGdldFR1cm47XG4gIGxldCBjb29yZE9mQXR0YWNrO1xuICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICBjb25zdCBpbmRleFRvU3BsaWNlID0gZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuZmluZEluZGV4KFxuICAgIChpbmRleCkgPT4gaW5kZXggPT09IHBsYXllck1vdmVcbiAgKTtcbiAgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuc3BsaWNlKGluZGV4VG9TcGxpY2UsIDEpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGlmICghaXNHYW1lT3Zlcikge1xuICAgICAgZ2V0VHVybiA9IHR1cm5Ecml2ZXIoKTtcbiAgICAgIGlmIChnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICBjb29yZE9mQXR0YWNrID0gcGxheWVyTW92ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkT2ZBdHRhY2sgPSBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBhdHRhY2tPdXRjb21lID0gcmVjZWl2ZUF0dGFjayhjb29yZE9mQXR0YWNrLCBnZXRUdXJuKTtcbiAgICAgIGNvbnNvbGUubG9nKGF0dGFja091dGNvbWUpO1xuICAgICAgcmVuZGVyTW92ZShnZXRUdXJuLCBhdHRhY2tPdXRjb21lKTtcbiAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgICAgIHN0b3JlZEdhbWVib2FyZHMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW1bMF0gPT09IGdldFR1cm4pIHtcbiAgICAgICAgICAgIGlzR2FtZU92ZXIgPSBpdGVtWzFdLmlzR2FtZU92ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gJiYgZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbiAgICAgICAgbGV0IGlzU2hpcFN1bms7XG4gICAgICAgIGxldCBhcnJheUluZGV4O1xuICAgICAgICBzdG9yZWRHYW1lYm9hcmRzWzBdWzFdLnNoaXBzLmZsZWV0LmZpbHRlcigob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdID09PSBvYmplY3QubmFtZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYGhlcmUgd2l0aCBgICsgb2JqZWN0Lm5hbWUpO1xuICAgICAgICAgICAgaXNTaGlwU3VuayA9IG9iamVjdC5pc1N1bms7XG4gICAgICAgICAgICBhcnJheUluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICBpZiAoaXNTaGlwU3Vuaykge1xuICAgICAgICAgICAgICBjb25zdCBjcHVIaWRkZW5TaGlwcyA9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICAgICAgICAgICAgICBjcHVIaWRkZW5TaGlwc1tpbmRleF0uc3R5bGUuZGlzcGxheSA9IGBibG9ja2A7XG4gICAgICAgICAgICAgIGNwdUhpZGRlblNoaXBzW2luZGV4XS5zdHlsZS56SW5kZXggPSBgMWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpc1NoaXBTdW5rKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFycmF5SW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNHYW1lT3Zlcikge1xuICAgICAgICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGdldFBsYXllck1vdmVzUmVtYWluaW5nKTtcbiAgICAgICAgYWxlcnQoYGdhbWUgb3ZlciEgJHtnZXRUdXJufSB3aW5zIWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzLCBnYW1lTG9vcCB9O1xuIiwiaW1wb3J0IHsgU2hpcHMgfSBmcm9tIFwiLi9zaGlwTW9kdWxlXCI7XG5pbXBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHJlbmRlckNvbXB1dGVyU2hpcHMsIHJlbmRlclBsYXllclNoaXBzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuXG5jb25zdCBHYW1lYm9hcmQgPSAoZmxlZXRBcnJheSkgPT4ge1xuICBjb25zdCBnYW1lYm9hcmQgPSBbXG4gICAgZmxlZXRBcnJheVswXSxcbiAgICBmbGVldEFycmF5WzFdLFxuICAgIGZsZWV0QXJyYXlbMl0sXG4gICAgZmxlZXRBcnJheVszXSxcbiAgICBmbGVldEFycmF5WzRdLFxuICBdO1xuICBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBTaGlwcygpO1xuXG4gIGNvbnN0IGlzR2FtZU92ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBzaGlwcy5mbGVldDtcbiAgICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgIGxldCBzaGlwc1N1bmtDb3VudGVyID0gMDtcblxuICAgIGFycmF5LmZpbHRlcigob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLmlzU3Vuaykge1xuICAgICAgICBzaGlwc1N1bmtDb3VudGVyICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHNoaXBzU3Vua0NvdW50ZXIgPT09IDUpIHtcbiAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNHYW1lT3ZlcjtcbiAgfTtcblxuICByZXR1cm4geyBnYW1lYm9hcmQsIG1pc3Nlcywgc2hpcHMsIGlzR2FtZU92ZXIgfTtcbn07XG5cbi8vIC8vIEJFR0lOLS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgY29tcHV0ZXIgLS0tLS0tLSAvL1xuLy8gY29uc3QgY29tcHV0ZXJGbGVldCA9IFtdO1xuXG4vLyBmdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpIHtcbi8vICAgY29uc3QgbnVtYmVyT2ZDb29yZGluYXRlcyA9IDEwMDtcbi8vICAgY29uc3Qgb3JpZW50YXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbi8vICAgY29uc3QgZmlyc3RDb29yZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bWJlck9mQ29vcmRpbmF0ZXMpO1xuLy8gICByZXR1cm4gW29yaWVudGF0aW9uLCBmaXJzdENvb3JkXTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gb3JpZW50U2hpcChzdGFydENvb3JkLCBvcmllbnRhdGlvbiwgbmFtZSwgbGVuZ3RoKSB7XG4vLyAgIGxldCBzaGlwUGxhY2VtZW50ID0gW107XG4vLyAgIGxldCBob3Jpem9udGFsTGltaXQ7XG4vLyAgIGlmIChzdGFydENvb3JkIDwgMTApIHtcbi8vICAgICBob3Jpem9udGFsTGltaXQgPSA5O1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIGhvcml6b250YWxMaW1pdCA9ICsoc3RhcnRDb29yZC50b1N0cmluZygpLmNoYXJBdCgwKSArIDkpO1xuLy8gICB9XG4vLyAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbi8vICAgICBpZiAob3JpZW50YXRpb24pIHtcbi8vICAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpICogMTAgPCAxMDApIHtcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpICogMTApO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpICogMTApO1xuLy8gICAgICAgfVxuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSA8PSBob3Jpem9udGFsTGltaXQpIHtcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSk7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG4vLyAgIHJldHVybiB7IG5hbWUsIHNoaXBQbGFjZW1lbnQgfTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gdmVyaWZ5Q29vcmRzKG9iamVjdCkge1xuLy8gICBjb25zdCBzaGlwVG9WZXJpZnkgPSBvYmplY3Quc2hpcFBsYWNlbWVudDtcbi8vICAgbGV0IGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbi8vICAgaWYgKCFjb21wdXRlckZsZWV0Lmxlbmd0aCkge1xuLy8gICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuLy8gICAgIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFRvVmVyaWZ5Lmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICBpZiAoIWlzUGxhY2VtZW50VmFsaWQpIHtcbi8vICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBjb21wdXRlckZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbi8vICAgICAgICAgICBpZiAoaXNQbGFjZW1lbnRWYWxpZCkge1xuLy8gICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLnNoaXBQbGFjZW1lbnQubGVuZ3RoOyBqKyspIHtcbi8vICAgICAgICAgICAgICAgaWYgKHNoaXBUb1ZlcmlmeVtpXSAhPT0gc2hpcC5zaGlwUGxhY2VtZW50W2pdKSB7XG4vLyAgICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4vLyAgICAgICAgICAgICAgICAgY29udGludWU7XG4vLyAgICAgICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuLy8gICAgICAgICAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9KTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH1cbi8vICAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG4vLyB9XG5cbi8vIC8vIHVzZWQgZm9yIHRoZSBuYW1lIGFuZCBsZW5ndGggcHJvcHMgaW4gdGhlIHBsYWNlQ29tcHV0ZXJGbGVldCBmeG5cbi8vIGNvbnN0IHNoaXBDbG9uZSA9IFNoaXBzKCk7XG5cbi8vIGZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJGbGVldCgpIHtcbi8vICAgc2hpcENsb25lLmZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbi8vICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuLy8gICAgIHdoaWxlICghaXNWYWxpZCkge1xuLy8gICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuLy8gICAgICAgY29uc3QgcmFuZG9tVmFsdWVzID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKTtcbi8vICAgICAgIGNvbnN0IHBsYWNlbWVudCA9IG9yaWVudFNoaXAoXG4vLyAgICAgICAgIHJhbmRvbVZhbHVlc1sxXSxcbi8vICAgICAgICAgcmFuZG9tVmFsdWVzWzBdLFxuLy8gICAgICAgICBzaGlwLm5hbWUsXG4vLyAgICAgICAgIHNoaXAubGVuZ3RoXG4vLyAgICAgICApO1xuLy8gICAgICAgY29uc3QgdmVyaWZ5ID0gdmVyaWZ5Q29vcmRzKHBsYWNlbWVudCk7XG4vLyAgICAgICBpZiAodmVyaWZ5KSB7XG4vLyAgICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuLy8gICAgICAgICBjb21wdXRlckZsZWV0LnB1c2gocGxhY2VtZW50KTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gICByZW5kZXJDb21wdXRlclNoaXBzKGNvbXB1dGVyRmxlZXQpO1xuLy8gICByZXR1cm4gY29tcHV0ZXJGbGVldDtcbi8vIH1cbi8vIC8vIEVORC0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIGNvbXB1dGVyIC0tLS0tLS0gLy9cblxuY29uc3QgcmVjZWl2ZUF0dGFjayA9IChhdHRhY2tDb29yZCwgdXNlcikgPT4ge1xuICBsZXQgaW5kZXg7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIGF0dGFja0Nvb3JkXTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgaW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gMTtcbiAgfVxuICBjb25zdCBnYW1lYm9hcmRPYmplY3QgPSBzdG9yZWRHYW1lYm9hcmRzW2luZGV4XVsxXTtcbiAgZ2FtZWJvYXJkT2JqZWN0LmdhbWVib2FyZC5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICBpZiAob2JqZWN0LnNoaXBQbGFjZW1lbnQuaW5jbHVkZXMoYXR0YWNrQ29vcmQpKSB7XG4gICAgICBhdHRhY2tPdXRjb21lID0gW29iamVjdC5uYW1lLCBhdHRhY2tDb29yZF07XG4gICAgfVxuICB9KTtcbiAgaWYgKCFhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgZ2FtZWJvYXJkT2JqZWN0Lm1pc3Nlcy5wdXNoKGF0dGFja0Nvb3JkKTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lYm9hcmRPYmplY3Quc2hpcHMuaGl0KGF0dGFja091dGNvbWUpO1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5pc1N1bmsoYXR0YWNrT3V0Y29tZVswXSk7XG4gIH1cbiAgcmV0dXJuIGF0dGFja091dGNvbWU7XG59O1xuXG4vLyBCRUdJTi0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIHBsYXllciAtLS0tLS0tIC8vXG4vLyBjb25zdCBjb21wdXRlckZsZWV0ID0gW107XG4vLyBjb25zdCBwbGF5ZXJGbGVldCA9IFtdO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpIHtcbiAgY29uc3QgbnVtYmVyT2ZDb29yZGluYXRlcyA9IDEwMDtcbiAgY29uc3Qgb3JpZW50YXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgY29uc3QgZmlyc3RDb29yZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bWJlck9mQ29vcmRpbmF0ZXMpO1xuICByZXR1cm4gW29yaWVudGF0aW9uLCBmaXJzdENvb3JkXTtcbn1cblxuZnVuY3Rpb24gb3JpZW50U2hpcChzdGFydENvb3JkLCBvcmllbnRhdGlvbiwgbmFtZSwgbGVuZ3RoKSB7XG4gIGxldCBzaGlwUGxhY2VtZW50ID0gW107XG4gIGxldCBob3Jpem9udGFsTGltaXQ7XG4gIGlmIChzdGFydENvb3JkIDwgMTApIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSA5O1xuICB9IGVsc2Uge1xuICAgIGhvcml6b250YWxMaW1pdCA9ICsoc3RhcnRDb29yZC50b1N0cmluZygpLmNoYXJBdCgwKSArIDkpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3JpZW50YXRpb24pIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpICogMTAgPCAxMDApIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpICogMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpICogMTApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSA8PSBob3Jpem9udGFsTGltaXQpIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7IG5hbWUsIHNoaXBQbGFjZW1lbnQgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5Q29vcmRzKGFycmF5LCBvYmplY3QpIHtcbiAgY29uc3Qgc2hpcFRvVmVyaWZ5ID0gb2JqZWN0LnNoaXBQbGFjZW1lbnQ7XG4gIGxldCBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gIGlmICghYXJyYXkubGVuZ3RoKSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG4gIH0gZWxzZSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwVG9WZXJpZnkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgICBpZiAoaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLnNoaXBQbGFjZW1lbnQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNoaXBUb1ZlcmlmeVtpXSAhPT0gc2hpcC5zaGlwUGxhY2VtZW50W2pdKSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG59XG5cbi8vIHVzZWQgZm9yIHRoZSBuYW1lIGFuZCBsZW5ndGggcHJvcHMgaW4gdGhlIHBsYWNlQ29tcHV0ZXJGbGVldCBmeG5cbmNvbnN0IHNoaXBDbG9uZSA9IFNoaXBzKCk7XG5cbmZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJGbGVldCh1c2VyLCBhcnJheSkge1xuICBzaGlwQ2xvbmUuZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgd2hpbGUgKCFpc1ZhbGlkKSB7XG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICBjb25zdCByYW5kb21WYWx1ZXMgPSBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpO1xuICAgICAgY29uc3QgcGxhY2VtZW50ID0gb3JpZW50U2hpcChcbiAgICAgICAgcmFuZG9tVmFsdWVzWzFdLFxuICAgICAgICByYW5kb21WYWx1ZXNbMF0sXG4gICAgICAgIHNoaXAubmFtZSxcbiAgICAgICAgc2hpcC5sZW5ndGhcbiAgICAgICk7XG4gICAgICBjb25zdCB2ZXJpZnkgPSB2ZXJpZnlDb29yZHMoYXJyYXksIHBsYWNlbWVudCk7XG4gICAgICBpZiAodmVyaWZ5KSB7XG4gICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICBhcnJheS5wdXNoKHBsYWNlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKHVzZXIgPT09IGBjcHVgKSB7XG4gICAgcmVuZGVyQ29tcHV0ZXJTaGlwcyhhcnJheSk7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyUGxheWVyU2hpcHMoYXJyYXkpO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cbi8vIEVORC0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIHBsYXllciAtLS0tLS0tIC8vXG5cbmV4cG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH07XG4iLCJpbXBvcnQgXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyByZW5kZXJQbGF5ZXJTaGlwcyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcblxuY29uc3QgcGxheWVyRmxlZXQgPSBbXTtcblxuY29uc3Qgc2hpcE5hbWVzID0gW1xuICBgQ2FycmllcmAsXG4gIGBCYXR0bGVzaGlwYCxcbiAgYERlc3Ryb3llcmAsXG4gIGBTdWJtYXJpbmVgLFxuICBgUGF0cm9sIEJvYXRgLFxuXTtcbmNvbnN0IHNoaXBMZW5ndGhzID0gWzUsIDQsIDMsIDMsIDJdO1xubGV0IHNoaXBzUGxhY2VkID0gMDtcbmxldCBzaGlwQ29vcmRzID0gW107XG5cbmNvbnN0IGNwdUdhbWVCb2FyZFRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZC1oZWFkZXJgKTtcbmNvbnN0IGNwdUJvYXJkU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbmNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNidG4tcm90YXRlLXNoaXBgKTtcbmNvbnN0IHBsYWNlU2hpcHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxhY2Utc2hpcHMtY29udGFpbmVyYCk7XG5jb25zdCBwbGF5ZXJTaGlwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gIGAucGxheWVyLXNoaXBzLWNvbnRhaW5lcmBcbik7XG5jb25zdCBzaGlwSW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuXG5mdW5jdGlvbiBoaWRlU2hpcHNUb1BsYWNlKCkge1xuICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKGBoaWRlLXNoaXBgKTtcbiAgfSk7XG4gIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xufVxuXG4vLyBoaWRlcyBhbGwgYnV0IHRoZSBjYXJyaWVyIG9uIHBhZ2UgbG9hZFxuc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCwgaW5kZXgpID0+IHtcbiAgaWYgKGluZGV4ICE9PSAwKSB7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKGBoaWRlLXNoaXBgKTtcbiAgfVxufSk7XG5cbi8vIGxhYmVscyB0aGUgY29tcHV0ZXIgZ2FtZWJvYXJkIG9uIHBhZ2UgbG9hZFxuY3B1R2FtZUJvYXJkVGl0bGUudGV4dENvbnRlbnQgPSBgUExBQ0UgWU9VUiBTSElQU2A7XG5cbi8vIHN0YXJ0IGdhbWUgYnV0dG9uXG5jb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzdGFydC1nYW1lLWJ0bmApO1xuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBiZWdpbkdhbWUpO1xuXG5mdW5jdGlvbiBiZWdpbkdhbWUoKSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICBjcHVHYW1lQm9hcmRUaXRsZS50ZXh0Q29udGVudCA9IGBDb21wdXRlcmA7XG4gIHBsYXllckJvYXJkLnN0eWxlLmRpc3BsYXkgPSBgYmxvY2tgO1xuICBwbGFjZVNoaXBzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG59XG5cbnJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHJvdGF0ZVNoaXApO1xuXG5mdW5jdGlvbiByb3RhdGVTaGlwKGUpIHtcbiAgaWYgKCFzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlKSB7XG4gICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSA9IGAtOTBkZWdgO1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS50b3AgPVxuICAgICAgMTAwICsgKChzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF0gLSAxKSAvIDIpICogMzUgKyBgcHhgO1xuICB9IGVsc2Uge1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUgPSBgYDtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID0gMTAwICsgYHB4YDtcbiAgfVxufVxuXG5zaGlwSW1ncy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihgbW91c2Vkb3duYCwgYmVnaW5TaGlwUGxhY2VtZW50KTtcbiAgc2hpcC5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gIHNoaXAub25kcmFnc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGJlZ2luU2hpcFBsYWNlbWVudChldmVudCkge1xuICAvLyAoMSkgcHJlcGFyZSB0byBtb3ZlIGVsZW1lbnQ6IG1ha2UgYWJzb2x1dGUgYW5kIG9uIHRvcCBieSB6LWluZGV4XG4gIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnpJbmRleCA9IDEwMDA7XG5cbiAgLy8gbW92ZSBpdCBvdXQgb2YgYW55IGN1cnJlbnQgcGFyZW50cyBkaXJlY3RseSBpbnRvIGNwdUJvYXJkXG4gIHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5hcHBlbmQoc2hpcEltZ3Nbc2hpcHNQbGFjZWRdKTtcblxuICAvLyBjZW50ZXJzIHRoZSBjdXJzb3IgaW4gdGhlIGZpcnN0IFwic3F1YXJlXCIgb2YgdGhlIHNoaXAgaW1hZ2VcbiAgZnVuY3Rpb24gbW92ZUF0KHBhZ2VYLCBwYWdlWSkge1xuICAgIGlmICghc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLmxlZnQgPVxuICAgICAgICBwYWdlWCAtXG4gICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1tzaGlwc1BsYWNlZF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArIDE3LjUpICtcbiAgICAgICAgXCJweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnRvcCA9XG4gICAgICAgIHBhZ2VZIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55ICsgMTcuNSkgK1xuICAgICAgICBcInB4XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgcGFnZVggLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggK1xuICAgICAgICAgICgoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID1cbiAgICAgICAgcGFnZVkgLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkgLVxuICAgICAgICAgICgoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgfVxuICB9XG5cbiAgLy8gbW92ZSBvdXIgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNhcnJpZXIgdW5kZXIgdGhlIHBvaW50ZXJcbiAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbiAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZSB0aGF0IHdlJ3JlIGZseWluZyBvdmVyIHJpZ2h0IG5vd1xuICBsZXQgY3VycmVudERyb3BwYWJsZSA9IG51bGw7XG4gIGxldCBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG4gIGxldCBpc0Ryb3BWYWxpZDtcblxuICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5oaWRkZW4gPSB0cnVlO1xuICAgIGxldCBlbGVtQmVsb3cgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuXG4gICAgLy8gbW91c2Vtb3ZlIGV2ZW50cyBtYXkgdHJpZ2dlciBvdXQgb2YgdGhlIHdpbmRvdyAod2hlbiB0aGUgc2hpcCBpcyBkcmFnZ2VkIG9mZi1zY3JlZW4pXG4gICAgLy8gaWYgY2xpZW50WC9jbGllbnRZIGFyZSBvdXQgb2YgdGhlIHdpbmRvdywgdGhlbiBlbGVtZW50RnJvbVBvaW50IHJldHVybnMgbnVsbFxuICAgIC8vIGNvbnN0IG1heFBhZ2VYID0gd2luZG93LmlubmVyV2lkdGggLSAoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgKiAzNTtcbiAgICAvLyBjb25zdCBtYXhQYWdlWSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIChzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF0gLSAxKSAqIDM1O1xuICAgIC8vIGNvbnNvbGUubG9nKFwiWDogXCIgKyBtYXhQYWdlWCArIFwiLCBZOiBcIiArIG1heFBhZ2VZKTtcblxuICAgIGlmICghZWxlbUJlbG93KSByZXR1cm47XG5cbiAgICAvLyBpZiAoIXNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUgJiYgZXZlbnQucGFnZVggPj0gbWF4UGFnZVgpIHtcbiAgICAvLyAgIGlzRHJvcFZhbGlkID0gZmFsc2U7XG4gICAgLy8gICByZXR1cm47XG4gICAgLy8gfSBlbHNlIGlmIChzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlICYmIGV2ZW50LnBhZ2VZID49IG1heFBhZ2VZKSB7XG4gICAgLy8gICBpc0Ryb3BWYWxpZCA9IGZhbHNlO1xuICAgIC8vICAgcmV0dXJuO1xuICAgIC8vIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICAvLyBjb25zb2xlLmxvZyh3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbiAgICAvLyBCRUdJTiAtLS0tIGNoZWNrcyB2YWxpZGl0eSBvZiB0aGUgZHJvcFxuICAgIGxldCBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eSA9IFtdO1xuICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LnNoaWZ0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF07IGkrKykge1xuICAgICAgbGV0IGdldENsYXNzVG9DaGVja1ZhbGlkaXR5O1xuICAgICAgaWYgKHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkgPSBkb2N1bWVudFxuICAgICAgICAgIC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgKyBpICogMzUpXG4gICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdldENsYXNzVG9DaGVja1ZhbGlkaXR5ID0gZG9jdW1lbnRcbiAgICAgICAgICAuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYICsgaSAqIDM1LCBldmVudC5jbGllbnRZKVxuICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGNsYXNzYCk7XG4gICAgICB9XG4gICAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5wdXNoKGdldENsYXNzVG9DaGVja1ZhbGlkaXR5KTtcbiAgICAgIGlmIChhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eVswXSkge1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoKGl0ZW0gJiYgaXRlbS5pbmNsdWRlcyhgaW52YWxpZGApKSB8fCBpdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNvdW50ZXIpIHtcbiAgICAgICAgICBpc0Ryb3BWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzRHJvcFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpc0Ryb3BWYWxpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5KTtcbiAgICAvLyBFTkQgLS0tLSBjaGVja3MgdmFsaWRpdHkgb2YgdGhlIGRyb3BcblxuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5oaWRkZW4gPSBmYWxzZTtcblxuICAgIC8vIC8vIG1vdXNlbW92ZSBldmVudHMgbWF5IHRyaWdnZXIgb3V0IG9mIHRoZSB3aW5kb3cgKHdoZW4gdGhlIHNoaXAgaXMgZHJhZ2dlZCBvZmYtc2NyZWVuKVxuICAgIC8vIC8vIGlmIGNsaWVudFgvY2xpZW50WSBhcmUgb3V0IG9mIHRoZSB3aW5kb3csIHRoZW4gZWxlbWVudEZyb21Qb2ludCByZXR1cm5zIG51bGxcbiAgICAvLyBpZiAoIWVsZW1CZWxvdykgcmV0dXJuO1xuXG4gICAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZXMgYXJlIGxhYmVsZWQgd2l0aCB0aGUgY2xhc3MgXCJkcm9wcGFibGVcIiAoY2FuIGJlIG90aGVyIGxvZ2ljKVxuICAgIGRyb3BwYWJsZUJlbG93ID0gZWxlbUJlbG93LmNsb3Nlc3QoXCIuY3B1U3F1YXJlXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKGRyb3BwYWJsZUJlbG93KTtcblxuICAgIGlmICghZHJvcHBhYmxlQmVsb3cgfHwgIWlzRHJvcFZhbGlkKSB7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuY3Vyc29yID0gYG5vLWRyb3BgO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuY3Vyc29yID0gYGdyYWJiaW5nYDtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudERyb3BwYWJsZSAhPSBkcm9wcGFibGVCZWxvdykge1xuICAgICAgLy8gd2UncmUgZmx5aW5nIGluIG9yIG91dC4uLlxuICAgICAgLy8gbm90ZTogYm90aCB2YWx1ZXMgY2FuIGJlIG51bGxcbiAgICAgIC8vICAgY3VycmVudERyb3BwYWJsZT1udWxsIGlmIHdlIHdlcmUgbm90IG92ZXIgYSBkcm9wcGFibGUgYmVmb3JlIHRoaXMgZXZlbnQgKGUuZyBvdmVyIGFuIGVtcHR5IHNwYWNlKVxuICAgICAgLy8gICBkcm9wcGFibGVCZWxvdz1udWxsIGlmIHdlJ3JlIG5vdCBvdmVyIGEgZHJvcHBhYmxlIG5vdywgZHVyaW5nIHRoaXMgZXZlbnRcblxuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgb3V0XCIgb2YgdGhlIGRyb3BwYWJsZSAocmVtb3ZlIGhpZ2hsaWdodClcbiAgICAgICAgbGVhdmVEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuICAgICAgfVxuICAgICAgY3VycmVudERyb3BwYWJsZSA9IGRyb3BwYWJsZUJlbG93O1xuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgaW5cIiBvZiB0aGUgZHJvcHBhYmxlXG4gICAgICAgIGVudGVyRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbnRlckRyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICAvLyBpZiAoZWxlbWVudCkge1xuICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICBjb25zdCBtYXhIb3Jpem9udGFsID0gKE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKyAxKSAqIDEwO1xuICAgIGNvbnN0IG1heFZlcnRpY2FsID1cbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC1cbiAgICAgIE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKiAxMCArXG4gICAgICA5MDtcbiAgICBpZiAoXG4gICAgICAhc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSAmJlxuICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgPFxuICAgICAgICBtYXhIb3Jpem9udGFsICYmXG4gICAgICBpc0Ryb3BWYWxpZFxuICAgICkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgXCIjODI5RTc2XCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSAmJlxuICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgKiAxMCA8PVxuICAgICAgICBtYXhWZXJ0aWNhbCAmJlxuICAgICAgaXNEcm9wVmFsaWRcbiAgICApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODI5RTc2XCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhgaGVyZWApO1xuICAgICAgZHJvcHBhYmxlQmVsb3cgPSBudWxsO1xuICAgICAgc2hpcENvb3JkcyA9IFtdO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhzaGlwQ29vcmRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYXZlRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4gICAgc2hpcENvb3JkcyA9IFtdO1xuICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICBpZiAoIXNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldKSB7XG4gICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbiAgICAgICAgICAgIFwiI2MxYzFjMVwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjYzFjMWMxXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyAoMikgbW92ZSB0aGUgc2hpcCBvbiBtb3VzZW1vdmVcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG5cbiAgLy8gKDMpIGRyb3AgdGhlIHNoaXAsIHJlbW92ZSB1bm5lZWRlZCBoYW5kbGVyc1xuICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0ub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5vbm1vdXNldXAgPSBudWxsO1xuICAgIC8vIGNvbnNvbGUubG9nKHNoaXBDb29yZHMpO1xuICAgIGlmIChzaGlwQ29vcmRzLmxlbmd0aCAhPT0gMCAmJiBkcm9wcGFibGVCZWxvdyAmJiBpc0Ryb3BWYWxpZCkge1xuICAgICAgcGxheWVyRmxlZXQucHVzaCh7XG4gICAgICAgIG5hbWU6IHNoaXBOYW1lc1tzaGlwc1BsYWNlZF0sXG4gICAgICAgIHNoaXBQbGFjZW1lbnQ6IHNoaXBDb29yZHMsXG4gICAgICB9KTtcbiAgICAgIHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5yZW1vdmVDaGlsZChzaGlwSW1nc1tzaGlwc1BsYWNlZF0pO1xuICAgICAgcmVuZGVyUGxheWVyU2hpcHMoW3BsYXllckZsZWV0W3NoaXBzUGxhY2VkXV0pO1xuICAgICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYCNjMWMxYzFgO1xuICAgICAgfSk7XG4gICAgICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoaW5kZXggPT09IHBsYXllckZsZWV0Lmxlbmd0aCkge1xuICAgICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShgaGlkZS1zaGlwYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2hpcHNQbGFjZWQgKz0gMTtcbiAgICAgIGNvbnN0IGNsZWFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NsZWFyLWJvYXJkLWJ0bmApO1xuICAgICAgaWYgKHNoaXBzUGxhY2VkID09PSAxKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbWl6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNyYW5kb21pemUtcGxheWVyLWZsZWV0YCk7XG4gICAgICAgIHJhbmRvbWl6ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmUgYDtcbiAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgfVxuICAgICAgaWYgKHNoaXBzUGxhY2VkID09PSA1KSB7XG4gICAgICAgIHN0YXJ0QnRuLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgICAgICAgcm90YXRlQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYWNlU2hpcHNDb250YWluZXIuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0sXG4gICAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkICsgMV1cbiAgICAgICk7XG4gICAgICBpZiAoc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlID0gYGA7XG4gICAgICB9XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID0gXCIxMDBweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnpJbmRleCA9IDA7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuY3Vyc29yID0gYGdyYWJgO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IHsgaGlkZVNoaXBzVG9QbGFjZSB9O1xuIiwiaW1wb3J0IHsgZ2FtZUxvb3AgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuXG5mdW5jdGlvbiByZW5kZXJHYW1lYm9hcmQodXNlcikge1xuICBsZXQgYm9hcmREaXY7XG4gIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICB9IGVsc2Uge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICB9XG4gIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gIGJvYXJkLmNsYXNzTGlzdC5hZGQoYGdhbWVib2FyZGApO1xuICBjb25zdCBtYXhTcXVhcmVzID0gMTAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1heFNxdWFyZXM7IGkrKykge1xuICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIC8vIHNxdWFyZS50ZXh0Q29udGVudCA9IGk7XG4gICAgc3F1YXJlLmRhdGFzZXQuaW5kZXhOdW1iZXIgPSBpO1xuICAgIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYHBsYXllclNxdWFyZWApO1xuICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYGNwdVNxdWFyZWApO1xuICAgIH1cbiAgICBib2FyZC5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICB9XG4gIGJvYXJkRGl2LmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuY29uc3QgcGxheWVyQXR0YWNrID0gKGUpID0+IHtcbiAgY29uc3QgY29vcmRpbmF0ZUNsaWNrZWQgPSArZS50YXJnZXQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgZ2FtZUxvb3AoY29vcmRpbmF0ZUNsaWNrZWQpO1xuICBlLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG59O1xuXG4vLyByZW5kZXJHYW1lYm9hcmQoYHBsYXllcmApO1xucmVuZGVyR2FtZWJvYXJkKGBjcHVgKTtcblxuZnVuY3Rpb24gZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhhcnJheSkge1xuICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICBhcnJheS5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgIHNxdWFyZXNbaW5kZXhdLnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlck1vdmUod2hvc2VUdXJuLCBhdHRhY2tBcnJheSkge1xuICBsZXQgc3F1YXJlcztcbiAgY29uc3QgaGl0SW5kZXggPSBhdHRhY2tBcnJheVsxXTtcbiAgaWYgKHdob3NlVHVybiA9PT0gYHBsYXllcmApIHtcbiAgICBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICB9IGVsc2Uge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG4gIH1cbiAgaWYgKGF0dGFja0FycmF5WzBdKSB7XG4gICAgc3F1YXJlc1toaXRJbmRleF0uY2xhc3NMaXN0LmFkZChgaGl0YCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlc1toaXRJbmRleF0uY2xhc3NMaXN0LmFkZChgbWlzc2ApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckNvbXB1dGVyU2hpcHMoY3B1RmxlZXQpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gIGxldCBpbWdTcmM7XG5cbiAgY3B1RmxlZXQuZm9yRWFjaCgoc2hpcE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGBjcHUtc2hpcHMtcmVuZGVyZWRgKTtcbiAgICBjb25zdCBzaGlwSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBpbWdgKTtcbiAgICBpZiAoc2hpcE9iamVjdC5uYW1lID09PSBgUGF0cm9sIEJvYXRgKSB7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzL3BhdHJvbC5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYHBhdHJvbGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXBPYmplY3QubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy8ke3NoaXBOYW1lfS5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYCR7c2hpcE5hbWV9YCk7XG4gICAgfVxuICAgIHNoaXBJbWFnZS5zcmMgPSBpbWdTcmM7XG5cbiAgICBjb25zdCBzb3J0QXNjZW5kaW5nID0gc2hpcE9iamVjdC5zaGlwUGxhY2VtZW50LnNvcnQoKHgsIHkpID0+IHggLSB5KTtcbiAgICBjb25zdCBkaW1lbnNpb25PZlNxdWFyZSA9IDM1O1xuICAgIGxldCB0b3BPZmZzZXQ7XG4gICAgbGV0IGxlZnRPZmZzZXQ7XG4gICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gKyAxID09PSBzb3J0QXNjZW5kaW5nWzFdKSB7XG4gICAgICAvLyBwbGFjZSBob3Jpem9udGFsIHNoaXBzXG4gICAgICB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9IHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwbGFjZSB2ZXJ0aWNhbCBzaGlwc1xuICAgICAgc2hpcEltYWdlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoLTkwZGVnKWA7XG4gICAgICB0b3BPZmZzZXQgPVxuICAgICAgICBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSArXG4gICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgIHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcEltYWdlLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGA7XG4gICAgc2hpcEltYWdlLnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgICBwbGF5ZXJCb2FyZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9KTtcbiAgcmVuZGVyR2FtZWJvYXJkKGBwbGF5ZXJgKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyUGxheWVyU2hpcHMoZmxlZXQpIHtcbiAgLy8gY29uc29sZS5sb2coIWZsZWV0WzBdLnNoaXBQbGFjZW1lbnQpO1xuICAvLyBjb25zb2xlLmxvZyhmbGVldFswXS5zaGlwUGxhY2VtZW50KTtcbiAgLy8gY29uc29sZS5sb2coZmxlZXRbMF0uc2hpcFBsYWNlbWVudFswXSA9PT0gdW5kZWZpbmVkKTtcbiAgaWYgKGZsZWV0WzBdLnNoaXBQbGFjZW1lbnRbMF0gPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBmbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYHBsYXllci1zaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYGludmFsaWRgKTtcbiAgICBzaGlwSW1hZ2Uuc3JjID0gaW1nU3JjO1xuXG4gICAgY29uc3Qgc29ydEFzY2VuZGluZyA9IHNoaXBPYmplY3Quc2hpcFBsYWNlbWVudC5zb3J0KCh4LCB5KSA9PiB4IC0geSk7XG4gICAgY29uc3QgZGltZW5zaW9uT2ZTcXVhcmUgPSAzNTtcbiAgICBsZXQgdG9wT2Zmc2V0O1xuICAgIGxldCBsZWZ0T2Zmc2V0O1xuICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdICsgMSA9PT0gc29ydEFzY2VuZGluZ1sxXSkge1xuICAgICAgLy8gcGxhY2UgaG9yaXpvbnRhbCBzaGlwc1xuICAgICAgdG9wT2Zmc2V0ID0gTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgLSAzNTA7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGxhY2UgdmVydGljYWwgc2hpcHNcbiAgICAgIHNoaXBJbWFnZS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKC05MGRlZylgO1xuICAgICAgdG9wT2Zmc2V0ID1cbiAgICAgICAgTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgK1xuICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1IC1cbiAgICAgICAgMzUwO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBJbWFnZS5zdHlsZS50b3AgPSBgJHt0b3BPZmZzZXR9cHhgO1xuICAgIHNoaXBJbWFnZS5zdHlsZS5sZWZ0ID0gYCR7bGVmdE9mZnNldH1weGA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gICAgY3B1Qm9hcmQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7XG4gIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMsXG4gIHJlbmRlck1vdmUsXG4gIHJlbmRlckNvbXB1dGVyU2hpcHMsXG4gIHJlbmRlclBsYXllclNoaXBzLFxufTtcbiIsImNvbnN0IFNoaXBzID0gKCkgPT4ge1xuICBjb25zdCBmbGVldCA9IFtcbiAgICB7IG5hbWU6IGBDYXJyaWVyYCwgbGVuZ3RoOiA1LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYEJhdHRsZXNoaXBgLCBsZW5ndGg6IDQsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgRGVzdHJveWVyYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFN1Ym1hcmluZWAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBQYXRyb2wgQm9hdGAsIGxlbmd0aDogMiwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgXTtcblxuICBjb25zdCBoaXQgPSAoYXR0YWNrRGF0YSkgPT4ge1xuICAgIGNvbnN0IHNoaXBIaXQgPSBhdHRhY2tEYXRhWzBdO1xuICAgIGNvbnN0IGNvb3JkT2ZIaXQgPSBhdHRhY2tEYXRhWzFdO1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUpIHtcbiAgICAgICAgc2hpcC5oaXRzLnB1c2goY29vcmRPZkhpdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKHNoaXBIaXQpID0+IHtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lICYmIHNoaXAubGVuZ3RoID09PSBzaGlwLmhpdHMubGVuZ3RoKSB7XG4gICAgICAgIHNoaXAuaXNTdW5rID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4geyBmbGVldCwgaGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCB7IFNoaXBzIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LmpzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==