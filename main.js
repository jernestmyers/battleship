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
/* harmony export */   "createPlayerObjects": () => (/* binding */ createPlayerObjects),
/* harmony export */   "handleState": () => (/* binding */ handleState)
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

function createComputerObjects() {
  const cpuFleetArray = [];
  const computerFleet = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.placeComputerFleet)(`cpu`, cpuFleetArray);
  const computerBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard)(computerFleet);
  storedGameboards.push([`player`, computerBoard]);
}
createComputerObjects();

function handleState() {
  if (storedGameboards.length === 2) {
    storedGameboards.shift();
  }
  storedGameboards.shift();
  createComputerObjects();
}

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

// BEGIN-------- creates a randomly placed boards ------- //
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
/* harmony export */   "hideShipsToPlace": () => (/* binding */ hideShipsToPlace),
/* harmony export */   "setUpShipsToDragAndDrop": () => (/* binding */ setUpShipsToDragAndDrop),
/* harmony export */   "beginShipPlacement": () => (/* binding */ beginShipPlacement)
/* harmony export */ });
/* harmony import */ var _gameHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameHandler */ "./src/gameHandler.js");
/* harmony import */ var _renderGame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderGame */ "./src/renderGame.js");



let playerFleet = [];

const shipNames = [
  `Carrier`,
  `Battleship`,
  `Destroyer`,
  `Submarine`,
  `Patrol Boat`,
];
const shipLengths = [5, 4, 3, 3, 2];
// let shipsPlaced = playerFleet.length;
let shipCoords = [];

const cpuGameBoardTitle = document.querySelector(`#cpu-board-header`);
const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);

const rotateBtn = document.querySelector(`#btn-rotate-ship`);
const clearBtn = document.querySelector(`#clear-board-btn`);
const randomizeBtn = document.querySelector(`#randomize-player-fleet`);

const placeShipsContainer = document.querySelector(`#place-ships-container`);
const playerShipContainers = document.querySelectorAll(
  `.player-ships-container`
);
let shipImgs = document.querySelectorAll(`.ships-to-place`);

function hideShipsToPlace() {
  shipImgs.forEach((ship) => {
    ship.classList.add(`hide-ship`);
  });
  rotateBtn.style.display = `none`;
}

// hides all but the carrier on page load
function setUpShipsToDragAndDrop() {
  playerFleet = [];
  shipImgs = document.querySelectorAll(`.ships-to-place`);
  shipImgs.forEach((ship, index) => {
    // console.log(ship);
    ship.addEventListener(`mousedown`, beginShipPlacement);
    if (index !== 0) {
      // console.log(ship);
      ship.classList.add(`hide-ship`);
    }
    ship.addEventListener(`mousedown`, beginShipPlacement);
    ship.style.cursor = `grab`;
    ship.ondragstart = function () {
      return false;
    };
  });
  randomizeBtn.style.display = `flex`;
  clearBtn.style.display = `none`;
}
setUpShipsToDragAndDrop();

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
  if (playerFleet.length === 5) {
    // console.log(`create objects`);
    (0,_gameHandler__WEBPACK_IMPORTED_MODULE_0__.createPlayerObjects)(playerFleet);
    cpuBoardSquares.forEach((square) => {
      square.style.backgroundColor = ``;
    });
  }
}

clearBtn.addEventListener(`click`, _renderGame__WEBPACK_IMPORTED_MODULE_1__.clearBoards);

rotateBtn.addEventListener(`click`, rotateShip);

function rotateShip(e) {
  if (!shipImgs[playerFleet.length].style.rotate) {
    shipImgs[playerFleet.length].style.rotate = `-90deg`;
    shipImgs[playerFleet.length].style.top =
      100 + ((shipLengths[playerFleet.length] - 1) / 2) * 35 + `px`;
  } else {
    shipImgs[playerFleet.length].style.rotate = ``;
    shipImgs[playerFleet.length].style.top = 100 + `px`;
  }
}

// shipImgs.forEach((ship) => {
//   ship.addEventListener(`mousedown`, beginShipPlacement);
//   ship.style.cursor = `grab`;
//   ship.ondragstart = function () {
//     return false;
//   };
// });

function beginShipPlacement(event) {
  // (1) prepare to move element: make absolute and on top by z-index
  shipImgs[playerFleet.length].style.position = "absolute";
  shipImgs[playerFleet.length].style.zIndex = 1000;

  // move it out of any current parents directly into cpuBoard
  playerShipContainers[playerFleet.length].append(shipImgs[playerFleet.length]);

  // centers the cursor in the first "square" of the ship image
  function moveAt(pageX, pageY) {
    if (!shipImgs[playerFleet.length].style.rotate) {
      shipImgs[playerFleet.length].style.left =
        pageX -
        (playerShipContainers[playerFleet.length].getBoundingClientRect().x +
          17.5) +
        "px";
      shipImgs[playerFleet.length].style.top =
        pageY -
        (playerShipContainers[playerFleet.length].getBoundingClientRect().y +
          17.5) +
        "px";
    } else {
      shipImgs[playerFleet.length].style.left =
        pageX -
        (playerShipContainers[playerFleet.length].getBoundingClientRect().x +
          ((shipLengths[playerFleet.length] - 1) / 2) * 35) -
        17.5 +
        "px";
      shipImgs[playerFleet.length].style.top =
        pageY -
        (playerShipContainers[playerFleet.length].getBoundingClientRect().y -
          ((shipLengths[playerFleet.length] - 1) / 2) * 35) -
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
    shipImgs[playerFleet.length].hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

    // mousemove events may trigger out of the window (when the ship is dragged off-screen)
    // if clientX/clientY are out of the window, then elementFromPoint returns null
    // const maxPageX = window.innerWidth - (shipLengths[playerFleet.length] - 1) * 35;
    // const maxPageY = window.innerHeight - (shipLengths[playerFleet.length] - 1) * 35;
    // console.log("X: " + maxPageX + ", Y: " + maxPageY);

    if (!elemBelow) return;

    // if (!shipImgs[playerFleet.length].style.rotate && event.pageX >= maxPageX) {
    //   isDropValid = false;
    //   return;
    // } else if (shipImgs[playerFleet.length].style.rotate && event.pageY >= maxPageY) {
    //   isDropValid = false;
    //   return;
    // }

    // console.log(window.innerWidth);
    // console.log(window.innerHeight);
    // console.log(event.pageX, event.pageY);

    // BEGIN ---- checks validity of the drop
    let arrayOfElementsBelowToCheckValidity = [];
    arrayOfElementsBelowToCheckValidity.shift();
    for (let i = 0; i < shipLengths[playerFleet.length]; i++) {
      let getClassToCheckValidity;
      if (shipImgs[playerFleet.length].style.rotate) {
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

    shipImgs[playerFleet.length].hidden = false;

    // // mousemove events may trigger out of the window (when the ship is dragged off-screen)
    // // if clientX/clientY are out of the window, then elementFromPoint returns null
    // if (!elemBelow) return;

    // potential droppables are labeled with the class "droppable" (can be other logic)
    droppableBelow = elemBelow.closest(".cpuSquare");
    // console.log(droppableBelow);

    if (!droppableBelow || !isDropValid) {
      shipImgs[playerFleet.length].style.cursor = `no-drop`;
    } else {
      shipImgs[playerFleet.length].style.cursor = `grabbing`;
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
      !shipImgs[playerFleet.length].style.rotate &&
      indexOfInitialDropPoint + (shipLengths[playerFleet.length] - 1) <
        maxHorizontal &&
      isDropValid
    ) {
      for (let i = 0; i < shipLengths[playerFleet.length]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
          cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
            "#829E76";
          shipCoords.push(indexOfInitialDropPoint + i);
        }
      }
    } else if (
      shipImgs[playerFleet.length].style.rotate &&
      indexOfInitialDropPoint + (shipLengths[playerFleet.length] - 1) * 10 <=
        maxVertical &&
      isDropValid
    ) {
      for (let i = 0; i < shipLengths[playerFleet.length]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i * 10]) {
          cpuBoardSquares[
            indexOfInitialDropPoint + i * 10
          ].style.backgroundColor = "#829E76";
          shipCoords.push(indexOfInitialDropPoint + i * 10);
        }
      }
    } else {
      droppableBelow = null;
      shipCoords = [];
    }
    // console.log(shipCoords);
  }

  function leaveDroppableArea(element) {
    shipCoords = [];
    const indexOfInitialDropPoint = +element.dataset.indexNumber;
    if (!shipImgs[playerFleet.length].style.rotate) {
      for (let i = 0; i < shipLengths[playerFleet.length]; i++) {
        if (cpuBoardSquares[indexOfInitialDropPoint + i]) {
          cpuBoardSquares[indexOfInitialDropPoint + i].style.backgroundColor =
            "#c1c1c1";
        }
      }
    } else {
      for (let i = 0; i < shipLengths[playerFleet.length]; i++) {
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
  shipImgs[playerFleet.length].onmouseup = function () {
    console.log(playerFleet.length);
    console.log(playerFleet.length);
    document.removeEventListener("mousemove", onMouseMove);
    shipImgs[playerFleet.length].onmouseup = null;
    if (shipCoords.length !== 0 && droppableBelow && isDropValid) {
      playerFleet.push({
        name: shipNames[playerFleet.length],
        shipPlacement: shipCoords,
      });
      playerShipContainers[playerFleet.length - 1].removeChild(
        shipImgs[playerFleet.length - 1]
      );
      (0,_renderGame__WEBPACK_IMPORTED_MODULE_1__.renderPlayerShips)([playerFleet[playerFleet.length - 1]]);
      cpuBoardSquares.forEach((square) => {
        square.style.backgroundColor = `#c1c1c1`;
      });
      shipImgs.forEach((ship, index) => {
        if (index === playerFleet.length) {
          ship.classList.remove(`hide-ship`);
        }
      });
      console.log(playerFleet.length);
      console.log(playerFleet.length);
      // playerFleet.length += 1;
      // const clearBtn = document.querySelector(`#clear-board-btn`);
      if (playerFleet.length === 1) {
        randomizeBtn.style.display = `none `;
        clearBtn.style.display = "flex";
      }
      if (playerFleet.length === 5) {
        startBtn.style.display = "flex";
        clearBtn.style.display = `none`;
        rotateBtn.style.display = `none`;
      }
    } else {
      placeShipsContainer.insertBefore(
        shipImgs[playerFleet.length],
        shipImgs[playerFleet.length + 1]
      );
      if (shipImgs[playerFleet.length].style.rotate) {
        shipImgs[playerFleet.length].style.rotate = ``;
      }
      shipImgs[playerFleet.length].style.position = "absolute";
      shipImgs[playerFleet.length].style.top = "100px";
      shipImgs[playerFleet.length].style.left = "0px";
      shipImgs[playerFleet.length].style.zIndex = 0;
      shipImgs[playerFleet.length].style.cursor = `grab`;
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
/* harmony export */   "renderPlayerShips": () => (/* binding */ renderPlayerShips),
/* harmony export */   "clearBoards": () => (/* binding */ clearBoards)
/* harmony export */ });
/* harmony import */ var _gameHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameHandler */ "./src/gameHandler.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./src/index.js");



function renderGameboard(user) {
  let boardDiv;
  const board = document.createElement(`div`);
  if (user === `player`) {
    boardDiv = document.querySelector(`#player-board`);
    board.setAttribute(`id`, `player-squares-container`);
  } else {
    boardDiv = document.querySelector(`#cpu-board`);
  }
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

function clearBoards() {
  const playerBoard = document.querySelector(`#player-board`);
  const playerSquares = document.querySelector(`#player-squares-container`);
  const cpuBoard = document.querySelector(`#cpu-board`);
  const placeShipsContainer = document.querySelector(`#place-ships-container`);
  const shipsOnCPUBoard = document.querySelectorAll(`.player-ships-rendered`);
  const shipsOnPlayerBoard = document.querySelectorAll(`.cpu-ships-rendered`);
  const remainingShipsToPlace = document.querySelectorAll(`.ships-to-place`);

  playerBoard.removeChild(playerSquares);
  removeElements(cpuBoard, shipsOnCPUBoard);
  removeElements(playerBoard, shipsOnPlayerBoard);
  // removeElements(playerBoard, playerSquares);
  removeElements(placeShipsContainer, remainingShipsToPlace);
  redisplayShipsToPlace(placeShipsContainer);
  (0,_index__WEBPACK_IMPORTED_MODULE_1__.setUpShipsToDragAndDrop)();
  (0,_gameHandler__WEBPACK_IMPORTED_MODULE_0__.handleState)();
}

function removeElements(parent, children) {
  if (children) {
    for (let i = 0; i < children.length; i++) {
      parent.removeChild(children[i]);
    }
  } else {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}

function redisplayShipsToPlace(parent) {
  const nameHelper = [
    `carrier`,
    `battleship`,
    `destroyer`,
    `submarine`,
    `patrol`,
  ];
  nameHelper.forEach((ship) => {
    const shipImage = document.createElement(`img`);
    shipImage.src = `./imgs/${ship}.png`;
    shipImage.classList.add(`${ship}`);
    shipImage.classList.add(`ships-to-place`);
    shipImage.setAttribute(`id`, `player-${ship}`);
    parent.appendChild(shipImage);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZW5kZXJHYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkU7QUFDRztBQUNoQzs7QUFFOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRSwyREFBZ0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDhEQUFrQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLHFEQUFTO0FBQy9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLDhEQUFrQjtBQUMxQyx3QkFBd0IscURBQVM7QUFDakM7QUFDQTtB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LGlFQUFtQjtBQUN2QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUEsbUNBQW1DLG9EQUFXOztBQUU5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUNBQXFDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixLQUFLO0FBQ25DLCtCQUErQixLQUFLO0FBQ3BDO0FBQ0EsMkNBQTJDLEtBQUs7QUFDaEQ7QUFDQSxHQUFHO0FBQ0g7O0FBUUU7Ozs7Ozs7Ozs7Ozs7OztBQ3JPRjtBQUNBO0FBQ0EsS0FBSyxzREFBc0Q7QUFDM0QsS0FBSyx5REFBeUQ7QUFDOUQsS0FBSyx3REFBd0Q7QUFDN0QsS0FBSyx3REFBd0Q7QUFDN0QsS0FBSywwREFBMEQ7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxVQUFVO0FBQ1Y7O0FBRWlCOzs7Ozs7O1VDOUJqQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgeyByZW5kZXJNb3ZlLCBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuaW1wb3J0IHsgaGlkZVNoaXBzVG9QbGFjZSB9IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmNvbnN0IHN0b3JlZEdhbWVib2FyZHMgPSBbXTtcblxubGV0IHR1cm5Db3VudGVyID0gMTtcbmZ1bmN0aW9uIHR1cm5Ecml2ZXIoKSB7XG4gIGxldCB3aG9zZU1vdmU7XG4gIGlmICh0dXJuQ291bnRlciAlIDIgIT09IDApIHtcbiAgICB3aG9zZU1vdmUgPSBgcGxheWVyYDtcbiAgfSBlbHNlIHtcbiAgICB3aG9zZU1vdmUgPSBgY29tcHV0ZXJgO1xuICB9XG4gIHR1cm5Db3VudGVyICs9IDE7XG4gIHJldHVybiB3aG9zZU1vdmU7XG59XG5cbmNvbnN0IHJhbmRvbWl6ZVBsYXllckZsZWV0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgYCNyYW5kb21pemUtcGxheWVyLWZsZWV0YFxuKTtcbnJhbmRvbWl6ZVBsYXllckZsZWV0QnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcmFuZG9taXplUGxheWVyRmxlZXQpO1xuXG5mdW5jdGlvbiByYW5kb21pemVQbGF5ZXJGbGVldCgpIHtcbiAgaGlkZVNoaXBzVG9QbGFjZSgpO1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzdGFydC1nYW1lLWJ0bmApO1xuICBzdGFydEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gIGlmIChzdG9yZWRHYW1lYm9hcmRzWzFdKSB7XG4gICAgc3RvcmVkR2FtZWJvYXJkcy5wb3AoKTtcbiAgICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgICBjb25zdCByZW5kZXJlZFBsYXllclNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGAucGxheWVyLXNoaXBzLXJlbmRlcmVkYFxuICAgICk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgIGNwdUJvYXJkLnJlbW92ZUNoaWxkKHJlbmRlcmVkUGxheWVyU2hpcHNbaV0pO1xuICAgIH1cbiAgfVxuICBjb25zdCBwbGF5ZXJGbGVldEFycmF5ID0gW107XG4gIGNvbnN0IHBsYXllckZsZWV0ID0gcGxhY2VDb21wdXRlckZsZWV0KGB1c2VyYCwgcGxheWVyRmxlZXRBcnJheSk7XG4gIGNyZWF0ZVBsYXllck9iamVjdHMocGxheWVyRmxlZXQpO1xuICAvLyBjb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVib2FyZChwbGF5ZXJGbGVldCk7XG4gIC8vIHN0b3JlZEdhbWVib2FyZHMucHVzaChbYGNvbXB1dGVyYCwgcGxheWVyQm9hcmRdKTtcbiAgLy8gY29uc29sZS5sb2coc3RvcmVkR2FtZWJvYXJkc1swXVsxXS5zaGlwcy5mbGVldCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBsYXllck9iamVjdHMoZmxlZXQpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lYm9hcmQoZmxlZXQpO1xuICBzdG9yZWRHYW1lYm9hcmRzLnB1c2goW2Bjb21wdXRlcmAsIHBsYXllckJvYXJkXSk7XG4gIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wdXRlck9iamVjdHMoKSB7XG4gIGNvbnN0IGNwdUZsZWV0QXJyYXkgPSBbXTtcbiAgY29uc3QgY29tcHV0ZXJGbGVldCA9IHBsYWNlQ29tcHV0ZXJGbGVldChgY3B1YCwgY3B1RmxlZXRBcnJheSk7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lYm9hcmQoY29tcHV0ZXJGbGVldCk7XG4gIHN0b3JlZEdhbWVib2FyZHMucHVzaChbYHBsYXllcmAsIGNvbXB1dGVyQm9hcmRdKTtcbn1cbmNyZWF0ZUNvbXB1dGVyT2JqZWN0cygpO1xuXG5mdW5jdGlvbiBoYW5kbGVTdGF0ZSgpIHtcbiAgaWYgKHN0b3JlZEdhbWVib2FyZHMubGVuZ3RoID09PSAyKSB7XG4gICAgc3RvcmVkR2FtZWJvYXJkcy5zaGlmdCgpO1xuICB9XG4gIHN0b3JlZEdhbWVib2FyZHMuc2hpZnQoKTtcbiAgY3JlYXRlQ29tcHV0ZXJPYmplY3RzKCk7XG59XG5cbi8vIEJFR0lOIC0tLS0tIGdlbmVyYXRlcyByYW5kb20gbW92ZSBmb3IgY29tcHV0ZXIgLS0tLS0tLS0tLS0gLy9cbmZ1bmN0aW9uIGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpIHtcbiAgY29uc3QgdmFsaWRNb3ZlcyA9IFtdO1xuICBjb25zdCBtYXhNb3ZlcyA9IDEwMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhNb3ZlczsgaSsrKSB7XG4gICAgdmFsaWRNb3Zlcy5wdXNoKGkpO1xuICB9XG4gIHJldHVybiB2YWxpZE1vdmVzO1xufVxuXG5jb25zdCBnZXRWYWxpZE1vdmVzID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG5jb25zdCBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCkge1xuICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdldFZhbGlkTW92ZXMubGVuZ3RoKTtcbiAgY29uc3QgcmFuZG9tTW92ZSA9IGdldFZhbGlkTW92ZXNbcmFuZG9tSW5kZXhdO1xuICBnZXRWYWxpZE1vdmVzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gIHJldHVybiByYW5kb21Nb3ZlO1xufVxuLy8gRU5EIC0tLS0tIGdlbmVyYXRlcyByYW5kb20gbW92ZSBmb3IgY29tcHV0ZXIgLS0tLS0tLS0tLS0gLy9cblxuZnVuY3Rpb24gZ2FtZUxvb3AocGxheWVyTW92ZSkge1xuICBsZXQgZ2V0VHVybjtcbiAgbGV0IGNvb3JkT2ZBdHRhY2s7XG4gIGxldCBpc0dhbWVPdmVyID0gZmFsc2U7XG4gIGNvbnN0IGluZGV4VG9TcGxpY2UgPSBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZy5maW5kSW5kZXgoXG4gICAgKGluZGV4KSA9PiBpbmRleCA9PT0gcGxheWVyTW92ZVxuICApO1xuICBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZy5zcGxpY2UoaW5kZXhUb1NwbGljZSwgMSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XG4gICAgICBnZXRUdXJuID0gdHVybkRyaXZlcigpO1xuICAgICAgaWYgKGdldFR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgICAgIGNvb3JkT2ZBdHRhY2sgPSBwbGF5ZXJNb3ZlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRPZkF0dGFjayA9IGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF0dGFja091dGNvbWUgPSByZWNlaXZlQXR0YWNrKGNvb3JkT2ZBdHRhY2ssIGdldFR1cm4pO1xuICAgICAgY29uc29sZS5sb2coYXR0YWNrT3V0Y29tZSk7XG4gICAgICByZW5kZXJNb3ZlKGdldFR1cm4sIGF0dGFja091dGNvbWUpO1xuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0pIHtcbiAgICAgICAgY29uc29sZS5sb2coc3RvcmVkR2FtZWJvYXJkcyk7XG4gICAgICAgIHN0b3JlZEdhbWVib2FyZHMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW1bMF0gPT09IGdldFR1cm4pIHtcbiAgICAgICAgICAgIGlzR2FtZU92ZXIgPSBpdGVtWzFdLmlzR2FtZU92ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gJiYgZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbiAgICAgICAgbGV0IGlzU2hpcFN1bms7XG4gICAgICAgIGxldCBhcnJheUluZGV4O1xuICAgICAgICBzdG9yZWRHYW1lYm9hcmRzWzBdWzFdLnNoaXBzLmZsZWV0LmZpbHRlcigob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdID09PSBvYmplY3QubmFtZSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYGhlcmUgd2l0aCBgICsgb2JqZWN0Lm5hbWUpO1xuICAgICAgICAgICAgaXNTaGlwU3VuayA9IG9iamVjdC5pc1N1bms7XG4gICAgICAgICAgICBhcnJheUluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICBpZiAoaXNTaGlwU3Vuaykge1xuICAgICAgICAgICAgICBjb25zdCBjcHVIaWRkZW5TaGlwcyA9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICAgICAgICAgICAgICBjcHVIaWRkZW5TaGlwc1tpbmRleF0uc3R5bGUuZGlzcGxheSA9IGBibG9ja2A7XG4gICAgICAgICAgICAgIGNwdUhpZGRlblNoaXBzW2luZGV4XS5zdHlsZS56SW5kZXggPSBgMWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpc1NoaXBTdW5rKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFycmF5SW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNHYW1lT3Zlcikge1xuICAgICAgICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGdldFBsYXllck1vdmVzUmVtYWluaW5nKTtcbiAgICAgICAgYWxlcnQoYGdhbWUgb3ZlciEgJHtnZXRUdXJufSB3aW5zIWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzLCBnYW1lTG9vcCwgY3JlYXRlUGxheWVyT2JqZWN0cywgaGFuZGxlU3RhdGUgfTtcbiIsImltcG9ydCB7IFNoaXBzIH0gZnJvbSBcIi4vc2hpcE1vZHVsZVwiO1xuaW1wb3J0IHsgc3RvcmVkR2FtZWJvYXJkcyB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyByZW5kZXJDb21wdXRlclNoaXBzLCByZW5kZXJQbGF5ZXJTaGlwcyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcblxuY29uc3QgR2FtZWJvYXJkID0gKGZsZWV0QXJyYXkpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gW1xuICAgIGZsZWV0QXJyYXlbMF0sXG4gICAgZmxlZXRBcnJheVsxXSxcbiAgICBmbGVldEFycmF5WzJdLFxuICAgIGZsZWV0QXJyYXlbM10sXG4gICAgZmxlZXRBcnJheVs0XSxcbiAgXTtcbiAgY29uc3QgbWlzc2VzID0gW107XG4gIGNvbnN0IHNoaXBzID0gU2hpcHMoKTtcblxuICBjb25zdCBpc0dhbWVPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGFycmF5ID0gc2hpcHMuZmxlZXQ7XG4gICAgbGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgICBsZXQgc2hpcHNTdW5rQ291bnRlciA9IDA7XG5cbiAgICBhcnJheS5maWx0ZXIoKG9iaikgPT4ge1xuICAgICAgaWYgKG9iai5pc1N1bmspIHtcbiAgICAgICAgc2hpcHNTdW5rQ291bnRlciArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzaGlwc1N1bmtDb3VudGVyID09PSA1KSB7XG4gICAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGlzR2FtZU92ZXI7XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2FtZWJvYXJkLCBtaXNzZXMsIHNoaXBzLCBpc0dhbWVPdmVyIH07XG59O1xuXG5jb25zdCByZWNlaXZlQXR0YWNrID0gKGF0dGFja0Nvb3JkLCB1c2VyKSA9PiB7XG4gIGxldCBpbmRleDtcbiAgbGV0IGF0dGFja091dGNvbWUgPSBbbnVsbCwgYXR0YWNrQ29vcmRdO1xuICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICBpbmRleCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSAxO1xuICB9XG4gIGNvbnN0IGdhbWVib2FyZE9iamVjdCA9IHN0b3JlZEdhbWVib2FyZHNbaW5kZXhdWzFdO1xuICBnYW1lYm9hcmRPYmplY3QuZ2FtZWJvYXJkLmZvckVhY2goKG9iamVjdCkgPT4ge1xuICAgIGlmIChvYmplY3Quc2hpcFBsYWNlbWVudC5pbmNsdWRlcyhhdHRhY2tDb29yZCkpIHtcbiAgICAgIGF0dGFja091dGNvbWUgPSBbb2JqZWN0Lm5hbWUsIGF0dGFja0Nvb3JkXTtcbiAgICB9XG4gIH0pO1xuICBpZiAoIWF0dGFja091dGNvbWVbMF0pIHtcbiAgICBnYW1lYm9hcmRPYmplY3QubWlzc2VzLnB1c2goYXR0YWNrQ29vcmQpO1xuICB9IGVsc2Uge1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5oaXQoYXR0YWNrT3V0Y29tZSk7XG4gICAgZ2FtZWJvYXJkT2JqZWN0LnNoaXBzLmlzU3VuayhhdHRhY2tPdXRjb21lWzBdKTtcbiAgfVxuICByZXR1cm4gYXR0YWNrT3V0Y29tZTtcbn07XG5cbi8vIEJFR0lOLS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZHMgLS0tLS0tLSAvL1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKSB7XG4gIGNvbnN0IG51bWJlck9mQ29vcmRpbmF0ZXMgPSAxMDA7XG4gIGNvbnN0IG9yaWVudGF0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gIGNvbnN0IGZpcnN0Q29vcmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1iZXJPZkNvb3JkaW5hdGVzKTtcbiAgcmV0dXJuIFtvcmllbnRhdGlvbiwgZmlyc3RDb29yZF07XG59XG5cbmZ1bmN0aW9uIG9yaWVudFNoaXAoc3RhcnRDb29yZCwgb3JpZW50YXRpb24sIG5hbWUsIGxlbmd0aCkge1xuICBsZXQgc2hpcFBsYWNlbWVudCA9IFtdO1xuICBsZXQgaG9yaXpvbnRhbExpbWl0O1xuICBpZiAoc3RhcnRDb29yZCA8IDEwKSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gOTtcbiAgfSBlbHNlIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSArKHN0YXJ0Q29vcmQudG9TdHJpbmcoKS5jaGFyQXQoMCkgKyA5KTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9yaWVudGF0aW9uKSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSAqIDEwIDwgMTAwKSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSAqIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSAqIDEwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgPD0gaG9yaXpvbnRhbExpbWl0KSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4geyBuYW1lLCBzaGlwUGxhY2VtZW50IH07XG59XG5cbmZ1bmN0aW9uIHZlcmlmeUNvb3JkcyhhcnJheSwgb2JqZWN0KSB7XG4gIGNvbnN0IHNoaXBUb1ZlcmlmeSA9IG9iamVjdC5zaGlwUGxhY2VtZW50O1xuICBsZXQgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICBpZiAoIWFycmF5Lmxlbmd0aCkge1xuICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xuICB9IGVsc2Uge1xuICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFRvVmVyaWZ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgICAgaWYgKGlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcC5zaGlwUGxhY2VtZW50Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChzaGlwVG9WZXJpZnlbaV0gIT09IHNoaXAuc2hpcFBsYWNlbWVudFtqXSkge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xufVxuXG4vLyB1c2VkIGZvciB0aGUgbmFtZSBhbmQgbGVuZ3RoIHByb3BzIGluIHRoZSBwbGFjZUNvbXB1dGVyRmxlZXQgZnhuXG5jb25zdCBzaGlwQ2xvbmUgPSBTaGlwcygpO1xuXG5mdW5jdGlvbiBwbGFjZUNvbXB1dGVyRmxlZXQodXNlciwgYXJyYXkpIHtcbiAgc2hpcENsb25lLmZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuICAgIHdoaWxlICghaXNWYWxpZCkge1xuICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgY29uc3QgcmFuZG9tVmFsdWVzID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKTtcbiAgICAgIGNvbnN0IHBsYWNlbWVudCA9IG9yaWVudFNoaXAoXG4gICAgICAgIHJhbmRvbVZhbHVlc1sxXSxcbiAgICAgICAgcmFuZG9tVmFsdWVzWzBdLFxuICAgICAgICBzaGlwLm5hbWUsXG4gICAgICAgIHNoaXAubGVuZ3RoXG4gICAgICApO1xuICAgICAgY29uc3QgdmVyaWZ5ID0gdmVyaWZ5Q29vcmRzKGFycmF5LCBwbGFjZW1lbnQpO1xuICAgICAgaWYgKHZlcmlmeSkge1xuICAgICAgICBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgYXJyYXkucHVzaChwbGFjZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmICh1c2VyID09PSBgY3B1YCkge1xuICAgIHJlbmRlckNvbXB1dGVyU2hpcHMoYXJyYXkpO1xuICB9IGVsc2Uge1xuICAgIHJlbmRlclBsYXllclNoaXBzKGFycmF5KTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG4vLyBFTkQtLS0tLS0tLSBjcmVhdGVzIGEgcmFuZG9tbHkgcGxhY2VkIGJvYXJkIGZvciBwbGF5ZXIgLS0tLS0tLSAvL1xuXG5leHBvcnQgeyBHYW1lYm9hcmQsIHBsYWNlQ29tcHV0ZXJGbGVldCwgcmVjZWl2ZUF0dGFjayB9O1xuIiwiaW1wb3J0IHsgY3JlYXRlUGxheWVyT2JqZWN0cyB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyByZW5kZXJQbGF5ZXJTaGlwcywgY2xlYXJCb2FyZHMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmxldCBwbGF5ZXJGbGVldCA9IFtdO1xuXG5jb25zdCBzaGlwTmFtZXMgPSBbXG4gIGBDYXJyaWVyYCxcbiAgYEJhdHRsZXNoaXBgLFxuICBgRGVzdHJveWVyYCxcbiAgYFN1Ym1hcmluZWAsXG4gIGBQYXRyb2wgQm9hdGAsXG5dO1xuY29uc3Qgc2hpcExlbmd0aHMgPSBbNSwgNCwgMywgMywgMl07XG4vLyBsZXQgc2hpcHNQbGFjZWQgPSBwbGF5ZXJGbGVldC5sZW5ndGg7XG5sZXQgc2hpcENvb3JkcyA9IFtdO1xuXG5jb25zdCBjcHVHYW1lQm9hcmRUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmQtaGVhZGVyYCk7XG5jb25zdCBjcHVCb2FyZFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG5cbmNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNidG4tcm90YXRlLXNoaXBgKTtcbmNvbnN0IGNsZWFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NsZWFyLWJvYXJkLWJ0bmApO1xuY29uc3QgcmFuZG9taXplQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3JhbmRvbWl6ZS1wbGF5ZXItZmxlZXRgKTtcblxuY29uc3QgcGxhY2VTaGlwc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGFjZS1zaGlwcy1jb250YWluZXJgKTtcbmNvbnN0IHBsYXllclNoaXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgYC5wbGF5ZXItc2hpcHMtY29udGFpbmVyYFxuKTtcbmxldCBzaGlwSW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuXG5mdW5jdGlvbiBoaWRlU2hpcHNUb1BsYWNlKCkge1xuICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKGBoaWRlLXNoaXBgKTtcbiAgfSk7XG4gIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xufVxuXG4vLyBoaWRlcyBhbGwgYnV0IHRoZSBjYXJyaWVyIG9uIHBhZ2UgbG9hZFxuZnVuY3Rpb24gc2V0VXBTaGlwc1RvRHJhZ0FuZERyb3AoKSB7XG4gIHBsYXllckZsZWV0ID0gW107XG4gIHNoaXBJbWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnNoaXBzLXRvLXBsYWNlYCk7XG4gIHNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coc2hpcCk7XG4gICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKGBtb3VzZWRvd25gLCBiZWdpblNoaXBQbGFjZW1lbnQpO1xuICAgIGlmIChpbmRleCAhPT0gMCkge1xuICAgICAgLy8gY29uc29sZS5sb2coc2hpcCk7XG4gICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoYGhpZGUtc2hpcGApO1xuICAgIH1cbiAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoYG1vdXNlZG93bmAsIGJlZ2luU2hpcFBsYWNlbWVudCk7XG4gICAgc2hpcC5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gICAgc2hpcC5vbmRyYWdzdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICB9KTtcbiAgcmFuZG9taXplQnRuLnN0eWxlLmRpc3BsYXkgPSBgZmxleGA7XG4gIGNsZWFyQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG59XG5zZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCgpO1xuXG4vLyBsYWJlbHMgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCBvbiBwYWdlIGxvYWRcbmNwdUdhbWVCb2FyZFRpdGxlLnRleHRDb250ZW50ID0gYFBMQUNFIFlPVVIgU0hJUFNgO1xuXG4vLyBzdGFydCBnYW1lIGJ1dHRvblxuY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc3RhcnQtZ2FtZS1idG5gKTtcbnN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgYmVnaW5HYW1lKTtcblxuZnVuY3Rpb24gYmVnaW5HYW1lKCkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgY3B1R2FtZUJvYXJkVGl0bGUudGV4dENvbnRlbnQgPSBgQ29tcHV0ZXJgO1xuICBwbGF5ZXJCb2FyZC5zdHlsZS5kaXNwbGF5ID0gYGJsb2NrYDtcbiAgcGxhY2VTaGlwc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICBpZiAocGxheWVyRmxlZXQubGVuZ3RoID09PSA1KSB7XG4gICAgLy8gY29uc29sZS5sb2coYGNyZWF0ZSBvYmplY3RzYCk7XG4gICAgY3JlYXRlUGxheWVyT2JqZWN0cyhwbGF5ZXJGbGVldCk7XG4gICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGBgO1xuICAgIH0pO1xuICB9XG59XG5cbmNsZWFyQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgY2xlYXJCb2FyZHMpO1xuXG5yb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCByb3RhdGVTaGlwKTtcblxuZnVuY3Rpb24gcm90YXRlU2hpcChlKSB7XG4gIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSA9IGAtOTBkZWdgO1xuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgIDEwMCArICgoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpIC8gMikgKiAzNSArIGBweGA7XG4gIH0gZWxzZSB7XG4gICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgPSBgYDtcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9IDEwMCArIGBweGA7XG4gIH1cbn1cblxuLy8gc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCkgPT4ge1xuLy8gICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoYG1vdXNlZG93bmAsIGJlZ2luU2hpcFBsYWNlbWVudCk7XG4vLyAgIHNoaXAuc3R5bGUuY3Vyc29yID0gYGdyYWJgO1xuLy8gICBzaGlwLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuLy8gICAgIHJldHVybiBmYWxzZTtcbi8vICAgfTtcbi8vIH0pO1xuXG5mdW5jdGlvbiBiZWdpblNoaXBQbGFjZW1lbnQoZXZlbnQpIHtcbiAgLy8gKDEpIHByZXBhcmUgdG8gbW92ZSBlbGVtZW50OiBtYWtlIGFic29sdXRlIGFuZCBvbiB0b3AgYnkgei1pbmRleFxuICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnpJbmRleCA9IDEwMDA7XG5cbiAgLy8gbW92ZSBpdCBvdXQgb2YgYW55IGN1cnJlbnQgcGFyZW50cyBkaXJlY3RseSBpbnRvIGNwdUJvYXJkXG4gIHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uYXBwZW5kKHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0pO1xuXG4gIC8vIGNlbnRlcnMgdGhlIGN1cnNvciBpbiB0aGUgZmlyc3QgXCJzcXVhcmVcIiBvZiB0aGUgc2hpcCBpbWFnZVxuICBmdW5jdGlvbiBtb3ZlQXQocGFnZVgsIHBhZ2VZKSB7XG4gICAgaWYgKCFzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgcGFnZVggLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54ICtcbiAgICAgICAgICAxNy41KSArXG4gICAgICAgIFwicHhcIjtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgICAgcGFnZVkgLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55ICtcbiAgICAgICAgICAxNy41KSArXG4gICAgICAgIFwicHhcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgcGFnZVggLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54ICtcbiAgICAgICAgICAoKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAvIDIpICogMzUpIC1cbiAgICAgICAgMTcuNSArXG4gICAgICAgIFwicHhcIjtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgICAgcGFnZVkgLVxuICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55IC1cbiAgICAgICAgICAoKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAvIDIpICogMzUpIC1cbiAgICAgICAgMTcuNSArXG4gICAgICAgIFwicHhcIjtcbiAgICB9XG4gIH1cblxuICAvLyBtb3ZlIG91ciBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgY2FycmllciB1bmRlciB0aGUgcG9pbnRlclxuICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcblxuICAvLyBwb3RlbnRpYWwgZHJvcHBhYmxlIHRoYXQgd2UncmUgZmx5aW5nIG92ZXIgcmlnaHQgbm93XG4gIGxldCBjdXJyZW50RHJvcHBhYmxlID0gbnVsbDtcbiAgbGV0IGRyb3BwYWJsZUJlbG93ID0gbnVsbDtcbiAgbGV0IGlzRHJvcFZhbGlkO1xuXG4gIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG4gICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5oaWRkZW4gPSB0cnVlO1xuICAgIGxldCBlbGVtQmVsb3cgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuXG4gICAgLy8gbW91c2Vtb3ZlIGV2ZW50cyBtYXkgdHJpZ2dlciBvdXQgb2YgdGhlIHdpbmRvdyAod2hlbiB0aGUgc2hpcCBpcyBkcmFnZ2VkIG9mZi1zY3JlZW4pXG4gICAgLy8gaWYgY2xpZW50WC9jbGllbnRZIGFyZSBvdXQgb2YgdGhlIHdpbmRvdywgdGhlbiBlbGVtZW50RnJvbVBvaW50IHJldHVybnMgbnVsbFxuICAgIC8vIGNvbnN0IG1heFBhZ2VYID0gd2luZG93LmlubmVyV2lkdGggLSAoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpICogMzU7XG4gICAgLy8gY29uc3QgbWF4UGFnZVkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSAoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpICogMzU7XG4gICAgLy8gY29uc29sZS5sb2coXCJYOiBcIiArIG1heFBhZ2VYICsgXCIsIFk6IFwiICsgbWF4UGFnZVkpO1xuXG4gICAgaWYgKCFlbGVtQmVsb3cpIHJldHVybjtcblxuICAgIC8vIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgJiYgZXZlbnQucGFnZVggPj0gbWF4UGFnZVgpIHtcbiAgICAvLyAgIGlzRHJvcFZhbGlkID0gZmFsc2U7XG4gICAgLy8gICByZXR1cm47XG4gICAgLy8gfSBlbHNlIGlmIChzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSAmJiBldmVudC5wYWdlWSA+PSBtYXhQYWdlWSkge1xuICAgIC8vICAgaXNEcm9wVmFsaWQgPSBmYWxzZTtcbiAgICAvLyAgIHJldHVybjtcbiAgICAvLyB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyh3aW5kb3cuaW5uZXJXaWR0aCk7XG4gICAgLy8gY29uc29sZS5sb2cod2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAvLyBjb25zb2xlLmxvZyhldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuXG4gICAgLy8gQkVHSU4gLS0tLSBjaGVja3MgdmFsaWRpdHkgb2YgdGhlIGRyb3BcbiAgICBsZXQgYXJyYXlPZkVsZW1lbnRzQmVsb3dUb0NoZWNrVmFsaWRpdHkgPSBbXTtcbiAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5zaGlmdCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICBsZXQgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHk7XG4gICAgICBpZiAoc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkgPSBkb2N1bWVudFxuICAgICAgICAgIC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgKyBpICogMzUpXG4gICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdldENsYXNzVG9DaGVja1ZhbGlkaXR5ID0gZG9jdW1lbnRcbiAgICAgICAgICAuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYICsgaSAqIDM1LCBldmVudC5jbGllbnRZKVxuICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGNsYXNzYCk7XG4gICAgICB9XG4gICAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5wdXNoKGdldENsYXNzVG9DaGVja1ZhbGlkaXR5KTtcbiAgICAgIGlmIChhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eVswXSkge1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoKGl0ZW0gJiYgaXRlbS5pbmNsdWRlcyhgaW52YWxpZGApKSB8fCBpdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNvdW50ZXIpIHtcbiAgICAgICAgICBpc0Ryb3BWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzRHJvcFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpc0Ryb3BWYWxpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5KTtcbiAgICAvLyBFTkQgLS0tLSBjaGVja3MgdmFsaWRpdHkgb2YgdGhlIGRyb3BcblxuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uaGlkZGVuID0gZmFsc2U7XG5cbiAgICAvLyAvLyBtb3VzZW1vdmUgZXZlbnRzIG1heSB0cmlnZ2VyIG91dCBvZiB0aGUgd2luZG93ICh3aGVuIHRoZSBzaGlwIGlzIGRyYWdnZWQgb2ZmLXNjcmVlbilcbiAgICAvLyAvLyBpZiBjbGllbnRYL2NsaWVudFkgYXJlIG91dCBvZiB0aGUgd2luZG93LCB0aGVuIGVsZW1lbnRGcm9tUG9pbnQgcmV0dXJucyBudWxsXG4gICAgLy8gaWYgKCFlbGVtQmVsb3cpIHJldHVybjtcblxuICAgIC8vIHBvdGVudGlhbCBkcm9wcGFibGVzIGFyZSBsYWJlbGVkIHdpdGggdGhlIGNsYXNzIFwiZHJvcHBhYmxlXCIgKGNhbiBiZSBvdGhlciBsb2dpYylcbiAgICBkcm9wcGFibGVCZWxvdyA9IGVsZW1CZWxvdy5jbG9zZXN0KFwiLmNwdVNxdWFyZVwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhkcm9wcGFibGVCZWxvdyk7XG5cbiAgICBpZiAoIWRyb3BwYWJsZUJlbG93IHx8ICFpc0Ryb3BWYWxpZCkge1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5jdXJzb3IgPSBgbm8tZHJvcGA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuY3Vyc29yID0gYGdyYWJiaW5nYDtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudERyb3BwYWJsZSAhPSBkcm9wcGFibGVCZWxvdykge1xuICAgICAgLy8gd2UncmUgZmx5aW5nIGluIG9yIG91dC4uLlxuICAgICAgLy8gbm90ZTogYm90aCB2YWx1ZXMgY2FuIGJlIG51bGxcbiAgICAgIC8vICAgY3VycmVudERyb3BwYWJsZT1udWxsIGlmIHdlIHdlcmUgbm90IG92ZXIgYSBkcm9wcGFibGUgYmVmb3JlIHRoaXMgZXZlbnQgKGUuZyBvdmVyIGFuIGVtcHR5IHNwYWNlKVxuICAgICAgLy8gICBkcm9wcGFibGVCZWxvdz1udWxsIGlmIHdlJ3JlIG5vdCBvdmVyIGEgZHJvcHBhYmxlIG5vdywgZHVyaW5nIHRoaXMgZXZlbnRcblxuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgb3V0XCIgb2YgdGhlIGRyb3BwYWJsZSAocmVtb3ZlIGhpZ2hsaWdodClcbiAgICAgICAgbGVhdmVEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuICAgICAgfVxuICAgICAgY3VycmVudERyb3BwYWJsZSA9IGRyb3BwYWJsZUJlbG93O1xuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgLy8gdGhlIGxvZ2ljIHRvIHByb2Nlc3MgXCJmbHlpbmcgaW5cIiBvZiB0aGUgZHJvcHBhYmxlXG4gICAgICAgIGVudGVyRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbnRlckRyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICAvLyBpZiAoZWxlbWVudCkge1xuICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICBjb25zdCBtYXhIb3Jpem9udGFsID0gKE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKyAxKSAqIDEwO1xuICAgIGNvbnN0IG1heFZlcnRpY2FsID1cbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC1cbiAgICAgIE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKiAxMCArXG4gICAgICA5MDtcbiAgICBpZiAoXG4gICAgICAhc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSA8XG4gICAgICAgIG1heEhvcml6b250YWwgJiZcbiAgICAgIGlzRHJvcFZhbGlkXG4gICAgKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgXCIjODI5RTc2XCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAqIDEwIDw9XG4gICAgICAgIG1heFZlcnRpY2FsICYmXG4gICAgICBpc0Ryb3BWYWxpZFxuICAgICkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODI5RTc2XCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG4gICAgICBzaGlwQ29vcmRzID0gW107XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKHNoaXBDb29yZHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhdmVEcm9wcGFibGVBcmVhKGVsZW1lbnQpIHtcbiAgICBzaGlwQ29vcmRzID0gW107XG4gICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICAgIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXSkge1xuICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICBcIiNjMWMxYzFcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tcbiAgICAgICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXG4gICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNjMWMxYzFcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vICgyKSBtb3ZlIHRoZSBzaGlwIG9uIG1vdXNlbW92ZVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcblxuICAvLyAoMykgZHJvcCB0aGUgc2hpcCwgcmVtb3ZlIHVubmVlZGVkIGhhbmRsZXJzXG4gIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0ub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKHBsYXllckZsZWV0Lmxlbmd0aCk7XG4gICAgY29uc29sZS5sb2cocGxheWVyRmxlZXQubGVuZ3RoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLm9ubW91c2V1cCA9IG51bGw7XG4gICAgaWYgKHNoaXBDb29yZHMubGVuZ3RoICE9PSAwICYmIGRyb3BwYWJsZUJlbG93ICYmIGlzRHJvcFZhbGlkKSB7XG4gICAgICBwbGF5ZXJGbGVldC5wdXNoKHtcbiAgICAgICAgbmFtZTogc2hpcE5hbWVzW3BsYXllckZsZWV0Lmxlbmd0aF0sXG4gICAgICAgIHNoaXBQbGFjZW1lbnQ6IHNoaXBDb29yZHMsXG4gICAgICB9KTtcbiAgICAgIHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aCAtIDFdLnJlbW92ZUNoaWxkKFxuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGggLSAxXVxuICAgICAgKTtcbiAgICAgIHJlbmRlclBsYXllclNoaXBzKFtwbGF5ZXJGbGVldFtwbGF5ZXJGbGVldC5sZW5ndGggLSAxXV0pO1xuICAgICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYCNjMWMxYzFgO1xuICAgICAgfSk7XG4gICAgICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoaW5kZXggPT09IHBsYXllckZsZWV0Lmxlbmd0aCkge1xuICAgICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShgaGlkZS1zaGlwYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2cocGxheWVyRmxlZXQubGVuZ3RoKTtcbiAgICAgIGNvbnNvbGUubG9nKHBsYXllckZsZWV0Lmxlbmd0aCk7XG4gICAgICAvLyBwbGF5ZXJGbGVldC5sZW5ndGggKz0gMTtcbiAgICAgIC8vIGNvbnN0IGNsZWFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NsZWFyLWJvYXJkLWJ0bmApO1xuICAgICAgaWYgKHBsYXllckZsZWV0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByYW5kb21pemVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lIGA7XG4gICAgICAgIGNsZWFyQnRuLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgIH1cbiAgICAgIGlmIChwbGF5ZXJGbGVldC5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgc3RhcnRCdG4uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICBjbGVhckJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICAgICAgICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGxhY2VTaGlwc0NvbnRhaW5lci5pbnNlcnRCZWZvcmUoXG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0sXG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aCArIDFdXG4gICAgICApO1xuICAgICAgaWYgKHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlKSB7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlID0gYGA7XG4gICAgICB9XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPSBcIjEwMHB4XCI7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS56SW5kZXggPSAwO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgeyBoaWRlU2hpcHNUb1BsYWNlLCBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCwgYmVnaW5TaGlwUGxhY2VtZW50IH07XG4iLCJpbXBvcnQgeyBnYW1lTG9vcCwgaGFuZGxlU3RhdGUgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuaW1wb3J0IHsgc2V0VXBTaGlwc1RvRHJhZ0FuZERyb3AsIGJlZ2luU2hpcFBsYWNlbWVudCB9IGZyb20gXCIuL2luZGV4XCI7XG5cbmZ1bmN0aW9uIHJlbmRlckdhbWVib2FyZCh1c2VyKSB7XG4gIGxldCBib2FyZERpdjtcbiAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gICAgYm9hcmQuc2V0QXR0cmlidXRlKGBpZGAsIGBwbGF5ZXItc3F1YXJlcy1jb250YWluZXJgKTtcbiAgfSBlbHNlIHtcbiAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgfVxuICBib2FyZC5jbGFzc0xpc3QuYWRkKGBnYW1lYm9hcmRgKTtcbiAgY29uc3QgbWF4U3F1YXJlcyA9IDEwMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhTcXVhcmVzOyBpKyspIHtcbiAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICAvLyBzcXVhcmUudGV4dENvbnRlbnQgPSBpO1xuICAgIHNxdWFyZS5kYXRhc2V0LmluZGV4TnVtYmVyID0gaTtcbiAgICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKGBwbGF5ZXJTcXVhcmVgKTtcbiAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKGBjcHVTcXVhcmVgKTtcbiAgICB9XG4gICAgYm9hcmQuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgfVxuICBib2FyZERpdi5hcHBlbmRDaGlsZChib2FyZCk7XG59XG5cbmNvbnN0IHBsYXllckF0dGFjayA9IChlKSA9PiB7XG4gIGNvbnN0IGNvb3JkaW5hdGVDbGlja2VkID0gK2UudGFyZ2V0LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4gIGdhbWVMb29wKGNvb3JkaW5hdGVDbGlja2VkKTtcbiAgZS50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xufTtcblxucmVuZGVyR2FtZWJvYXJkKGBjcHVgKTtcblxuZnVuY3Rpb24gZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhhcnJheSkge1xuICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICBhcnJheS5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgIHNxdWFyZXNbaW5kZXhdLnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlck1vdmUod2hvc2VUdXJuLCBhdHRhY2tBcnJheSkge1xuICBjb25zb2xlLmxvZyh7IHdob3NlVHVybiwgYXR0YWNrQXJyYXkgfSk7XG4gIGxldCBzcXVhcmVzO1xuICBjb25zdCBoaXRJbmRleCA9IGF0dGFja0FycmF5WzFdO1xuICBpZiAod2hvc2VUdXJuID09PSBgcGxheWVyYCkge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbiAgfVxuICBpZiAoYXR0YWNrQXJyYXlbMF0pIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBoaXRgKTtcbiAgfSBlbHNlIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBtaXNzYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29tcHV0ZXJTaGlwcyhjcHVGbGVldCkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBjcHVGbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYGNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLnNyYyA9IGltZ1NyYztcblxuICAgIGNvbnN0IHNvcnRBc2NlbmRpbmcgPSBzaGlwT2JqZWN0LnNoaXBQbGFjZW1lbnQuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuICAgIGNvbnN0IGRpbWVuc2lvbk9mU3F1YXJlID0gMzU7XG4gICAgbGV0IHRvcE9mZnNldDtcbiAgICBsZXQgbGVmdE9mZnNldDtcbiAgICBpZiAoc29ydEFzY2VuZGluZ1swXSArIDEgPT09IHNvcnRBc2NlbmRpbmdbMV0pIHtcbiAgICAgIC8vIHBsYWNlIGhvcml6b250YWwgc2hpcHNcbiAgICAgIHRvcE9mZnNldCA9IE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9ICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBsYWNlIHZlcnRpY2FsIHNoaXBzXG4gICAgICBzaGlwSW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgtOTBkZWcpYDtcbiAgICAgIHRvcE9mZnNldCA9XG4gICAgICAgIE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlICtcbiAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwSW1hZ2Uuc3R5bGUudG9wID0gYCR7dG9wT2Zmc2V0fXB4YDtcbiAgICBzaGlwSW1hZ2Uuc3R5bGUubGVmdCA9IGAke2xlZnRPZmZzZXR9cHhgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH0pO1xuICByZW5kZXJHYW1lYm9hcmQoYHBsYXllcmApO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQbGF5ZXJTaGlwcyhmbGVldCkge1xuICBpZiAoZmxlZXRbMF0uc2hpcFBsYWNlbWVudFswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICBsZXQgaW1nU3JjO1xuXG4gIGZsZWV0LmZvckVhY2goKHNoaXBPYmplY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChgcGxheWVyLXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgaWYgKHNoaXBPYmplY3QubmFtZSA9PT0gYFBhdHJvbCBCb2F0YCkge1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy9wYXRyb2wucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBwYXRyb2xgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwT2JqZWN0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvJHtzaGlwTmFtZX0ucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXBOYW1lfWApO1xuICAgIH1cbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgaW52YWxpZGApO1xuICAgIHNoaXBJbWFnZS5zcmMgPSBpbWdTcmM7XG5cbiAgICBjb25zdCBzb3J0QXNjZW5kaW5nID0gc2hpcE9iamVjdC5zaGlwUGxhY2VtZW50LnNvcnQoKHgsIHkpID0+IHggLSB5KTtcbiAgICBjb25zdCBkaW1lbnNpb25PZlNxdWFyZSA9IDM1O1xuICAgIGxldCB0b3BPZmZzZXQ7XG4gICAgbGV0IGxlZnRPZmZzZXQ7XG4gICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gKyAxID09PSBzb3J0QXNjZW5kaW5nWzFdKSB7XG4gICAgICAvLyBwbGFjZSBob3Jpem9udGFsIHNoaXBzXG4gICAgICB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSAtIDM1MDtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9IHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwbGFjZSB2ZXJ0aWNhbCBzaGlwc1xuICAgICAgc2hpcEltYWdlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoLTkwZGVnKWA7XG4gICAgICB0b3BPZmZzZXQgPVxuICAgICAgICBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSArXG4gICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzUgLVxuICAgICAgICAzNTA7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgIHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcEltYWdlLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGA7XG4gICAgc2hpcEltYWdlLnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgICBjcHVCb2FyZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2xlYXJCb2FyZHMoKSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICBjb25zdCBwbGF5ZXJTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1zcXVhcmVzLWNvbnRhaW5lcmApO1xuICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgY29uc3QgcGxhY2VTaGlwc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGFjZS1zaGlwcy1jb250YWluZXJgKTtcbiAgY29uc3Qgc2hpcHNPbkNQVUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllci1zaGlwcy1yZW5kZXJlZGApO1xuICBjb25zdCBzaGlwc09uUGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1LXNoaXBzLXJlbmRlcmVkYCk7XG4gIGNvbnN0IHJlbWFpbmluZ1NoaXBzVG9QbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuXG4gIHBsYXllckJvYXJkLnJlbW92ZUNoaWxkKHBsYXllclNxdWFyZXMpO1xuICByZW1vdmVFbGVtZW50cyhjcHVCb2FyZCwgc2hpcHNPbkNQVUJvYXJkKTtcbiAgcmVtb3ZlRWxlbWVudHMocGxheWVyQm9hcmQsIHNoaXBzT25QbGF5ZXJCb2FyZCk7XG4gIC8vIHJlbW92ZUVsZW1lbnRzKHBsYXllckJvYXJkLCBwbGF5ZXJTcXVhcmVzKTtcbiAgcmVtb3ZlRWxlbWVudHMocGxhY2VTaGlwc0NvbnRhaW5lciwgcmVtYWluaW5nU2hpcHNUb1BsYWNlKTtcbiAgcmVkaXNwbGF5U2hpcHNUb1BsYWNlKHBsYWNlU2hpcHNDb250YWluZXIpO1xuICBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCgpO1xuICBoYW5kbGVTdGF0ZSgpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50cyhwYXJlbnQsIGNoaWxkcmVuKSB7XG4gIGlmIChjaGlsZHJlbikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVkaXNwbGF5U2hpcHNUb1BsYWNlKHBhcmVudCkge1xuICBjb25zdCBuYW1lSGVscGVyID0gW1xuICAgIGBjYXJyaWVyYCxcbiAgICBgYmF0dGxlc2hpcGAsXG4gICAgYGRlc3Ryb3llcmAsXG4gICAgYHN1Ym1hcmluZWAsXG4gICAgYHBhdHJvbGAsXG4gIF07XG4gIG5hbWVIZWxwZXIuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIHNoaXBJbWFnZS5zcmMgPSBgLi9pbWdzLyR7c2hpcH0ucG5nYDtcbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwfWApO1xuICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBzaGlwcy10by1wbGFjZWApO1xuICAgIHNoaXBJbWFnZS5zZXRBdHRyaWJ1dGUoYGlkYCwgYHBsYXllci0ke3NoaXB9YCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gIH0pO1xufVxuXG5leHBvcnQge1xuICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzLFxuICByZW5kZXJNb3ZlLFxuICByZW5kZXJDb21wdXRlclNoaXBzLFxuICByZW5kZXJQbGF5ZXJTaGlwcyxcbiAgY2xlYXJCb2FyZHMsXG59O1xuIiwiY29uc3QgU2hpcHMgPSAoKSA9PiB7XG4gIGNvbnN0IGZsZWV0ID0gW1xuICAgIHsgbmFtZTogYENhcnJpZXJgLCBsZW5ndGg6IDUsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgQmF0dGxlc2hpcGAsIGxlbmd0aDogNCwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBEZXN0cm95ZXJgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgU3VibWFyaW5lYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFBhdHJvbCBCb2F0YCwgbGVuZ3RoOiAyLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICBdO1xuXG4gIGNvbnN0IGhpdCA9IChhdHRhY2tEYXRhKSA9PiB7XG4gICAgY29uc3Qgc2hpcEhpdCA9IGF0dGFja0RhdGFbMF07XG4gICAgY29uc3QgY29vcmRPZkhpdCA9IGF0dGFja0RhdGFbMV07XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSkge1xuICAgICAgICBzaGlwLmhpdHMucHVzaChjb29yZE9mSGl0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoc2hpcEhpdCkgPT4ge1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUgJiYgc2hpcC5sZW5ndGggPT09IHNoaXAuaGl0cy5sZW5ndGgpIHtcbiAgICAgICAgc2hpcC5pc1N1bmsgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGZsZWV0LCBoaXQsIGlzU3VuayB9O1xufTtcblxuZXhwb3J0IHsgU2hpcHMgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9