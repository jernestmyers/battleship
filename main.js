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
}

function createPlayerObjects(fleet) {
  const playerBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard)(fleet);
  storedGameboards.push([`computer`, playerBoard]);
}

function createComputerObjects() {
  const cpuFleetArray = [];
  const computerFleet = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.placeComputerFleet)(`cpu`, cpuFleetArray);
  const computerBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard)(computerFleet);
  storedGameboards.push([`player`, computerBoard]);
}
createComputerObjects();

const validMoves = [];
function handleState() {
  if (storedGameboards.length === 2) {
    storedGameboards.shift();
  }
  storedGameboards.shift();
  for (let i = 0; i < validMoves.length; i++) {
    validMoves.pop();
  }
  createComputerObjects();
}

// BEGIN ----- generates random move for computer ----------- //
function createValidMovesArray() {
  // const validMoves = [];
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
            isShipSunk = object.isSunk;
            arrayIndex = index;
            if (isShipSunk) {
              const cpuHiddenShips =
                document.querySelectorAll(`.cpu-ships-rendered`);
              cpuHiddenShips[index].style.display = `block`;
              cpuHiddenShips[index].style.zIndex = `1`;
            }
          }
        });
      }
      if (isGameOver) {
        const gameOverModal = document.querySelector(`#game-over-modal`);
        const displayWinnerText = document.querySelector(`#display-winner`);
        (0,_renderGame__WEBPACK_IMPORTED_MODULE_1__.deregisterRemainingEventListneners)(getPlayerMovesRemaining);
        if (getTurn === `player`) {
          displayWinnerText.textContent = `You win!`;
        } else {
          displayWinnerText.textContent = `You lose!`;
        }
        gameOverModal.style.display = "block";
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
let shipCoords = [];

const cpuGameBoardTitle = document.querySelector(`#cpu-board-header`);
const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);

const rotateBtn = document.querySelector(`#btn-rotate-ship`);
const clearBtn = document.querySelector(`#clear-board-btn`);
const randomizeBtn = document.querySelector(`#randomize-player-fleet`);
const newGameBtn = document.querySelector(`#new-game-btn`);

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
    ship.addEventListener(`mousedown`, beginShipPlacement);
    if (index !== 0) {
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
    (0,_gameHandler__WEBPACK_IMPORTED_MODULE_0__.createPlayerObjects)(playerFleet);
    cpuBoardSquares.forEach((square) => {
      square.style.backgroundColor = ``;
    });
  }
}

clearBtn.addEventListener(`click`, _renderGame__WEBPACK_IMPORTED_MODULE_1__.clearBoards);
newGameBtn.addEventListener(`click`, _renderGame__WEBPACK_IMPORTED_MODULE_1__.clearBoards);

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

    if (!elemBelow) return;

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
      }
    }
    // END ---- checks validity of the drop

    shipImgs[playerFleet.length].hidden = false;

    // potential droppables are the squares on the gameboard
    droppableBelow = elemBelow.closest(".cpuSquare");

    if (!droppableBelow || !isDropValid) {
      shipImgs[playerFleet.length].style.cursor = `no-drop`;
    } else {
      shipImgs[playerFleet.length].style.cursor = `grabbing`;
    }

    if (currentDroppable != droppableBelow) {
      if (currentDroppable) {
        leaveDroppableArea(currentDroppable);
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        enterDroppableArea(currentDroppable);
      }
    }
  }

  function enterDroppableArea(element) {
    shipCoords = [];
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
/* harmony export */   "clearBoards": () => (/* binding */ clearBoards),
/* harmony export */   "startNewGame": () => (/* binding */ startNewGame)
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
    board.setAttribute(`id`, `cpu-squares-container`);
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

function clearBoards(e) {
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
  removeElements(placeShipsContainer, remainingShipsToPlace);
  redisplayShipsToPlace(placeShipsContainer);
  (0,_index__WEBPACK_IMPORTED_MODULE_1__.setUpShipsToDragAndDrop)();
  (0,_gameHandler__WEBPACK_IMPORTED_MODULE_0__.handleState)();
  if (e.target.closest(`div`).id !== `clear-board-btn`) {
    startNewGame(playerBoard, placeShipsContainer, cpuBoard);
  }
}

function startNewGame(hidePlayerBoard, displayContainer, cpuParent) {
  const rotateBtn = document.querySelector(`#btn-rotate-ship`);
  rotateBtn.style.display = `flex`;
  document.querySelector(`#game-over-modal`).style.display = `none`;
  hidePlayerBoard.style.display = `none`;
  displayContainer.style.display = `flex`;
  document.querySelector(`#cpu-board-header`).textContent = `PLACE YOUR SHIPS`;
  const buttons = document.querySelectorAll(`.place-ships-btns`);
  for (let i = 0; i < buttons.length; i++) {
    if (i === 0) {
      buttons[i].style.display = "flex";
    } else if (i === buttons.length - 1) {
      break;
    } else {
      buttons[i].style.display = "none";
    }
  }
  const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);
  cpuBoardSquares.forEach((square) => {
    square.style.backgroundColor = ``;
  });
  cpuParent.removeChild(document.querySelector(`#cpu-squares-container`));
  renderGameboard(`cpu`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZW5kZXJHYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkU7QUFDRztBQUNoQzs7QUFFOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRSwyREFBZ0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDhEQUFrQjtBQUN4QztBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLHFEQUFTO0FBQy9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3Qiw4REFBa0I7QUFDMUMsd0JBQXdCLHFEQUFTO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QUNBO0FBQ0EsSUFBSSxpRUFBbUI7QUFDdkI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLG1DQUFtQyxvREFBVztBQUM5QyxxQ0FBcUMsb0RBQVc7O0FBRWhEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHFDQUFxQztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscUNBQXFDO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFDQUFxQztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNB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Q0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixLQUFLO0FBQ25DLCtCQUErQixLQUFLO0FBQ3BDO0FBQ0EsMkNBQTJDLEtBQUs7QUFDaEQ7QUFDQSxHQUFHO0FBQ0g7O0FBU0U7Ozs7Ozs7Ozs7Ozs7OztBQ2xRRjtBQUNBO0FBQ0EsS0FBSyxzREFBc0Q7QUFDM0QsS0FBSyx5REFBeUQ7QUFDOUQsS0FBSyx3REFBd0Q7QUFDN0QsS0FBSyx3REFBd0Q7QUFDN0QsS0FBSywwREFBMEQ7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxVQUFVO0FBQ1Y7O0FBRWlCOzs7Ozs7O1VDOUJqQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgeyByZW5kZXJNb3ZlLCBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuaW1wb3J0IHsgaGlkZVNoaXBzVG9QbGFjZSB9IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmNvbnN0IHN0b3JlZEdhbWVib2FyZHMgPSBbXTtcblxubGV0IHR1cm5Db3VudGVyID0gMTtcbmZ1bmN0aW9uIHR1cm5Ecml2ZXIoKSB7XG4gIGxldCB3aG9zZU1vdmU7XG4gIGlmICh0dXJuQ291bnRlciAlIDIgIT09IDApIHtcbiAgICB3aG9zZU1vdmUgPSBgcGxheWVyYDtcbiAgfSBlbHNlIHtcbiAgICB3aG9zZU1vdmUgPSBgY29tcHV0ZXJgO1xuICB9XG4gIHR1cm5Db3VudGVyICs9IDE7XG4gIHJldHVybiB3aG9zZU1vdmU7XG59XG5cbmNvbnN0IHJhbmRvbWl6ZVBsYXllckZsZWV0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgYCNyYW5kb21pemUtcGxheWVyLWZsZWV0YFxuKTtcbnJhbmRvbWl6ZVBsYXllckZsZWV0QnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcmFuZG9taXplUGxheWVyRmxlZXQpO1xuXG5mdW5jdGlvbiByYW5kb21pemVQbGF5ZXJGbGVldCgpIHtcbiAgaGlkZVNoaXBzVG9QbGFjZSgpO1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzdGFydC1nYW1lLWJ0bmApO1xuICBzdGFydEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gIGlmIChzdG9yZWRHYW1lYm9hcmRzWzFdKSB7XG4gICAgc3RvcmVkR2FtZWJvYXJkcy5wb3AoKTtcbiAgICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgICBjb25zdCByZW5kZXJlZFBsYXllclNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGAucGxheWVyLXNoaXBzLXJlbmRlcmVkYFxuICAgICk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgIGNwdUJvYXJkLnJlbW92ZUNoaWxkKHJlbmRlcmVkUGxheWVyU2hpcHNbaV0pO1xuICAgIH1cbiAgfVxuICBjb25zdCBwbGF5ZXJGbGVldEFycmF5ID0gW107XG4gIGNvbnN0IHBsYXllckZsZWV0ID0gcGxhY2VDb21wdXRlckZsZWV0KGB1c2VyYCwgcGxheWVyRmxlZXRBcnJheSk7XG4gIGNyZWF0ZVBsYXllck9iamVjdHMocGxheWVyRmxlZXQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQbGF5ZXJPYmplY3RzKGZsZWV0KSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gR2FtZWJvYXJkKGZsZWV0KTtcbiAgc3RvcmVkR2FtZWJvYXJkcy5wdXNoKFtgY29tcHV0ZXJgLCBwbGF5ZXJCb2FyZF0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wdXRlck9iamVjdHMoKSB7XG4gIGNvbnN0IGNwdUZsZWV0QXJyYXkgPSBbXTtcbiAgY29uc3QgY29tcHV0ZXJGbGVldCA9IHBsYWNlQ29tcHV0ZXJGbGVldChgY3B1YCwgY3B1RmxlZXRBcnJheSk7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lYm9hcmQoY29tcHV0ZXJGbGVldCk7XG4gIHN0b3JlZEdhbWVib2FyZHMucHVzaChbYHBsYXllcmAsIGNvbXB1dGVyQm9hcmRdKTtcbn1cbmNyZWF0ZUNvbXB1dGVyT2JqZWN0cygpO1xuXG5jb25zdCB2YWxpZE1vdmVzID0gW107XG5mdW5jdGlvbiBoYW5kbGVTdGF0ZSgpIHtcbiAgaWYgKHN0b3JlZEdhbWVib2FyZHMubGVuZ3RoID09PSAyKSB7XG4gICAgc3RvcmVkR2FtZWJvYXJkcy5zaGlmdCgpO1xuICB9XG4gIHN0b3JlZEdhbWVib2FyZHMuc2hpZnQoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWxpZE1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFsaWRNb3Zlcy5wb3AoKTtcbiAgfVxuICBjcmVhdGVDb21wdXRlck9iamVjdHMoKTtcbn1cblxuLy8gQkVHSU4gLS0tLS0gZ2VuZXJhdGVzIHJhbmRvbSBtb3ZlIGZvciBjb21wdXRlciAtLS0tLS0tLS0tLSAvL1xuZnVuY3Rpb24gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCkge1xuICAvLyBjb25zdCB2YWxpZE1vdmVzID0gW107XG4gIGNvbnN0IG1heE1vdmVzID0gMTAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1heE1vdmVzOyBpKyspIHtcbiAgICB2YWxpZE1vdmVzLnB1c2goaSk7XG4gIH1cbiAgcmV0dXJuIHZhbGlkTW92ZXM7XG59XG5cbmNvbnN0IGdldFZhbGlkTW92ZXMgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcbmNvbnN0IGdldFBsYXllck1vdmVzUmVtYWluaW5nID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKSB7XG4gIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ2V0VmFsaWRNb3Zlcy5sZW5ndGgpO1xuICBjb25zdCByYW5kb21Nb3ZlID0gZ2V0VmFsaWRNb3Zlc1tyYW5kb21JbmRleF07XG4gIGdldFZhbGlkTW92ZXMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgcmV0dXJuIHJhbmRvbU1vdmU7XG59XG4vLyBFTkQgLS0tLS0gZ2VuZXJhdGVzIHJhbmRvbSBtb3ZlIGZvciBjb21wdXRlciAtLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBnYW1lTG9vcChwbGF5ZXJNb3ZlKSB7XG4gIGxldCBnZXRUdXJuO1xuICBsZXQgY29vcmRPZkF0dGFjaztcbiAgbGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgY29uc3QgaW5kZXhUb1NwbGljZSA9IGdldFBsYXllck1vdmVzUmVtYWluaW5nLmZpbmRJbmRleChcbiAgICAoaW5kZXgpID0+IGluZGV4ID09PSBwbGF5ZXJNb3ZlXG4gICk7XG4gIGdldFBsYXllck1vdmVzUmVtYWluaW5nLnNwbGljZShpbmRleFRvU3BsaWNlLCAxKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcbiAgICAgIGdldFR1cm4gPSB0dXJuRHJpdmVyKCk7XG4gICAgICBpZiAoZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbiAgICAgICAgY29vcmRPZkF0dGFjayA9IHBsYXllck1vdmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZE9mQXR0YWNrID0gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpO1xuICAgICAgfVxuICAgICAgY29uc3QgYXR0YWNrT3V0Y29tZSA9IHJlY2VpdmVBdHRhY2soY29vcmRPZkF0dGFjaywgZ2V0VHVybik7XG4gICAgICBjb25zb2xlLmxvZyhhdHRhY2tPdXRjb21lKTtcbiAgICAgIHJlbmRlck1vdmUoZ2V0VHVybiwgYXR0YWNrT3V0Y29tZSk7XG4gICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSkge1xuICAgICAgICBjb25zb2xlLmxvZyhzdG9yZWRHYW1lYm9hcmRzKTtcbiAgICAgICAgc3RvcmVkR2FtZWJvYXJkcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoaXRlbVswXSA9PT0gZ2V0VHVybikge1xuICAgICAgICAgICAgaXNHYW1lT3ZlciA9IGl0ZW1bMV0uaXNHYW1lT3ZlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSAmJiBnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICBsZXQgaXNTaGlwU3VuaztcbiAgICAgICAgbGV0IGFycmF5SW5kZXg7XG4gICAgICAgIHN0b3JlZEdhbWVib2FyZHNbMF1bMV0uc2hpcHMuZmxlZXQuZmlsdGVyKChvYmplY3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gPT09IG9iamVjdC5uYW1lKSB7XG4gICAgICAgICAgICBpc1NoaXBTdW5rID0gb2JqZWN0LmlzU3VuaztcbiAgICAgICAgICAgIGFycmF5SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIGlmIChpc1NoaXBTdW5rKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNwdUhpZGRlblNoaXBzID1cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1LXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgICAgICAgICAgIGNwdUhpZGRlblNoaXBzW2luZGV4XS5zdHlsZS5kaXNwbGF5ID0gYGJsb2NrYDtcbiAgICAgICAgICAgICAgY3B1SGlkZGVuU2hpcHNbaW5kZXhdLnN0eWxlLnpJbmRleCA9IGAxYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGlzR2FtZU92ZXIpIHtcbiAgICAgICAgY29uc3QgZ2FtZU92ZXJNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNnYW1lLW92ZXItbW9kYWxgKTtcbiAgICAgICAgY29uc3QgZGlzcGxheVdpbm5lclRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjZGlzcGxheS13aW5uZXJgKTtcbiAgICAgICAgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyk7XG4gICAgICAgIGlmIChnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICAgIGRpc3BsYXlXaW5uZXJUZXh0LnRleHRDb250ZW50ID0gYFlvdSB3aW4hYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwbGF5V2lubmVyVGV4dC50ZXh0Q29udGVudCA9IGBZb3UgbG9zZSFgO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVPdmVyTW9kYWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgc3RvcmVkR2FtZWJvYXJkcywgZ2FtZUxvb3AsIGNyZWF0ZVBsYXllck9iamVjdHMsIGhhbmRsZVN0YXRlIH07XG4iLCJpbXBvcnQgeyBTaGlwcyB9IGZyb20gXCIuL3NoaXBNb2R1bGVcIjtcbmltcG9ydCB7IHN0b3JlZEdhbWVib2FyZHMgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuaW1wb3J0IHsgcmVuZGVyQ29tcHV0ZXJTaGlwcywgcmVuZGVyUGxheWVyU2hpcHMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmNvbnN0IEdhbWVib2FyZCA9IChmbGVldEFycmF5KSA9PiB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IFtcbiAgICBmbGVldEFycmF5WzBdLFxuICAgIGZsZWV0QXJyYXlbMV0sXG4gICAgZmxlZXRBcnJheVsyXSxcbiAgICBmbGVldEFycmF5WzNdLFxuICAgIGZsZWV0QXJyYXlbNF0sXG4gIF07XG4gIGNvbnN0IG1pc3NlcyA9IFtdO1xuICBjb25zdCBzaGlwcyA9IFNoaXBzKCk7XG5cbiAgY29uc3QgaXNHYW1lT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IHNoaXBzLmZsZWV0O1xuICAgIGxldCBpc0dhbWVPdmVyID0gZmFsc2U7XG4gICAgbGV0IHNoaXBzU3Vua0NvdW50ZXIgPSAwO1xuXG4gICAgYXJyYXkuZmlsdGVyKChvYmopID0+IHtcbiAgICAgIGlmIChvYmouaXNTdW5rKSB7XG4gICAgICAgIHNoaXBzU3Vua0NvdW50ZXIgKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc2hpcHNTdW5rQ291bnRlciA9PT0gNSkge1xuICAgICAgaXNHYW1lT3ZlciA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpc0dhbWVPdmVyO1xuICB9O1xuXG4gIHJldHVybiB7IGdhbWVib2FyZCwgbWlzc2VzLCBzaGlwcywgaXNHYW1lT3ZlciB9O1xufTtcblxuY29uc3QgcmVjZWl2ZUF0dGFjayA9IChhdHRhY2tDb29yZCwgdXNlcikgPT4ge1xuICBsZXQgaW5kZXg7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIGF0dGFja0Nvb3JkXTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgaW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gMTtcbiAgfVxuICBjb25zdCBnYW1lYm9hcmRPYmplY3QgPSBzdG9yZWRHYW1lYm9hcmRzW2luZGV4XVsxXTtcbiAgZ2FtZWJvYXJkT2JqZWN0LmdhbWVib2FyZC5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICBpZiAob2JqZWN0LnNoaXBQbGFjZW1lbnQuaW5jbHVkZXMoYXR0YWNrQ29vcmQpKSB7XG4gICAgICBhdHRhY2tPdXRjb21lID0gW29iamVjdC5uYW1lLCBhdHRhY2tDb29yZF07XG4gICAgfVxuICB9KTtcbiAgaWYgKCFhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgZ2FtZWJvYXJkT2JqZWN0Lm1pc3Nlcy5wdXNoKGF0dGFja0Nvb3JkKTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lYm9hcmRPYmplY3Quc2hpcHMuaGl0KGF0dGFja091dGNvbWUpO1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5pc1N1bmsoYXR0YWNrT3V0Y29tZVswXSk7XG4gIH1cbiAgcmV0dXJuIGF0dGFja091dGNvbWU7XG59O1xuXG4vLyBCRUdJTi0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmRzIC0tLS0tLS0gLy9cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCkge1xuICBjb25zdCBudW1iZXJPZkNvb3JkaW5hdGVzID0gMTAwO1xuICBjb25zdCBvcmllbnRhdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICBjb25zdCBmaXJzdENvb3JkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtYmVyT2ZDb29yZGluYXRlcyk7XG4gIHJldHVybiBbb3JpZW50YXRpb24sIGZpcnN0Q29vcmRdO1xufVxuXG5mdW5jdGlvbiBvcmllbnRTaGlwKHN0YXJ0Q29vcmQsIG9yaWVudGF0aW9uLCBuYW1lLCBsZW5ndGgpIHtcbiAgbGV0IHNoaXBQbGFjZW1lbnQgPSBbXTtcbiAgbGV0IGhvcml6b250YWxMaW1pdDtcbiAgaWYgKHN0YXJ0Q29vcmQgPCAxMCkge1xuICAgIGhvcml6b250YWxMaW1pdCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gKyhzdGFydENvb3JkLnRvU3RyaW5nKCkuY2hhckF0KDApICsgOSk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChvcmllbnRhdGlvbikge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgKiAxMCA8IDEwMCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkgKiAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkgKiAxMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpIDw9IGhvcml6b250YWxMaW1pdCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgbmFtZSwgc2hpcFBsYWNlbWVudCB9O1xufVxuXG5mdW5jdGlvbiB2ZXJpZnlDb29yZHMoYXJyYXksIG9iamVjdCkge1xuICBjb25zdCBzaGlwVG9WZXJpZnkgPSBvYmplY3Quc2hpcFBsYWNlbWVudDtcbiAgbGV0IGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgaWYgKCFhcnJheS5sZW5ndGgpIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbiAgfSBlbHNlIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBUb1ZlcmlmeS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXkuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICAgIGlmIChpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXAuc2hpcFBsYWNlbWVudC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICBpZiAoc2hpcFRvVmVyaWZ5W2ldICE9PSBzaGlwLnNoaXBQbGFjZW1lbnRbal0pIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbn1cblxuLy8gdXNlZCBmb3IgdGhlIG5hbWUgYW5kIGxlbmd0aCBwcm9wcyBpbiB0aGUgcGxhY2VDb21wdXRlckZsZWV0IGZ4blxuY29uc3Qgc2hpcENsb25lID0gU2hpcHMoKTtcblxuZnVuY3Rpb24gcGxhY2VDb21wdXRlckZsZWV0KHVzZXIsIGFycmF5KSB7XG4gIHNoaXBDbG9uZS5mbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcbiAgICB3aGlsZSAoIWlzVmFsaWQpIHtcbiAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHJhbmRvbVZhbHVlcyA9IGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCk7XG4gICAgICBjb25zdCBwbGFjZW1lbnQgPSBvcmllbnRTaGlwKFxuICAgICAgICByYW5kb21WYWx1ZXNbMV0sXG4gICAgICAgIHJhbmRvbVZhbHVlc1swXSxcbiAgICAgICAgc2hpcC5uYW1lLFxuICAgICAgICBzaGlwLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHZlcmlmeSA9IHZlcmlmeUNvb3JkcyhhcnJheSwgcGxhY2VtZW50KTtcbiAgICAgIGlmICh2ZXJpZnkpIHtcbiAgICAgICAgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIGFycmF5LnB1c2gocGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAodXNlciA9PT0gYGNwdWApIHtcbiAgICByZW5kZXJDb21wdXRlclNoaXBzKGFycmF5KTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJQbGF5ZXJTaGlwcyhhcnJheSk7XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuLy8gRU5ELS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgcGxheWVyIC0tLS0tLS0gLy9cblxuZXhwb3J0IHsgR2FtZWJvYXJkLCBwbGFjZUNvbXB1dGVyRmxlZXQsIHJlY2VpdmVBdHRhY2sgfTtcbiIsImltcG9ydCB7IGNyZWF0ZVBsYXllck9iamVjdHMgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuaW1wb3J0IHsgcmVuZGVyUGxheWVyU2hpcHMsIGNsZWFyQm9hcmRzLCBzdGFydE5ld0dhbWUgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmxldCBwbGF5ZXJGbGVldCA9IFtdO1xuXG5jb25zdCBzaGlwTmFtZXMgPSBbXG4gIGBDYXJyaWVyYCxcbiAgYEJhdHRsZXNoaXBgLFxuICBgRGVzdHJveWVyYCxcbiAgYFN1Ym1hcmluZWAsXG4gIGBQYXRyb2wgQm9hdGAsXG5dO1xuY29uc3Qgc2hpcExlbmd0aHMgPSBbNSwgNCwgMywgMywgMl07XG5sZXQgc2hpcENvb3JkcyA9IFtdO1xuXG5jb25zdCBjcHVHYW1lQm9hcmRUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmQtaGVhZGVyYCk7XG5jb25zdCBjcHVCb2FyZFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG5cbmNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNidG4tcm90YXRlLXNoaXBgKTtcbmNvbnN0IGNsZWFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NsZWFyLWJvYXJkLWJ0bmApO1xuY29uc3QgcmFuZG9taXplQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3JhbmRvbWl6ZS1wbGF5ZXItZmxlZXRgKTtcbmNvbnN0IG5ld0dhbWVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjbmV3LWdhbWUtYnRuYCk7XG5cbmNvbnN0IHBsYWNlU2hpcHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxhY2Utc2hpcHMtY29udGFpbmVyYCk7XG5jb25zdCBwbGF5ZXJTaGlwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gIGAucGxheWVyLXNoaXBzLWNvbnRhaW5lcmBcbik7XG5sZXQgc2hpcEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcblxuZnVuY3Rpb24gaGlkZVNoaXBzVG9QbGFjZSgpIHtcbiAgc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIHNoaXAuY2xhc3NMaXN0LmFkZChgaGlkZS1zaGlwYCk7XG4gIH0pO1xuICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbn1cblxuLy8gaGlkZXMgYWxsIGJ1dCB0aGUgY2FycmllciBvbiBwYWdlIGxvYWRcbmZ1bmN0aW9uIHNldFVwU2hpcHNUb0RyYWdBbmREcm9wKCkge1xuICBwbGF5ZXJGbGVldCA9IFtdO1xuICBzaGlwSW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICAgIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihgbW91c2Vkb3duYCwgYmVnaW5TaGlwUGxhY2VtZW50KTtcbiAgICBpZiAoaW5kZXggIT09IDApIHtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZChgaGlkZS1zaGlwYCk7XG4gICAgfVxuICAgIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihgbW91c2Vkb3duYCwgYmVnaW5TaGlwUGxhY2VtZW50KTtcbiAgICBzaGlwLnN0eWxlLmN1cnNvciA9IGBncmFiYDtcbiAgICBzaGlwLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gIH0pO1xuICByYW5kb21pemVCdG4uc3R5bGUuZGlzcGxheSA9IGBmbGV4YDtcbiAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbn1cbnNldFVwU2hpcHNUb0RyYWdBbmREcm9wKCk7XG5cbi8vIGxhYmVscyB0aGUgY29tcHV0ZXIgZ2FtZWJvYXJkIG9uIHBhZ2UgbG9hZFxuY3B1R2FtZUJvYXJkVGl0bGUudGV4dENvbnRlbnQgPSBgUExBQ0UgWU9VUiBTSElQU2A7XG5cbi8vIHN0YXJ0IGdhbWUgYnV0dG9uXG5jb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzdGFydC1nYW1lLWJ0bmApO1xuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBiZWdpbkdhbWUpO1xuXG5mdW5jdGlvbiBiZWdpbkdhbWUoKSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICBjcHVHYW1lQm9hcmRUaXRsZS50ZXh0Q29udGVudCA9IGBDb21wdXRlcmA7XG4gIHBsYXllckJvYXJkLnN0eWxlLmRpc3BsYXkgPSBgYmxvY2tgO1xuICBwbGFjZVNoaXBzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gIGlmIChwbGF5ZXJGbGVldC5sZW5ndGggPT09IDUpIHtcbiAgICBjcmVhdGVQbGF5ZXJPYmplY3RzKHBsYXllckZsZWV0KTtcbiAgICBjcHVCb2FyZFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYGA7XG4gICAgfSk7XG4gIH1cbn1cblxuY2xlYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBjbGVhckJvYXJkcyk7XG5uZXdHYW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgY2xlYXJCb2FyZHMpO1xuXG5yb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCByb3RhdGVTaGlwKTtcblxuZnVuY3Rpb24gcm90YXRlU2hpcChlKSB7XG4gIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSA9IGAtOTBkZWdgO1xuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgIDEwMCArICgoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpIC8gMikgKiAzNSArIGBweGA7XG4gIH0gZWxzZSB7XG4gICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgPSBgYDtcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9IDEwMCArIGBweGA7XG4gIH1cbn1cblxuZnVuY3Rpb24gYmVnaW5TaGlwUGxhY2VtZW50KGV2ZW50KSB7XG4gIC8vICgxKSBwcmVwYXJlIHRvIG1vdmUgZWxlbWVudDogbWFrZSBhYnNvbHV0ZSBhbmQgb24gdG9wIGJ5IHotaW5kZXhcbiAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS56SW5kZXggPSAxMDAwO1xuXG4gIC8vIG1vdmUgaXQgb3V0IG9mIGFueSBjdXJyZW50IHBhcmVudHMgZGlyZWN0bHkgaW50byBjcHVCb2FyZFxuICBwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGhdLmFwcGVuZChzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdKTtcblxuICAvLyBjZW50ZXJzIHRoZSBjdXJzb3IgaW4gdGhlIGZpcnN0IFwic3F1YXJlXCIgb2YgdGhlIHNoaXAgaW1hZ2VcbiAgZnVuY3Rpb24gbW92ZUF0KHBhZ2VYLCBwYWdlWSkge1xuICAgIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUubGVmdCA9XG4gICAgICAgIHBhZ2VYIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArXG4gICAgICAgICAgMTcuNSkgK1xuICAgICAgICBcInB4XCI7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9XG4gICAgICAgIHBhZ2VZIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSArXG4gICAgICAgICAgMTcuNSkgK1xuICAgICAgICBcInB4XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUubGVmdCA9XG4gICAgICAgIHBhZ2VYIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArXG4gICAgICAgICAgKChzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9XG4gICAgICAgIHBhZ2VZIC1cbiAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSAtXG4gICAgICAgICAgKChzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgIDE3LjUgK1xuICAgICAgICBcInB4XCI7XG4gICAgfVxuICB9XG5cbiAgLy8gbW92ZSBvdXIgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNhcnJpZXIgdW5kZXIgdGhlIHBvaW50ZXJcbiAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbiAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZSB0aGF0IHdlJ3JlIGZseWluZyBvdmVyIHJpZ2h0IG5vd1xuICBsZXQgY3VycmVudERyb3BwYWJsZSA9IG51bGw7XG4gIGxldCBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG4gIGxldCBpc0Ryb3BWYWxpZDtcblxuICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uaGlkZGVuID0gdHJ1ZTtcbiAgICBsZXQgZWxlbUJlbG93ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcblxuICAgIGlmICghZWxlbUJlbG93KSByZXR1cm47XG5cbiAgICAvLyBCRUdJTiAtLS0tIGNoZWNrcyB2YWxpZGl0eSBvZiB0aGUgZHJvcFxuICAgIGxldCBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eSA9IFtdO1xuICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LnNoaWZ0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgIGxldCBnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eTtcbiAgICAgIGlmIChzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICBnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eSA9IGRvY3VtZW50XG4gICAgICAgICAgLmVsZW1lbnRGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSArIGkgKiAzNSlcbiAgICAgICAgICAuZ2V0QXR0cmlidXRlKGBjbGFzc2ApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkgPSBkb2N1bWVudFxuICAgICAgICAgIC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFggKyBpICogMzUsIGV2ZW50LmNsaWVudFkpXG4gICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgIH1cbiAgICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LnB1c2goZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkpO1xuICAgICAgaWYgKGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5WzBdKSB7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgYXJyYXlPZkVsZW1lbnRzQmVsb3dUb0NoZWNrVmFsaWRpdHkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmICgoaXRlbSAmJiBpdGVtLmluY2x1ZGVzKGBpbnZhbGlkYCkpIHx8IGl0ZW0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY291bnRlcikge1xuICAgICAgICAgIGlzRHJvcFZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNEcm9wVmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEVORCAtLS0tIGNoZWNrcyB2YWxpZGl0eSBvZiB0aGUgZHJvcFxuXG4gICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5oaWRkZW4gPSBmYWxzZTtcblxuICAgIC8vIHBvdGVudGlhbCBkcm9wcGFibGVzIGFyZSB0aGUgc3F1YXJlcyBvbiB0aGUgZ2FtZWJvYXJkXG4gICAgZHJvcHBhYmxlQmVsb3cgPSBlbGVtQmVsb3cuY2xvc2VzdChcIi5jcHVTcXVhcmVcIik7XG5cbiAgICBpZiAoIWRyb3BwYWJsZUJlbG93IHx8ICFpc0Ryb3BWYWxpZCkge1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5jdXJzb3IgPSBgbm8tZHJvcGA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuY3Vyc29yID0gYGdyYWJiaW5nYDtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudERyb3BwYWJsZSAhPSBkcm9wcGFibGVCZWxvdykge1xuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgbGVhdmVEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuICAgICAgfVxuICAgICAgY3VycmVudERyb3BwYWJsZSA9IGRyb3BwYWJsZUJlbG93O1xuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgZW50ZXJEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVudGVyRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4gICAgc2hpcENvb3JkcyA9IFtdO1xuICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICBjb25zdCBtYXhIb3Jpem9udGFsID0gKE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKyAxKSAqIDEwO1xuICAgIGNvbnN0IG1heFZlcnRpY2FsID1cbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC1cbiAgICAgIE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKiAxMCArXG4gICAgICA5MDtcbiAgICBpZiAoXG4gICAgICAhc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSA8XG4gICAgICAgIG1heEhvcml6b250YWwgJiZcbiAgICAgIGlzRHJvcFZhbGlkXG4gICAgKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgXCIjODI5RTc2XCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAqIDEwIDw9XG4gICAgICAgIG1heFZlcnRpY2FsICYmXG4gICAgICBpc0Ryb3BWYWxpZFxuICAgICkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODI5RTc2XCI7XG4gICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG4gICAgICBzaGlwQ29vcmRzID0gW107XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbGVhdmVEcm9wcGFibGVBcmVhKGVsZW1lbnQpIHtcbiAgICBzaGlwQ29vcmRzID0gW107XG4gICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICAgIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXSkge1xuICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICBcIiNjMWMxYzFcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tcbiAgICAgICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXG4gICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNjMWMxYzFcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vICgyKSBtb3ZlIHRoZSBzaGlwIG9uIG1vdXNlbW92ZVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcblxuICAvLyAoMykgZHJvcCB0aGUgc2hpcCwgcmVtb3ZlIHVubmVlZGVkIGhhbmRsZXJzXG4gIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0ub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0ub25tb3VzZXVwID0gbnVsbDtcbiAgICBpZiAoc2hpcENvb3Jkcy5sZW5ndGggIT09IDAgJiYgZHJvcHBhYmxlQmVsb3cgJiYgaXNEcm9wVmFsaWQpIHtcbiAgICAgIHBsYXllckZsZWV0LnB1c2goe1xuICAgICAgICBuYW1lOiBzaGlwTmFtZXNbcGxheWVyRmxlZXQubGVuZ3RoXSxcbiAgICAgICAgc2hpcFBsYWNlbWVudDogc2hpcENvb3JkcyxcbiAgICAgIH0pO1xuICAgICAgcGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoIC0gMV0ucmVtb3ZlQ2hpbGQoXG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aCAtIDFdXG4gICAgICApO1xuICAgICAgcmVuZGVyUGxheWVyU2hpcHMoW3BsYXllckZsZWV0W3BsYXllckZsZWV0Lmxlbmd0aCAtIDFdXSk7XG4gICAgICBjcHVCb2FyZFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgI2MxYzFjMWA7XG4gICAgICB9KTtcbiAgICAgIHNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gcGxheWVyRmxlZXQubGVuZ3RoKSB7XG4gICAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKGBoaWRlLXNoaXBgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAocGxheWVyRmxlZXQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJhbmRvbWl6ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmUgYDtcbiAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgfVxuICAgICAgaWYgKHBsYXllckZsZWV0Lmxlbmd0aCA9PT0gNSkge1xuICAgICAgICBzdGFydEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgIGNsZWFyQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gICAgICAgIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwbGFjZVNoaXBzQ29udGFpbmVyLmluc2VydEJlZm9yZShcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXSxcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoICsgMV1cbiAgICAgICk7XG4gICAgICBpZiAoc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgPSBgYDtcbiAgICAgIH1cbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9IFwiMTAwcHhcIjtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnpJbmRleCA9IDA7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmN1cnNvciA9IGBncmFiYDtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCB7IGhpZGVTaGlwc1RvUGxhY2UsIHNldFVwU2hpcHNUb0RyYWdBbmREcm9wLCBiZWdpblNoaXBQbGFjZW1lbnQgfTtcbiIsImltcG9ydCB7IGdhbWVMb29wLCBoYW5kbGVTdGF0ZSB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCwgYmVnaW5TaGlwUGxhY2VtZW50IH0gZnJvbSBcIi4vaW5kZXhcIjtcblxuZnVuY3Rpb24gcmVuZGVyR2FtZWJvYXJkKHVzZXIpIHtcbiAgbGV0IGJvYXJkRGl2O1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgICBib2FyZC5zZXRBdHRyaWJ1dGUoYGlkYCwgYHBsYXllci1zcXVhcmVzLWNvbnRhaW5lcmApO1xuICB9IGVsc2Uge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICAgIGJvYXJkLnNldEF0dHJpYnV0ZShgaWRgLCBgY3B1LXNxdWFyZXMtY29udGFpbmVyYCk7XG4gIH1cbiAgYm9hcmQuY2xhc3NMaXN0LmFkZChgZ2FtZWJvYXJkYCk7XG4gIGNvbnN0IG1heFNxdWFyZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4U3F1YXJlczsgaSsrKSB7XG4gICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgLy8gc3F1YXJlLnRleHRDb250ZW50ID0gaTtcbiAgICBzcXVhcmUuZGF0YXNldC5pbmRleE51bWJlciA9IGk7XG4gICAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChgcGxheWVyU3F1YXJlYCk7XG4gICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChgY3B1U3F1YXJlYCk7XG4gICAgfVxuICAgIGJvYXJkLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gIH1cbiAgYm9hcmREaXYuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG5jb25zdCBwbGF5ZXJBdHRhY2sgPSAoZSkgPT4ge1xuICBjb25zdCBjb29yZGluYXRlQ2xpY2tlZCA9ICtlLnRhcmdldC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICBnYW1lTG9vcChjb29yZGluYXRlQ2xpY2tlZCk7XG4gIGUudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbn07XG5cbnJlbmRlckdhbWVib2FyZChgY3B1YCk7XG5cbmZ1bmN0aW9uIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMoYXJyYXkpIHtcbiAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5wbGF5ZXJTcXVhcmVgKTtcbiAgYXJyYXkuZm9yRWFjaCgoaW5kZXgpID0+IHtcbiAgICBzcXVhcmVzW2luZGV4XS5yZW1vdmVFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJNb3ZlKHdob3NlVHVybiwgYXR0YWNrQXJyYXkpIHtcbiAgY29uc29sZS5sb2coeyB3aG9zZVR1cm4sIGF0dGFja0FycmF5IH0pO1xuICBsZXQgc3F1YXJlcztcbiAgY29uc3QgaGl0SW5kZXggPSBhdHRhY2tBcnJheVsxXTtcbiAgaWYgKHdob3NlVHVybiA9PT0gYHBsYXllcmApIHtcbiAgICBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICB9IGVsc2Uge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG4gIH1cbiAgaWYgKGF0dGFja0FycmF5WzBdKSB7XG4gICAgc3F1YXJlc1toaXRJbmRleF0uY2xhc3NMaXN0LmFkZChgaGl0YCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlc1toaXRJbmRleF0uY2xhc3NMaXN0LmFkZChgbWlzc2ApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckNvbXB1dGVyU2hpcHMoY3B1RmxlZXQpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gIGxldCBpbWdTcmM7XG5cbiAgY3B1RmxlZXQuZm9yRWFjaCgoc2hpcE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGBjcHUtc2hpcHMtcmVuZGVyZWRgKTtcbiAgICBjb25zdCBzaGlwSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBpbWdgKTtcbiAgICBpZiAoc2hpcE9iamVjdC5uYW1lID09PSBgUGF0cm9sIEJvYXRgKSB7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzL3BhdHJvbC5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYHBhdHJvbGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXBPYmplY3QubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy8ke3NoaXBOYW1lfS5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYCR7c2hpcE5hbWV9YCk7XG4gICAgfVxuICAgIHNoaXBJbWFnZS5zcmMgPSBpbWdTcmM7XG5cbiAgICBjb25zdCBzb3J0QXNjZW5kaW5nID0gc2hpcE9iamVjdC5zaGlwUGxhY2VtZW50LnNvcnQoKHgsIHkpID0+IHggLSB5KTtcbiAgICBjb25zdCBkaW1lbnNpb25PZlNxdWFyZSA9IDM1O1xuICAgIGxldCB0b3BPZmZzZXQ7XG4gICAgbGV0IGxlZnRPZmZzZXQ7XG4gICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gKyAxID09PSBzb3J0QXNjZW5kaW5nWzFdKSB7XG4gICAgICAvLyBwbGFjZSBob3Jpem9udGFsIHNoaXBzXG4gICAgICB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9IHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwbGFjZSB2ZXJ0aWNhbCBzaGlwc1xuICAgICAgc2hpcEltYWdlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoLTkwZGVnKWA7XG4gICAgICB0b3BPZmZzZXQgPVxuICAgICAgICBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSArXG4gICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgIHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcEltYWdlLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGA7XG4gICAgc2hpcEltYWdlLnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgICBwbGF5ZXJCb2FyZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9KTtcbiAgcmVuZGVyR2FtZWJvYXJkKGBwbGF5ZXJgKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyUGxheWVyU2hpcHMoZmxlZXQpIHtcbiAgaWYgKGZsZWV0WzBdLnNoaXBQbGFjZW1lbnRbMF0gPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBmbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYHBsYXllci1zaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYGludmFsaWRgKTtcbiAgICBzaGlwSW1hZ2Uuc3JjID0gaW1nU3JjO1xuXG4gICAgY29uc3Qgc29ydEFzY2VuZGluZyA9IHNoaXBPYmplY3Quc2hpcFBsYWNlbWVudC5zb3J0KCh4LCB5KSA9PiB4IC0geSk7XG4gICAgY29uc3QgZGltZW5zaW9uT2ZTcXVhcmUgPSAzNTtcbiAgICBsZXQgdG9wT2Zmc2V0O1xuICAgIGxldCBsZWZ0T2Zmc2V0O1xuICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdICsgMSA9PT0gc29ydEFzY2VuZGluZ1sxXSkge1xuICAgICAgLy8gcGxhY2UgaG9yaXpvbnRhbCBzaGlwc1xuICAgICAgdG9wT2Zmc2V0ID0gTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgLSAzNTA7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGxhY2UgdmVydGljYWwgc2hpcHNcbiAgICAgIHNoaXBJbWFnZS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKC05MGRlZylgO1xuICAgICAgdG9wT2Zmc2V0ID1cbiAgICAgICAgTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgK1xuICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1IC1cbiAgICAgICAgMzUwO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBJbWFnZS5zdHlsZS50b3AgPSBgJHt0b3BPZmZzZXR9cHhgO1xuICAgIHNoaXBJbWFnZS5zdHlsZS5sZWZ0ID0gYCR7bGVmdE9mZnNldH1weGA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gICAgY3B1Qm9hcmQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyQm9hcmRzKGUpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gIGNvbnN0IHBsYXllclNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLXNxdWFyZXMtY29udGFpbmVyYCk7XG4gIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICBjb25zdCBwbGFjZVNoaXBzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYWNlLXNoaXBzLWNvbnRhaW5lcmApO1xuICBjb25zdCBzaGlwc09uQ1BVQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyLXNoaXBzLXJlbmRlcmVkYCk7XG4gIGNvbnN0IHNoaXBzT25QbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHUtc2hpcHMtcmVuZGVyZWRgKTtcbiAgY29uc3QgcmVtYWluaW5nU2hpcHNUb1BsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnNoaXBzLXRvLXBsYWNlYCk7XG5cbiAgcGxheWVyQm9hcmQucmVtb3ZlQ2hpbGQocGxheWVyU3F1YXJlcyk7XG4gIHJlbW92ZUVsZW1lbnRzKGNwdUJvYXJkLCBzaGlwc09uQ1BVQm9hcmQpO1xuICByZW1vdmVFbGVtZW50cyhwbGF5ZXJCb2FyZCwgc2hpcHNPblBsYXllckJvYXJkKTtcbiAgcmVtb3ZlRWxlbWVudHMocGxhY2VTaGlwc0NvbnRhaW5lciwgcmVtYWluaW5nU2hpcHNUb1BsYWNlKTtcbiAgcmVkaXNwbGF5U2hpcHNUb1BsYWNlKHBsYWNlU2hpcHNDb250YWluZXIpO1xuICBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCgpO1xuICBoYW5kbGVTdGF0ZSgpO1xuICBpZiAoZS50YXJnZXQuY2xvc2VzdChgZGl2YCkuaWQgIT09IGBjbGVhci1ib2FyZC1idG5gKSB7XG4gICAgc3RhcnROZXdHYW1lKHBsYXllckJvYXJkLCBwbGFjZVNoaXBzQ29udGFpbmVyLCBjcHVCb2FyZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RhcnROZXdHYW1lKGhpZGVQbGF5ZXJCb2FyZCwgZGlzcGxheUNvbnRhaW5lciwgY3B1UGFyZW50KSB7XG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNidG4tcm90YXRlLXNoaXBgKTtcbiAgcm90YXRlQnRuLnN0eWxlLmRpc3BsYXkgPSBgZmxleGA7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNnYW1lLW92ZXItbW9kYWxgKS5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICBoaWRlUGxheWVyQm9hcmQuc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgZGlzcGxheUNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gYGZsZXhgO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkLWhlYWRlcmApLnRleHRDb250ZW50ID0gYFBMQUNFIFlPVVIgU0hJUFNgO1xuICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYWNlLXNoaXBzLWJ0bnNgKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIGJ1dHRvbnNbaV0uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIH0gZWxzZSBpZiAoaSA9PT0gYnV0dG9ucy5sZW5ndGggLSAxKSB7XG4gICAgICBicmVhaztcbiAgICB9IGVsc2Uge1xuICAgICAgYnV0dG9uc1tpXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICB9XG4gIGNvbnN0IGNwdUJvYXJkU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbiAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgYDtcbiAgfSk7XG4gIGNwdVBhcmVudC5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LXNxdWFyZXMtY29udGFpbmVyYCkpO1xuICByZW5kZXJHYW1lYm9hcmQoYGNwdWApO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50cyhwYXJlbnQsIGNoaWxkcmVuKSB7XG4gIGlmIChjaGlsZHJlbikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVkaXNwbGF5U2hpcHNUb1BsYWNlKHBhcmVudCkge1xuICBjb25zdCBuYW1lSGVscGVyID0gW1xuICAgIGBjYXJyaWVyYCxcbiAgICBgYmF0dGxlc2hpcGAsXG4gICAgYGRlc3Ryb3llcmAsXG4gICAgYHN1Ym1hcmluZWAsXG4gICAgYHBhdHJvbGAsXG4gIF07XG4gIG5hbWVIZWxwZXIuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIHNoaXBJbWFnZS5zcmMgPSBgLi9pbWdzLyR7c2hpcH0ucG5nYDtcbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwfWApO1xuICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBzaGlwcy10by1wbGFjZWApO1xuICAgIHNoaXBJbWFnZS5zZXRBdHRyaWJ1dGUoYGlkYCwgYHBsYXllci0ke3NoaXB9YCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gIH0pO1xufVxuXG5leHBvcnQge1xuICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzLFxuICByZW5kZXJNb3ZlLFxuICByZW5kZXJDb21wdXRlclNoaXBzLFxuICByZW5kZXJQbGF5ZXJTaGlwcyxcbiAgY2xlYXJCb2FyZHMsXG4gIHN0YXJ0TmV3R2FtZSxcbn07XG4iLCJjb25zdCBTaGlwcyA9ICgpID0+IHtcbiAgY29uc3QgZmxlZXQgPSBbXG4gICAgeyBuYW1lOiBgQ2FycmllcmAsIGxlbmd0aDogNSwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBCYXR0bGVzaGlwYCwgbGVuZ3RoOiA0LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYERlc3Ryb3llcmAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBTdWJtYXJpbmVgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgUGF0cm9sIEJvYXRgLCBsZW5ndGg6IDIsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gIF07XG5cbiAgY29uc3QgaGl0ID0gKGF0dGFja0RhdGEpID0+IHtcbiAgICBjb25zdCBzaGlwSGl0ID0gYXR0YWNrRGF0YVswXTtcbiAgICBjb25zdCBjb29yZE9mSGl0ID0gYXR0YWNrRGF0YVsxXTtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lKSB7XG4gICAgICAgIHNoaXAuaGl0cy5wdXNoKGNvb3JkT2ZIaXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9IChzaGlwSGl0KSA9PiB7XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSAmJiBzaGlwLmxlbmd0aCA9PT0gc2hpcC5oaXRzLmxlbmd0aCkge1xuICAgICAgICBzaGlwLmlzU3VuayA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgZmxlZXQsIGhpdCwgaXNTdW5rIH07XG59O1xuXG5leHBvcnQgeyBTaGlwcyB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=