/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dragAndDrop.js":
/*!****************************!*\
  !*** ./src/dragAndDrop.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setDragAndDrop": () => (/* binding */ setDragAndDrop)
/* harmony export */ });
/* harmony import */ var _gameHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameHandler */ "./src/gameHandler.js");
/* harmony import */ var _renderGame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderGame */ "./src/renderGame.js");



const setDragAndDrop = (function () {
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
    playerShipContainers[playerFleet.length].append(
      shipImgs[playerFleet.length]
    );

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
  return { hideShipsToPlace, setUpShipsToDragAndDrop, beginShipPlacement };
})();




/***/ }),

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
/* harmony import */ var _dragAndDrop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dragAndDrop */ "./src/dragAndDrop.js");




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
  _dragAndDrop__WEBPACK_IMPORTED_MODULE_2__.setDragAndDrop.hideShipsToPlace();
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

let getValidMoves = createValidMovesArray();
let getPlayerMovesRemaining = createValidMovesArray();

function handleState() {
  if (storedGameboards.length === 2) {
    storedGameboards.shift();
  }
  storedGameboards.shift();
  createComputerObjects();
  getValidMoves = createValidMovesArray();
  getPlayerMovesRemaining = createValidMovesArray();
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
/* harmony import */ var _dragAndDrop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dragAndDrop */ "./src/dragAndDrop.js");



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

  const cpuBoardSquares = document.querySelectorAll(`.cpuSquare`);
  cpuBoardSquares.forEach((square) => {
    square.style.backgroundColor = ``;
  });

  playerBoard.removeChild(playerSquares);
  removeElements(cpuBoard, shipsOnCPUBoard);
  removeElements(playerBoard, shipsOnPlayerBoard);
  removeElements(placeShipsContainer, remainingShipsToPlace);
  redisplayShipsToPlace(placeShipsContainer);
  _dragAndDrop__WEBPACK_IMPORTED_MODULE_1__.setDragAndDrop.setUpShipsToDragAndDrop();
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dragAndDrop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dragAndDrop */ "./src/dragAndDrop.js");


const newGameBtn = document.querySelector(`#new-game-btn`);
newGameBtn.addEventListener(`click`, () => location.reload());

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RyYWdBbmREcm9wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZW5kZXJHYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9EO0FBQ1U7O0FBRTlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGlFQUFtQjtBQUN6QjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUEscUNBQXFDLG9EQUFXO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxQ0FBcUM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFDQUFxQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQ0FBcUM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUNBQXFD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QUc7QUFDSDs7QUFRRTs7Ozs7Ozs7Ozs7Ozs7O0FDek9GO0FBQ0E7QUFDQSxLQUFLLHNEQUFzRDtBQUMzRCxLQUFLLHlEQUF5RDtBQUM5RCxLQUFLLHdEQUF3RDtBQUM3RCxLQUFLLHdEQUF3RDtBQUM3RCxLQUFLLDBEQUEwRDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFVBQVU7QUFDVjs7QUFFaUI7Ozs7Ozs7VUM5QmpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7O0FDTnVCOztBQUV2QjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVQbGF5ZXJPYmplY3RzIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHJlbmRlclBsYXllclNoaXBzLCBjbGVhckJvYXJkcyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcblxuY29uc3Qgc2V0RHJhZ0FuZERyb3AgPSAoZnVuY3Rpb24gKCkge1xuICBsZXQgcGxheWVyRmxlZXQgPSBbXTtcblxuICBjb25zdCBzaGlwTmFtZXMgPSBbXG4gICAgYENhcnJpZXJgLFxuICAgIGBCYXR0bGVzaGlwYCxcbiAgICBgRGVzdHJveWVyYCxcbiAgICBgU3VibWFyaW5lYCxcbiAgICBgUGF0cm9sIEJvYXRgLFxuICBdO1xuICBjb25zdCBzaGlwTGVuZ3RocyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgbGV0IHNoaXBDb29yZHMgPSBbXTtcblxuICBjb25zdCBjcHVHYW1lQm9hcmRUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmQtaGVhZGVyYCk7XG4gIGNvbnN0IGNwdUJvYXJkU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcblxuICBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjYnRuLXJvdGF0ZS1zaGlwYCk7XG4gIGNvbnN0IGNsZWFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NsZWFyLWJvYXJkLWJ0bmApO1xuICBjb25zdCByYW5kb21pemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcmFuZG9taXplLXBsYXllci1mbGVldGApO1xuXG4gIGNvbnN0IHBsYWNlU2hpcHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxhY2Utc2hpcHMtY29udGFpbmVyYCk7XG4gIGNvbnN0IHBsYXllclNoaXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICBgLnBsYXllci1zaGlwcy1jb250YWluZXJgXG4gICk7XG4gIGxldCBzaGlwSW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuXG4gIGZ1bmN0aW9uIGhpZGVTaGlwc1RvUGxhY2UoKSB7XG4gICAgc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKGBoaWRlLXNoaXBgKTtcbiAgICB9KTtcbiAgICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgfVxuXG4gIC8vIGhpZGVzIGFsbCBidXQgdGhlIGNhcnJpZXIgb24gcGFnZSBsb2FkXG4gIGZ1bmN0aW9uIHNldFVwU2hpcHNUb0RyYWdBbmREcm9wKCkge1xuICAgIHBsYXllckZsZWV0ID0gW107XG4gICAgc2hpcEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcbiAgICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICAgICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKGBtb3VzZWRvd25gLCBiZWdpblNoaXBQbGFjZW1lbnQpO1xuICAgICAgaWYgKGluZGV4ICE9PSAwKSB7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZChgaGlkZS1zaGlwYCk7XG4gICAgICB9XG4gICAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoYG1vdXNlZG93bmAsIGJlZ2luU2hpcFBsYWNlbWVudCk7XG4gICAgICBzaGlwLnN0eWxlLmN1cnNvciA9IGBncmFiYDtcbiAgICAgIHNoaXAub25kcmFnc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmFuZG9taXplQnRuLnN0eWxlLmRpc3BsYXkgPSBgZmxleGA7XG4gICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgfVxuICBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCgpO1xuXG4gIC8vIGxhYmVscyB0aGUgY29tcHV0ZXIgZ2FtZWJvYXJkIG9uIHBhZ2UgbG9hZFxuICBjcHVHYW1lQm9hcmRUaXRsZS50ZXh0Q29udGVudCA9IGBQTEFDRSBZT1VSIFNISVBTYDtcblxuICAvLyBzdGFydCBnYW1lIGJ1dHRvblxuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzdGFydC1nYW1lLWJ0bmApO1xuICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIGJlZ2luR2FtZSk7XG5cbiAgZnVuY3Rpb24gYmVnaW5HYW1lKCkge1xuICAgIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICAgIGNwdUdhbWVCb2FyZFRpdGxlLnRleHRDb250ZW50ID0gYENvbXB1dGVyYDtcbiAgICBwbGF5ZXJCb2FyZC5zdHlsZS5kaXNwbGF5ID0gYGJsb2NrYDtcbiAgICBwbGFjZVNoaXBzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gICAgaWYgKHBsYXllckZsZWV0Lmxlbmd0aCA9PT0gNSkge1xuICAgICAgY3JlYXRlUGxheWVyT2JqZWN0cyhwbGF5ZXJGbGVldCk7XG4gICAgICBjcHVCb2FyZFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgYDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgY2xlYXJCb2FyZHMpO1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCByb3RhdGVTaGlwKTtcblxuICBmdW5jdGlvbiByb3RhdGVTaGlwKGUpIHtcbiAgICBpZiAoIXNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlKSB7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSA9IGAtOTBkZWdgO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPVxuICAgICAgICAxMDAgKyAoKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAvIDIpICogMzUgKyBgcHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSA9IGBgO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPSAxMDAgKyBgcHhgO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJlZ2luU2hpcFBsYWNlbWVudChldmVudCkge1xuICAgIC8vICgxKSBwcmVwYXJlIHRvIG1vdmUgZWxlbWVudDogbWFrZSBhYnNvbHV0ZSBhbmQgb24gdG9wIGJ5IHotaW5kZXhcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuekluZGV4ID0gMTAwMDtcblxuICAgIC8vIG1vdmUgaXQgb3V0IG9mIGFueSBjdXJyZW50IHBhcmVudHMgZGlyZWN0bHkgaW50byBjcHVCb2FyZFxuICAgIHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uYXBwZW5kKFxuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXVxuICAgICk7XG5cbiAgICAvLyBjZW50ZXJzIHRoZSBjdXJzb3IgaW4gdGhlIGZpcnN0IFwic3F1YXJlXCIgb2YgdGhlIHNoaXAgaW1hZ2VcbiAgICBmdW5jdGlvbiBtb3ZlQXQocGFnZVgsIHBhZ2VZKSB7XG4gICAgICBpZiAoIXNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlKSB7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUubGVmdCA9XG4gICAgICAgICAgcGFnZVggLVxuICAgICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGhdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggK1xuICAgICAgICAgICAgMTcuNSkgK1xuICAgICAgICAgIFwicHhcIjtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPVxuICAgICAgICAgIHBhZ2VZIC1cbiAgICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55ICtcbiAgICAgICAgICAgIDE3LjUpICtcbiAgICAgICAgICBcInB4XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmxlZnQgPVxuICAgICAgICAgIHBhZ2VYIC1cbiAgICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54ICtcbiAgICAgICAgICAgICgoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpIC8gMikgKiAzNSkgLVxuICAgICAgICAgIDE3LjUgK1xuICAgICAgICAgIFwicHhcIjtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPVxuICAgICAgICAgIHBhZ2VZIC1cbiAgICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55IC1cbiAgICAgICAgICAgICgoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpIC8gMikgKiAzNSkgLVxuICAgICAgICAgIDE3LjUgK1xuICAgICAgICAgIFwicHhcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBtb3ZlIG91ciBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgY2FycmllciB1bmRlciB0aGUgcG9pbnRlclxuICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuXG4gICAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZSB0aGF0IHdlJ3JlIGZseWluZyBvdmVyIHJpZ2h0IG5vd1xuICAgIGxldCBjdXJyZW50RHJvcHBhYmxlID0gbnVsbDtcbiAgICBsZXQgZHJvcHBhYmxlQmVsb3cgPSBudWxsO1xuICAgIGxldCBpc0Ryb3BWYWxpZDtcblxuICAgIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uaGlkZGVuID0gdHJ1ZTtcbiAgICAgIGxldCBlbGVtQmVsb3cgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuXG4gICAgICBpZiAoIWVsZW1CZWxvdykgcmV0dXJuO1xuXG4gICAgICAvLyBCRUdJTiAtLS0tIGNoZWNrcyB2YWxpZGl0eSBvZiB0aGUgZHJvcFxuICAgICAgbGV0IGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5ID0gW107XG4gICAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5zaGlmdCgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgbGV0IGdldENsYXNzVG9DaGVja1ZhbGlkaXR5O1xuICAgICAgICBpZiAoc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgICBnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eSA9IGRvY3VtZW50XG4gICAgICAgICAgICAuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZICsgaSAqIDM1KVxuICAgICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eSA9IGRvY3VtZW50XG4gICAgICAgICAgICAuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYICsgaSAqIDM1LCBldmVudC5jbGllbnRZKVxuICAgICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgICAgfVxuICAgICAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5wdXNoKGdldENsYXNzVG9DaGVja1ZhbGlkaXR5KTtcbiAgICAgICAgaWYgKGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5WzBdKSB7XG4gICAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmICgoaXRlbSAmJiBpdGVtLmluY2x1ZGVzKGBpbnZhbGlkYCkpIHx8IGl0ZW0gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChjb3VudGVyKSB7XG4gICAgICAgICAgICBpc0Ryb3BWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0Ryb3BWYWxpZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFTkQgLS0tLSBjaGVja3MgdmFsaWRpdHkgb2YgdGhlIGRyb3BcblxuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5oaWRkZW4gPSBmYWxzZTtcblxuICAgICAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZXMgYXJlIHRoZSBzcXVhcmVzIG9uIHRoZSBnYW1lYm9hcmRcbiAgICAgIGRyb3BwYWJsZUJlbG93ID0gZWxlbUJlbG93LmNsb3Nlc3QoXCIuY3B1U3F1YXJlXCIpO1xuXG4gICAgICBpZiAoIWRyb3BwYWJsZUJlbG93IHx8ICFpc0Ryb3BWYWxpZCkge1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmN1cnNvciA9IGBuby1kcm9wYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuY3Vyc29yID0gYGdyYWJiaW5nYDtcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUgIT0gZHJvcHBhYmxlQmVsb3cpIHtcbiAgICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgICBsZWF2ZURyb3BwYWJsZUFyZWEoY3VycmVudERyb3BwYWJsZSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudERyb3BwYWJsZSA9IGRyb3BwYWJsZUJlbG93O1xuICAgICAgICBpZiAoY3VycmVudERyb3BwYWJsZSkge1xuICAgICAgICAgIGVudGVyRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVudGVyRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4gICAgICBzaGlwQ29vcmRzID0gW107XG4gICAgICBjb25zdCBpbmRleE9mSW5pdGlhbERyb3BQb2ludCA9ICtlbGVtZW50LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4gICAgICBjb25zdCBtYXhIb3Jpem9udGFsID0gKE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKyAxKSAqIDEwO1xuICAgICAgY29uc3QgbWF4VmVydGljYWwgPVxuICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCAtXG4gICAgICAgIE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKiAxMCArXG4gICAgICAgIDkwO1xuICAgICAgaWYgKFxuICAgICAgICAhc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpIDxcbiAgICAgICAgICBtYXhIb3Jpem9udGFsICYmXG4gICAgICAgIGlzRHJvcFZhbGlkXG4gICAgICApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICAgIFwiIzgyOUU3NlwiO1xuICAgICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSAmJlxuICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIChzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdIC0gMSkgKiAxMCA8PVxuICAgICAgICAgIG1heFZlcnRpY2FsICYmXG4gICAgICAgIGlzRHJvcFZhbGlkXG4gICAgICApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuICAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW1xuICAgICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM4MjlFNzZcIjtcbiAgICAgICAgICAgIHNoaXBDb29yZHMucHVzaChpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG4gICAgICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsZWF2ZURyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuICAgICAgc2hpcENvb3JkcyA9IFtdO1xuICAgICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICAgICAgaWYgKCFzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXSkge1xuICAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbiAgICAgICAgICAgICAgXCIjYzFjMWMxXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBdKSB7XG4gICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXG4gICAgICAgICAgICBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2MxYzFjMVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vICgyKSBtb3ZlIHRoZSBzaGlwIG9uIG1vdXNlbW92ZVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuXG4gICAgLy8gKDMpIGRyb3AgdGhlIHNoaXAsIHJlbW92ZSB1bm5lZWRlZCBoYW5kbGVyc1xuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0ub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLm9ubW91c2V1cCA9IG51bGw7XG4gICAgICBpZiAoc2hpcENvb3Jkcy5sZW5ndGggIT09IDAgJiYgZHJvcHBhYmxlQmVsb3cgJiYgaXNEcm9wVmFsaWQpIHtcbiAgICAgICAgcGxheWVyRmxlZXQucHVzaCh7XG4gICAgICAgICAgbmFtZTogc2hpcE5hbWVzW3BsYXllckZsZWV0Lmxlbmd0aF0sXG4gICAgICAgICAgc2hpcFBsYWNlbWVudDogc2hpcENvb3JkcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aCAtIDFdLnJlbW92ZUNoaWxkKFxuICAgICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aCAtIDFdXG4gICAgICAgICk7XG4gICAgICAgIHJlbmRlclBsYXllclNoaXBzKFtwbGF5ZXJGbGVldFtwbGF5ZXJGbGVldC5sZW5ndGggLSAxXV0pO1xuICAgICAgICBjcHVCb2FyZFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGAjYzFjMWMxYDtcbiAgICAgICAgfSk7XG4gICAgICAgIHNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGluZGV4ID09PSBwbGF5ZXJGbGVldC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShgaGlkZS1zaGlwYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBsYXllckZsZWV0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHJhbmRvbWl6ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmUgYDtcbiAgICAgICAgICBjbGVhckJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYXllckZsZWV0Lmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgIHN0YXJ0QnRuLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgICBjbGVhckJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICAgICAgICAgIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGFjZVNoaXBzQ29udGFpbmVyLmluc2VydEJlZm9yZShcbiAgICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLFxuICAgICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aCArIDFdXG4gICAgICAgICk7XG4gICAgICAgIGlmIChzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlID0gYGA7XG4gICAgICAgIH1cbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPSBcIjEwMHB4XCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuekluZGV4ID0gMDtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICByZXR1cm4geyBoaWRlU2hpcHNUb1BsYWNlLCBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCwgYmVnaW5TaGlwUGxhY2VtZW50IH07XG59KSgpO1xuXG5leHBvcnQgeyBzZXREcmFnQW5kRHJvcCB9O1xuIiwiaW1wb3J0IHsgR2FtZWJvYXJkLCBwbGFjZUNvbXB1dGVyRmxlZXQsIHJlY2VpdmVBdHRhY2sgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCB7IHJlbmRlck1vdmUsIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5pbXBvcnQgeyBzZXREcmFnQW5kRHJvcCB9IGZyb20gXCIuL2RyYWdBbmREcm9wXCI7XG5cbmNvbnN0IHN0b3JlZEdhbWVib2FyZHMgPSBbXTtcblxubGV0IHR1cm5Db3VudGVyID0gMTtcbmZ1bmN0aW9uIHR1cm5Ecml2ZXIoKSB7XG4gIGxldCB3aG9zZU1vdmU7XG4gIGlmICh0dXJuQ291bnRlciAlIDIgIT09IDApIHtcbiAgICB3aG9zZU1vdmUgPSBgcGxheWVyYDtcbiAgfSBlbHNlIHtcbiAgICB3aG9zZU1vdmUgPSBgY29tcHV0ZXJgO1xuICB9XG4gIHR1cm5Db3VudGVyICs9IDE7XG4gIHJldHVybiB3aG9zZU1vdmU7XG59XG5cbmNvbnN0IHJhbmRvbWl6ZVBsYXllckZsZWV0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgYCNyYW5kb21pemUtcGxheWVyLWZsZWV0YFxuKTtcbnJhbmRvbWl6ZVBsYXllckZsZWV0QnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcmFuZG9taXplUGxheWVyRmxlZXQpO1xuXG5mdW5jdGlvbiByYW5kb21pemVQbGF5ZXJGbGVldCgpIHtcbiAgc2V0RHJhZ0FuZERyb3AuaGlkZVNoaXBzVG9QbGFjZSgpO1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzdGFydC1nYW1lLWJ0bmApO1xuICBzdGFydEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gIGlmIChzdG9yZWRHYW1lYm9hcmRzWzFdKSB7XG4gICAgc3RvcmVkR2FtZWJvYXJkcy5wb3AoKTtcbiAgICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgICBjb25zdCByZW5kZXJlZFBsYXllclNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGAucGxheWVyLXNoaXBzLXJlbmRlcmVkYFxuICAgICk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgIGNwdUJvYXJkLnJlbW92ZUNoaWxkKHJlbmRlcmVkUGxheWVyU2hpcHNbaV0pO1xuICAgIH1cbiAgfVxuICBjb25zdCBwbGF5ZXJGbGVldEFycmF5ID0gW107XG4gIGNvbnN0IHBsYXllckZsZWV0ID0gcGxhY2VDb21wdXRlckZsZWV0KGB1c2VyYCwgcGxheWVyRmxlZXRBcnJheSk7XG4gIGNyZWF0ZVBsYXllck9iamVjdHMocGxheWVyRmxlZXQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQbGF5ZXJPYmplY3RzKGZsZWV0KSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gR2FtZWJvYXJkKGZsZWV0KTtcbiAgc3RvcmVkR2FtZWJvYXJkcy5wdXNoKFtgY29tcHV0ZXJgLCBwbGF5ZXJCb2FyZF0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wdXRlck9iamVjdHMoKSB7XG4gIGNvbnN0IGNwdUZsZWV0QXJyYXkgPSBbXTtcbiAgY29uc3QgY29tcHV0ZXJGbGVldCA9IHBsYWNlQ29tcHV0ZXJGbGVldChgY3B1YCwgY3B1RmxlZXRBcnJheSk7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lYm9hcmQoY29tcHV0ZXJGbGVldCk7XG4gIHN0b3JlZEdhbWVib2FyZHMucHVzaChbYHBsYXllcmAsIGNvbXB1dGVyQm9hcmRdKTtcbn1cbmNyZWF0ZUNvbXB1dGVyT2JqZWN0cygpO1xuXG5sZXQgZ2V0VmFsaWRNb3ZlcyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xubGV0IGdldFBsYXllck1vdmVzUmVtYWluaW5nID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG5cbmZ1bmN0aW9uIGhhbmRsZVN0YXRlKCkge1xuICBpZiAoc3RvcmVkR2FtZWJvYXJkcy5sZW5ndGggPT09IDIpIHtcbiAgICBzdG9yZWRHYW1lYm9hcmRzLnNoaWZ0KCk7XG4gIH1cbiAgc3RvcmVkR2FtZWJvYXJkcy5zaGlmdCgpO1xuICBjcmVhdGVDb21wdXRlck9iamVjdHMoKTtcbiAgZ2V0VmFsaWRNb3ZlcyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuICBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xufVxuXG4vLyBCRUdJTiAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5mdW5jdGlvbiBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKSB7XG4gIGNvbnN0IHZhbGlkTW92ZXMgPSBbXTtcbiAgY29uc3QgbWF4TW92ZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4TW92ZXM7IGkrKykge1xuICAgIHZhbGlkTW92ZXMucHVzaChpKTtcbiAgfVxuICByZXR1cm4gdmFsaWRNb3Zlcztcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpIHtcbiAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnZXRWYWxpZE1vdmVzLmxlbmd0aCk7XG4gIGNvbnN0IHJhbmRvbU1vdmUgPSBnZXRWYWxpZE1vdmVzW3JhbmRvbUluZGV4XTtcbiAgZ2V0VmFsaWRNb3Zlcy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICByZXR1cm4gcmFuZG9tTW92ZTtcbn1cbi8vIEVORCAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIGdhbWVMb29wKHBsYXllck1vdmUpIHtcbiAgbGV0IGdldFR1cm47XG4gIGxldCBjb29yZE9mQXR0YWNrO1xuICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICBjb25zdCBpbmRleFRvU3BsaWNlID0gZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuZmluZEluZGV4KFxuICAgIChpbmRleCkgPT4gaW5kZXggPT09IHBsYXllck1vdmVcbiAgKTtcbiAgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuc3BsaWNlKGluZGV4VG9TcGxpY2UsIDEpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGlmICghaXNHYW1lT3Zlcikge1xuICAgICAgZ2V0VHVybiA9IHR1cm5Ecml2ZXIoKTtcbiAgICAgIGlmIChnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICBjb29yZE9mQXR0YWNrID0gcGxheWVyTW92ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkT2ZBdHRhY2sgPSBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBhdHRhY2tPdXRjb21lID0gcmVjZWl2ZUF0dGFjayhjb29yZE9mQXR0YWNrLCBnZXRUdXJuKTtcbiAgICAgIGNvbnNvbGUubG9nKGF0dGFja091dGNvbWUpO1xuICAgICAgcmVuZGVyTW92ZShnZXRUdXJuLCBhdHRhY2tPdXRjb21lKTtcbiAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuICAgICAgICBzdG9yZWRHYW1lYm9hcmRzLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChpdGVtWzBdID09PSBnZXRUdXJuKSB7XG4gICAgICAgICAgICBpc0dhbWVPdmVyID0gaXRlbVsxXS5pc0dhbWVPdmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdICYmIGdldFR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgICAgIGxldCBpc1NoaXBTdW5rO1xuICAgICAgICBsZXQgYXJyYXlJbmRleDtcbiAgICAgICAgc3RvcmVkR2FtZWJvYXJkc1swXVsxXS5zaGlwcy5mbGVldC5maWx0ZXIoKG9iamVjdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSA9PT0gb2JqZWN0Lm5hbWUpIHtcbiAgICAgICAgICAgIGlzU2hpcFN1bmsgPSBvYmplY3QuaXNTdW5rO1xuICAgICAgICAgICAgYXJyYXlJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgaWYgKGlzU2hpcFN1bmspIHtcbiAgICAgICAgICAgICAgY29uc3QgY3B1SGlkZGVuU2hpcHMgPVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHUtc2hpcHMtcmVuZGVyZWRgKTtcbiAgICAgICAgICAgICAgY3B1SGlkZGVuU2hpcHNbaW5kZXhdLnN0eWxlLmRpc3BsYXkgPSBgYmxvY2tgO1xuICAgICAgICAgICAgICBjcHVIaWRkZW5TaGlwc1tpbmRleF0uc3R5bGUuekluZGV4ID0gYDFgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNHYW1lT3Zlcikge1xuICAgICAgICBjb25zdCBnYW1lT3Zlck1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2dhbWUtb3Zlci1tb2RhbGApO1xuICAgICAgICBjb25zdCBkaXNwbGF5V2lubmVyVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNkaXNwbGF5LXdpbm5lcmApO1xuICAgICAgICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGdldFBsYXllck1vdmVzUmVtYWluaW5nKTtcbiAgICAgICAgaWYgKGdldFR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgICAgICAgZGlzcGxheVdpbm5lclRleHQudGV4dENvbnRlbnQgPSBgWW91IHdpbiFgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BsYXlXaW5uZXJUZXh0LnRleHRDb250ZW50ID0gYFlvdSBsb3NlIWA7XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZU92ZXJNb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzLCBnYW1lTG9vcCwgY3JlYXRlUGxheWVyT2JqZWN0cywgaGFuZGxlU3RhdGUgfTtcbiIsImltcG9ydCB7IFNoaXBzIH0gZnJvbSBcIi4vc2hpcE1vZHVsZVwiO1xuaW1wb3J0IHsgc3RvcmVkR2FtZWJvYXJkcyB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyByZW5kZXJDb21wdXRlclNoaXBzLCByZW5kZXJQbGF5ZXJTaGlwcyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcblxuY29uc3QgR2FtZWJvYXJkID0gKGZsZWV0QXJyYXkpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gW1xuICAgIGZsZWV0QXJyYXlbMF0sXG4gICAgZmxlZXRBcnJheVsxXSxcbiAgICBmbGVldEFycmF5WzJdLFxuICAgIGZsZWV0QXJyYXlbM10sXG4gICAgZmxlZXRBcnJheVs0XSxcbiAgXTtcbiAgY29uc3QgbWlzc2VzID0gW107XG4gIGNvbnN0IHNoaXBzID0gU2hpcHMoKTtcblxuICBjb25zdCBpc0dhbWVPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGFycmF5ID0gc2hpcHMuZmxlZXQ7XG4gICAgbGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgICBsZXQgc2hpcHNTdW5rQ291bnRlciA9IDA7XG5cbiAgICBhcnJheS5maWx0ZXIoKG9iaikgPT4ge1xuICAgICAgaWYgKG9iai5pc1N1bmspIHtcbiAgICAgICAgc2hpcHNTdW5rQ291bnRlciArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzaGlwc1N1bmtDb3VudGVyID09PSA1KSB7XG4gICAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGlzR2FtZU92ZXI7XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2FtZWJvYXJkLCBtaXNzZXMsIHNoaXBzLCBpc0dhbWVPdmVyIH07XG59O1xuXG5jb25zdCByZWNlaXZlQXR0YWNrID0gKGF0dGFja0Nvb3JkLCB1c2VyKSA9PiB7XG4gIGxldCBpbmRleDtcbiAgbGV0IGF0dGFja091dGNvbWUgPSBbbnVsbCwgYXR0YWNrQ29vcmRdO1xuICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICBpbmRleCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSAxO1xuICB9XG4gIGNvbnN0IGdhbWVib2FyZE9iamVjdCA9IHN0b3JlZEdhbWVib2FyZHNbaW5kZXhdWzFdO1xuICBnYW1lYm9hcmRPYmplY3QuZ2FtZWJvYXJkLmZvckVhY2goKG9iamVjdCkgPT4ge1xuICAgIGlmIChvYmplY3Quc2hpcFBsYWNlbWVudC5pbmNsdWRlcyhhdHRhY2tDb29yZCkpIHtcbiAgICAgIGF0dGFja091dGNvbWUgPSBbb2JqZWN0Lm5hbWUsIGF0dGFja0Nvb3JkXTtcbiAgICB9XG4gIH0pO1xuICBpZiAoIWF0dGFja091dGNvbWVbMF0pIHtcbiAgICBnYW1lYm9hcmRPYmplY3QubWlzc2VzLnB1c2goYXR0YWNrQ29vcmQpO1xuICB9IGVsc2Uge1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5oaXQoYXR0YWNrT3V0Y29tZSk7XG4gICAgZ2FtZWJvYXJkT2JqZWN0LnNoaXBzLmlzU3VuayhhdHRhY2tPdXRjb21lWzBdKTtcbiAgfVxuICByZXR1cm4gYXR0YWNrT3V0Y29tZTtcbn07XG5cbi8vIEJFR0lOLS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZHMgLS0tLS0tLSAvL1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKSB7XG4gIGNvbnN0IG51bWJlck9mQ29vcmRpbmF0ZXMgPSAxMDA7XG4gIGNvbnN0IG9yaWVudGF0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gIGNvbnN0IGZpcnN0Q29vcmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1iZXJPZkNvb3JkaW5hdGVzKTtcbiAgcmV0dXJuIFtvcmllbnRhdGlvbiwgZmlyc3RDb29yZF07XG59XG5cbmZ1bmN0aW9uIG9yaWVudFNoaXAoc3RhcnRDb29yZCwgb3JpZW50YXRpb24sIG5hbWUsIGxlbmd0aCkge1xuICBsZXQgc2hpcFBsYWNlbWVudCA9IFtdO1xuICBsZXQgaG9yaXpvbnRhbExpbWl0O1xuICBpZiAoc3RhcnRDb29yZCA8IDEwKSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gOTtcbiAgfSBlbHNlIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSArKHN0YXJ0Q29vcmQudG9TdHJpbmcoKS5jaGFyQXQoMCkgKyA5KTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9yaWVudGF0aW9uKSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSAqIDEwIDwgMTAwKSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSAqIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSAqIDEwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgPD0gaG9yaXpvbnRhbExpbWl0KSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4geyBuYW1lLCBzaGlwUGxhY2VtZW50IH07XG59XG5cbmZ1bmN0aW9uIHZlcmlmeUNvb3JkcyhhcnJheSwgb2JqZWN0KSB7XG4gIGNvbnN0IHNoaXBUb1ZlcmlmeSA9IG9iamVjdC5zaGlwUGxhY2VtZW50O1xuICBsZXQgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICBpZiAoIWFycmF5Lmxlbmd0aCkge1xuICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xuICB9IGVsc2Uge1xuICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFRvVmVyaWZ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgICAgaWYgKGlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcC5zaGlwUGxhY2VtZW50Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChzaGlwVG9WZXJpZnlbaV0gIT09IHNoaXAuc2hpcFBsYWNlbWVudFtqXSkge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xufVxuXG4vLyB1c2VkIGZvciB0aGUgbmFtZSBhbmQgbGVuZ3RoIHByb3BzIGluIHRoZSBwbGFjZUNvbXB1dGVyRmxlZXQgZnhuXG5jb25zdCBzaGlwQ2xvbmUgPSBTaGlwcygpO1xuXG5mdW5jdGlvbiBwbGFjZUNvbXB1dGVyRmxlZXQodXNlciwgYXJyYXkpIHtcbiAgc2hpcENsb25lLmZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuICAgIHdoaWxlICghaXNWYWxpZCkge1xuICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgY29uc3QgcmFuZG9tVmFsdWVzID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKTtcbiAgICAgIGNvbnN0IHBsYWNlbWVudCA9IG9yaWVudFNoaXAoXG4gICAgICAgIHJhbmRvbVZhbHVlc1sxXSxcbiAgICAgICAgcmFuZG9tVmFsdWVzWzBdLFxuICAgICAgICBzaGlwLm5hbWUsXG4gICAgICAgIHNoaXAubGVuZ3RoXG4gICAgICApO1xuICAgICAgY29uc3QgdmVyaWZ5ID0gdmVyaWZ5Q29vcmRzKGFycmF5LCBwbGFjZW1lbnQpO1xuICAgICAgaWYgKHZlcmlmeSkge1xuICAgICAgICBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgYXJyYXkucHVzaChwbGFjZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmICh1c2VyID09PSBgY3B1YCkge1xuICAgIHJlbmRlckNvbXB1dGVyU2hpcHMoYXJyYXkpO1xuICB9IGVsc2Uge1xuICAgIHJlbmRlclBsYXllclNoaXBzKGFycmF5KTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG4vLyBFTkQtLS0tLS0tLSBjcmVhdGVzIGEgcmFuZG9tbHkgcGxhY2VkIGJvYXJkIGZvciBwbGF5ZXIgLS0tLS0tLSAvL1xuXG5leHBvcnQgeyBHYW1lYm9hcmQsIHBsYWNlQ29tcHV0ZXJGbGVldCwgcmVjZWl2ZUF0dGFjayB9O1xuIiwiaW1wb3J0IHsgZ2FtZUxvb3AsIGhhbmRsZVN0YXRlIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHNldERyYWdBbmREcm9wIH0gZnJvbSBcIi4vZHJhZ0FuZERyb3BcIjtcblxuZnVuY3Rpb24gcmVuZGVyR2FtZWJvYXJkKHVzZXIpIHtcbiAgbGV0IGJvYXJkRGl2O1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgICBib2FyZC5zZXRBdHRyaWJ1dGUoYGlkYCwgYHBsYXllci1zcXVhcmVzLWNvbnRhaW5lcmApO1xuICB9IGVsc2Uge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICAgIGJvYXJkLnNldEF0dHJpYnV0ZShgaWRgLCBgY3B1LXNxdWFyZXMtY29udGFpbmVyYCk7XG4gIH1cbiAgYm9hcmQuY2xhc3NMaXN0LmFkZChgZ2FtZWJvYXJkYCk7XG4gIGNvbnN0IG1heFNxdWFyZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4U3F1YXJlczsgaSsrKSB7XG4gICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgc3F1YXJlLmRhdGFzZXQuaW5kZXhOdW1iZXIgPSBpO1xuICAgIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYHBsYXllclNxdWFyZWApO1xuICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYGNwdVNxdWFyZWApO1xuICAgIH1cbiAgICBib2FyZC5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICB9XG4gIGJvYXJkRGl2LmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuY29uc3QgcGxheWVyQXR0YWNrID0gKGUpID0+IHtcbiAgY29uc3QgY29vcmRpbmF0ZUNsaWNrZWQgPSArZS50YXJnZXQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgZ2FtZUxvb3AoY29vcmRpbmF0ZUNsaWNrZWQpO1xuICBlLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG59O1xuXG5yZW5kZXJHYW1lYm9hcmQoYGNwdWApO1xuXG5mdW5jdGlvbiBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGFycmF5KSB7XG4gIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIGFycmF5LmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgc3F1YXJlc1tpbmRleF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyTW92ZSh3aG9zZVR1cm4sIGF0dGFja0FycmF5KSB7XG4gIGNvbnNvbGUubG9nKHsgd2hvc2VUdXJuLCBhdHRhY2tBcnJheSB9KTtcbiAgbGV0IHNxdWFyZXM7XG4gIGNvbnN0IGhpdEluZGV4ID0gYXR0YWNrQXJyYXlbMV07XG4gIGlmICh3aG9zZVR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5wbGF5ZXJTcXVhcmVgKTtcbiAgfSBlbHNlIHtcbiAgICBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdVNxdWFyZWApO1xuICB9XG4gIGlmIChhdHRhY2tBcnJheVswXSkge1xuICAgIHNxdWFyZXNbaGl0SW5kZXhdLmNsYXNzTGlzdC5hZGQoYGhpdGApO1xuICB9IGVsc2Uge1xuICAgIHNxdWFyZXNbaGl0SW5kZXhdLmNsYXNzTGlzdC5hZGQoYG1pc3NgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJDb21wdXRlclNoaXBzKGNwdUZsZWV0KSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICBsZXQgaW1nU3JjO1xuXG4gIGNwdUZsZWV0LmZvckVhY2goKHNoaXBPYmplY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChgY3B1LXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgaWYgKHNoaXBPYmplY3QubmFtZSA9PT0gYFBhdHJvbCBCb2F0YCkge1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy9wYXRyb2wucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBwYXRyb2xgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwT2JqZWN0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvJHtzaGlwTmFtZX0ucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXBOYW1lfWApO1xuICAgIH1cbiAgICBzaGlwSW1hZ2Uuc3JjID0gaW1nU3JjO1xuXG4gICAgY29uc3Qgc29ydEFzY2VuZGluZyA9IHNoaXBPYmplY3Quc2hpcFBsYWNlbWVudC5zb3J0KCh4LCB5KSA9PiB4IC0geSk7XG4gICAgY29uc3QgZGltZW5zaW9uT2ZTcXVhcmUgPSAzNTtcbiAgICBsZXQgdG9wT2Zmc2V0O1xuICAgIGxldCBsZWZ0T2Zmc2V0O1xuICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdICsgMSA9PT0gc29ydEFzY2VuZGluZ1sxXSkge1xuICAgICAgLy8gcGxhY2UgaG9yaXpvbnRhbCBzaGlwc1xuICAgICAgdG9wT2Zmc2V0ID0gTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGxhY2UgdmVydGljYWwgc2hpcHNcbiAgICAgIHNoaXBJbWFnZS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKC05MGRlZylgO1xuICAgICAgdG9wT2Zmc2V0ID1cbiAgICAgICAgTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgK1xuICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBJbWFnZS5zdHlsZS50b3AgPSBgJHt0b3BPZmZzZXR9cHhgO1xuICAgIHNoaXBJbWFnZS5zdHlsZS5sZWZ0ID0gYCR7bGVmdE9mZnNldH1weGA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gICAgcGxheWVyQm9hcmQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfSk7XG4gIHJlbmRlckdhbWVib2FyZChgcGxheWVyYCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclBsYXllclNoaXBzKGZsZWV0KSB7XG4gIGlmIChmbGVldFswXS5zaGlwUGxhY2VtZW50WzBdID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgY3B1Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gIGxldCBpbWdTcmM7XG5cbiAgZmxlZXQuZm9yRWFjaCgoc2hpcE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGBwbGF5ZXItc2hpcHMtcmVuZGVyZWRgKTtcbiAgICBjb25zdCBzaGlwSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBpbWdgKTtcbiAgICBpZiAoc2hpcE9iamVjdC5uYW1lID09PSBgUGF0cm9sIEJvYXRgKSB7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzL3BhdHJvbC5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYHBhdHJvbGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXBPYmplY3QubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy8ke3NoaXBOYW1lfS5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYCR7c2hpcE5hbWV9YCk7XG4gICAgfVxuICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBpbnZhbGlkYCk7XG4gICAgc2hpcEltYWdlLnNyYyA9IGltZ1NyYztcblxuICAgIGNvbnN0IHNvcnRBc2NlbmRpbmcgPSBzaGlwT2JqZWN0LnNoaXBQbGFjZW1lbnQuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuICAgIGNvbnN0IGRpbWVuc2lvbk9mU3F1YXJlID0gMzU7XG4gICAgbGV0IHRvcE9mZnNldDtcbiAgICBsZXQgbGVmdE9mZnNldDtcbiAgICBpZiAoc29ydEFzY2VuZGluZ1swXSArIDEgPT09IHNvcnRBc2NlbmRpbmdbMV0pIHtcbiAgICAgIC8vIHBsYWNlIGhvcml6b250YWwgc2hpcHNcbiAgICAgIHRvcE9mZnNldCA9IE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC0gMzUwO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9ICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBsYWNlIHZlcnRpY2FsIHNoaXBzXG4gICAgICBzaGlwSW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgtOTBkZWcpYDtcbiAgICAgIHRvcE9mZnNldCA9XG4gICAgICAgIE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlICtcbiAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNSAtXG4gICAgICAgIDM1MDtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwSW1hZ2Uuc3R5bGUudG9wID0gYCR7dG9wT2Zmc2V0fXB4YDtcbiAgICBzaGlwSW1hZ2Uuc3R5bGUubGVmdCA9IGAke2xlZnRPZmZzZXR9cHhgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICAgIGNwdUJvYXJkLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhckJvYXJkcyhlKSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICBjb25zdCBwbGF5ZXJTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1zcXVhcmVzLWNvbnRhaW5lcmApO1xuICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgY29uc3QgcGxhY2VTaGlwc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGFjZS1zaGlwcy1jb250YWluZXJgKTtcbiAgY29uc3Qgc2hpcHNPbkNQVUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllci1zaGlwcy1yZW5kZXJlZGApO1xuICBjb25zdCBzaGlwc09uUGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1LXNoaXBzLXJlbmRlcmVkYCk7XG4gIGNvbnN0IHJlbWFpbmluZ1NoaXBzVG9QbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuXG4gIGNvbnN0IGNwdUJvYXJkU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbiAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgYDtcbiAgfSk7XG5cbiAgcGxheWVyQm9hcmQucmVtb3ZlQ2hpbGQocGxheWVyU3F1YXJlcyk7XG4gIHJlbW92ZUVsZW1lbnRzKGNwdUJvYXJkLCBzaGlwc09uQ1BVQm9hcmQpO1xuICByZW1vdmVFbGVtZW50cyhwbGF5ZXJCb2FyZCwgc2hpcHNPblBsYXllckJvYXJkKTtcbiAgcmVtb3ZlRWxlbWVudHMocGxhY2VTaGlwc0NvbnRhaW5lciwgcmVtYWluaW5nU2hpcHNUb1BsYWNlKTtcbiAgcmVkaXNwbGF5U2hpcHNUb1BsYWNlKHBsYWNlU2hpcHNDb250YWluZXIpO1xuICBzZXREcmFnQW5kRHJvcC5zZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCgpO1xuICBoYW5kbGVTdGF0ZSgpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50cyhwYXJlbnQsIGNoaWxkcmVuKSB7XG4gIGlmIChjaGlsZHJlbikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVkaXNwbGF5U2hpcHNUb1BsYWNlKHBhcmVudCkge1xuICBjb25zdCBuYW1lSGVscGVyID0gW1xuICAgIGBjYXJyaWVyYCxcbiAgICBgYmF0dGxlc2hpcGAsXG4gICAgYGRlc3Ryb3llcmAsXG4gICAgYHN1Ym1hcmluZWAsXG4gICAgYHBhdHJvbGAsXG4gIF07XG4gIG5hbWVIZWxwZXIuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIHNoaXBJbWFnZS5zcmMgPSBgLi9pbWdzLyR7c2hpcH0ucG5nYDtcbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwfWApO1xuICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBzaGlwcy10by1wbGFjZWApO1xuICAgIHNoaXBJbWFnZS5zZXRBdHRyaWJ1dGUoYGlkYCwgYHBsYXllci0ke3NoaXB9YCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gIH0pO1xufVxuXG5leHBvcnQge1xuICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzLFxuICByZW5kZXJNb3ZlLFxuICByZW5kZXJDb21wdXRlclNoaXBzLFxuICByZW5kZXJQbGF5ZXJTaGlwcyxcbiAgY2xlYXJCb2FyZHMsXG59O1xuIiwiY29uc3QgU2hpcHMgPSAoKSA9PiB7XG4gIGNvbnN0IGZsZWV0ID0gW1xuICAgIHsgbmFtZTogYENhcnJpZXJgLCBsZW5ndGg6IDUsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgQmF0dGxlc2hpcGAsIGxlbmd0aDogNCwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBEZXN0cm95ZXJgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgU3VibWFyaW5lYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFBhdHJvbCBCb2F0YCwgbGVuZ3RoOiAyLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICBdO1xuXG4gIGNvbnN0IGhpdCA9IChhdHRhY2tEYXRhKSA9PiB7XG4gICAgY29uc3Qgc2hpcEhpdCA9IGF0dGFja0RhdGFbMF07XG4gICAgY29uc3QgY29vcmRPZkhpdCA9IGF0dGFja0RhdGFbMV07XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSkge1xuICAgICAgICBzaGlwLmhpdHMucHVzaChjb29yZE9mSGl0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoc2hpcEhpdCkgPT4ge1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUgJiYgc2hpcC5sZW5ndGggPT09IHNoaXAuaGl0cy5sZW5ndGgpIHtcbiAgICAgICAgc2hpcC5pc1N1bmsgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGZsZWV0LCBoaXQsIGlzU3VuayB9O1xufTtcblxuZXhwb3J0IHsgU2hpcHMgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9kcmFnQW5kRHJvcFwiO1xuXG5jb25zdCBuZXdHYW1lQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI25ldy1nYW1lLWJ0bmApO1xubmV3R2FtZUJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsICgpID0+IGxvY2F0aW9uLnJlbG9hZCgpKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=