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
/* harmony export */   "gameLoop": () => (/* binding */ gameLoop),
/* harmony export */   "createPlayerObjects": () => (/* binding */ createPlayerObjects)
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
  }
  const playerFleetArray = [];
  const playerFleet = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.placeComputerFleet)(`user`, playerFleetArray);
  createPlayerObjects(playerFleet);
  // const playerBoard = Gameboard(playerFleet);
  // storedGameboards.push([`computer`, playerBoard]);
  // console.log(storedGameboards[0][1].ships.fleet);
}

function createPlayerObjects(fleet) {
  const playerBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard)(fleet);
  storedGameboards.push([`computer`, playerBoard]);
  console.log(storedGameboards);
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
        console.log(storedGameboards);
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
            // console.log(`here with ` + object.name);
            isShipSunk = object.isSunk;
            arrayIndex = index;
            if (isShipSunk) {
              const cpuHiddenShips =
                document.querySelectorAll(`.cpu-ships-rendered`);
              cpuHiddenShips[index].style.display = `block`;
              cpuHiddenShips[index].style.zIndex = `1`;
            }
            // console.log(isShipSunk);
            // console.log(arrayIndex);
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
  if (shipsPlaced === 5) {
    console.log(`create objects`);
    (0,_gameHandler__WEBPACK_IMPORTED_MODULE_0__.createPlayerObjects)(playerFleet);
    cpuBoardSquares.forEach((square) => {
      square.style.backgroundColor = ``;
    });
  }
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
  console.log({ whoseTurn, attackArray });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZW5kZXJHYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUEyRTtBQUtyRDtBQUN3Qjs7QUFFOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRSwyREFBZ0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDhEQUFrQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLHFEQUFTO0FBQy9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQiw4REFBa0I7QUFDeEMsc0JBQXNCLHFEQUFTO0FBQy9COztBQUVBO0FBQ0E7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LGlDQUFpQyxTQUFTO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixVQUFVO0FBQ3ZDLDhCQUE4QixXQUFXO0FBQ3pDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBT0U7Ozs7Ozs7Ozs7Ozs7OztBQ3JMRjtBQUNBO0FBQ0EsS0FBSyxzREFBc0Q7QUFDM0QsS0FBSyx5REFBeUQ7QUFDOUQsS0FBSyx3REFBd0Q7QUFDN0QsS0FBSyx3REFBd0Q7QUFDN0QsS0FBSywwREFBMEQ7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxVQUFVO0FBQ1Y7O0FBRWlCOzs7Ozs7O1VDOUJqQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQge1xuICByZW5kZXJNb3ZlLFxuICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzLFxuICByZW5kZXJQbGF5ZXJTaGlwcyxcbn0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuaW1wb3J0IHsgaGlkZVNoaXBzVG9QbGFjZSB9IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmNvbnN0IHN0b3JlZEdhbWVib2FyZHMgPSBbXTtcblxubGV0IHR1cm5Db3VudGVyID0gMTtcbmZ1bmN0aW9uIHR1cm5Ecml2ZXIoKSB7XG4gIGxldCB3aG9zZU1vdmU7XG4gIGlmICh0dXJuQ291bnRlciAlIDIgIT09IDApIHtcbiAgICB3aG9zZU1vdmUgPSBgcGxheWVyYDtcbiAgfSBlbHNlIHtcbiAgICB3aG9zZU1vdmUgPSBgY29tcHV0ZXJgO1xuICB9XG4gIHR1cm5Db3VudGVyICs9IDE7XG4gIHJldHVybiB3aG9zZU1vdmU7XG59XG5cbmNvbnN0IHJhbmRvbWl6ZVBsYXllckZsZWV0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgYCNyYW5kb21pemUtcGxheWVyLWZsZWV0YFxuKTtcbnJhbmRvbWl6ZVBsYXllckZsZWV0QnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcmFuZG9taXplUGxheWVyRmxlZXQpO1xuXG5mdW5jdGlvbiByYW5kb21pemVQbGF5ZXJGbGVldCgpIHtcbiAgaGlkZVNoaXBzVG9QbGFjZSgpO1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzdGFydC1nYW1lLWJ0bmApO1xuICBzdGFydEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gIGlmIChzdG9yZWRHYW1lYm9hcmRzWzFdKSB7XG4gICAgc3RvcmVkR2FtZWJvYXJkcy5wb3AoKTtcbiAgICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgICBjb25zdCByZW5kZXJlZFBsYXllclNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGAucGxheWVyLXNoaXBzLXJlbmRlcmVkYFxuICAgICk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgIGNwdUJvYXJkLnJlbW92ZUNoaWxkKHJlbmRlcmVkUGxheWVyU2hpcHNbaV0pO1xuICAgIH1cbiAgfVxuICBjb25zdCBwbGF5ZXJGbGVldEFycmF5ID0gW107XG4gIGNvbnN0IHBsYXllckZsZWV0ID0gcGxhY2VDb21wdXRlckZsZWV0KGB1c2VyYCwgcGxheWVyRmxlZXRBcnJheSk7XG4gIGNyZWF0ZVBsYXllck9iamVjdHMocGxheWVyRmxlZXQpO1xuICAvLyBjb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVib2FyZChwbGF5ZXJGbGVldCk7XG4gIC8vIHN0b3JlZEdhbWVib2FyZHMucHVzaChbYGNvbXB1dGVyYCwgcGxheWVyQm9hcmRdKTtcbiAgLy8gY29uc29sZS5sb2coc3RvcmVkR2FtZWJvYXJkc1swXVsxXS5zaGlwcy5mbGVldCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBsYXllck9iamVjdHMoZmxlZXQpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lYm9hcmQoZmxlZXQpO1xuICBzdG9yZWRHYW1lYm9hcmRzLnB1c2goW2Bjb21wdXRlcmAsIHBsYXllckJvYXJkXSk7XG4gIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xufVxuXG5jb25zdCBjcHVGbGVldEFycmF5ID0gW107XG5jb25zdCBjb21wdXRlckZsZWV0ID0gcGxhY2VDb21wdXRlckZsZWV0KGBjcHVgLCBjcHVGbGVldEFycmF5KTtcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lYm9hcmQoY29tcHV0ZXJGbGVldCk7XG5zdG9yZWRHYW1lYm9hcmRzLnB1c2goW2BwbGF5ZXJgLCBjb21wdXRlckJvYXJkXSk7XG5cbi8vIEJFR0lOIC0tLS0tIGdlbmVyYXRlcyByYW5kb20gbW92ZSBmb3IgY29tcHV0ZXIgLS0tLS0tLS0tLS0gLy9cbmZ1bmN0aW9uIGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpIHtcbiAgY29uc3QgdmFsaWRNb3ZlcyA9IFtdO1xuICBjb25zdCBtYXhNb3ZlcyA9IDEwMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhNb3ZlczsgaSsrKSB7XG4gICAgdmFsaWRNb3Zlcy5wdXNoKGkpO1xuICB9XG4gIHJldHVybiB2YWxpZE1vdmVzO1xufVxuXG5jb25zdCBnZXRWYWxpZE1vdmVzID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG5jb25zdCBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCkge1xuICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdldFZhbGlkTW92ZXMubGVuZ3RoKTtcbiAgY29uc3QgcmFuZG9tTW92ZSA9IGdldFZhbGlkTW92ZXNbcmFuZG9tSW5kZXhdO1xuICBnZXRWYWxpZE1vdmVzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gIHJldHVybiByYW5kb21Nb3ZlO1xufVxuLy8gRU5EIC0tLS0tIGdlbmVyYXRlcyByYW5kb20gbW92ZSBmb3IgY29tcHV0ZXIgLS0tLS0tLS0tLS0gLy9cblxuZnVuY3Rpb24gZ2FtZUxvb3AocGxheWVyTW92ZSkge1xuICBsZXQgZ2V0VHVybjtcbiAgbGV0IGNvb3JkT2ZBdHRhY2s7XG4gIGxldCBpc0dhbWVPdmVyID0gZmFsc2U7XG4gIGNvbnN0IGluZGV4VG9TcGxpY2UgPSBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZy5maW5kSW5kZXgoXG4gICAgKGluZGV4KSA9PiBpbmRleCA9PT0gcGxheWVyTW92ZVxuICApO1xuICBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZy5zcGxpY2UoaW5kZXhUb1NwbGljZSwgMSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XG4gICAgICBnZXRUdXJuID0gdHVybkRyaXZlcigpO1xuICAgICAgaWYgKGdldFR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgICAgIGNvb3JkT2ZBdHRhY2sgPSBwbGF5ZXJNb3ZlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRPZkF0dGFjayA9IGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF0dGFja091dGNvbWUgPSByZWNlaXZlQXR0YWNrKGNvb3JkT2ZBdHRhY2ssIGdldFR1cm4pO1xuICAgICAgY29uc29sZS5sb2coYXR0YWNrT3V0Y29tZSk7XG4gICAgICByZW5kZXJNb3ZlKGdldFR1cm4sIGF0dGFja091dGNvbWUpO1xuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0pIHtcbiAgICAgICAgY29uc29sZS5sb2coc3RvcmVkR2FtZWJvYXJkcyk7XG4gICAgICAgIHN0b3JlZEdhbWVib2FyZHMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW1bMF0gPT09IGdldFR1cm4pIHtcbiAgICAgICAgICAgIGlzR2FtZU92ZXIgPSBpdGVtWzFdLmlzR2FtZU92ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gJiYgZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbiAgICAgICAgbGV0IGlzU2hpcFN1bms7XG4gICAgICAgIGxldCBhcnJheUluZGV4O1xuICAgICAgICBzdG9yZWRHYW1lYm9hcmRzWzBdWzFdLnNoaXBzLmZsZWV0LmZpbHRlcigob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdID09PSBvYmplY3QubmFtZSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYGhlcmUgd2l0aCBgICsgb2JqZWN0Lm5hbWUpO1xuICAgICAgICAgICAgaXNTaGlwU3VuayA9IG9iamVjdC5pc1N1bms7XG4gICAgICAgICAgICBhcnJheUluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICBpZiAoaXNTaGlwU3Vuaykge1xuICAgICAgICAgICAgICBjb25zdCBjcHVIaWRkZW5TaGlwcyA9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICAgICAgICAgICAgICBjcHVIaWRkZW5TaGlwc1tpbmRleF0uc3R5bGUuZGlzcGxheSA9IGBibG9ja2A7XG4gICAgICAgICAgICAgIGNwdUhpZGRlblNoaXBzW2luZGV4XS5zdHlsZS56SW5kZXggPSBgMWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpc1NoaXBTdW5rKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFycmF5SW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNHYW1lT3Zlcikge1xuICAgICAgICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGdldFBsYXllck1vdmVzUmVtYWluaW5nKTtcbiAgICAgICAgYWxlcnQoYGdhbWUgb3ZlciEgJHtnZXRUdXJufSB3aW5zIWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzLCBnYW1lTG9vcCwgY3JlYXRlUGxheWVyT2JqZWN0cyB9O1xuIiwiaW1wb3J0IHsgU2hpcHMgfSBmcm9tIFwiLi9zaGlwTW9kdWxlXCI7XG5pbXBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHJlbmRlckNvbXB1dGVyU2hpcHMsIHJlbmRlclBsYXllclNoaXBzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuXG5jb25zdCBHYW1lYm9hcmQgPSAoZmxlZXRBcnJheSkgPT4ge1xuICBjb25zdCBnYW1lYm9hcmQgPSBbXG4gICAgZmxlZXRBcnJheVswXSxcbiAgICBmbGVldEFycmF5WzFdLFxuICAgIGZsZWV0QXJyYXlbMl0sXG4gICAgZmxlZXRBcnJheVszXSxcbiAgICBmbGVldEFycmF5WzRdLFxuICBdO1xuICBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBTaGlwcygpO1xuXG4gIGNvbnN0IGlzR2FtZU92ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBzaGlwcy5mbGVldDtcbiAgICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgIGxldCBzaGlwc1N1bmtDb3VudGVyID0gMDtcblxuICAgIGFycmF5LmZpbHRlcigob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLmlzU3Vuaykge1xuICAgICAgICBzaGlwc1N1bmtDb3VudGVyICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHNoaXBzU3Vua0NvdW50ZXIgPT09IDUpIHtcbiAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNHYW1lT3ZlcjtcbiAgfTtcblxuICByZXR1cm4geyBnYW1lYm9hcmQsIG1pc3Nlcywgc2hpcHMsIGlzR2FtZU92ZXIgfTtcbn07XG5cbi8vIC8vIEJFR0lOLS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgY29tcHV0ZXIgLS0tLS0tLSAvL1xuLy8gY29uc3QgY29tcHV0ZXJGbGVldCA9IFtdO1xuXG4vLyBmdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpIHtcbi8vICAgY29uc3QgbnVtYmVyT2ZDb29yZGluYXRlcyA9IDEwMDtcbi8vICAgY29uc3Qgb3JpZW50YXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbi8vICAgY29uc3QgZmlyc3RDb29yZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bWJlck9mQ29vcmRpbmF0ZXMpO1xuLy8gICByZXR1cm4gW29yaWVudGF0aW9uLCBmaXJzdENvb3JkXTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gb3JpZW50U2hpcChzdGFydENvb3JkLCBvcmllbnRhdGlvbiwgbmFtZSwgbGVuZ3RoKSB7XG4vLyAgIGxldCBzaGlwUGxhY2VtZW50ID0gW107XG4vLyAgIGxldCBob3Jpem9udGFsTGltaXQ7XG4vLyAgIGlmIChzdGFydENvb3JkIDwgMTApIHtcbi8vICAgICBob3Jpem9udGFsTGltaXQgPSA5O1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIGhvcml6b250YWxMaW1pdCA9ICsoc3RhcnRDb29yZC50b1N0cmluZygpLmNoYXJBdCgwKSArIDkpO1xuLy8gICB9XG4vLyAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbi8vICAgICBpZiAob3JpZW50YXRpb24pIHtcbi8vICAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpICogMTAgPCAxMDApIHtcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpICogMTApO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpICogMTApO1xuLy8gICAgICAgfVxuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSA8PSBob3Jpem9udGFsTGltaXQpIHtcbi8vICAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSk7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG4vLyAgIHJldHVybiB7IG5hbWUsIHNoaXBQbGFjZW1lbnQgfTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gdmVyaWZ5Q29vcmRzKG9iamVjdCkge1xuLy8gICBjb25zdCBzaGlwVG9WZXJpZnkgPSBvYmplY3Quc2hpcFBsYWNlbWVudDtcbi8vICAgbGV0IGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbi8vICAgaWYgKCFjb21wdXRlckZsZWV0Lmxlbmd0aCkge1xuLy8gICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuLy8gICAgIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFRvVmVyaWZ5Lmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICBpZiAoIWlzUGxhY2VtZW50VmFsaWQpIHtcbi8vICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBjb21wdXRlckZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbi8vICAgICAgICAgICBpZiAoaXNQbGFjZW1lbnRWYWxpZCkge1xuLy8gICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLnNoaXBQbGFjZW1lbnQubGVuZ3RoOyBqKyspIHtcbi8vICAgICAgICAgICAgICAgaWYgKHNoaXBUb1ZlcmlmeVtpXSAhPT0gc2hpcC5zaGlwUGxhY2VtZW50W2pdKSB7XG4vLyAgICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4vLyAgICAgICAgICAgICAgICAgY29udGludWU7XG4vLyAgICAgICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuLy8gICAgICAgICAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9KTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH1cbi8vICAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG4vLyB9XG5cbi8vIC8vIHVzZWQgZm9yIHRoZSBuYW1lIGFuZCBsZW5ndGggcHJvcHMgaW4gdGhlIHBsYWNlQ29tcHV0ZXJGbGVldCBmeG5cbi8vIGNvbnN0IHNoaXBDbG9uZSA9IFNoaXBzKCk7XG5cbi8vIGZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJGbGVldCgpIHtcbi8vICAgc2hpcENsb25lLmZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbi8vICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuLy8gICAgIHdoaWxlICghaXNWYWxpZCkge1xuLy8gICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuLy8gICAgICAgY29uc3QgcmFuZG9tVmFsdWVzID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKTtcbi8vICAgICAgIGNvbnN0IHBsYWNlbWVudCA9IG9yaWVudFNoaXAoXG4vLyAgICAgICAgIHJhbmRvbVZhbHVlc1sxXSxcbi8vICAgICAgICAgcmFuZG9tVmFsdWVzWzBdLFxuLy8gICAgICAgICBzaGlwLm5hbWUsXG4vLyAgICAgICAgIHNoaXAubGVuZ3RoXG4vLyAgICAgICApO1xuLy8gICAgICAgY29uc3QgdmVyaWZ5ID0gdmVyaWZ5Q29vcmRzKHBsYWNlbWVudCk7XG4vLyAgICAgICBpZiAodmVyaWZ5KSB7XG4vLyAgICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuLy8gICAgICAgICBjb21wdXRlckZsZWV0LnB1c2gocGxhY2VtZW50KTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH0pO1xuLy8gICByZW5kZXJDb21wdXRlclNoaXBzKGNvbXB1dGVyRmxlZXQpO1xuLy8gICByZXR1cm4gY29tcHV0ZXJGbGVldDtcbi8vIH1cbi8vIC8vIEVORC0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIGNvbXB1dGVyIC0tLS0tLS0gLy9cblxuY29uc3QgcmVjZWl2ZUF0dGFjayA9IChhdHRhY2tDb29yZCwgdXNlcikgPT4ge1xuICBsZXQgaW5kZXg7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIGF0dGFja0Nvb3JkXTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgaW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gMTtcbiAgfVxuICBjb25zdCBnYW1lYm9hcmRPYmplY3QgPSBzdG9yZWRHYW1lYm9hcmRzW2luZGV4XVsxXTtcbiAgZ2FtZWJvYXJkT2JqZWN0LmdhbWVib2FyZC5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICBpZiAob2JqZWN0LnNoaXBQbGFjZW1lbnQuaW5jbHVkZXMoYXR0YWNrQ29vcmQpKSB7XG4gICAgICBhdHRhY2tPdXRjb21lID0gW29iamVjdC5uYW1lLCBhdHRhY2tDb29yZF07XG4gICAgfVxuICB9KTtcbiAgaWYgKCFhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgZ2FtZWJvYXJkT2JqZWN0Lm1pc3Nlcy5wdXNoKGF0dGFja0Nvb3JkKTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lYm9hcmRPYmplY3Quc2hpcHMuaGl0KGF0dGFja091dGNvbWUpO1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5pc1N1bmsoYXR0YWNrT3V0Y29tZVswXSk7XG4gIH1cbiAgcmV0dXJuIGF0dGFja091dGNvbWU7XG59O1xuXG4vLyBCRUdJTi0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIHBsYXllciAtLS0tLS0tIC8vXG4vLyBjb25zdCBjb21wdXRlckZsZWV0ID0gW107XG4vLyBjb25zdCBwbGF5ZXJGbGVldCA9IFtdO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpIHtcbiAgY29uc3QgbnVtYmVyT2ZDb29yZGluYXRlcyA9IDEwMDtcbiAgY29uc3Qgb3JpZW50YXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgY29uc3QgZmlyc3RDb29yZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bWJlck9mQ29vcmRpbmF0ZXMpO1xuICByZXR1cm4gW29yaWVudGF0aW9uLCBmaXJzdENvb3JkXTtcbn1cblxuZnVuY3Rpb24gb3JpZW50U2hpcChzdGFydENvb3JkLCBvcmllbnRhdGlvbiwgbmFtZSwgbGVuZ3RoKSB7XG4gIGxldCBzaGlwUGxhY2VtZW50ID0gW107XG4gIGxldCBob3Jpem9udGFsTGltaXQ7XG4gIGlmIChzdGFydENvb3JkIDwgMTApIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSA5O1xuICB9IGVsc2Uge1xuICAgIGhvcml6b250YWxMaW1pdCA9ICsoc3RhcnRDb29yZC50b1N0cmluZygpLmNoYXJBdCgwKSArIDkpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3JpZW50YXRpb24pIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpICogMTAgPCAxMDApIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpICogMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpICogMTApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSA8PSBob3Jpem9udGFsTGltaXQpIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7IG5hbWUsIHNoaXBQbGFjZW1lbnQgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5Q29vcmRzKGFycmF5LCBvYmplY3QpIHtcbiAgY29uc3Qgc2hpcFRvVmVyaWZ5ID0gb2JqZWN0LnNoaXBQbGFjZW1lbnQ7XG4gIGxldCBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gIGlmICghYXJyYXkubGVuZ3RoKSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG4gIH0gZWxzZSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwVG9WZXJpZnkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgICBpZiAoaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLnNoaXBQbGFjZW1lbnQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNoaXBUb1ZlcmlmeVtpXSAhPT0gc2hpcC5zaGlwUGxhY2VtZW50W2pdKSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG59XG5cbi8vIHVzZWQgZm9yIHRoZSBuYW1lIGFuZCBsZW5ndGggcHJvcHMgaW4gdGhlIHBsYWNlQ29tcHV0ZXJGbGVldCBmeG5cbmNvbnN0IHNoaXBDbG9uZSA9IFNoaXBzKCk7XG5cbmZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJGbGVldCh1c2VyLCBhcnJheSkge1xuICBzaGlwQ2xvbmUuZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgd2hpbGUgKCFpc1ZhbGlkKSB7XG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICBjb25zdCByYW5kb21WYWx1ZXMgPSBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpO1xuICAgICAgY29uc3QgcGxhY2VtZW50ID0gb3JpZW50U2hpcChcbiAgICAgICAgcmFuZG9tVmFsdWVzWzFdLFxuICAgICAgICByYW5kb21WYWx1ZXNbMF0sXG4gICAgICAgIHNoaXAubmFtZSxcbiAgICAgICAgc2hpcC5sZW5ndGhcbiAgICAgICk7XG4gICAgICBjb25zdCB2ZXJpZnkgPSB2ZXJpZnlDb29yZHMoYXJyYXksIHBsYWNlbWVudCk7XG4gICAgICBpZiAodmVyaWZ5KSB7XG4gICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICBhcnJheS5wdXNoKHBsYWNlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKHVzZXIgPT09IGBjcHVgKSB7XG4gICAgcmVuZGVyQ29tcHV0ZXJTaGlwcyhhcnJheSk7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyUGxheWVyU2hpcHMoYXJyYXkpO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cbi8vIEVORC0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIHBsYXllciAtLS0tLS0tIC8vXG5cbmV4cG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH07XG4iLCJpbXBvcnQgeyBjcmVhdGVQbGF5ZXJPYmplY3RzIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHJlbmRlclBsYXllclNoaXBzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuXG5jb25zdCBwbGF5ZXJGbGVldCA9IFtdO1xuXG5jb25zdCBzaGlwTmFtZXMgPSBbXG4gIGBDYXJyaWVyYCxcbiAgYEJhdHRsZXNoaXBgLFxuICBgRGVzdHJveWVyYCxcbiAgYFN1Ym1hcmluZWAsXG4gIGBQYXRyb2wgQm9hdGAsXG5dO1xuY29uc3Qgc2hpcExlbmd0aHMgPSBbNSwgNCwgMywgMywgMl07XG5sZXQgc2hpcHNQbGFjZWQgPSAwO1xubGV0IHNoaXBDb29yZHMgPSBbXTtcblxuY29uc3QgY3B1R2FtZUJvYXJkVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkLWhlYWRlcmApO1xuY29uc3QgY3B1Qm9hcmRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdVNxdWFyZWApO1xuY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2J0bi1yb3RhdGUtc2hpcGApO1xuY29uc3QgcGxhY2VTaGlwc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGFjZS1zaGlwcy1jb250YWluZXJgKTtcbmNvbnN0IHBsYXllclNoaXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgYC5wbGF5ZXItc2hpcHMtY29udGFpbmVyYFxuKTtcbmNvbnN0IHNoaXBJbWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnNoaXBzLXRvLXBsYWNlYCk7XG5cbmZ1bmN0aW9uIGhpZGVTaGlwc1RvUGxhY2UoKSB7XG4gIHNoaXBJbWdzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoYGhpZGUtc2hpcGApO1xuICB9KTtcbiAgcm90YXRlQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG59XG5cbi8vIGhpZGVzIGFsbCBidXQgdGhlIGNhcnJpZXIgb24gcGFnZSBsb2FkXG5zaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICBpZiAoaW5kZXggIT09IDApIHtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoYGhpZGUtc2hpcGApO1xuICB9XG59KTtcblxuLy8gbGFiZWxzIHRoZSBjb21wdXRlciBnYW1lYm9hcmQgb24gcGFnZSBsb2FkXG5jcHVHYW1lQm9hcmRUaXRsZS50ZXh0Q29udGVudCA9IGBQTEFDRSBZT1VSIFNISVBTYDtcblxuLy8gc3RhcnQgZ2FtZSBidXR0b25cbmNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3N0YXJ0LWdhbWUtYnRuYCk7XG5zdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIGJlZ2luR2FtZSk7XG5cbmZ1bmN0aW9uIGJlZ2luR2FtZSgpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gIGNwdUdhbWVCb2FyZFRpdGxlLnRleHRDb250ZW50ID0gYENvbXB1dGVyYDtcbiAgcGxheWVyQm9hcmQuc3R5bGUuZGlzcGxheSA9IGBibG9ja2A7XG4gIHBsYWNlU2hpcHNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgaWYgKHNoaXBzUGxhY2VkID09PSA1KSB7XG4gICAgY29uc29sZS5sb2coYGNyZWF0ZSBvYmplY3RzYCk7XG4gICAgY3JlYXRlUGxheWVyT2JqZWN0cyhwbGF5ZXJGbGVldCk7XG4gICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGBgO1xuICAgIH0pO1xuICB9XG59XG5cbnJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHJvdGF0ZVNoaXApO1xuXG5mdW5jdGlvbiByb3RhdGVTaGlwKGUpIHtcbiAgaWYgKCFzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlKSB7XG4gICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSA9IGAtOTBkZWdgO1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS50b3AgPVxuICAgICAgMTAwICsgKChzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF0gLSAxKSAvIDIpICogMzUgKyBgcHhgO1xuICB9IGVsc2Uge1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUgPSBgYDtcbiAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID0gMTAwICsgYHB4YDtcbiAgfVxufVxuXG5zaGlwSW1ncy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihgbW91c2Vkb3duYCwgYmVnaW5TaGlwUGxhY2VtZW50KTtcbiAgc2hpcC5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gIHNoaXAub25kcmFnc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGJlZ2luU2hpcFBsYWNlbWVudChldmVudCkge1xuICAvLyAoMSkgcHJlcGFyZSB0byBtb3ZlIGVsZW1lbnQ6IG1ha2UgYWJzb2x1dGUgYW5kIG9uIHRvcCBieSB6LWluZGV4XG4gIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnpJbmRleCA9IDEwMDA7XG5cbiAgLy8gbW92ZSBpdCBvdXQgb2YgYW55IGN1cnJlbnQgcGFyZW50cyBkaXJlY3RseSBpbnRvIGNwdUJvYXJkXG4gIHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5hcHBlbmQoc2hpcEltZ3Nbc2hpcHNQbGFjZWRdKTtcblxuICAvLyBjZW50ZXJzIHRoZSBjdXJzb3IgaW4gdGhlIGZpcnN0IFwic3F1YXJlXCIgb2YgdGhlIHNoaXAgaW1hZ2VcbiAgZnVuY3Rpb24gbW92ZUF0KHBhZ2VYLCBwYWdlWSkge1xuICAgIGlmICghc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLmxlZnQgPVxuICAgICAgICBwYWdlWCAtXG4gICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1tzaGlwc1BsYWNlZF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArIDE3LjUpICtcbiAgICAgICAgXCJweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnRvcCA9XG4gICAgICAgIHBhZ2VZIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55ICsgMTcuNSkgK1xuICAgICAgICBcInB4XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgcGFnZVggLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggK1xuICAgICAgICAgICgoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID1cbiAgICAgICAgcGFnZVkgLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbc2hpcHNQbGFjZWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkgLVxuICAgICAgICAgICgoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgfVxuICB9XG5cbiAgLy8gbW92ZSBvdXIgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNhcnJpZXIgdW5kZXIgdGhlIHBvaW50ZXJcbiAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbiAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZSB0aGF0IHdlJ3JlIGZseWluZyBvdmVyIHJpZ2h0IG5vd1xuICBsZXQgY3VycmVudERyb3BwYWJsZSA9IG51bGw7XG4gIGxldCBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG4gIGxldCBpc0Ryb3BWYWxpZDtcblxuICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5oaWRkZW4gPSB0cnVlO1xuICAgIGxldCBlbGVtQmVsb3cgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuXG4gICAgLy8gbW91c2Vtb3ZlIGV2ZW50cyBtYXkgdHJpZ2dlciBvdXQgb2YgdGhlIHdpbmRvdyAod2hlbiB0aGUgc2hpcCBpcyBkcmFnZ2VkIG9mZi1zY3JlZW4pXG4gICAgLy8gaWYgY2xpZW50WC9jbGllbnRZIGFyZSBvdXQgb2YgdGhlIHdpbmRvdywgdGhlbiBlbGVtZW50RnJvbVBvaW50IHJldHVybnMgbnVsbFxuICAgIC8vIGNvbnN0IG1heFBhZ2VYID0gd2luZG93LmlubmVyV2lkdGggLSAoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgKiAzNTtcbiAgICAvLyBjb25zdCBtYXhQYWdlWSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIChzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF0gLSAxKSAqIDM1O1xuICAgIC8vIGNvbnNvbGUubG9nKFwiWDogXCIgKyBtYXhQYWdlWCArIFwiLCBZOiBcIiArIG1heFBhZ2VZKTtcblxuICAgIGlmICghZWxlbUJlbG93KSByZXR1cm47XG5cbiAgICAvLyBpZiAoIXNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUgJiYgZXZlbnQucGFnZVggPj0gbWF4UGFnZVgpIHtcbiAgICAvLyAgIGlzRHJvcFZhbGlkID0gZmFsc2U7XG4gICAgLy8gICByZXR1cm47XG4gICAgLy8gfSBlbHNlIGlmIChzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlICYmIGV2ZW50LnBhZ2VZID49IG1heFBhZ2VZKSB7XG4gICAgLy8gICBpc0Ryb3BWYWxpZCA9IGZhbHNlO1xuICAgIC8vICAgcmV0dXJuO1xuICAgIC8vIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICAvLyBjb25zb2xlLmxvZyh3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbiAgICAvLyBCRUdJTiAtLS0tIGNoZWNrcyB2YWxpZGl0eSBvZiB0aGUgZHJvcFxuICAgIGxldCBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eSA9IFtdO1xuICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LnNoaWZ0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF07IGkrKykge1xuICAgICAgbGV0IGdldENsYXNzVG9DaGVja1ZhbGlkaXR5O1xuICAgICAgaWYgKHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkgPSBkb2N1bWVudFxuICAgICAgICAgIC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgKyBpICogMzUpXG4gICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdldENsYXNzVG9DaGVja1ZhbGlkaXR5ID0gZG9jdW1lbnRcbiAgICAgICAgICAuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYICsgaSAqIDM1LCBldmVudC5jbGllbnRZKVxuICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGNsYXNzYCk7XG4gICAgICB9XG4gICAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5wdXNoKGdldENsYXNzVG9DaGVja1ZhbGlkaXR5KTtcbiAgICAgIGlmIChhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eVswXSkge1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoKGl0ZW0gJiYgaXRlbS5pbmNsdWRlcyhgaW52YWxpZGApKSB8fCBpdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNvdW50ZXIpIHtcbiAgICAgICAgICBpc0Ryb3BWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzRHJvcFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpc0Ryb3BWYWxpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5KTtcbiAgICAvLyBFTkQgLS0tLSBjaGVja3MgdmFsaWRpdHkgb2YgdGhlIGRyb3BcblxuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5oaWRkZW4gPSBmYWxzZTtcblxuICAgIC8vIC8vIG1vdXNlbW92ZSBldmVudHMgbWF5IHRyaWdnZXIgb3V0IG9mIHRoZSB3aW5kb3cgKHdoZW4gdGhlIHNoaXAgaXMgZHJhZ2dlZCBvZmYtc2NyZWVuKVxuICAgIC8vIC8vIGlmIGNsaWVudFgvY2xpZW50WSBhcmUgb3V0IG9mIHRoZSB3aW5kb3csIHRoZW4gZWxlbWVudEZyb21Qb2ludCByZXR1cm5zIG51bGxcbiAgICAvLyBpZiAoIWVsZW1CZWxvdykgcmV0dXJuO1xuXG4gICAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZXMgYXJlIGxhYmVsZWQgd2l0aCB0aGUgY2xhc3MgXCJkcm9wcGFibGVcIiAoY2FuIGJlIG90aGVyIGxvZ2ljKVxuICAgIGRyb3BwYWJsZUJlbG93ID0gZWxlbUJlbG93LmNsb3Nlc3QoXCIuY3B1U3F1YXJlXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKGRyb3BwYWJsZUJlbG93KTtcblxuICAgIGlmICghZHJvcHBhYmxlQmVsb3cgfHwgIWlzRHJvcFZhbGlkKSB7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuY3Vyc29yID0gYG5vLWRyb3BgO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuY3Vyc29yID0gYGdyYWJiaW5nYDtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudERyb3BwYWJsZSAhPSBkcm9wcGFibGVCZWxvdykge1xuICAgICAgLy8gd2UncmUgZmx5aW5nIGluIG9yIG91dC4uLlxuICAgICAgLy8gbm90ZTogYm90aCB2YWx1ZXMgY2FuIGJlIG51bGxcbiAgICAgIC8vICAgY3VycmVudERyb3BwYWJsZT1udWxsIGlmIHdlIHdlcmUgbm90IG92ZXIgYSBkcm9wcGFibGUgYmVmb3JlIHRoaXMgZXZlbnQgKGUuZyBvdmVyIGFuIGVtcHR5IHNwYWNlKVxuICAgICAgLy8gICBkcm9wcGFibGVCZWxvdz1udWxsIGlmIHdlJ3JlIG5vdCBvdmVyIGEgZHJvcHBhYmxlIG5vdywgZHVyaW5nIHRoaXMgZXZlbnRcblxuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgb3V0XCIgb2YgdGhlIGRyb3BwYWJsZSAocmVtb3ZlIGhpZ2hsaWdodClcbiAgICAgICAgbGVhdmVEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuICAgICAgfVxuICAgICAgY3VycmVudERyb3BwYWJsZSA9IGRyb3BwYWJsZUJlbG93O1xuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgaW5cIiBvZiB0aGUgZHJvcHBhYmxlXG4gICAgICAgIGVudGVyRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbnRlckRyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICAvLyBpZiAoZWxlbWVudCkge1xuICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICBjb25zdCBtYXhIb3Jpem9udGFsID0gKE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKyAxKSAqIDEwO1xuICAgIGNvbnN0IG1heFZlcnRpY2FsID1cbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC1cbiAgICAgIE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKiAxMCArXG4gICAgICA5MDtcbiAgICBpZiAoXG4gICAgICAhc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSAmJlxuICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgPFxuICAgICAgICBtYXhIb3Jpem9udGFsICYmXG4gICAgICBpc0Ryb3BWYWxpZFxuICAgICkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1tzaGlwc1BsYWNlZF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgXCIjODI5RTc2XCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSAmJlxuICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdIC0gMSkgKiAxMCA8PVxuICAgICAgICBtYXhWZXJ0aWNhbCAmJlxuICAgICAgaXNEcm9wVmFsaWRcbiAgICApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODI5RTc2XCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhgaGVyZWApO1xuICAgICAgZHJvcHBhYmxlQmVsb3cgPSBudWxsO1xuICAgICAgc2hpcENvb3JkcyA9IFtdO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhzaGlwQ29vcmRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYXZlRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4gICAgc2hpcENvb3JkcyA9IFtdO1xuICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICBpZiAoIXNoaXBJbWdzW3NoaXBzUGxhY2VkXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldKSB7XG4gICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbiAgICAgICAgICAgIFwiI2MxYzFjMVwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbc2hpcHNQbGFjZWRdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjYzFjMWMxXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyAoMikgbW92ZSB0aGUgc2hpcCBvbiBtb3VzZW1vdmVcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG5cbiAgLy8gKDMpIGRyb3AgdGhlIHNoaXAsIHJlbW92ZSB1bm5lZWRlZCBoYW5kbGVyc1xuICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0ub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkXS5vbm1vdXNldXAgPSBudWxsO1xuICAgIC8vIGNvbnNvbGUubG9nKHNoaXBDb29yZHMpO1xuICAgIGlmIChzaGlwQ29vcmRzLmxlbmd0aCAhPT0gMCAmJiBkcm9wcGFibGVCZWxvdyAmJiBpc0Ryb3BWYWxpZCkge1xuICAgICAgcGxheWVyRmxlZXQucHVzaCh7XG4gICAgICAgIG5hbWU6IHNoaXBOYW1lc1tzaGlwc1BsYWNlZF0sXG4gICAgICAgIHNoaXBQbGFjZW1lbnQ6IHNoaXBDb29yZHMsXG4gICAgICB9KTtcbiAgICAgIHBsYXllclNoaXBDb250YWluZXJzW3NoaXBzUGxhY2VkXS5yZW1vdmVDaGlsZChzaGlwSW1nc1tzaGlwc1BsYWNlZF0pO1xuICAgICAgcmVuZGVyUGxheWVyU2hpcHMoW3BsYXllckZsZWV0W3NoaXBzUGxhY2VkXV0pO1xuICAgICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYCNjMWMxYzFgO1xuICAgICAgfSk7XG4gICAgICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoaW5kZXggPT09IHBsYXllckZsZWV0Lmxlbmd0aCkge1xuICAgICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShgaGlkZS1zaGlwYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2hpcHNQbGFjZWQgKz0gMTtcbiAgICAgIGNvbnN0IGNsZWFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NsZWFyLWJvYXJkLWJ0bmApO1xuICAgICAgaWYgKHNoaXBzUGxhY2VkID09PSAxKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbWl6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNyYW5kb21pemUtcGxheWVyLWZsZWV0YCk7XG4gICAgICAgIHJhbmRvbWl6ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmUgYDtcbiAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgfVxuICAgICAgaWYgKHNoaXBzUGxhY2VkID09PSA1KSB7XG4gICAgICAgIHN0YXJ0QnRuLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgICAgICAgcm90YXRlQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYWNlU2hpcHNDb250YWluZXIuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0sXG4gICAgICAgIHNoaXBJbWdzW3NoaXBzUGxhY2VkICsgMV1cbiAgICAgICk7XG4gICAgICBpZiAoc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucm90YXRlID0gYGA7XG4gICAgICB9XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUudG9wID0gXCIxMDBweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgc2hpcEltZ3Nbc2hpcHNQbGFjZWRdLnN0eWxlLnpJbmRleCA9IDA7XG4gICAgICBzaGlwSW1nc1tzaGlwc1BsYWNlZF0uc3R5bGUuY3Vyc29yID0gYGdyYWJgO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IHsgaGlkZVNoaXBzVG9QbGFjZSB9O1xuIiwiaW1wb3J0IHsgZ2FtZUxvb3AgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuXG5mdW5jdGlvbiByZW5kZXJHYW1lYm9hcmQodXNlcikge1xuICBsZXQgYm9hcmREaXY7XG4gIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICB9IGVsc2Uge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICB9XG4gIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gIGJvYXJkLmNsYXNzTGlzdC5hZGQoYGdhbWVib2FyZGApO1xuICBjb25zdCBtYXhTcXVhcmVzID0gMTAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1heFNxdWFyZXM7IGkrKykge1xuICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIC8vIHNxdWFyZS50ZXh0Q29udGVudCA9IGk7XG4gICAgc3F1YXJlLmRhdGFzZXQuaW5kZXhOdW1iZXIgPSBpO1xuICAgIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYHBsYXllclNxdWFyZWApO1xuICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYGNwdVNxdWFyZWApO1xuICAgIH1cbiAgICBib2FyZC5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICB9XG4gIGJvYXJkRGl2LmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuY29uc3QgcGxheWVyQXR0YWNrID0gKGUpID0+IHtcbiAgY29uc3QgY29vcmRpbmF0ZUNsaWNrZWQgPSArZS50YXJnZXQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgZ2FtZUxvb3AoY29vcmRpbmF0ZUNsaWNrZWQpO1xuICBlLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG59O1xuXG4vLyByZW5kZXJHYW1lYm9hcmQoYHBsYXllcmApO1xucmVuZGVyR2FtZWJvYXJkKGBjcHVgKTtcblxuZnVuY3Rpb24gZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhhcnJheSkge1xuICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICBhcnJheS5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgIHNxdWFyZXNbaW5kZXhdLnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlck1vdmUod2hvc2VUdXJuLCBhdHRhY2tBcnJheSkge1xuICBjb25zb2xlLmxvZyh7IHdob3NlVHVybiwgYXR0YWNrQXJyYXkgfSk7XG4gIGxldCBzcXVhcmVzO1xuICBjb25zdCBoaXRJbmRleCA9IGF0dGFja0FycmF5WzFdO1xuICBpZiAod2hvc2VUdXJuID09PSBgcGxheWVyYCkge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbiAgfVxuICBpZiAoYXR0YWNrQXJyYXlbMF0pIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBoaXRgKTtcbiAgfSBlbHNlIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBtaXNzYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29tcHV0ZXJTaGlwcyhjcHVGbGVldCkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBjcHVGbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYGNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLnNyYyA9IGltZ1NyYztcblxuICAgIGNvbnN0IHNvcnRBc2NlbmRpbmcgPSBzaGlwT2JqZWN0LnNoaXBQbGFjZW1lbnQuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuICAgIGNvbnN0IGRpbWVuc2lvbk9mU3F1YXJlID0gMzU7XG4gICAgbGV0IHRvcE9mZnNldDtcbiAgICBsZXQgbGVmdE9mZnNldDtcbiAgICBpZiAoc29ydEFzY2VuZGluZ1swXSArIDEgPT09IHNvcnRBc2NlbmRpbmdbMV0pIHtcbiAgICAgIC8vIHBsYWNlIGhvcml6b250YWwgc2hpcHNcbiAgICAgIHRvcE9mZnNldCA9IE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9ICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBsYWNlIHZlcnRpY2FsIHNoaXBzXG4gICAgICBzaGlwSW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgtOTBkZWcpYDtcbiAgICAgIHRvcE9mZnNldCA9XG4gICAgICAgIE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlICtcbiAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwSW1hZ2Uuc3R5bGUudG9wID0gYCR7dG9wT2Zmc2V0fXB4YDtcbiAgICBzaGlwSW1hZ2Uuc3R5bGUubGVmdCA9IGAke2xlZnRPZmZzZXR9cHhgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH0pO1xuICByZW5kZXJHYW1lYm9hcmQoYHBsYXllcmApO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQbGF5ZXJTaGlwcyhmbGVldCkge1xuICAvLyBjb25zb2xlLmxvZyghZmxlZXRbMF0uc2hpcFBsYWNlbWVudCk7XG4gIC8vIGNvbnNvbGUubG9nKGZsZWV0WzBdLnNoaXBQbGFjZW1lbnQpO1xuICAvLyBjb25zb2xlLmxvZyhmbGVldFswXS5zaGlwUGxhY2VtZW50WzBdID09PSB1bmRlZmluZWQpO1xuICBpZiAoZmxlZXRbMF0uc2hpcFBsYWNlbWVudFswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICBsZXQgaW1nU3JjO1xuXG4gIGZsZWV0LmZvckVhY2goKHNoaXBPYmplY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChgcGxheWVyLXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgaWYgKHNoaXBPYmplY3QubmFtZSA9PT0gYFBhdHJvbCBCb2F0YCkge1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy9wYXRyb2wucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBwYXRyb2xgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwT2JqZWN0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvJHtzaGlwTmFtZX0ucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXBOYW1lfWApO1xuICAgIH1cbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgaW52YWxpZGApO1xuICAgIHNoaXBJbWFnZS5zcmMgPSBpbWdTcmM7XG5cbiAgICBjb25zdCBzb3J0QXNjZW5kaW5nID0gc2hpcE9iamVjdC5zaGlwUGxhY2VtZW50LnNvcnQoKHgsIHkpID0+IHggLSB5KTtcbiAgICBjb25zdCBkaW1lbnNpb25PZlNxdWFyZSA9IDM1O1xuICAgIGxldCB0b3BPZmZzZXQ7XG4gICAgbGV0IGxlZnRPZmZzZXQ7XG4gICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gKyAxID09PSBzb3J0QXNjZW5kaW5nWzFdKSB7XG4gICAgICAvLyBwbGFjZSBob3Jpem9udGFsIHNoaXBzXG4gICAgICB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSAtIDM1MDtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9IHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwbGFjZSB2ZXJ0aWNhbCBzaGlwc1xuICAgICAgc2hpcEltYWdlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoLTkwZGVnKWA7XG4gICAgICB0b3BPZmZzZXQgPVxuICAgICAgICBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSArXG4gICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzUgLVxuICAgICAgICAzNTA7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgIHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcEltYWdlLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGA7XG4gICAgc2hpcEltYWdlLnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgICBjcHVCb2FyZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9KTtcbn1cblxuZXhwb3J0IHtcbiAgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyxcbiAgcmVuZGVyTW92ZSxcbiAgcmVuZGVyQ29tcHV0ZXJTaGlwcyxcbiAgcmVuZGVyUGxheWVyU2hpcHMsXG59O1xuIiwiY29uc3QgU2hpcHMgPSAoKSA9PiB7XG4gIGNvbnN0IGZsZWV0ID0gW1xuICAgIHsgbmFtZTogYENhcnJpZXJgLCBsZW5ndGg6IDUsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgQmF0dGxlc2hpcGAsIGxlbmd0aDogNCwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBEZXN0cm95ZXJgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgU3VibWFyaW5lYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFBhdHJvbCBCb2F0YCwgbGVuZ3RoOiAyLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICBdO1xuXG4gIGNvbnN0IGhpdCA9IChhdHRhY2tEYXRhKSA9PiB7XG4gICAgY29uc3Qgc2hpcEhpdCA9IGF0dGFja0RhdGFbMF07XG4gICAgY29uc3QgY29vcmRPZkhpdCA9IGF0dGFja0RhdGFbMV07XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSkge1xuICAgICAgICBzaGlwLmhpdHMucHVzaChjb29yZE9mSGl0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoc2hpcEhpdCkgPT4ge1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUgJiYgc2hpcC5sZW5ndGggPT09IHNoaXAuaGl0cy5sZW5ndGgpIHtcbiAgICAgICAgc2hpcC5pc1N1bmsgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGZsZWV0LCBoaXQsIGlzU3VuayB9O1xufTtcblxuZXhwb3J0IHsgU2hpcHMgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9