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
let initialCPUHitObject;
let validSmartMoves;

function getValidAdjacentCPUMoves(initialHit) {
  console.log(initialHit);
  const validMovesRight = getMovesRight(initialHit);
  const validMovesLeft = getMovesLeft(initialHit);
  const validMovesDown = getMovesDown(initialHit);
  const validMovesUp = getMovesUp(initialHit);
  return { validMovesRight, validMovesLeft, validMovesDown, validMovesUp };
}

function getMovesRight(hit) {
  const getIndex = getValidMoves.indexOf(hit);
  const movesRight = getValidMoves.slice(getIndex).filter((item, index) => {
    if (item - hit - index === 0 && item < (Math.floor(hit / 10) + 1) * 10) {
      return item;
    }
  });
  movesRight.shift();
  // console.log({ movesRight });
  return movesRight;
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
  // console.log({ movesLeft });
  return movesLeft;
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
  // console.log({ movesDown });
  return movesDown;
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
  // console.log({ movesUp });
  return movesUp;
}

function generateComputerAttack() {
  let cpuMove;
  if (!isAITriggered) {
    const randomIndex = Math.floor(Math.random() * getValidMoves.length);
    cpuMove = getValidMoves[randomIndex];
    // getValidMoves.splice(randomIndex, 1);
  } else {
    console.log(`begin smart move`);
    cpuMove = getSmartCPUMove();
    // getValidMoves.splice(getValidMoves.indexOf(cpuMove), 1);
  }
  return cpuMove;
}

// let areShipsAdjacent;
let isAHit = true;
let hitsCounter = 0;
let smartMovesCounter = 0;
let numberOfShipsSunkByAI = 0;
let sunkShipsChecker = 0;
let isInitialShipSunk = false;
let isVertical = false;
let isRight = true;
let isLeft = true;
let isDown = true;

function getSmartCPUMove() {
  let move;
  smartMovesCounter += 1;
  if (isAHit) {
    hitsCounter += 1;
  }
  if (
    // first move is always right if array[0] is truthy
    validSmartMoves.validMovesRight[0] &&
    isAHit &&
    hitsCounter === smartMovesCounter
  ) {
    move = validSmartMoves.validMovesRight[0];
    validSmartMoves.validMovesRight.shift();
  } else if (
    (isRight &&
      // first condition is if moveRight DNE upon entering AI bc hits === smartMoves
      !validSmartMoves.validMovesRight[0] &&
      hitsCounter === smartMovesCounter &&
      validSmartMoves.validMovesLeft[0]) ||
    // second condition is for the move immediately after moveRight misses, thus hits and moves differ by 1
    (isRight &&
      validSmartMoves.validMovesLeft[0] &&
      !isAHit &&
      hitsCounter === smartMovesCounter - 1) ||
    // third condition is if VMR becomes falsy without sinking the ship by running up against right edge of gameboard
    // in this case, hits will equal smartMoves and go left until VML is falsy or a miss is registered
    (isRight &&
      !validSmartMoves.validMovesRight[0] &&
      validSmartMoves.validMovesLeft[0] &&
      hitsCounter === smartMovesCounter)
  ) {
    move = validSmartMoves.validMovesLeft[0];
    validSmartMoves.validMovesLeft.shift();
    isRight = false;
  } else if (
    validSmartMoves.validMovesLeft[0] &&
    isAHit &&
    isLeft &&
    !isVertical
  ) {
    // handles if one of the above "else if" conditions registers a hit but will not trigger once AI performs a move down
    move = validSmartMoves.validMovesLeft[0];
    validSmartMoves.validMovesLeft.shift();
  } else if (
    // handles the case in which there are no valid moves right or left upon entry into AI
    !validSmartMoves.validMovesLeft[0] &&
    !validSmartMoves.validMovesRight[0] &&
    validSmartMoves.validMovesDown[0] &&
    // hitsCounter === smartMovesCounter
    isLeft &&
    !isVertical
  ) {
    move = validSmartMoves.validMovesDown[0];
    validSmartMoves.validMovesDown.shift();
    isLeft = false;
    isVertical = true;
  } else if (validSmartMoves.validMovesDown[0] && !isAHit && !isVertical) {
    // handles the first time a move is made down with the exception of the above else if, thus setting isVertical = true
    move = validSmartMoves.validMovesDown[0];
    validSmartMoves.validMovesDown.shift();
    isLeft = false;
    isVertical = true;
  } else if (
    validSmartMoves.validMovesDown[0] &&
    isAHit &&
    isDown &&
    isVertical
  ) {
    move = validSmartMoves.validMovesDown[0];
    validSmartMoves.validMovesDown.shift();
  } else if (
    validSmartMoves.validMovesUp[0]
    // !isAHit
    // isVertical
  ) {
    move = validSmartMoves.validMovesUp[0];
    validSmartMoves.validMovesUp.shift();
    isDown = false;
  } else {
    breakFromAILoop();
    move = generateComputerAttack();
  }
  return move;
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

      if (getTurn === `computer`) {
        if (attackOutcome[0] && !isAITriggered) {
          console.log(`first hit`);
          isAITriggered = true;
          storedGameboards[1][1].ships.fleet.filter((object) => {
            if (object.isSunk) {
              numberOfShipsSunkByAI += 1;
              // console.log(numberOfShipsSunkByAI);
            }
          });
          storedGameboards[1][1].ships.fleet.filter((object) => {
            // if (attackOutcome[0] === object.name && object.hits.length === 1) {
            if (attackOutcome[0] === object.name) {
              initialCPUHitObject = object;
            }
          });
          validSmartMoves = getValidAdjacentCPUMoves(attackOutcome[1]);
          // console.log(validSmartMoves);
          // console.log(initialCPUHitObject);
        }
        if (isAITriggered) {
          if (attackOutcome[0]) {
            isAHit = true;
            isInitialShipSunk = initialCPUHitObject.isSunk;
            if (isInitialShipSunk) {
              // isAITriggered = false;
              // initialCPUHitObject = null;
              // hitsCounter = 0;
              // smartMovesCounter = 0;
              // isInitialShipSunk = false;
              // numberOfShipsSunkByAI = 0;
              breakFromAILoop();
            }
            console.log(sunkShipsChecker);
            console.log(numberOfShipsSunkByAI);
            console.log(isInitialShipSunk);
            // if (sunkShipsChecker !== numberOfShipsSunkByAI) {
            //   isAITriggered = false;
            // }
          } else {
            isAHit = false;
          }
        }
        console.log(validSmartMoves);
        getValidMoves.splice(getValidMoves.indexOf(attackOutcome[1]), 1);
      }

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

      if (attackOutcome[0] && getTurn === `player`) {
        let isShipSunk;
        storedGameboards[0][1].ships.fleet.filter((object, index) => {
          if (attackOutcome[0] === object.name) {
            isShipSunk = object.isSunk;
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

function breakFromAILoop() {
  isAITriggered = false;
  initialCPUHitObject = null;
  hitsCounter = 0;
  smartMovesCounter = 0;
  isInitialShipSunk = false;
  numberOfShipsSunkByAI = 0;
  isRight = true;
  isLeft = true;
  isDown = true;
  isVertical = false;
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
  // console.log({ whoseTurn, attackArray });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RyYWdBbmREcm9wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZW5kZXJHYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9EO0FBQ1U7O0FBRTlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGlFQUFtQjtBQUN6QjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUEscUNBQXFDLG9EQUFXO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxQ0FBcUM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFDQUFxQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQ0FBcUM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUNBQXFD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QUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ051Qjs7QUFFdkI7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlUGxheWVyT2JqZWN0cyB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyByZW5kZXJQbGF5ZXJTaGlwcywgY2xlYXJCb2FyZHMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmNvbnN0IHNldERyYWdBbmREcm9wID0gKGZ1bmN0aW9uICgpIHtcbiAgbGV0IHBsYXllckZsZWV0ID0gW107XG5cbiAgY29uc3Qgc2hpcE5hbWVzID0gW1xuICAgIGBDYXJyaWVyYCxcbiAgICBgQmF0dGxlc2hpcGAsXG4gICAgYERlc3Ryb3llcmAsXG4gICAgYFN1Ym1hcmluZWAsXG4gICAgYFBhdHJvbCBCb2F0YCxcbiAgXTtcbiAgY29uc3Qgc2hpcExlbmd0aHMgPSBbNSwgNCwgMywgMywgMl07XG4gIGxldCBzaGlwQ29vcmRzID0gW107XG5cbiAgY29uc3QgY3B1R2FtZUJvYXJkVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkLWhlYWRlcmApO1xuICBjb25zdCBjcHVCb2FyZFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG5cbiAgY29uc3Qgcm90YXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2J0bi1yb3RhdGUtc2hpcGApO1xuICBjb25zdCBjbGVhckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjbGVhci1ib2FyZC1idG5gKTtcbiAgY29uc3QgcmFuZG9taXplQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3JhbmRvbWl6ZS1wbGF5ZXItZmxlZXRgKTtcblxuICBjb25zdCBwbGFjZVNoaXBzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYWNlLXNoaXBzLWNvbnRhaW5lcmApO1xuICBjb25zdCBwbGF5ZXJTaGlwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgYC5wbGF5ZXItc2hpcHMtY29udGFpbmVyYFxuICApO1xuICBsZXQgc2hpcEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcblxuICBmdW5jdGlvbiBoaWRlU2hpcHNUb1BsYWNlKCkge1xuICAgIHNoaXBJbWdzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZChgaGlkZS1zaGlwYCk7XG4gICAgfSk7XG4gICAgcm90YXRlQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gIH1cblxuICAvLyBoaWRlcyBhbGwgYnV0IHRoZSBjYXJyaWVyIG9uIHBhZ2UgbG9hZFxuICBmdW5jdGlvbiBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCgpIHtcbiAgICBwbGF5ZXJGbGVldCA9IFtdO1xuICAgIHNoaXBJbWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnNoaXBzLXRvLXBsYWNlYCk7XG4gICAgc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCwgaW5kZXgpID0+IHtcbiAgICAgIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihgbW91c2Vkb3duYCwgYmVnaW5TaGlwUGxhY2VtZW50KTtcbiAgICAgIGlmIChpbmRleCAhPT0gMCkge1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoYGhpZGUtc2hpcGApO1xuICAgICAgfVxuICAgICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKGBtb3VzZWRvd25gLCBiZWdpblNoaXBQbGFjZW1lbnQpO1xuICAgICAgc2hpcC5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gICAgICBzaGlwLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIHJhbmRvbWl6ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYGZsZXhgO1xuICAgIGNsZWFyQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gIH1cbiAgc2V0VXBTaGlwc1RvRHJhZ0FuZERyb3AoKTtcblxuICAvLyBsYWJlbHMgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCBvbiBwYWdlIGxvYWRcbiAgY3B1R2FtZUJvYXJkVGl0bGUudGV4dENvbnRlbnQgPSBgUExBQ0UgWU9VUiBTSElQU2A7XG5cbiAgLy8gc3RhcnQgZ2FtZSBidXR0b25cbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc3RhcnQtZ2FtZS1idG5gKTtcbiAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBiZWdpbkdhbWUpO1xuXG4gIGZ1bmN0aW9uIGJlZ2luR2FtZSgpIHtcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgICBjcHVHYW1lQm9hcmRUaXRsZS50ZXh0Q29udGVudCA9IGBDb21wdXRlcmA7XG4gICAgcGxheWVyQm9hcmQuc3R5bGUuZGlzcGxheSA9IGBibG9ja2A7XG4gICAgcGxhY2VTaGlwc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICAgIGlmIChwbGF5ZXJGbGVldC5sZW5ndGggPT09IDUpIHtcbiAgICAgIGNyZWF0ZVBsYXllck9iamVjdHMocGxheWVyRmxlZXQpO1xuICAgICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYGA7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjbGVhckJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIGNsZWFyQm9hcmRzKTtcbiAgcm90YXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcm90YXRlU2hpcCk7XG5cbiAgZnVuY3Rpb24gcm90YXRlU2hpcChlKSB7XG4gICAgaWYgKCFzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgPSBgLTkwZGVnYDtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgICAgMTAwICsgKChzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdIC0gMSkgLyAyKSAqIDM1ICsgYHB4YDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgPSBgYDtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID0gMTAwICsgYHB4YDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBiZWdpblNoaXBQbGFjZW1lbnQoZXZlbnQpIHtcbiAgICAvLyAoMSkgcHJlcGFyZSB0byBtb3ZlIGVsZW1lbnQ6IG1ha2UgYWJzb2x1dGUgYW5kIG9uIHRvcCBieSB6LWluZGV4XG4gICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnpJbmRleCA9IDEwMDA7XG5cbiAgICAvLyBtb3ZlIGl0IG91dCBvZiBhbnkgY3VycmVudCBwYXJlbnRzIGRpcmVjdGx5IGludG8gY3B1Qm9hcmRcbiAgICBwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGhdLmFwcGVuZChcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF1cbiAgICApO1xuXG4gICAgLy8gY2VudGVycyB0aGUgY3Vyc29yIGluIHRoZSBmaXJzdCBcInNxdWFyZVwiIG9mIHRoZSBzaGlwIGltYWdlXG4gICAgZnVuY3Rpb24gbW92ZUF0KHBhZ2VYLCBwYWdlWSkge1xuICAgICAgaWYgKCFzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmxlZnQgPVxuICAgICAgICAgIHBhZ2VYIC1cbiAgICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54ICtcbiAgICAgICAgICAgIDE3LjUpICtcbiAgICAgICAgICBcInB4XCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgICAgICBwYWdlWSAtXG4gICAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSArXG4gICAgICAgICAgICAxNy41KSArXG4gICAgICAgICAgXCJweFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgICBwYWdlWCAtXG4gICAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArXG4gICAgICAgICAgICAoKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAvIDIpICogMzUpIC1cbiAgICAgICAgICAxNy41ICtcbiAgICAgICAgICBcInB4XCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID1cbiAgICAgICAgICBwYWdlWSAtXG4gICAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSAtXG4gICAgICAgICAgICAoKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAvIDIpICogMzUpIC1cbiAgICAgICAgICAxNy41ICtcbiAgICAgICAgICBcInB4XCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbW92ZSBvdXIgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNhcnJpZXIgdW5kZXIgdGhlIHBvaW50ZXJcbiAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcblxuICAgIC8vIHBvdGVudGlhbCBkcm9wcGFibGUgdGhhdCB3ZSdyZSBmbHlpbmcgb3ZlciByaWdodCBub3dcbiAgICBsZXQgY3VycmVudERyb3BwYWJsZSA9IG51bGw7XG4gICAgbGV0IGRyb3BwYWJsZUJlbG93ID0gbnVsbDtcbiAgICBsZXQgaXNEcm9wVmFsaWQ7XG5cbiAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgICAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLmhpZGRlbiA9IHRydWU7XG4gICAgICBsZXQgZWxlbUJlbG93ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcblxuICAgICAgaWYgKCFlbGVtQmVsb3cpIHJldHVybjtcblxuICAgICAgLy8gQkVHSU4gLS0tLSBjaGVja3MgdmFsaWRpdHkgb2YgdGhlIGRyb3BcbiAgICAgIGxldCBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eSA9IFtdO1xuICAgICAgYXJyYXlPZkVsZW1lbnRzQmVsb3dUb0NoZWNrVmFsaWRpdHkuc2hpZnQoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgIGxldCBnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eTtcbiAgICAgICAgaWYgKHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlKSB7XG4gICAgICAgICAgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkgPSBkb2N1bWVudFxuICAgICAgICAgICAgLmVsZW1lbnRGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSArIGkgKiAzNSlcbiAgICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGNsYXNzYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkgPSBkb2N1bWVudFxuICAgICAgICAgICAgLmVsZW1lbnRGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCArIGkgKiAzNSwgZXZlbnQuY2xpZW50WSlcbiAgICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGNsYXNzYCk7XG4gICAgICAgIH1cbiAgICAgICAgYXJyYXlPZkVsZW1lbnRzQmVsb3dUb0NoZWNrVmFsaWRpdHkucHVzaChnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eSk7XG4gICAgICAgIGlmIChhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eVswXSkge1xuICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoKGl0ZW0gJiYgaXRlbS5pbmNsdWRlcyhgaW52YWxpZGApKSB8fCBpdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoY291bnRlcikge1xuICAgICAgICAgICAgaXNEcm9wVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXNEcm9wVmFsaWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRU5EIC0tLS0gY2hlY2tzIHZhbGlkaXR5IG9mIHRoZSBkcm9wXG5cbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uaGlkZGVuID0gZmFsc2U7XG5cbiAgICAgIC8vIHBvdGVudGlhbCBkcm9wcGFibGVzIGFyZSB0aGUgc3F1YXJlcyBvbiB0aGUgZ2FtZWJvYXJkXG4gICAgICBkcm9wcGFibGVCZWxvdyA9IGVsZW1CZWxvdy5jbG9zZXN0KFwiLmNwdVNxdWFyZVwiKTtcblxuICAgICAgaWYgKCFkcm9wcGFibGVCZWxvdyB8fCAhaXNEcm9wVmFsaWQpIHtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5jdXJzb3IgPSBgbm8tZHJvcGA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmN1cnNvciA9IGBncmFiYmluZ2A7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlICE9IGRyb3BwYWJsZUJlbG93KSB7XG4gICAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlKSB7XG4gICAgICAgICAgbGVhdmVEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnREcm9wcGFibGUgPSBkcm9wcGFibGVCZWxvdztcbiAgICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgICBlbnRlckRyb3BwYWJsZUFyZWEoY3VycmVudERyb3BwYWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbnRlckRyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuICAgICAgc2hpcENvb3JkcyA9IFtdO1xuICAgICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICAgICAgY29uc3QgbWF4SG9yaXpvbnRhbCA9IChNYXRoLmZsb29yKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC8gMTApICsgMSkgKiAxMDtcbiAgICAgIGNvbnN0IG1heFZlcnRpY2FsID1cbiAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLVxuICAgICAgICBNYXRoLmZsb29yKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC8gMTApICogMTAgK1xuICAgICAgICA5MDtcbiAgICAgIGlmIChcbiAgICAgICAgIXNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlICYmXG4gICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSA8XG4gICAgICAgICAgbWF4SG9yaXpvbnRhbCAmJlxuICAgICAgICBpc0Ryb3BWYWxpZFxuICAgICAgKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldKSB7XG4gICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgICBcIiM4MjlFNzZcIjtcbiAgICAgICAgICAgIHNoaXBDb29yZHMucHVzaChpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpICogMTAgPD1cbiAgICAgICAgICBtYXhWZXJ0aWNhbCAmJlxuICAgICAgICBpc0Ryb3BWYWxpZFxuICAgICAgKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tcbiAgICAgICAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBcbiAgICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODI5RTc2XCI7XG4gICAgICAgICAgICBzaGlwQ29vcmRzLnB1c2goaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJvcHBhYmxlQmVsb3cgPSBudWxsO1xuICAgICAgICBzaGlwQ29vcmRzID0gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGVhdmVEcm9wcGFibGVBcmVhKGVsZW1lbnQpIHtcbiAgICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICAgIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICAgIFwiI2MxYzFjMVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuICAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW1xuICAgICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNjMWMxYzFcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAoMikgbW92ZSB0aGUgc2hpcCBvbiBtb3VzZW1vdmVcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcblxuICAgIC8vICgzKSBkcm9wIHRoZSBzaGlwLCByZW1vdmUgdW5uZWVkZWQgaGFuZGxlcnNcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgaWYgKHNoaXBDb29yZHMubGVuZ3RoICE9PSAwICYmIGRyb3BwYWJsZUJlbG93ICYmIGlzRHJvcFZhbGlkKSB7XG4gICAgICAgIHBsYXllckZsZWV0LnB1c2goe1xuICAgICAgICAgIG5hbWU6IHNoaXBOYW1lc1twbGF5ZXJGbGVldC5sZW5ndGhdLFxuICAgICAgICAgIHNoaXBQbGFjZW1lbnQ6IHNoaXBDb29yZHMsXG4gICAgICAgIH0pO1xuICAgICAgICBwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGggLSAxXS5yZW1vdmVDaGlsZChcbiAgICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGggLSAxXVxuICAgICAgICApO1xuICAgICAgICByZW5kZXJQbGF5ZXJTaGlwcyhbcGxheWVyRmxlZXRbcGxheWVyRmxlZXQubGVuZ3RoIC0gMV1dKTtcbiAgICAgICAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgI2MxYzFjMWA7XG4gICAgICAgIH0pO1xuICAgICAgICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChpbmRleCA9PT0gcGxheWVyRmxlZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBzaGlwLmNsYXNzTGlzdC5yZW1vdmUoYGhpZGUtc2hpcGApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwbGF5ZXJGbGVldC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICByYW5kb21pemVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lIGA7XG4gICAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwbGF5ZXJGbGVldC5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICBzdGFydEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgICAgICAgICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxhY2VTaGlwc0NvbnRhaW5lci5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXSxcbiAgICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGggKyAxXVxuICAgICAgICApO1xuICAgICAgICBpZiAoc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSA9IGBgO1xuICAgICAgICB9XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUudG9wID0gXCIxMDBweFwiO1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnpJbmRleCA9IDA7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuY3Vyc29yID0gYGdyYWJgO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHsgaGlkZVNoaXBzVG9QbGFjZSwgc2V0VXBTaGlwc1RvRHJhZ0FuZERyb3AsIGJlZ2luU2hpcFBsYWNlbWVudCB9O1xufSkoKTtcblxuZXhwb3J0IHsgc2V0RHJhZ0FuZERyb3AgfTtcbiIsImltcG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgeyByZW5kZXJNb3ZlLCBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuaW1wb3J0IHsgc2V0RHJhZ0FuZERyb3AgfSBmcm9tIFwiLi9kcmFnQW5kRHJvcFwiO1xuXG5jb25zdCBzdG9yZWRHYW1lYm9hcmRzID0gW107XG5cbmxldCB0dXJuQ291bnRlciA9IDE7XG5mdW5jdGlvbiB0dXJuRHJpdmVyKCkge1xuICBsZXQgd2hvc2VNb3ZlO1xuICBpZiAodHVybkNvdW50ZXIgJSAyICE9PSAwKSB7XG4gICAgd2hvc2VNb3ZlID0gYHBsYXllcmA7XG4gIH0gZWxzZSB7XG4gICAgd2hvc2VNb3ZlID0gYGNvbXB1dGVyYDtcbiAgfVxuICB0dXJuQ291bnRlciArPSAxO1xuICByZXR1cm4gd2hvc2VNb3ZlO1xufVxuXG5jb25zdCByYW5kb21pemVQbGF5ZXJGbGVldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gIGAjcmFuZG9taXplLXBsYXllci1mbGVldGBcbik7XG5yYW5kb21pemVQbGF5ZXJGbGVldEJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHJhbmRvbWl6ZVBsYXllckZsZWV0KTtcblxuZnVuY3Rpb24gcmFuZG9taXplUGxheWVyRmxlZXQoKSB7XG4gIHNldERyYWdBbmREcm9wLmhpZGVTaGlwc1RvUGxhY2UoKTtcbiAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc3RhcnQtZ2FtZS1idG5gKTtcbiAgc3RhcnRCdG4uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICBpZiAoc3RvcmVkR2FtZWJvYXJkc1sxXSkge1xuICAgIHN0b3JlZEdhbWVib2FyZHMucG9wKCk7XG4gICAgY29uc3QgY3B1Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gICAgY29uc3QgcmVuZGVyZWRQbGF5ZXJTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICBgLnBsYXllci1zaGlwcy1yZW5kZXJlZGBcbiAgICApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICBjcHVCb2FyZC5yZW1vdmVDaGlsZChyZW5kZXJlZFBsYXllclNoaXBzW2ldKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgcGxheWVyRmxlZXRBcnJheSA9IFtdO1xuICBjb25zdCBwbGF5ZXJGbGVldCA9IHBsYWNlQ29tcHV0ZXJGbGVldChgdXNlcmAsIHBsYXllckZsZWV0QXJyYXkpO1xuICBjcmVhdGVQbGF5ZXJPYmplY3RzKHBsYXllckZsZWV0KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGxheWVyT2JqZWN0cyhmbGVldCkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVib2FyZChmbGVldCk7XG4gIHN0b3JlZEdhbWVib2FyZHMucHVzaChbYGNvbXB1dGVyYCwgcGxheWVyQm9hcmRdKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tcHV0ZXJPYmplY3RzKCkge1xuICBjb25zdCBjcHVGbGVldEFycmF5ID0gW107XG4gIGNvbnN0IGNvbXB1dGVyRmxlZXQgPSBwbGFjZUNvbXB1dGVyRmxlZXQoYGNwdWAsIGNwdUZsZWV0QXJyYXkpO1xuICBjb25zdCBjb21wdXRlckJvYXJkID0gR2FtZWJvYXJkKGNvbXB1dGVyRmxlZXQpO1xuICBzdG9yZWRHYW1lYm9hcmRzLnB1c2goW2BwbGF5ZXJgLCBjb21wdXRlckJvYXJkXSk7XG59XG5jcmVhdGVDb21wdXRlck9iamVjdHMoKTtcblxubGV0IGdldFZhbGlkTW92ZXMgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcbmxldCBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuXG5mdW5jdGlvbiBoYW5kbGVTdGF0ZSgpIHtcbiAgaWYgKHN0b3JlZEdhbWVib2FyZHMubGVuZ3RoID09PSAyKSB7XG4gICAgc3RvcmVkR2FtZWJvYXJkcy5zaGlmdCgpO1xuICB9XG4gIHN0b3JlZEdhbWVib2FyZHMuc2hpZnQoKTtcbiAgY3JlYXRlQ29tcHV0ZXJPYmplY3RzKCk7XG4gIGdldFZhbGlkTW92ZXMgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcbiAgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcbn1cblxuLy8gQkVHSU4gLS0tLS0gZ2VuZXJhdGVzIHJhbmRvbSBtb3ZlIGZvciBjb21wdXRlciAtLS0tLS0tLS0tLSAvL1xuZnVuY3Rpb24gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCkge1xuICBjb25zdCB2YWxpZE1vdmVzID0gW107XG4gIGNvbnN0IG1heE1vdmVzID0gMTAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1heE1vdmVzOyBpKyspIHtcbiAgICB2YWxpZE1vdmVzLnB1c2goaSk7XG4gIH1cbiAgcmV0dXJuIHZhbGlkTW92ZXM7XG59XG5cbi8vIGZ1bmN0aW9uIGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKSB7XG4vLyAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ2V0VmFsaWRNb3Zlcy5sZW5ndGgpO1xuLy8gICBjb25zdCByYW5kb21Nb3ZlID0gZ2V0VmFsaWRNb3Zlc1tyYW5kb21JbmRleF07XG4vLyAgIGdldFZhbGlkTW92ZXMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbi8vICAgcmV0dXJuIHJhbmRvbU1vdmU7XG4vLyB9XG5cbmxldCBpc0FJVHJpZ2dlcmVkID0gZmFsc2U7XG5sZXQgaW5pdGlhbENQVUhpdE9iamVjdDtcbmxldCB2YWxpZFNtYXJ0TW92ZXM7XG5cbmZ1bmN0aW9uIGdldFZhbGlkQWRqYWNlbnRDUFVNb3Zlcyhpbml0aWFsSGl0KSB7XG4gIGNvbnNvbGUubG9nKGluaXRpYWxIaXQpO1xuICBjb25zdCB2YWxpZE1vdmVzUmlnaHQgPSBnZXRNb3Zlc1JpZ2h0KGluaXRpYWxIaXQpO1xuICBjb25zdCB2YWxpZE1vdmVzTGVmdCA9IGdldE1vdmVzTGVmdChpbml0aWFsSGl0KTtcbiAgY29uc3QgdmFsaWRNb3Zlc0Rvd24gPSBnZXRNb3Zlc0Rvd24oaW5pdGlhbEhpdCk7XG4gIGNvbnN0IHZhbGlkTW92ZXNVcCA9IGdldE1vdmVzVXAoaW5pdGlhbEhpdCk7XG4gIHJldHVybiB7IHZhbGlkTW92ZXNSaWdodCwgdmFsaWRNb3Zlc0xlZnQsIHZhbGlkTW92ZXNEb3duLCB2YWxpZE1vdmVzVXAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0TW92ZXNSaWdodChoaXQpIHtcbiAgY29uc3QgZ2V0SW5kZXggPSBnZXRWYWxpZE1vdmVzLmluZGV4T2YoaGl0KTtcbiAgY29uc3QgbW92ZXNSaWdodCA9IGdldFZhbGlkTW92ZXMuc2xpY2UoZ2V0SW5kZXgpLmZpbHRlcigoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXRlbSAtIGhpdCAtIGluZGV4ID09PSAwICYmIGl0ZW0gPCAoTWF0aC5mbG9vcihoaXQgLyAxMCkgKyAxKSAqIDEwKSB7XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gIH0pO1xuICBtb3Zlc1JpZ2h0LnNoaWZ0KCk7XG4gIC8vIGNvbnNvbGUubG9nKHsgbW92ZXNSaWdodCB9KTtcbiAgcmV0dXJuIG1vdmVzUmlnaHQ7XG59XG5cbmZ1bmN0aW9uIGdldE1vdmVzTGVmdChoaXQpIHtcbiAgY29uc3QgZ2V0SW5kZXggPSBnZXRWYWxpZE1vdmVzLmluZGV4T2YoaGl0KTtcbiAgY29uc3QgbWFwVmFsaWRNb3ZlcyA9IGdldFZhbGlkTW92ZXMubWFwKChpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH0pO1xuICBjb25zdCBtb3Zlc0xlZnQgPSBbXTtcbiAgbWFwVmFsaWRNb3Zlcy5zcGxpY2UoZ2V0SW5kZXgsIG1hcFZhbGlkTW92ZXMubGVuZ3RoIC0gMSk7XG4gIG1hcFZhbGlkTW92ZXMucmV2ZXJzZSgpLmZpbHRlcigoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaGl0ID09PSBpdGVtICsgaW5kZXggKyAxICYmIGl0ZW0gPj0gTWF0aC5mbG9vcihoaXQgLyAxMCkgKiAxMCkge1xuICAgICAgbW92ZXNMZWZ0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgLy8gY29uc29sZS5sb2coeyBtb3Zlc0xlZnQgfSk7XG4gIHJldHVybiBtb3Zlc0xlZnQ7XG59XG5cbmZ1bmN0aW9uIGdldE1vdmVzRG93bihoaXQpIHtcbiAgY29uc3QgdmVydGljYWxNb3ZlcyA9IGdldFZhbGlkTW92ZXMuZmlsdGVyKChjb29yZCkgPT4ge1xuICAgIGlmIChcbiAgICAgIGhpdCAtIE1hdGguZmxvb3IoaGl0IC8gMTApICogMTAgPT09XG4gICAgICBjb29yZCAtIE1hdGguZmxvb3IoY29vcmQgLyAxMCkgKiAxMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvb3JkO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IG1vdmVzRG93biA9IHZlcnRpY2FsTW92ZXNcbiAgICAuc2xpY2UodmVydGljYWxNb3Zlcy5pbmRleE9mKGhpdCkpXG4gICAgLmZpbHRlcigoY29vcmQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoY29vcmQgLSBoaXQgLSBpbmRleCAqIDEwID09PSAwKSB7XG4gICAgICAgIHJldHVybiBjb29yZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgbW92ZXNEb3duLnNoaWZ0KCk7XG4gIC8vIGNvbnNvbGUubG9nKHsgbW92ZXNEb3duIH0pO1xuICByZXR1cm4gbW92ZXNEb3duO1xufVxuXG5mdW5jdGlvbiBnZXRNb3Zlc1VwKGhpdCkge1xuICBjb25zdCB2ZXJ0aWNhbE1vdmVzID0gZ2V0VmFsaWRNb3Zlcy5maWx0ZXIoKGNvb3JkKSA9PiB7XG4gICAgaWYgKGhpdCAlIDEwID09PSBjb29yZCAlIDEwKSB7XG4gICAgICByZXR1cm4gY29vcmQ7XG4gICAgfVxuICB9KTtcbiAgdmVydGljYWxNb3Zlcy5yZXZlcnNlKCk7XG4gIGNvbnN0IG1vdmVzVXAgPSB2ZXJ0aWNhbE1vdmVzXG4gICAgLnNsaWNlKHZlcnRpY2FsTW92ZXMuaW5kZXhPZihoaXQpKVxuICAgIC5maWx0ZXIoKGNvb3JkLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGhpdCA9PT0gY29vcmQgKyBpbmRleCAqIDEwKSB7XG4gICAgICAgIHJldHVybiBjb29yZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgaWYgKFxuICAgIGhpdCAlIDEwID09PSAwICYmXG4gICAgZ2V0VmFsaWRNb3Zlcy5pbmNsdWRlcygwKSAmJlxuICAgIGhpdCA9PT0gbW92ZXNVcC5sZW5ndGggKiAxMFxuICApIHtcbiAgICBtb3Zlc1VwLnB1c2goMCk7XG4gIH1cbiAgbW92ZXNVcC5zaGlmdCgpO1xuICAvLyBjb25zb2xlLmxvZyh7IG1vdmVzVXAgfSk7XG4gIHJldHVybiBtb3Zlc1VwO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCkge1xuICBsZXQgY3B1TW92ZTtcbiAgaWYgKCFpc0FJVHJpZ2dlcmVkKSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnZXRWYWxpZE1vdmVzLmxlbmd0aCk7XG4gICAgY3B1TW92ZSA9IGdldFZhbGlkTW92ZXNbcmFuZG9tSW5kZXhdO1xuICAgIC8vIGdldFZhbGlkTW92ZXMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhgYmVnaW4gc21hcnQgbW92ZWApO1xuICAgIGNwdU1vdmUgPSBnZXRTbWFydENQVU1vdmUoKTtcbiAgICAvLyBnZXRWYWxpZE1vdmVzLnNwbGljZShnZXRWYWxpZE1vdmVzLmluZGV4T2YoY3B1TW92ZSksIDEpO1xuICB9XG4gIHJldHVybiBjcHVNb3ZlO1xufVxuXG4vLyBsZXQgYXJlU2hpcHNBZGphY2VudDtcbmxldCBpc0FIaXQgPSB0cnVlO1xubGV0IGhpdHNDb3VudGVyID0gMDtcbmxldCBzbWFydE1vdmVzQ291bnRlciA9IDA7XG5sZXQgbnVtYmVyT2ZTaGlwc1N1bmtCeUFJID0gMDtcbmxldCBzdW5rU2hpcHNDaGVja2VyID0gMDtcbmxldCBpc0luaXRpYWxTaGlwU3VuayA9IGZhbHNlO1xubGV0IGlzVmVydGljYWwgPSBmYWxzZTtcbmxldCBpc1JpZ2h0ID0gdHJ1ZTtcbmxldCBpc0xlZnQgPSB0cnVlO1xubGV0IGlzRG93biA9IHRydWU7XG5cbmZ1bmN0aW9uIGdldFNtYXJ0Q1BVTW92ZSgpIHtcbiAgbGV0IG1vdmU7XG4gIHNtYXJ0TW92ZXNDb3VudGVyICs9IDE7XG4gIGlmIChpc0FIaXQpIHtcbiAgICBoaXRzQ291bnRlciArPSAxO1xuICB9XG4gIGlmIChcbiAgICAvLyBmaXJzdCBtb3ZlIGlzIGFsd2F5cyByaWdodCBpZiBhcnJheVswXSBpcyB0cnV0aHlcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1JpZ2h0WzBdICYmXG4gICAgaXNBSGl0ICYmXG4gICAgaGl0c0NvdW50ZXIgPT09IHNtYXJ0TW92ZXNDb3VudGVyXG4gICkge1xuICAgIG1vdmUgPSB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1JpZ2h0WzBdO1xuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzUmlnaHQuc2hpZnQoKTtcbiAgfSBlbHNlIGlmIChcbiAgICAoaXNSaWdodCAmJlxuICAgICAgLy8gZmlyc3QgY29uZGl0aW9uIGlzIGlmIG1vdmVSaWdodCBETkUgdXBvbiBlbnRlcmluZyBBSSBiYyBoaXRzID09PSBzbWFydE1vdmVzXG4gICAgICAhdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNSaWdodFswXSAmJlxuICAgICAgaGl0c0NvdW50ZXIgPT09IHNtYXJ0TW92ZXNDb3VudGVyICYmXG4gICAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnRbMF0pIHx8XG4gICAgLy8gc2Vjb25kIGNvbmRpdGlvbiBpcyBmb3IgdGhlIG1vdmUgaW1tZWRpYXRlbHkgYWZ0ZXIgbW92ZVJpZ2h0IG1pc3NlcywgdGh1cyBoaXRzIGFuZCBtb3ZlcyBkaWZmZXIgYnkgMVxuICAgIChpc1JpZ2h0ICYmXG4gICAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnRbMF0gJiZcbiAgICAgICFpc0FIaXQgJiZcbiAgICAgIGhpdHNDb3VudGVyID09PSBzbWFydE1vdmVzQ291bnRlciAtIDEpIHx8XG4gICAgLy8gdGhpcmQgY29uZGl0aW9uIGlzIGlmIFZNUiBiZWNvbWVzIGZhbHN5IHdpdGhvdXQgc2lua2luZyB0aGUgc2hpcCBieSBydW5uaW5nIHVwIGFnYWluc3QgcmlnaHQgZWRnZSBvZiBnYW1lYm9hcmRcbiAgICAvLyBpbiB0aGlzIGNhc2UsIGhpdHMgd2lsbCBlcXVhbCBzbWFydE1vdmVzIGFuZCBnbyBsZWZ0IHVudGlsIFZNTCBpcyBmYWxzeSBvciBhIG1pc3MgaXMgcmVnaXN0ZXJlZFxuICAgIChpc1JpZ2h0ICYmXG4gICAgICAhdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNSaWdodFswXSAmJlxuICAgICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0WzBdICYmXG4gICAgICBoaXRzQ291bnRlciA9PT0gc21hcnRNb3Zlc0NvdW50ZXIpXG4gICkge1xuICAgIG1vdmUgPSB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnRbMF07XG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0LnNoaWZ0KCk7XG4gICAgaXNSaWdodCA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKFxuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzTGVmdFswXSAmJlxuICAgIGlzQUhpdCAmJlxuICAgIGlzTGVmdCAmJlxuICAgICFpc1ZlcnRpY2FsXG4gICkge1xuICAgIC8vIGhhbmRsZXMgaWYgb25lIG9mIHRoZSBhYm92ZSBcImVsc2UgaWZcIiBjb25kaXRpb25zIHJlZ2lzdGVycyBhIGhpdCBidXQgd2lsbCBub3QgdHJpZ2dlciBvbmNlIEFJIHBlcmZvcm1zIGEgbW92ZSBkb3duXG4gICAgbW92ZSA9IHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzTGVmdFswXTtcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnQuc2hpZnQoKTtcbiAgfSBlbHNlIGlmIChcbiAgICAvLyBoYW5kbGVzIHRoZSBjYXNlIGluIHdoaWNoIHRoZXJlIGFyZSBubyB2YWxpZCBtb3ZlcyByaWdodCBvciBsZWZ0IHVwb24gZW50cnkgaW50byBBSVxuICAgICF2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnRbMF0gJiZcbiAgICAhdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNSaWdodFswXSAmJlxuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93blswXSAmJlxuICAgIC8vIGhpdHNDb3VudGVyID09PSBzbWFydE1vdmVzQ291bnRlclxuICAgIGlzTGVmdCAmJlxuICAgICFpc1ZlcnRpY2FsXG4gICkge1xuICAgIG1vdmUgPSB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0Rvd25bMF07XG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duLnNoaWZ0KCk7XG4gICAgaXNMZWZ0ID0gZmFsc2U7XG4gICAgaXNWZXJ0aWNhbCA9IHRydWU7XG4gIH0gZWxzZSBpZiAodmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duWzBdICYmICFpc0FIaXQgJiYgIWlzVmVydGljYWwpIHtcbiAgICAvLyBoYW5kbGVzIHRoZSBmaXJzdCB0aW1lIGEgbW92ZSBpcyBtYWRlIGRvd24gd2l0aCB0aGUgZXhjZXB0aW9uIG9mIHRoZSBhYm92ZSBlbHNlIGlmLCB0aHVzIHNldHRpbmcgaXNWZXJ0aWNhbCA9IHRydWVcbiAgICBtb3ZlID0gdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duWzBdO1xuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93bi5zaGlmdCgpO1xuICAgIGlzTGVmdCA9IGZhbHNlO1xuICAgIGlzVmVydGljYWwgPSB0cnVlO1xuICB9IGVsc2UgaWYgKFxuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93blswXSAmJlxuICAgIGlzQUhpdCAmJlxuICAgIGlzRG93biAmJlxuICAgIGlzVmVydGljYWxcbiAgKSB7XG4gICAgbW92ZSA9IHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93blswXTtcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0Rvd24uc2hpZnQoKTtcbiAgfSBlbHNlIGlmIChcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1VwWzBdXG4gICAgLy8gIWlzQUhpdFxuICAgIC8vIGlzVmVydGljYWxcbiAgKSB7XG4gICAgbW92ZSA9IHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzVXBbMF07XG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNVcC5zaGlmdCgpO1xuICAgIGlzRG93biA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIGJyZWFrRnJvbUFJTG9vcCgpO1xuICAgIG1vdmUgPSBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCk7XG4gIH1cbiAgcmV0dXJuIG1vdmU7XG59XG4vLyBFTkQgLS0tLS0gZ2VuZXJhdGVzIHJhbmRvbSBtb3ZlIGZvciBjb21wdXRlciAtLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBnYW1lTG9vcChwbGF5ZXJNb3ZlKSB7XG4gIGxldCBnZXRUdXJuO1xuICBsZXQgY29vcmRPZkF0dGFjaztcbiAgbGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgY29uc3QgaW5kZXhUb1NwbGljZSA9IGdldFBsYXllck1vdmVzUmVtYWluaW5nLmZpbmRJbmRleChcbiAgICAoaW5kZXgpID0+IGluZGV4ID09PSBwbGF5ZXJNb3ZlXG4gICk7XG4gIGdldFBsYXllck1vdmVzUmVtYWluaW5nLnNwbGljZShpbmRleFRvU3BsaWNlLCAxKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcbiAgICAgIGdldFR1cm4gPSB0dXJuRHJpdmVyKCk7XG4gICAgICBpZiAoZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbiAgICAgICAgY29vcmRPZkF0dGFjayA9IHBsYXllck1vdmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZE9mQXR0YWNrID0gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpO1xuICAgICAgfVxuICAgICAgY29uc3QgYXR0YWNrT3V0Y29tZSA9IHJlY2VpdmVBdHRhY2soY29vcmRPZkF0dGFjaywgZ2V0VHVybik7XG4gICAgICBjb25zb2xlLmxvZyhhdHRhY2tPdXRjb21lKTtcblxuICAgICAgaWYgKGdldFR1cm4gPT09IGBjb21wdXRlcmApIHtcbiAgICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gJiYgIWlzQUlUcmlnZ2VyZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgZmlyc3QgaGl0YCk7XG4gICAgICAgICAgaXNBSVRyaWdnZXJlZCA9IHRydWU7XG4gICAgICAgICAgc3RvcmVkR2FtZWJvYXJkc1sxXVsxXS5zaGlwcy5mbGVldC5maWx0ZXIoKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5pc1N1bmspIHtcbiAgICAgICAgICAgICAgbnVtYmVyT2ZTaGlwc1N1bmtCeUFJICs9IDE7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG51bWJlck9mU2hpcHNTdW5rQnlBSSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc3RvcmVkR2FtZWJvYXJkc1sxXVsxXS5zaGlwcy5mbGVldC5maWx0ZXIoKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgLy8gaWYgKGF0dGFja091dGNvbWVbMF0gPT09IG9iamVjdC5uYW1lICYmIG9iamVjdC5oaXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gPT09IG9iamVjdC5uYW1lKSB7XG4gICAgICAgICAgICAgIGluaXRpYWxDUFVIaXRPYmplY3QgPSBvYmplY3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFsaWRTbWFydE1vdmVzID0gZ2V0VmFsaWRBZGphY2VudENQVU1vdmVzKGF0dGFja091dGNvbWVbMV0pO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbGlkU21hcnRNb3Zlcyk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coaW5pdGlhbENQVUhpdE9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQUlUcmlnZ2VyZWQpIHtcbiAgICAgICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSkge1xuICAgICAgICAgICAgaXNBSGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGlzSW5pdGlhbFNoaXBTdW5rID0gaW5pdGlhbENQVUhpdE9iamVjdC5pc1N1bms7XG4gICAgICAgICAgICBpZiAoaXNJbml0aWFsU2hpcFN1bmspIHtcbiAgICAgICAgICAgICAgLy8gaXNBSVRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAvLyBpbml0aWFsQ1BVSGl0T2JqZWN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgLy8gaGl0c0NvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAvLyBzbWFydE1vdmVzQ291bnRlciA9IDA7XG4gICAgICAgICAgICAgIC8vIGlzSW5pdGlhbFNoaXBTdW5rID0gZmFsc2U7XG4gICAgICAgICAgICAgIC8vIG51bWJlck9mU2hpcHNTdW5rQnlBSSA9IDA7XG4gICAgICAgICAgICAgIGJyZWFrRnJvbUFJTG9vcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coc3Vua1NoaXBzQ2hlY2tlcik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhudW1iZXJPZlNoaXBzU3Vua0J5QUkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coaXNJbml0aWFsU2hpcFN1bmspO1xuICAgICAgICAgICAgLy8gaWYgKHN1bmtTaGlwc0NoZWNrZXIgIT09IG51bWJlck9mU2hpcHNTdW5rQnlBSSkge1xuICAgICAgICAgICAgLy8gICBpc0FJVHJpZ2dlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzQUhpdCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh2YWxpZFNtYXJ0TW92ZXMpO1xuICAgICAgICBnZXRWYWxpZE1vdmVzLnNwbGljZShnZXRWYWxpZE1vdmVzLmluZGV4T2YoYXR0YWNrT3V0Y29tZVsxXSksIDEpO1xuICAgICAgfVxuXG4gICAgICAvLyBjb25zb2xlLmxvZyhhdHRhY2tPdXRjb21lKTtcbiAgICAgIHJlbmRlck1vdmUoZ2V0VHVybiwgYXR0YWNrT3V0Y29tZSk7XG4gICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhhdHRhY2tPdXRjb21lKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3RvcmVkR2FtZWJvYXJkcyk7XG4gICAgICAgIHN0b3JlZEdhbWVib2FyZHMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW1bMF0gPT09IGdldFR1cm4pIHtcbiAgICAgICAgICAgIGlzR2FtZU92ZXIgPSBpdGVtWzFdLmlzR2FtZU92ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSAmJiBnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICBsZXQgaXNTaGlwU3VuaztcbiAgICAgICAgc3RvcmVkR2FtZWJvYXJkc1swXVsxXS5zaGlwcy5mbGVldC5maWx0ZXIoKG9iamVjdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSA9PT0gb2JqZWN0Lm5hbWUpIHtcbiAgICAgICAgICAgIGlzU2hpcFN1bmsgPSBvYmplY3QuaXNTdW5rO1xuICAgICAgICAgICAgaWYgKGlzU2hpcFN1bmspIHtcbiAgICAgICAgICAgICAgY29uc3QgY3B1SGlkZGVuU2hpcHMgPVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHUtc2hpcHMtcmVuZGVyZWRgKTtcbiAgICAgICAgICAgICAgY3B1SGlkZGVuU2hpcHNbaW5kZXhdLnN0eWxlLmRpc3BsYXkgPSBgYmxvY2tgO1xuICAgICAgICAgICAgICBjcHVIaWRkZW5TaGlwc1tpbmRleF0uc3R5bGUuekluZGV4ID0gYDFgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0dhbWVPdmVyKSB7XG4gICAgICAgIGNvbnN0IGdhbWVPdmVyTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjZ2FtZS1vdmVyLW1vZGFsYCk7XG4gICAgICAgIGNvbnN0IGRpc3BsYXlXaW5uZXJUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2Rpc3BsYXktd2lubmVyYCk7XG4gICAgICAgIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMoZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcpO1xuICAgICAgICBpZiAoZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbiAgICAgICAgICBkaXNwbGF5V2lubmVyVGV4dC50ZXh0Q29udGVudCA9IGBZb3Ugd2luIWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlzcGxheVdpbm5lclRleHQudGV4dENvbnRlbnQgPSBgWW91IGxvc2UhYDtcbiAgICAgICAgfVxuICAgICAgICBnYW1lT3Zlck1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGJyZWFrRnJvbUFJTG9vcCgpIHtcbiAgaXNBSVRyaWdnZXJlZCA9IGZhbHNlO1xuICBpbml0aWFsQ1BVSGl0T2JqZWN0ID0gbnVsbDtcbiAgaGl0c0NvdW50ZXIgPSAwO1xuICBzbWFydE1vdmVzQ291bnRlciA9IDA7XG4gIGlzSW5pdGlhbFNoaXBTdW5rID0gZmFsc2U7XG4gIG51bWJlck9mU2hpcHNTdW5rQnlBSSA9IDA7XG4gIGlzUmlnaHQgPSB0cnVlO1xuICBpc0xlZnQgPSB0cnVlO1xuICBpc0Rvd24gPSB0cnVlO1xuICBpc1ZlcnRpY2FsID0gZmFsc2U7XG59XG5cbmV4cG9ydCB7IHN0b3JlZEdhbWVib2FyZHMsIGdhbWVMb29wLCBjcmVhdGVQbGF5ZXJPYmplY3RzLCBoYW5kbGVTdGF0ZSB9O1xuIiwiaW1wb3J0IHsgU2hpcHMgfSBmcm9tIFwiLi9zaGlwTW9kdWxlXCI7XG5pbXBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHJlbmRlckNvbXB1dGVyU2hpcHMsIHJlbmRlclBsYXllclNoaXBzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuXG5jb25zdCBHYW1lYm9hcmQgPSAoZmxlZXRBcnJheSkgPT4ge1xuICBjb25zdCBnYW1lYm9hcmQgPSBbXG4gICAgZmxlZXRBcnJheVswXSxcbiAgICBmbGVldEFycmF5WzFdLFxuICAgIGZsZWV0QXJyYXlbMl0sXG4gICAgZmxlZXRBcnJheVszXSxcbiAgICBmbGVldEFycmF5WzRdLFxuICBdO1xuICBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBTaGlwcygpO1xuXG4gIGNvbnN0IGlzR2FtZU92ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYXJyYXkgPSBzaGlwcy5mbGVldDtcbiAgICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgIGxldCBzaGlwc1N1bmtDb3VudGVyID0gMDtcblxuICAgIGFycmF5LmZpbHRlcigob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLmlzU3Vuaykge1xuICAgICAgICBzaGlwc1N1bmtDb3VudGVyICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHNoaXBzU3Vua0NvdW50ZXIgPT09IDUpIHtcbiAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNHYW1lT3ZlcjtcbiAgfTtcblxuICByZXR1cm4geyBnYW1lYm9hcmQsIG1pc3Nlcywgc2hpcHMsIGlzR2FtZU92ZXIgfTtcbn07XG5cbmNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoYXR0YWNrQ29vcmQsIHVzZXIpID0+IHtcbiAgbGV0IGluZGV4O1xuICBsZXQgYXR0YWNrT3V0Y29tZSA9IFtudWxsLCBhdHRhY2tDb29yZF07XG4gIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgIGluZGV4ID0gMDtcbiAgfSBlbHNlIHtcbiAgICBpbmRleCA9IDE7XG4gIH1cbiAgY29uc3QgZ2FtZWJvYXJkT2JqZWN0ID0gc3RvcmVkR2FtZWJvYXJkc1tpbmRleF1bMV07XG4gIGdhbWVib2FyZE9iamVjdC5nYW1lYm9hcmQuZm9yRWFjaCgob2JqZWN0KSA9PiB7XG4gICAgaWYgKG9iamVjdC5zaGlwUGxhY2VtZW50LmluY2x1ZGVzKGF0dGFja0Nvb3JkKSkge1xuICAgICAgYXR0YWNrT3V0Y29tZSA9IFtvYmplY3QubmFtZSwgYXR0YWNrQ29vcmRdO1xuICAgIH1cbiAgfSk7XG4gIGlmICghYXR0YWNrT3V0Y29tZVswXSkge1xuICAgIGdhbWVib2FyZE9iamVjdC5taXNzZXMucHVzaChhdHRhY2tDb29yZCk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZWJvYXJkT2JqZWN0LnNoaXBzLmhpdChhdHRhY2tPdXRjb21lKTtcbiAgICBnYW1lYm9hcmRPYmplY3Quc2hpcHMuaXNTdW5rKGF0dGFja091dGNvbWVbMF0pO1xuICB9XG4gIHJldHVybiBhdHRhY2tPdXRjb21lO1xufTtcblxuLy8gQkVHSU4tLS0tLS0tLSBjcmVhdGVzIGEgcmFuZG9tbHkgcGxhY2VkIGJvYXJkcyAtLS0tLS0tIC8vXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpIHtcbiAgY29uc3QgbnVtYmVyT2ZDb29yZGluYXRlcyA9IDEwMDtcbiAgY29uc3Qgb3JpZW50YXRpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgY29uc3QgZmlyc3RDb29yZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bWJlck9mQ29vcmRpbmF0ZXMpO1xuICByZXR1cm4gW29yaWVudGF0aW9uLCBmaXJzdENvb3JkXTtcbn1cblxuZnVuY3Rpb24gb3JpZW50U2hpcChzdGFydENvb3JkLCBvcmllbnRhdGlvbiwgbmFtZSwgbGVuZ3RoKSB7XG4gIGxldCBzaGlwUGxhY2VtZW50ID0gW107XG4gIGxldCBob3Jpem9udGFsTGltaXQ7XG4gIGlmIChzdGFydENvb3JkIDwgMTApIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSA5O1xuICB9IGVsc2Uge1xuICAgIGhvcml6b250YWxMaW1pdCA9ICsoc3RhcnRDb29yZC50b1N0cmluZygpLmNoYXJBdCgwKSArIDkpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3JpZW50YXRpb24pIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpICogMTAgPCAxMDApIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpICogMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpICogMTApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSA8PSBob3Jpem9udGFsTGltaXQpIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgKyBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7IG5hbWUsIHNoaXBQbGFjZW1lbnQgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5Q29vcmRzKGFycmF5LCBvYmplY3QpIHtcbiAgY29uc3Qgc2hpcFRvVmVyaWZ5ID0gb2JqZWN0LnNoaXBQbGFjZW1lbnQ7XG4gIGxldCBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gIGlmICghYXJyYXkubGVuZ3RoKSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG4gIH0gZWxzZSB7XG4gICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwVG9WZXJpZnkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgICBpZiAoaXNQbGFjZW1lbnRWYWxpZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwLnNoaXBQbGFjZW1lbnQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNoaXBUb1ZlcmlmeVtpXSAhPT0gc2hpcC5zaGlwUGxhY2VtZW50W2pdKSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlzUGxhY2VtZW50VmFsaWQ7XG59XG5cbi8vIHVzZWQgZm9yIHRoZSBuYW1lIGFuZCBsZW5ndGggcHJvcHMgaW4gdGhlIHBsYWNlQ29tcHV0ZXJGbGVldCBmeG5cbmNvbnN0IHNoaXBDbG9uZSA9IFNoaXBzKCk7XG5cbmZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJGbGVldCh1c2VyLCBhcnJheSkge1xuICBzaGlwQ2xvbmUuZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgd2hpbGUgKCFpc1ZhbGlkKSB7XG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICBjb25zdCByYW5kb21WYWx1ZXMgPSBnZW5lcmF0ZVJhbmRvbVBsYWNlbWVudCgpO1xuICAgICAgY29uc3QgcGxhY2VtZW50ID0gb3JpZW50U2hpcChcbiAgICAgICAgcmFuZG9tVmFsdWVzWzFdLFxuICAgICAgICByYW5kb21WYWx1ZXNbMF0sXG4gICAgICAgIHNoaXAubmFtZSxcbiAgICAgICAgc2hpcC5sZW5ndGhcbiAgICAgICk7XG4gICAgICBjb25zdCB2ZXJpZnkgPSB2ZXJpZnlDb29yZHMoYXJyYXksIHBsYWNlbWVudCk7XG4gICAgICBpZiAodmVyaWZ5KSB7XG4gICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICBhcnJheS5wdXNoKHBsYWNlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKHVzZXIgPT09IGBjcHVgKSB7XG4gICAgcmVuZGVyQ29tcHV0ZXJTaGlwcyhhcnJheSk7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyUGxheWVyU2hpcHMoYXJyYXkpO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cbi8vIEVORC0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmQgZm9yIHBsYXllciAtLS0tLS0tIC8vXG5cbmV4cG9ydCB7IEdhbWVib2FyZCwgcGxhY2VDb21wdXRlckZsZWV0LCByZWNlaXZlQXR0YWNrIH07XG4iLCJpbXBvcnQgeyBnYW1lTG9vcCwgaGFuZGxlU3RhdGUgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuaW1wb3J0IHsgc2V0RHJhZ0FuZERyb3AgfSBmcm9tIFwiLi9kcmFnQW5kRHJvcFwiO1xuXG5mdW5jdGlvbiByZW5kZXJHYW1lYm9hcmQodXNlcikge1xuICBsZXQgYm9hcmREaXY7XG4gIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICAgIGJvYXJkLnNldEF0dHJpYnV0ZShgaWRgLCBgcGxheWVyLXNxdWFyZXMtY29udGFpbmVyYCk7XG4gIH0gZWxzZSB7XG4gICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gICAgYm9hcmQuc2V0QXR0cmlidXRlKGBpZGAsIGBjcHUtc3F1YXJlcy1jb250YWluZXJgKTtcbiAgfVxuICBib2FyZC5jbGFzc0xpc3QuYWRkKGBnYW1lYm9hcmRgKTtcbiAgY29uc3QgbWF4U3F1YXJlcyA9IDEwMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhTcXVhcmVzOyBpKyspIHtcbiAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBzcXVhcmUuZGF0YXNldC5pbmRleE51bWJlciA9IGk7XG4gICAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChgcGxheWVyU3F1YXJlYCk7XG4gICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChgY3B1U3F1YXJlYCk7XG4gICAgfVxuICAgIGJvYXJkLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gIH1cbiAgYm9hcmREaXYuYXBwZW5kQ2hpbGQoYm9hcmQpO1xufVxuXG5jb25zdCBwbGF5ZXJBdHRhY2sgPSAoZSkgPT4ge1xuICBjb25zdCBjb29yZGluYXRlQ2xpY2tlZCA9ICtlLnRhcmdldC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICBnYW1lTG9vcChjb29yZGluYXRlQ2xpY2tlZCk7XG4gIGUudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbn07XG5cbnJlbmRlckdhbWVib2FyZChgY3B1YCk7XG5cbmZ1bmN0aW9uIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMoYXJyYXkpIHtcbiAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5wbGF5ZXJTcXVhcmVgKTtcbiAgYXJyYXkuZm9yRWFjaCgoaW5kZXgpID0+IHtcbiAgICBzcXVhcmVzW2luZGV4XS5yZW1vdmVFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJNb3ZlKHdob3NlVHVybiwgYXR0YWNrQXJyYXkpIHtcbiAgLy8gY29uc29sZS5sb2coeyB3aG9zZVR1cm4sIGF0dGFja0FycmF5IH0pO1xuICBsZXQgc3F1YXJlcztcbiAgY29uc3QgaGl0SW5kZXggPSBhdHRhY2tBcnJheVsxXTtcbiAgaWYgKHdob3NlVHVybiA9PT0gYHBsYXllcmApIHtcbiAgICBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICB9IGVsc2Uge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG4gIH1cbiAgaWYgKGF0dGFja0FycmF5WzBdKSB7XG4gICAgc3F1YXJlc1toaXRJbmRleF0uY2xhc3NMaXN0LmFkZChgaGl0YCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlc1toaXRJbmRleF0uY2xhc3NMaXN0LmFkZChgbWlzc2ApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckNvbXB1dGVyU2hpcHMoY3B1RmxlZXQpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gIGxldCBpbWdTcmM7XG5cbiAgY3B1RmxlZXQuZm9yRWFjaCgoc2hpcE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGBjcHUtc2hpcHMtcmVuZGVyZWRgKTtcbiAgICBjb25zdCBzaGlwSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBpbWdgKTtcbiAgICBpZiAoc2hpcE9iamVjdC5uYW1lID09PSBgUGF0cm9sIEJvYXRgKSB7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzL3BhdHJvbC5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYHBhdHJvbGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXBPYmplY3QubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy8ke3NoaXBOYW1lfS5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYCR7c2hpcE5hbWV9YCk7XG4gICAgfVxuICAgIHNoaXBJbWFnZS5zcmMgPSBpbWdTcmM7XG5cbiAgICBjb25zdCBzb3J0QXNjZW5kaW5nID0gc2hpcE9iamVjdC5zaGlwUGxhY2VtZW50LnNvcnQoKHgsIHkpID0+IHggLSB5KTtcbiAgICBjb25zdCBkaW1lbnNpb25PZlNxdWFyZSA9IDM1O1xuICAgIGxldCB0b3BPZmZzZXQ7XG4gICAgbGV0IGxlZnRPZmZzZXQ7XG4gICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gKyAxID09PSBzb3J0QXNjZW5kaW5nWzFdKSB7XG4gICAgICAvLyBwbGFjZSBob3Jpem9udGFsIHNoaXBzXG4gICAgICB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9IHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwbGFjZSB2ZXJ0aWNhbCBzaGlwc1xuICAgICAgc2hpcEltYWdlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoLTkwZGVnKWA7XG4gICAgICB0b3BPZmZzZXQgPVxuICAgICAgICBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSArXG4gICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgIHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcEltYWdlLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGA7XG4gICAgc2hpcEltYWdlLnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgICBwbGF5ZXJCb2FyZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9KTtcbiAgcmVuZGVyR2FtZWJvYXJkKGBwbGF5ZXJgKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyUGxheWVyU2hpcHMoZmxlZXQpIHtcbiAgaWYgKGZsZWV0WzBdLnNoaXBQbGFjZW1lbnRbMF0gPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBmbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYHBsYXllci1zaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYGludmFsaWRgKTtcbiAgICBzaGlwSW1hZ2Uuc3JjID0gaW1nU3JjO1xuXG4gICAgY29uc3Qgc29ydEFzY2VuZGluZyA9IHNoaXBPYmplY3Quc2hpcFBsYWNlbWVudC5zb3J0KCh4LCB5KSA9PiB4IC0geSk7XG4gICAgY29uc3QgZGltZW5zaW9uT2ZTcXVhcmUgPSAzNTtcbiAgICBsZXQgdG9wT2Zmc2V0O1xuICAgIGxldCBsZWZ0T2Zmc2V0O1xuICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdICsgMSA9PT0gc29ydEFzY2VuZGluZ1sxXSkge1xuICAgICAgLy8gcGxhY2UgaG9yaXpvbnRhbCBzaGlwc1xuICAgICAgdG9wT2Zmc2V0ID0gTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgLSAzNTA7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGxhY2UgdmVydGljYWwgc2hpcHNcbiAgICAgIHNoaXBJbWFnZS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKC05MGRlZylgO1xuICAgICAgdG9wT2Zmc2V0ID1cbiAgICAgICAgTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgK1xuICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1IC1cbiAgICAgICAgMzUwO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBJbWFnZS5zdHlsZS50b3AgPSBgJHt0b3BPZmZzZXR9cHhgO1xuICAgIHNoaXBJbWFnZS5zdHlsZS5sZWZ0ID0gYCR7bGVmdE9mZnNldH1weGA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gICAgY3B1Qm9hcmQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyQm9hcmRzKGUpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gIGNvbnN0IHBsYXllclNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLXNxdWFyZXMtY29udGFpbmVyYCk7XG4gIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICBjb25zdCBwbGFjZVNoaXBzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYWNlLXNoaXBzLWNvbnRhaW5lcmApO1xuICBjb25zdCBzaGlwc09uQ1BVQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyLXNoaXBzLXJlbmRlcmVkYCk7XG4gIGNvbnN0IHNoaXBzT25QbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHUtc2hpcHMtcmVuZGVyZWRgKTtcbiAgY29uc3QgcmVtYWluaW5nU2hpcHNUb1BsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnNoaXBzLXRvLXBsYWNlYCk7XG5cbiAgY29uc3QgY3B1Qm9hcmRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdVNxdWFyZWApO1xuICBjcHVCb2FyZFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGBgO1xuICB9KTtcblxuICBwbGF5ZXJCb2FyZC5yZW1vdmVDaGlsZChwbGF5ZXJTcXVhcmVzKTtcbiAgcmVtb3ZlRWxlbWVudHMoY3B1Qm9hcmQsIHNoaXBzT25DUFVCb2FyZCk7XG4gIHJlbW92ZUVsZW1lbnRzKHBsYXllckJvYXJkLCBzaGlwc09uUGxheWVyQm9hcmQpO1xuICByZW1vdmVFbGVtZW50cyhwbGFjZVNoaXBzQ29udGFpbmVyLCByZW1haW5pbmdTaGlwc1RvUGxhY2UpO1xuICByZWRpc3BsYXlTaGlwc1RvUGxhY2UocGxhY2VTaGlwc0NvbnRhaW5lcik7XG4gIHNldERyYWdBbmREcm9wLnNldFVwU2hpcHNUb0RyYWdBbmREcm9wKCk7XG4gIGhhbmRsZVN0YXRlKCk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUVsZW1lbnRzKHBhcmVudCwgY2hpbGRyZW4pIHtcbiAgaWYgKGNoaWxkcmVuKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkcmVuW2ldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHBhcmVudC5maXJzdENoaWxkKSB7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZWRpc3BsYXlTaGlwc1RvUGxhY2UocGFyZW50KSB7XG4gIGNvbnN0IG5hbWVIZWxwZXIgPSBbXG4gICAgYGNhcnJpZXJgLFxuICAgIGBiYXR0bGVzaGlwYCxcbiAgICBgZGVzdHJveWVyYCxcbiAgICBgc3VibWFyaW5lYCxcbiAgICBgcGF0cm9sYCxcbiAgXTtcbiAgbmFtZUhlbHBlci5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgc2hpcEltYWdlLnNyYyA9IGAuL2ltZ3MvJHtzaGlwfS5wbmdgO1xuICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXB9YCk7XG4gICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYHNoaXBzLXRvLXBsYWNlYCk7XG4gICAgc2hpcEltYWdlLnNldEF0dHJpYnV0ZShgaWRgLCBgcGxheWVyLSR7c2hpcH1gKTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7XG4gIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMsXG4gIHJlbmRlck1vdmUsXG4gIHJlbmRlckNvbXB1dGVyU2hpcHMsXG4gIHJlbmRlclBsYXllclNoaXBzLFxuICBjbGVhckJvYXJkcyxcbn07XG4iLCJjb25zdCBTaGlwcyA9ICgpID0+IHtcbiAgY29uc3QgZmxlZXQgPSBbXG4gICAgeyBuYW1lOiBgQ2FycmllcmAsIGxlbmd0aDogNSwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBCYXR0bGVzaGlwYCwgbGVuZ3RoOiA0LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYERlc3Ryb3llcmAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBTdWJtYXJpbmVgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgUGF0cm9sIEJvYXRgLCBsZW5ndGg6IDIsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gIF07XG5cbiAgY29uc3QgaGl0ID0gKGF0dGFja0RhdGEpID0+IHtcbiAgICBjb25zdCBzaGlwSGl0ID0gYXR0YWNrRGF0YVswXTtcbiAgICBjb25zdCBjb29yZE9mSGl0ID0gYXR0YWNrRGF0YVsxXTtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lKSB7XG4gICAgICAgIHNoaXAuaGl0cy5wdXNoKGNvb3JkT2ZIaXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9IChzaGlwSGl0KSA9PiB7XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSAmJiBzaGlwLmxlbmd0aCA9PT0gc2hpcC5oaXRzLmxlbmd0aCkge1xuICAgICAgICBzaGlwLmlzU3VuayA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgZmxlZXQsIGhpdCwgaXNTdW5rIH07XG59O1xuXG5leHBvcnQgeyBTaGlwcyB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2RyYWdBbmREcm9wXCI7XG5cbmNvbnN0IG5ld0dhbWVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjbmV3LWdhbWUtYnRuYCk7XG5uZXdHYW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgKCkgPT4gbG9jYXRpb24ucmVsb2FkKCkpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==