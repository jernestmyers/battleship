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

// function generateComputerAttack() {
//   const randomIndex = Math.floor(Math.random() * getValidMoves.length);
//   const randomMove = getValidMoves[randomIndex];
//   getValidMoves.splice(randomIndex, 1);
//   return randomMove;
// }
let isAITriggered = false;
let initialCPUHitArray = [];

function getValidAdjacentCPUMoves(initialHit) {
  console.log(initialHit);
  getMovesRight(initialHit);
  getMovesLeft(initialHit);
  getMovesDown(initialHit);
  getMovesUp(initialHit);
}

function getMovesRight(hit) {
  const getIndex = getValidMoves.indexOf(hit);
  const movesRight = getValidMoves.slice(getIndex).filter((item, index) => {
    if (item - hit - index === 0 && item < (Math.floor(hit / 10) + 1) * 10) {
      return item;
    }
  });
  movesRight.shift();
  console.log({ movesRight });
}

function getMovesLeft(hit) {
  const getIndex = getValidMoves.indexOf(hit);
  const mapValidMoves = getValidMoves.map((item) => {
    return item;
  });
  const movesLeft = [];
  mapValidMoves.splice(getIndex, mapValidMoves.length - 1);
  mapValidMoves.reverse().filter((item, index) => {
    if (hit === item + index + 1 && item >= Math.floor(hit / 10) * 10) {
      movesLeft.push(item);
    }
  });
  console.log({ movesLeft });
}

function getMovesDown(hit) {
  const verticalMoves = getValidMoves.filter((coord) => {
    if (
      hit - Math.floor(hit / 10) * 10 ===
      coord - Math.floor(coord / 10) * 10
    ) {
      return coord;
    }
  });
  const movesDown = verticalMoves
    .slice(verticalMoves.indexOf(hit))
    .filter((coord, index) => {
      if (coord - hit - index * 10 === 0) {
        return coord;
      }
    });
  movesDown.shift();
  console.log({ movesDown });
}

function getMovesUp(hit) {
  const verticalMoves = getValidMoves.filter((coord) => {
    if (hit % 10 === coord % 10) {
      return coord;
    }
  });
  verticalMoves.reverse();

  const movesUp = verticalMoves
    .slice(verticalMoves.indexOf(hit))
    .filter((coord, index) => {
      if (hit === coord + index * 10) {
        return coord;
      }
    });
  if (
    hit % 10 === 0 &&
    getValidMoves.includes(0) &&
    hit === movesUp.length * 10
  ) {
    movesUp.push(0);
  }
  movesUp.shift();
  console.log({ movesUp });
}

function generateComputerAttack() {
  let cpuMove;
  if (!isAITriggered) {
    const randomIndex = Math.floor(Math.random() * getValidMoves.length);
    cpuMove = getValidMoves[randomIndex];
    // getValidMoves.splice(randomIndex, 1);
  } else {
    console.log(`begin smart move`);
    // console.log(initialCPUHitArray);
    // cpuMove = getSmartCPUMove();
    // getValidMoves.splice(getValidMoves.indexOf(cpuMove), 1);
  }
  return cpuMove;
}

// let isVert;
// let areShipsAdjacent;
// function getSmartCPUMove() {
//   if (
//     getValidMoves.includes(initialCPUHitArray[1] + 1) &&
//     initialCPUHitArray[1] + 1 <
//       (Math.floor(initialCPUHitArray[1] / 10) + 1) * 10
//   ) {
//     return initialCPUHitArray[1] + 1;
//   } else if (
//     getValidMoves.includes(initialCPUHitArray[1] - 1) &&
//     initialCPUHitArray[1] - 1 > Math.floor(initialCPUHitArray[1] / 10) * 10
//   ) {
//     return initialCPUHitArray[1] - 1;
//   }
// }
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
      // console.log(attackOutcome);
      (0,_renderGame__WEBPACK_IMPORTED_MODULE_1__.renderMove)(getTurn, attackOutcome);
      if (attackOutcome[0]) {
        // console.log(attackOutcome);
        // console.log(storedGameboards);
        storedGameboards.filter((item) => {
          if (item[0] === getTurn) {
            isGameOver = item[1].isGameOver();
          }
        });
      }
      if (getTurn === `computer`) {
        if (attackOutcome[0] && getTurn === `computer`) {
          isAITriggered = true;
          storedGameboards[1][1].ships.fleet.filter((object) => {
            if (attackOutcome[0] === object.name && object.hits.length === 1)
              console.log(`first hit`);
            initialCPUHitArray = [object, attackOutcome[1]];
          });
          const validSmartMoves = getValidAdjacentCPUMoves(attackOutcome[1]);
          // console.log(validSmartMoves);
        }
        getValidMoves.splice(getValidMoves.indexOf(attackOutcome[1]), 1);
      }

      if (attackOutcome[0] && getTurn === `player`) {
        let isShipSunk;
        // let arrayIndex;
        storedGameboards[0][1].ships.fleet.filter((object, index) => {
          if (attackOutcome[0] === object.name) {
            isShipSunk = object.isSunk;
            // arrayIndex = index;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RyYWdBbmREcm9wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZW5kZXJHYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9EO0FBQ1U7O0FBRTlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGlFQUFtQjtBQUN6QjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUEscUNBQXFDLG9EQUFXO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxQ0FBcUM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFDQUFxQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQ0FBcUM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUNBQXFD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QUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxVQUFVO0FBQ1Y7O0FBRWlCOzs7Ozs7O1VDOUJqQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ051Qjs7QUFFdkI7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlUGxheWVyT2JqZWN0cyB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyByZW5kZXJQbGF5ZXJTaGlwcywgY2xlYXJCb2FyZHMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmNvbnN0IHNldERyYWdBbmREcm9wID0gKGZ1bmN0aW9uICgpIHtcbiAgbGV0IHBsYXllckZsZWV0ID0gW107XG5cbiAgY29uc3Qgc2hpcE5hbWVzID0gW1xuICAgIGBDYXJyaWVyYCxcbiAgICBgQmF0dGxlc2hpcGAsXG4gICAgYERlc3Ryb3llcmAsXG4gICAgYFN1Ym1hcmluZWAsXG4gICAgYFBhdHJvbCBCb2F0YCxcbiAgXTtcbiAgY29uc3Qgc2hpcExlbmd0aHMgPSBbNSwgNCwgMywgMywgMl07XG4gIGxldCBzaGlwQ29vcmRzID0gW107XG5cbiAgY29uc3QgY3B1R2FtZUJvYXJkVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkLWhlYWRlcmApO1xuICBjb25zdCBjcHVCb2FyZFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG5cbiAgY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2J0bi1yb3RhdGUtc2hpcGApO1xuICBjb25zdCBjbGVhckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjbGVhci1ib2FyZC1idG5gKTtcbiAgY29uc3QgcmFuZG9taXplQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3JhbmRvbWl6ZS1wbGF5ZXItZmxlZXRgKTtcblxuICBjb25zdCBwbGFjZVNoaXBzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYWNlLXNoaXBzLWNvbnRhaW5lcmApO1xuICBjb25zdCBwbGF5ZXJTaGlwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgYC5wbGF5ZXItc2hpcHMtY29udGFpbmVyYFxuICApO1xuICBsZXQgc2hpcEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcblxuICBmdW5jdGlvbiBoaWRlU2hpcHNUb1BsYWNlKCkge1xuICAgIHNoaXBJbWdzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZChgaGlkZS1zaGlwYCk7XG4gICAgfSk7XG4gICAgcm90YXRlQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gIH1cblxuICAvLyBoaWRlcyBhbGwgYnV0IHRoZSBjYXJyaWVyIG9uIHBhZ2UgbG9hZFxuICBmdW5jdGlvbiBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCgpIHtcbiAgICBwbGF5ZXJGbGVldCA9IFtdO1xuICAgIHNoaXBJbWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnNoaXBzLXRvLXBsYWNlYCk7XG4gICAgc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCwgaW5kZXgpID0+IHtcbiAgICAgIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihgbW91c2Vkb3duYCwgYmVnaW5TaGlwUGxhY2VtZW50KTtcbiAgICAgIGlmIChpbmRleCAhPT0gMCkge1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoYGhpZGUtc2hpcGApO1xuICAgICAgfVxuICAgICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKGBtb3VzZWRvd25gLCBiZWdpblNoaXBQbGFjZW1lbnQpO1xuICAgICAgc2hpcC5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gICAgICBzaGlwLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIHJhbmRvbWl6ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYGZsZXhgO1xuICAgIGNsZWFyQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gIH1cbiAgc2V0VXBTaGlwc1RvRHJhZ0FuZERyb3AoKTtcblxuICAvLyBsYWJlbHMgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCBvbiBwYWdlIGxvYWRcbiAgY3B1R2FtZUJvYXJkVGl0bGUudGV4dENvbnRlbnQgPSBgUExBQ0UgWU9VUiBTSElQU2A7XG5cbiAgLy8gc3RhcnQgZ2FtZSBidXR0b25cbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc3RhcnQtZ2FtZS1idG5gKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBiZWdpbkdhbWUpO1xuXG4gIGZ1bmN0aW9uIGJlZ2luR2FtZSgpIHtcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgICBjcHVHYW1lQm9hcmRUaXRsZS50ZXh0Q29udGVudCA9IGBDb21wdXRlcmA7XG4gICAgcGxheWVyQm9hcmQuc3R5bGUuZGlzcGxheSA9IGBibG9ja2A7XG4gICAgcGxhY2VTaGlwc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICAgIGlmIChwbGF5ZXJGbGVldC5sZW5ndGggPT09IDUpIHtcbiAgICAgIGNyZWF0ZVBsYXllck9iamVjdHMocGxheWVyRmxlZXQpO1xuICAgICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYGA7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjbGVhckJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIGNsZWFyQm9hcmRzKTtcbiAgcm90YXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcm90YXRlU2hpcCk7XG5cbiAgZnVuY3Rpb24gcm90YXRlU2hpcChlKSB7XG4gICAgaWYgKCFzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgPSBgLTkwZGVnYDtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgICAgMTAwICsgKChzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdIC0gMSkgLyAyKSAqIDM1ICsgYHB4YDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgPSBgYDtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID0gMTAwICsgYHB4YDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBiZWdpblNoaXBQbGFjZW1lbnQoZXZlbnQpIHtcbiAgICAvLyAoMSkgcHJlcGFyZSB0byBtb3ZlIGVsZW1lbnQ6IG1ha2UgYWJzb2x1dGUgYW5kIG9uIHRvcCBieSB6LWluZGV4XG4gICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnpJbmRleCA9IDEwMDA7XG5cbiAgICAvLyBtb3ZlIGl0IG91dCBvZiBhbnkgY3VycmVudCBwYXJlbnRzIGRpcmVjdGx5IGludG8gY3B1Qm9hcmRcbiAgICBwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGhdLmFwcGVuZChcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF1cbiAgICApO1xuXG4gICAgLy8gY2VudGVycyB0aGUgY3Vyc29yIGluIHRoZSBmaXJzdCBcInNxdWFyZVwiIG9mIHRoZSBzaGlwIGltYWdlXG4gICAgZnVuY3Rpb24gbW92ZUF0KHBhZ2VYLCBwYWdlWSkge1xuICAgICAgaWYgKCFzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmxlZnQgPVxuICAgICAgICAgIHBhZ2VYIC1cbiAgICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54ICtcbiAgICAgICAgICAgIDE3LjUpICtcbiAgICAgICAgICBcInB4XCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgICAgICBwYWdlWSAtXG4gICAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSArXG4gICAgICAgICAgICAxNy41KSArXG4gICAgICAgICAgXCJweFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgICBwYWdlWCAtXG4gICAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArXG4gICAgICAgICAgICAoKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAvIDIpICogMzUpIC1cbiAgICAgICAgICAxNy41ICtcbiAgICAgICAgICBcInB4XCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgICAgICBwYWdlWSAtXG4gICAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSAtXG4gICAgICAgICAgICAoKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAvIDIpICogMzUpIC1cbiAgICAgICAgICAxNy41ICtcbiAgICAgICAgICBcInB4XCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbW92ZSBvdXIgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNhcnJpZXIgdW5kZXIgdGhlIHBvaW50ZXJcbiAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcblxuICAgIC8vIHBvdGVudGlhbCBkcm9wcGFibGUgdGhhdCB3ZSdyZSBmbHlpbmcgb3ZlciByaWdodCBub3dcbiAgICBsZXQgY3VycmVudERyb3BwYWJsZSA9IG51bGw7XG4gICAgbGV0IGRyb3BwYWJsZUJlbG93ID0gbnVsbDtcbiAgICBsZXQgaXNEcm9wVmFsaWQ7XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgICAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLmhpZGRlbiA9IHRydWU7XG4gICAgICBsZXQgZWxlbUJlbG93ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcblxuICAgICAgaWYgKCFlbGVtQmVsb3cpIHJldHVybjtcblxuICAgICAgLy8gQkVHSU4gLS0tLSBjaGVja3MgdmFsaWRpdHkgb2YgdGhlIGRyb3BcbiAgICAgIGxldCBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eSA9IFtdO1xuICAgICAgYXJyYXlPZkVsZW1lbnRzQmVsb3dUb0NoZWNrVmFsaWRpdHkuc2hpZnQoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgIGxldCBnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eTtcbiAgICAgICAgaWYgKHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlKSB7XG4gICAgICAgICAgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkgPSBkb2N1bWVudFxuICAgICAgICAgICAgLmVsZW1lbnRGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSArIGkgKiAzNSlcbiAgICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGNsYXNzYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkgPSBkb2N1bWVudFxuICAgICAgICAgICAgLmVsZW1lbnRGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCArIGkgKiAzNSwgZXZlbnQuY2xpZW50WSlcbiAgICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGNsYXNzYCk7XG4gICAgICAgIH1cbiAgICAgICAgYXJyYXlPZkVsZW1lbnRzQmVsb3dUb0NoZWNrVmFsaWRpdHkucHVzaChnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eSk7XG4gICAgICAgIGlmIChhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eVswXSkge1xuICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoKGl0ZW0gJiYgaXRlbS5pbmNsdWRlcyhgaW52YWxpZGApKSB8fCBpdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoY291bnRlcikge1xuICAgICAgICAgICAgaXNEcm9wVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXNEcm9wVmFsaWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRU5EIC0tLS0gY2hlY2tzIHZhbGlkaXR5IG9mIHRoZSBkcm9wXG5cbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uaGlkZGVuID0gZmFsc2U7XG5cbiAgICAgIC8vIHBvdGVudGlhbCBkcm9wcGFibGVzIGFyZSB0aGUgc3F1YXJlcyBvbiB0aGUgZ2FtZWJvYXJkXG4gICAgICBkcm9wcGFibGVCZWxvdyA9IGVsZW1CZWxvdy5jbG9zZXN0KFwiLmNwdVNxdWFyZVwiKTtcblxuICAgICAgaWYgKCFkcm9wcGFibGVCZWxvdyB8fCAhaXNEcm9wVmFsaWQpIHtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5jdXJzb3IgPSBgbm8tZHJvcGA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmN1cnNvciA9IGBncmFiYmluZ2A7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlICE9IGRyb3BwYWJsZUJlbG93KSB7XG4gICAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlKSB7XG4gICAgICAgICAgbGVhdmVEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnREcm9wcGFibGUgPSBkcm9wcGFibGVCZWxvdztcbiAgICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgICBlbnRlckRyb3BwYWJsZUFyZWEoY3VycmVudERyb3BwYWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbnRlckRyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuICAgICAgc2hpcENvb3JkcyA9IFtdO1xuICAgICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICAgICAgY29uc3QgbWF4SG9yaXpvbnRhbCA9IChNYXRoLmZsb29yKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC8gMTApICsgMSkgKiAxMDtcbiAgICAgIGNvbnN0IG1heFZlcnRpY2FsID1cbiAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLVxuICAgICAgICBNYXRoLmZsb29yKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC8gMTApICogMTAgK1xuICAgICAgICA5MDtcbiAgICAgIGlmIChcbiAgICAgICAgIXNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlICYmXG4gICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSA8XG4gICAgICAgICAgbWF4SG9yaXpvbnRhbCAmJlxuICAgICAgICBpc0Ryb3BWYWxpZFxuICAgICAgKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldKSB7XG4gICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgICBcIiM4MjlFNzZcIjtcbiAgICAgICAgICAgIHNoaXBDb29yZHMucHVzaChpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpICogMTAgPD1cbiAgICAgICAgICBtYXhWZXJ0aWNhbCAmJlxuICAgICAgICBpc0Ryb3BWYWxpZFxuICAgICAgKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tcbiAgICAgICAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBcbiAgICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODI5RTc2XCI7XG4gICAgICAgICAgICBzaGlwQ29vcmRzLnB1c2goaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJvcHBhYmxlQmVsb3cgPSBudWxsO1xuICAgICAgICBzaGlwQ29vcmRzID0gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGVhdmVEcm9wcGFibGVBcmVhKGVsZW1lbnQpIHtcbiAgICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICAgIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICAgIFwiI2MxYzFjMVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuICAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW1xuICAgICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNjMWMxYzFcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAoMikgbW92ZSB0aGUgc2hpcCBvbiBtb3VzZW1vdmVcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcblxuICAgIC8vICgzKSBkcm9wIHRoZSBzaGlwLCByZW1vdmUgdW5uZWVkZWQgaGFuZGxlcnNcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgaWYgKHNoaXBDb29yZHMubGVuZ3RoICE9PSAwICYmIGRyb3BwYWJsZUJlbG93ICYmIGlzRHJvcFZhbGlkKSB7XG4gICAgICAgIHBsYXllckZsZWV0LnB1c2goe1xuICAgICAgICAgIG5hbWU6IHNoaXBOYW1lc1twbGF5ZXJGbGVldC5sZW5ndGhdLFxuICAgICAgICAgIHNoaXBQbGFjZW1lbnQ6IHNoaXBDb29yZHMsXG4gICAgICAgIH0pO1xuICAgICAgICBwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGggLSAxXS5yZW1vdmVDaGlsZChcbiAgICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGggLSAxXVxuICAgICAgICApO1xuICAgICAgICByZW5kZXJQbGF5ZXJTaGlwcyhbcGxheWVyRmxlZXRbcGxheWVyRmxlZXQubGVuZ3RoIC0gMV1dKTtcbiAgICAgICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgI2MxYzFjMWA7XG4gICAgICAgIH0pO1xuICAgICAgICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChpbmRleCA9PT0gcGxheWVyRmxlZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBzaGlwLmNsYXNzTGlzdC5yZW1vdmUoYGhpZGUtc2hpcGApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwbGF5ZXJGbGVldC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICByYW5kb21pemVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lIGA7XG4gICAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwbGF5ZXJGbGVldC5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICBzdGFydEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgICAgICAgICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxhY2VTaGlwc0NvbnRhaW5lci5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXSxcbiAgICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGggKyAxXVxuICAgICAgICApO1xuICAgICAgICBpZiAoc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSA9IGBgO1xuICAgICAgICB9XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID0gXCIxMDBweFwiO1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnpJbmRleCA9IDA7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuY3Vyc29yID0gYGdyYWJgO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHsgaGlkZVNoaXBzVG9QbGFjZSwgc2V0VXBTaGlwc1RvRHJhZ0FuZERyb3AsIGJlZ2luU2hpcFBsYWNlbWVudCB9O1xufSkoKTtcblxuZXhwb3J0IHsgc2V0RHJhZ0FuZERyb3AgfTtcbiIsImltcG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgeyByZW5kZXJNb3ZlLCBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuaW1wb3J0IHsgc2V0RHJhZ0FuZERyb3AgfSBmcm9tIFwiLi9kcmFnQW5kRHJvcFwiO1xuXG5jb25zdCBzdG9yZWRHYW1lYm9hcmRzID0gW107XG5cbmxldCB0dXJuQ291bnRlciA9IDE7XG5mdW5jdGlvbiB0dXJuRHJpdmVyKCkge1xuICBsZXQgd2hvc2VNb3ZlO1xuICBpZiAodHVybkNvdW50ZXIgJSAyICE9PSAwKSB7XG4gICAgd2hvc2VNb3ZlID0gYHBsYXllcmA7XG4gIH0gZWxzZSB7XG4gICAgd2hvc2VNb3ZlID0gYGNvbXB1dGVyYDtcbiAgfVxuICB0dXJuQ291bnRlciArPSAxO1xuICByZXR1cm4gd2hvc2VNb3ZlO1xufVxuXG5jb25zdCByYW5kb21pemVQbGF5ZXJGbGVldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gIGAjcmFuZG9taXplLXBsYXllci1mbGVldGBcbik7XG5yYW5kb21pemVQbGF5ZXJGbGVldEJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHJhbmRvbWl6ZVBsYXllckZsZWV0KTtcblxuZnVuY3Rpb24gcmFuZG9taXplUGxheWVyRmxlZXQoKSB7XG4gIHNldERyYWdBbmREcm9wLmhpZGVTaGlwc1RvUGxhY2UoKTtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc3RhcnQtZ2FtZS1idG5gKTtcbiAgc3RhcnRCdG4uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICBpZiAoc3RvcmVkR2FtZWJvYXJkc1sxXSkge1xuICAgIHN0b3JlZEdhbWVib2FyZHMucG9wKCk7XG4gICAgY29uc3QgY3B1Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gICAgY29uc3QgcmVuZGVyZWRQbGF5ZXJTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICBgLnBsYXllci1zaGlwcy1yZW5kZXJlZGBcbiAgICApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICBjcHVCb2FyZC5yZW1vdmVDaGlsZChyZW5kZXJlZFBsYXllclNoaXBzW2ldKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgcGxheWVyRmxlZXRBcnJheSA9IFtdO1xuICBjb25zdCBwbGF5ZXJGbGVldCA9IHBsYWNlQ29tcHV0ZXJGbGVldChgdXNlcmAsIHBsYXllckZsZWV0QXJyYXkpO1xuICBjcmVhdGVQbGF5ZXJPYmplY3RzKHBsYXllckZsZWV0KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGxheWVyT2JqZWN0cyhmbGVldCkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVib2FyZChmbGVldCk7XG4gIHN0b3JlZEdhbWVib2FyZHMucHVzaChbYGNvbXB1dGVyYCwgcGxheWVyQm9hcmRdKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tcHV0ZXJPYmplY3RzKCkge1xuICBjb25zdCBjcHVGbGVldEFycmF5ID0gW107XG4gIGNvbnN0IGNvbXB1dGVyRmxlZXQgPSBwbGFjZUNvbXB1dGVyRmxlZXQoYGNwdWAsIGNwdUZsZWV0QXJyYXkpO1xuICBjb25zdCBjb21wdXRlckJvYXJkID0gR2FtZWJvYXJkKGNvbXB1dGVyRmxlZXQpO1xuICBzdG9yZWRHYW1lYm9hcmRzLnB1c2goW2BwbGF5ZXJgLCBjb21wdXRlckJvYXJkXSk7XG59XG5jcmVhdGVDb21wdXRlck9iamVjdHMoKTtcblxubGV0IGdldFZhbGlkTW92ZXMgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcbmxldCBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuXG5mdW5jdGlvbiBoYW5kbGVTdGF0ZSgpIHtcbiAgaWYgKHN0b3JlZEdhbWVib2FyZHMubGVuZ3RoID09PSAyKSB7XG4gICAgc3RvcmVkR2FtZWJvYXJkcy5zaGlmdCgpO1xuICB9XG4gIHN0b3JlZEdhbWVib2FyZHMuc2hpZnQoKTtcbiAgY3JlYXRlQ29tcHV0ZXJPYmplY3RzKCk7XG4gIGdldFZhbGlkTW92ZXMgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcbiAgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcbn1cblxuLy8gQkVHSU4gLS0tLS0gZ2VuZXJhdGVzIHJhbmRvbSBtb3ZlIGZvciBjb21wdXRlciAtLS0tLS0tLS0tLSAvL1xuZnVuY3Rpb24gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCkge1xuICBjb25zdCB2YWxpZE1vdmVzID0gW107XG4gIGNvbnN0IG1heE1vdmVzID0gMTAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1heE1vdmVzOyBpKyspIHtcbiAgICB2YWxpZE1vdmVzLnB1c2goaSk7XG4gIH1cbiAgcmV0dXJuIHZhbGlkTW92ZXM7XG59XG5cbi8vIGZ1bmN0aW9uIGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKSB7XG4vLyAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ2V0VmFsaWRNb3Zlcy5sZW5ndGgpO1xuLy8gICBjb25zdCByYW5kb21Nb3ZlID0gZ2V0VmFsaWRNb3Zlc1tyYW5kb21JbmRleF07XG4vLyAgIGdldFZhbGlkTW92ZXMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbi8vICAgcmV0dXJuIHJhbmRvbU1vdmU7XG4vLyB9XG5sZXQgaXNBSVRyaWdnZXJlZCA9IGZhbHNlO1xubGV0IGluaXRpYWxDUFVIaXRBcnJheSA9IFtdO1xuXG5mdW5jdGlvbiBnZXRWYWxpZEFkamFjZW50Q1BVTW92ZXMoaW5pdGlhbEhpdCkge1xuICBjb25zb2xlLmxvZyhpbml0aWFsSGl0KTtcbiAgZ2V0TW92ZXNSaWdodChpbml0aWFsSGl0KTtcbiAgZ2V0TW92ZXNMZWZ0KGluaXRpYWxIaXQpO1xuICBnZXRNb3Zlc0Rvd24oaW5pdGlhbEhpdCk7XG4gIGdldE1vdmVzVXAoaW5pdGlhbEhpdCk7XG59XG5cbmZ1bmN0aW9uIGdldE1vdmVzUmlnaHQoaGl0KSB7XG4gIGNvbnN0IGdldEluZGV4ID0gZ2V0VmFsaWRNb3Zlcy5pbmRleE9mKGhpdCk7XG4gIGNvbnN0IG1vdmVzUmlnaHQgPSBnZXRWYWxpZE1vdmVzLnNsaWNlKGdldEluZGV4KS5maWx0ZXIoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgaWYgKGl0ZW0gLSBoaXQgLSBpbmRleCA9PT0gMCAmJiBpdGVtIDwgKE1hdGguZmxvb3IoaGl0IC8gMTApICsgMSkgKiAxMCkge1xuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9KTtcbiAgbW92ZXNSaWdodC5zaGlmdCgpO1xuICBjb25zb2xlLmxvZyh7IG1vdmVzUmlnaHQgfSk7XG59XG5cbmZ1bmN0aW9uIGdldE1vdmVzTGVmdChoaXQpIHtcbiAgY29uc3QgZ2V0SW5kZXggPSBnZXRWYWxpZE1vdmVzLmluZGV4T2YoaGl0KTtcbiAgY29uc3QgbWFwVmFsaWRNb3ZlcyA9IGdldFZhbGlkTW92ZXMubWFwKChpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH0pO1xuICBjb25zdCBtb3Zlc0xlZnQgPSBbXTtcbiAgbWFwVmFsaWRNb3Zlcy5zcGxpY2UoZ2V0SW5kZXgsIG1hcFZhbGlkTW92ZXMubGVuZ3RoIC0gMSk7XG4gIG1hcFZhbGlkTW92ZXMucmV2ZXJzZSgpLmZpbHRlcigoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaGl0ID09PSBpdGVtICsgaW5kZXggKyAxICYmIGl0ZW0gPj0gTWF0aC5mbG9vcihoaXQgLyAxMCkgKiAxMCkge1xuICAgICAgbW92ZXNMZWZ0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgY29uc29sZS5sb2coeyBtb3Zlc0xlZnQgfSk7XG59XG5cbmZ1bmN0aW9uIGdldE1vdmVzRG93bihoaXQpIHtcbiAgY29uc3QgdmVydGljYWxNb3ZlcyA9IGdldFZhbGlkTW92ZXMuZmlsdGVyKChjb29yZCkgPT4ge1xuICAgIGlmIChcbiAgICAgIGhpdCAtIE1hdGguZmxvb3IoaGl0IC8gMTApICogMTAgPT09XG4gICAgICBjb29yZCAtIE1hdGguZmxvb3IoY29vcmQgLyAxMCkgKiAxMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvb3JkO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IG1vdmVzRG93biA9IHZlcnRpY2FsTW92ZXNcbiAgICAuc2xpY2UodmVydGljYWxNb3Zlcy5pbmRleE9mKGhpdCkpXG4gICAgLmZpbHRlcigoY29vcmQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoY29vcmQgLSBoaXQgLSBpbmRleCAqIDEwID09PSAwKSB7XG4gICAgICAgIHJldHVybiBjb29yZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgbW92ZXNEb3duLnNoaWZ0KCk7XG4gIGNvbnNvbGUubG9nKHsgbW92ZXNEb3duIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRNb3Zlc1VwKGhpdCkge1xuICBjb25zdCB2ZXJ0aWNhbE1vdmVzID0gZ2V0VmFsaWRNb3Zlcy5maWx0ZXIoKGNvb3JkKSA9PiB7XG4gICAgaWYgKGhpdCAlIDEwID09PSBjb29yZCAlIDEwKSB7XG4gICAgICByZXR1cm4gY29vcmQ7XG4gICAgfVxuICB9KTtcbiAgdmVydGljYWxNb3Zlcy5yZXZlcnNlKCk7XG5cbiAgY29uc3QgbW92ZXNVcCA9IHZlcnRpY2FsTW92ZXNcbiAgICAuc2xpY2UodmVydGljYWxNb3Zlcy5pbmRleE9mKGhpdCkpXG4gICAgLmZpbHRlcigoY29vcmQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaGl0ID09PSBjb29yZCArIGluZGV4ICogMTApIHtcbiAgICAgICAgcmV0dXJuIGNvb3JkO1xuICAgICAgfVxuICAgIH0pO1xuICBpZiAoXG4gICAgaGl0ICUgMTAgPT09IDAgJiZcbiAgICBnZXRWYWxpZE1vdmVzLmluY2x1ZGVzKDApICYmXG4gICAgaGl0ID09PSBtb3Zlc1VwLmxlbmd0aCAqIDEwXG4gICkge1xuICAgIG1vdmVzVXAucHVzaCgwKTtcbiAgfVxuICBtb3Zlc1VwLnNoaWZ0KCk7XG4gIGNvbnNvbGUubG9nKHsgbW92ZXNVcCB9KTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpIHtcbiAgbGV0IGNwdU1vdmU7XG4gIGlmICghaXNBSVRyaWdnZXJlZCkge1xuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ2V0VmFsaWRNb3Zlcy5sZW5ndGgpO1xuICAgIGNwdU1vdmUgPSBnZXRWYWxpZE1vdmVzW3JhbmRvbUluZGV4XTtcbiAgICAvLyBnZXRWYWxpZE1vdmVzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coYGJlZ2luIHNtYXJ0IG1vdmVgKTtcbiAgICAvLyBjb25zb2xlLmxvZyhpbml0aWFsQ1BVSGl0QXJyYXkpO1xuICAgIC8vIGNwdU1vdmUgPSBnZXRTbWFydENQVU1vdmUoKTtcbiAgICAvLyBnZXRWYWxpZE1vdmVzLnNwbGljZShnZXRWYWxpZE1vdmVzLmluZGV4T2YoY3B1TW92ZSksIDEpO1xuICB9XG4gIHJldHVybiBjcHVNb3ZlO1xufVxuXG4vLyBsZXQgaXNWZXJ0O1xuLy8gbGV0IGFyZVNoaXBzQWRqYWNlbnQ7XG4vLyBmdW5jdGlvbiBnZXRTbWFydENQVU1vdmUoKSB7XG4vLyAgIGlmIChcbi8vICAgICBnZXRWYWxpZE1vdmVzLmluY2x1ZGVzKGluaXRpYWxDUFVIaXRBcnJheVsxXSArIDEpICYmXG4vLyAgICAgaW5pdGlhbENQVUhpdEFycmF5WzFdICsgMSA8XG4vLyAgICAgICAoTWF0aC5mbG9vcihpbml0aWFsQ1BVSGl0QXJyYXlbMV0gLyAxMCkgKyAxKSAqIDEwXG4vLyAgICkge1xuLy8gICAgIHJldHVybiBpbml0aWFsQ1BVSGl0QXJyYXlbMV0gKyAxO1xuLy8gICB9IGVsc2UgaWYgKFxuLy8gICAgIGdldFZhbGlkTW92ZXMuaW5jbHVkZXMoaW5pdGlhbENQVUhpdEFycmF5WzFdIC0gMSkgJiZcbi8vICAgICBpbml0aWFsQ1BVSGl0QXJyYXlbMV0gLSAxID4gTWF0aC5mbG9vcihpbml0aWFsQ1BVSGl0QXJyYXlbMV0gLyAxMCkgKiAxMFxuLy8gICApIHtcbi8vICAgICByZXR1cm4gaW5pdGlhbENQVUhpdEFycmF5WzFdIC0gMTtcbi8vICAgfVxuLy8gfVxuLy8gRU5EIC0tLS0tIGdlbmVyYXRlcyByYW5kb20gbW92ZSBmb3IgY29tcHV0ZXIgLS0tLS0tLS0tLS0gLy9cblxuZnVuY3Rpb24gZ2FtZUxvb3AocGxheWVyTW92ZSkge1xuICBsZXQgZ2V0VHVybjtcbiAgbGV0IGNvb3JkT2ZBdHRhY2s7XG4gIGxldCBpc0dhbWVPdmVyID0gZmFsc2U7XG4gIGNvbnN0IGluZGV4VG9TcGxpY2UgPSBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZy5maW5kSW5kZXgoXG4gICAgKGluZGV4KSA9PiBpbmRleCA9PT0gcGxheWVyTW92ZVxuICApO1xuICBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZy5zcGxpY2UoaW5kZXhUb1NwbGljZSwgMSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgaWYgKCFpc0dhbWVPdmVyKSB7XG4gICAgICBnZXRUdXJuID0gdHVybkRyaXZlcigpO1xuICAgICAgaWYgKGdldFR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgICAgIGNvb3JkT2ZBdHRhY2sgPSBwbGF5ZXJNb3ZlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRPZkF0dGFjayA9IGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF0dGFja091dGNvbWUgPSByZWNlaXZlQXR0YWNrKGNvb3JkT2ZBdHRhY2ssIGdldFR1cm4pO1xuICAgICAgLy8gY29uc29sZS5sb2coYXR0YWNrT3V0Y29tZSk7XG4gICAgICByZW5kZXJNb3ZlKGdldFR1cm4sIGF0dGFja091dGNvbWUpO1xuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYXR0YWNrT3V0Y29tZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuICAgICAgICBzdG9yZWRHYW1lYm9hcmRzLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChpdGVtWzBdID09PSBnZXRUdXJuKSB7XG4gICAgICAgICAgICBpc0dhbWVPdmVyID0gaXRlbVsxXS5pc0dhbWVPdmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChnZXRUdXJuID09PSBgY29tcHV0ZXJgKSB7XG4gICAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdICYmIGdldFR1cm4gPT09IGBjb21wdXRlcmApIHtcbiAgICAgICAgICBpc0FJVHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICBzdG9yZWRHYW1lYm9hcmRzWzFdWzFdLnNoaXBzLmZsZWV0LmZpbHRlcigob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSA9PT0gb2JqZWN0Lm5hbWUgJiYgb2JqZWN0LmhpdHMubGVuZ3RoID09PSAxKVxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgZmlyc3QgaGl0YCk7XG4gICAgICAgICAgICBpbml0aWFsQ1BVSGl0QXJyYXkgPSBbb2JqZWN0LCBhdHRhY2tPdXRjb21lWzFdXTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb25zdCB2YWxpZFNtYXJ0TW92ZXMgPSBnZXRWYWxpZEFkamFjZW50Q1BVTW92ZXMoYXR0YWNrT3V0Y29tZVsxXSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2codmFsaWRTbWFydE1vdmVzKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRWYWxpZE1vdmVzLnNwbGljZShnZXRWYWxpZE1vdmVzLmluZGV4T2YoYXR0YWNrT3V0Y29tZVsxXSksIDEpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSAmJiBnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICBsZXQgaXNTaGlwU3VuaztcbiAgICAgICAgLy8gbGV0IGFycmF5SW5kZXg7XG4gICAgICAgIHN0b3JlZEdhbWVib2FyZHNbMF1bMV0uc2hpcHMuZmxlZXQuZmlsdGVyKChvYmplY3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gPT09IG9iamVjdC5uYW1lKSB7XG4gICAgICAgICAgICBpc1NoaXBTdW5rID0gb2JqZWN0LmlzU3VuaztcbiAgICAgICAgICAgIC8vIGFycmF5SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIGlmIChpc1NoaXBTdW5rKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNwdUhpZGRlblNoaXBzID1cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1LXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgICAgICAgICAgIGNwdUhpZGRlblNoaXBzW2luZGV4XS5zdHlsZS5kaXNwbGF5ID0gYGJsb2NrYDtcbiAgICAgICAgICAgICAgY3B1SGlkZGVuU2hpcHNbaW5kZXhdLnN0eWxlLnpJbmRleCA9IGAxYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGlzR2FtZU92ZXIpIHtcbiAgICAgICAgY29uc3QgZ2FtZU92ZXJNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNnYW1lLW92ZXItbW9kYWxgKTtcbiAgICAgICAgY29uc3QgZGlzcGxheVdpbm5lclRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjZGlzcGxheS13aW5uZXJgKTtcbiAgICAgICAgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyk7XG4gICAgICAgIGlmIChnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICAgIGRpc3BsYXlXaW5uZXJUZXh0LnRleHRDb250ZW50ID0gYFlvdSB3aW4hYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwbGF5V2lubmVyVGV4dC50ZXh0Q29udGVudCA9IGBZb3UgbG9zZSFgO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVPdmVyTW9kYWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgc3RvcmVkR2FtZWJvYXJkcywgZ2FtZUxvb3AsIGNyZWF0ZVBsYXllck9iamVjdHMsIGhhbmRsZVN0YXRlIH07XG4iLCJpbXBvcnQgeyBTaGlwcyB9IGZyb20gXCIuL3NoaXBNb2R1bGVcIjtcbmltcG9ydCB7IHN0b3JlZEdhbWVib2FyZHMgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuaW1wb3J0IHsgcmVuZGVyQ29tcHV0ZXJTaGlwcywgcmVuZGVyUGxheWVyU2hpcHMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmNvbnN0IEdhbWVib2FyZCA9IChmbGVldEFycmF5KSA9PiB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IFtcbiAgICBmbGVldEFycmF5WzBdLFxuICAgIGZsZWV0QXJyYXlbMV0sXG4gICAgZmxlZXRBcnJheVsyXSxcbiAgICBmbGVldEFycmF5WzNdLFxuICAgIGZsZWV0QXJyYXlbNF0sXG4gIF07XG4gIGNvbnN0IG1pc3NlcyA9IFtdO1xuICBjb25zdCBzaGlwcyA9IFNoaXBzKCk7XG5cbiAgY29uc3QgaXNHYW1lT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IHNoaXBzLmZsZWV0O1xuICAgIGxldCBpc0dhbWVPdmVyID0gZmFsc2U7XG4gICAgbGV0IHNoaXBzU3Vua0NvdW50ZXIgPSAwO1xuXG4gICAgYXJyYXkuZmlsdGVyKChvYmopID0+IHtcbiAgICAgIGlmIChvYmouaXNTdW5rKSB7XG4gICAgICAgIHNoaXBzU3Vua0NvdW50ZXIgKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc2hpcHNTdW5rQ291bnRlciA9PT0gNSkge1xuICAgICAgaXNHYW1lT3ZlciA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpc0dhbWVPdmVyO1xuICB9O1xuXG4gIHJldHVybiB7IGdhbWVib2FyZCwgbWlzc2VzLCBzaGlwcywgaXNHYW1lT3ZlciB9O1xufTtcblxuY29uc3QgcmVjZWl2ZUF0dGFjayA9IChhdHRhY2tDb29yZCwgdXNlcikgPT4ge1xuICBsZXQgaW5kZXg7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIGF0dGFja0Nvb3JkXTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgaW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gMTtcbiAgfVxuICBjb25zdCBnYW1lYm9hcmRPYmplY3QgPSBzdG9yZWRHYW1lYm9hcmRzW2luZGV4XVsxXTtcbiAgZ2FtZWJvYXJkT2JqZWN0LmdhbWVib2FyZC5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICBpZiAob2JqZWN0LnNoaXBQbGFjZW1lbnQuaW5jbHVkZXMoYXR0YWNrQ29vcmQpKSB7XG4gICAgICBhdHRhY2tPdXRjb21lID0gW29iamVjdC5uYW1lLCBhdHRhY2tDb29yZF07XG4gICAgfVxuICB9KTtcbiAgaWYgKCFhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgZ2FtZWJvYXJkT2JqZWN0Lm1pc3Nlcy5wdXNoKGF0dGFja0Nvb3JkKTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lYm9hcmRPYmplY3Quc2hpcHMuaGl0KGF0dGFja091dGNvbWUpO1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5pc1N1bmsoYXR0YWNrT3V0Y29tZVswXSk7XG4gIH1cbiAgcmV0dXJuIGF0dGFja091dGNvbWU7XG59O1xuXG4vLyBCRUdJTi0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmRzIC0tLS0tLS0gLy9cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCkge1xuICBjb25zdCBudW1iZXJPZkNvb3JkaW5hdGVzID0gMTAwO1xuICBjb25zdCBvcmllbnRhdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICBjb25zdCBmaXJzdENvb3JkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtYmVyT2ZDb29yZGluYXRlcyk7XG4gIHJldHVybiBbb3JpZW50YXRpb24sIGZpcnN0Q29vcmRdO1xufVxuXG5mdW5jdGlvbiBvcmllbnRTaGlwKHN0YXJ0Q29vcmQsIG9yaWVudGF0aW9uLCBuYW1lLCBsZW5ndGgpIHtcbiAgbGV0IHNoaXBQbGFjZW1lbnQgPSBbXTtcbiAgbGV0IGhvcml6b250YWxMaW1pdDtcbiAgaWYgKHN0YXJ0Q29vcmQgPCAxMCkge1xuICAgIGhvcml6b250YWxMaW1pdCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gKyhzdGFydENvb3JkLnRvU3RyaW5nKCkuY2hhckF0KDApICsgOSk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChvcmllbnRhdGlvbikge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgKiAxMCA8IDEwMCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkgKiAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkgKiAxMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpIDw9IGhvcml6b250YWxMaW1pdCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgbmFtZSwgc2hpcFBsYWNlbWVudCB9O1xufVxuXG5mdW5jdGlvbiB2ZXJpZnlDb29yZHMoYXJyYXksIG9iamVjdCkge1xuICBjb25zdCBzaGlwVG9WZXJpZnkgPSBvYmplY3Quc2hpcFBsYWNlbWVudDtcbiAgbGV0IGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgaWYgKCFhcnJheS5sZW5ndGgpIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbiAgfSBlbHNlIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBUb1ZlcmlmeS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXkuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICAgIGlmIChpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXAuc2hpcFBsYWNlbWVudC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICBpZiAoc2hpcFRvVmVyaWZ5W2ldICE9PSBzaGlwLnNoaXBQbGFjZW1lbnRbal0pIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbn1cblxuLy8gdXNlZCBmb3IgdGhlIG5hbWUgYW5kIGxlbmd0aCBwcm9wcyBpbiB0aGUgcGxhY2VDb21wdXRlckZsZWV0IGZ4blxuY29uc3Qgc2hpcENsb25lID0gU2hpcHMoKTtcblxuZnVuY3Rpb24gcGxhY2VDb21wdXRlckZsZWV0KHVzZXIsIGFycmF5KSB7XG4gIHNoaXBDbG9uZS5mbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcbiAgICB3aGlsZSAoIWlzVmFsaWQpIHtcbiAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHJhbmRvbVZhbHVlcyA9IGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCk7XG4gICAgICBjb25zdCBwbGFjZW1lbnQgPSBvcmllbnRTaGlwKFxuICAgICAgICByYW5kb21WYWx1ZXNbMV0sXG4gICAgICAgIHJhbmRvbVZhbHVlc1swXSxcbiAgICAgICAgc2hpcC5uYW1lLFxuICAgICAgICBzaGlwLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHZlcmlmeSA9IHZlcmlmeUNvb3JkcyhhcnJheSwgcGxhY2VtZW50KTtcbiAgICAgIGlmICh2ZXJpZnkpIHtcbiAgICAgICAgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIGFycmF5LnB1c2gocGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAodXNlciA9PT0gYGNwdWApIHtcbiAgICByZW5kZXJDb21wdXRlclNoaXBzKGFycmF5KTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJQbGF5ZXJTaGlwcyhhcnJheSk7XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuLy8gRU5ELS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgcGxheWVyIC0tLS0tLS0gLy9cblxuZXhwb3J0IHsgR2FtZWJvYXJkLCBwbGFjZUNvbXB1dGVyRmxlZXQsIHJlY2VpdmVBdHRhY2sgfTtcbiIsImltcG9ydCB7IGdhbWVMb29wLCBoYW5kbGVTdGF0ZSB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyBzZXREcmFnQW5kRHJvcCB9IGZyb20gXCIuL2RyYWdBbmREcm9wXCI7XG5cbmZ1bmN0aW9uIHJlbmRlckdhbWVib2FyZCh1c2VyKSB7XG4gIGxldCBib2FyZERpdjtcbiAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gICAgYm9hcmQuc2V0QXR0cmlidXRlKGBpZGAsIGBwbGF5ZXItc3F1YXJlcy1jb250YWluZXJgKTtcbiAgfSBlbHNlIHtcbiAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgICBib2FyZC5zZXRBdHRyaWJ1dGUoYGlkYCwgYGNwdS1zcXVhcmVzLWNvbnRhaW5lcmApO1xuICB9XG4gIGJvYXJkLmNsYXNzTGlzdC5hZGQoYGdhbWVib2FyZGApO1xuICBjb25zdCBtYXhTcXVhcmVzID0gMTAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1heFNxdWFyZXM7IGkrKykge1xuICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIHNxdWFyZS5kYXRhc2V0LmluZGV4TnVtYmVyID0gaTtcbiAgICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKGBwbGF5ZXJTcXVhcmVgKTtcbiAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKGBjcHVTcXVhcmVgKTtcbiAgICB9XG4gICAgYm9hcmQuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgfVxuICBib2FyZERpdi5hcHBlbmRDaGlsZChib2FyZCk7XG59XG5cbmNvbnN0IHBsYXllckF0dGFjayA9IChlKSA9PiB7XG4gIGNvbnN0IGNvb3JkaW5hdGVDbGlja2VkID0gK2UudGFyZ2V0LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4gIGdhbWVMb29wKGNvb3JkaW5hdGVDbGlja2VkKTtcbiAgZS50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xufTtcblxucmVuZGVyR2FtZWJvYXJkKGBjcHVgKTtcblxuZnVuY3Rpb24gZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhhcnJheSkge1xuICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICBhcnJheS5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgIHNxdWFyZXNbaW5kZXhdLnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlck1vdmUod2hvc2VUdXJuLCBhdHRhY2tBcnJheSkge1xuICBjb25zb2xlLmxvZyh7IHdob3NlVHVybiwgYXR0YWNrQXJyYXkgfSk7XG4gIGxldCBzcXVhcmVzO1xuICBjb25zdCBoaXRJbmRleCA9IGF0dGFja0FycmF5WzFdO1xuICBpZiAod2hvc2VUdXJuID09PSBgcGxheWVyYCkge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbiAgfVxuICBpZiAoYXR0YWNrQXJyYXlbMF0pIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBoaXRgKTtcbiAgfSBlbHNlIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBtaXNzYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29tcHV0ZXJTaGlwcyhjcHVGbGVldCkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBjcHVGbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYGNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLnNyYyA9IGltZ1NyYztcblxuICAgIGNvbnN0IHNvcnRBc2NlbmRpbmcgPSBzaGlwT2JqZWN0LnNoaXBQbGFjZW1lbnQuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuICAgIGNvbnN0IGRpbWVuc2lvbk9mU3F1YXJlID0gMzU7XG4gICAgbGV0IHRvcE9mZnNldDtcbiAgICBsZXQgbGVmdE9mZnNldDtcbiAgICBpZiAoc29ydEFzY2VuZGluZ1swXSArIDEgPT09IHNvcnRBc2NlbmRpbmdbMV0pIHtcbiAgICAgIC8vIHBsYWNlIGhvcml6b250YWwgc2hpcHNcbiAgICAgIHRvcE9mZnNldCA9IE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9ICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBsYWNlIHZlcnRpY2FsIHNoaXBzXG4gICAgICBzaGlwSW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgtOTBkZWcpYDtcbiAgICAgIHRvcE9mZnNldCA9XG4gICAgICAgIE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlICtcbiAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwSW1hZ2Uuc3R5bGUudG9wID0gYCR7dG9wT2Zmc2V0fXB4YDtcbiAgICBzaGlwSW1hZ2Uuc3R5bGUubGVmdCA9IGAke2xlZnRPZmZzZXR9cHhgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH0pO1xuICByZW5kZXJHYW1lYm9hcmQoYHBsYXllcmApO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQbGF5ZXJTaGlwcyhmbGVldCkge1xuICBpZiAoZmxlZXRbMF0uc2hpcFBsYWNlbWVudFswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICBsZXQgaW1nU3JjO1xuXG4gIGZsZWV0LmZvckVhY2goKHNoaXBPYmplY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChgcGxheWVyLXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgaWYgKHNoaXBPYmplY3QubmFtZSA9PT0gYFBhdHJvbCBCb2F0YCkge1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy9wYXRyb2wucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBwYXRyb2xgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwT2JqZWN0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvJHtzaGlwTmFtZX0ucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXBOYW1lfWApO1xuICAgIH1cbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgaW52YWxpZGApO1xuICAgIHNoaXBJbWFnZS5zcmMgPSBpbWdTcmM7XG5cbiAgICBjb25zdCBzb3J0QXNjZW5kaW5nID0gc2hpcE9iamVjdC5zaGlwUGxhY2VtZW50LnNvcnQoKHgsIHkpID0+IHggLSB5KTtcbiAgICBjb25zdCBkaW1lbnNpb25PZlNxdWFyZSA9IDM1O1xuICAgIGxldCB0b3BPZmZzZXQ7XG4gICAgbGV0IGxlZnRPZmZzZXQ7XG4gICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gKyAxID09PSBzb3J0QXNjZW5kaW5nWzFdKSB7XG4gICAgICAvLyBwbGFjZSBob3Jpem9udGFsIHNoaXBzXG4gICAgICB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSAtIDM1MDtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9IHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwbGFjZSB2ZXJ0aWNhbCBzaGlwc1xuICAgICAgc2hpcEltYWdlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoLTkwZGVnKWA7XG4gICAgICB0b3BPZmZzZXQgPVxuICAgICAgICBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSArXG4gICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzUgLVxuICAgICAgICAzNTA7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgIHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcEltYWdlLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGA7XG4gICAgc2hpcEltYWdlLnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgICBjcHVCb2FyZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2xlYXJCb2FyZHMoZSkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgY29uc3QgcGxheWVyU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItc3F1YXJlcy1jb250YWluZXJgKTtcbiAgY29uc3QgY3B1Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gIGNvbnN0IHBsYWNlU2hpcHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxhY2Utc2hpcHMtY29udGFpbmVyYCk7XG4gIGNvbnN0IHNoaXBzT25DUFVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5wbGF5ZXItc2hpcHMtcmVuZGVyZWRgKTtcbiAgY29uc3Qgc2hpcHNPblBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICBjb25zdCByZW1haW5pbmdTaGlwc1RvUGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcblxuICBjb25zdCBjcHVCb2FyZFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG4gIGNwdUJvYXJkU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbiAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYGA7XG4gIH0pO1xuXG4gIHBsYXllckJvYXJkLnJlbW92ZUNoaWxkKHBsYXllclNxdWFyZXMpO1xuICByZW1vdmVFbGVtZW50cyhjcHVCb2FyZCwgc2hpcHNPbkNQVUJvYXJkKTtcbiAgcmVtb3ZlRWxlbWVudHMocGxheWVyQm9hcmQsIHNoaXBzT25QbGF5ZXJCb2FyZCk7XG4gIHJlbW92ZUVsZW1lbnRzKHBsYWNlU2hpcHNDb250YWluZXIsIHJlbWFpbmluZ1NoaXBzVG9QbGFjZSk7XG4gIHJlZGlzcGxheVNoaXBzVG9QbGFjZShwbGFjZVNoaXBzQ29udGFpbmVyKTtcbiAgc2V0RHJhZ0FuZERyb3Auc2V0VXBTaGlwc1RvRHJhZ0FuZERyb3AoKTtcbiAgaGFuZGxlU3RhdGUoKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRWxlbWVudHMocGFyZW50LCBjaGlsZHJlbikge1xuICBpZiAoY2hpbGRyZW4pIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAocGFyZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlZGlzcGxheVNoaXBzVG9QbGFjZShwYXJlbnQpIHtcbiAgY29uc3QgbmFtZUhlbHBlciA9IFtcbiAgICBgY2FycmllcmAsXG4gICAgYGJhdHRsZXNoaXBgLFxuICAgIGBkZXN0cm95ZXJgLFxuICAgIGBzdWJtYXJpbmVgLFxuICAgIGBwYXRyb2xgLFxuICBdO1xuICBuYW1lSGVscGVyLmZvckVhY2goKHNoaXApID0+IHtcbiAgICBjb25zdCBzaGlwSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBpbWdgKTtcbiAgICBzaGlwSW1hZ2Uuc3JjID0gYC4vaW1ncy8ke3NoaXB9LnBuZ2A7XG4gICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYCR7c2hpcH1gKTtcbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgc2hpcHMtdG8tcGxhY2VgKTtcbiAgICBzaGlwSW1hZ2Uuc2V0QXR0cmlidXRlKGBpZGAsIGBwbGF5ZXItJHtzaGlwfWApO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICB9KTtcbn1cblxuZXhwb3J0IHtcbiAgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyxcbiAgcmVuZGVyTW92ZSxcbiAgcmVuZGVyQ29tcHV0ZXJTaGlwcyxcbiAgcmVuZGVyUGxheWVyU2hpcHMsXG4gIGNsZWFyQm9hcmRzLFxufTtcbiIsImNvbnN0IFNoaXBzID0gKCkgPT4ge1xuICBjb25zdCBmbGVldCA9IFtcbiAgICB7IG5hbWU6IGBDYXJyaWVyYCwgbGVuZ3RoOiA1LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYEJhdHRsZXNoaXBgLCBsZW5ndGg6IDQsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgRGVzdHJveWVyYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFN1Ym1hcmluZWAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBQYXRyb2wgQm9hdGAsIGxlbmd0aDogMiwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgXTtcblxuICBjb25zdCBoaXQgPSAoYXR0YWNrRGF0YSkgPT4ge1xuICAgIGNvbnN0IHNoaXBIaXQgPSBhdHRhY2tEYXRhWzBdO1xuICAgIGNvbnN0IGNvb3JkT2ZIaXQgPSBhdHRhY2tEYXRhWzFdO1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUpIHtcbiAgICAgICAgc2hpcC5oaXRzLnB1c2goY29vcmRPZkhpdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKHNoaXBIaXQpID0+IHtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lICYmIHNoaXAubGVuZ3RoID09PSBzaGlwLmhpdHMubGVuZ3RoKSB7XG4gICAgICAgIHNoaXAuaXNTdW5rID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4geyBmbGVldCwgaGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCB7IFNoaXBzIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vZHJhZ0FuZERyb3BcIjtcblxuY29uc3QgbmV3R2FtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNuZXctZ2FtZS1idG5gKTtcbm5ld0dhbWVCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCAoKSA9PiBsb2NhdGlvbi5yZWxvYWQoKSk7XG4iXSwic291cmNlUm9vdCI6IiJ9