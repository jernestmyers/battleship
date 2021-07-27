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
  const movesRight = [];
  getValidMoves.slice(getIndex).filter((item, index) => {
    if (item - hit - index === 0 && item < (Math.floor(hit / 10) + 1) * 10) {
      movesRight.push(item);
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
  const verticalMoves = [];
  getValidMoves.filter((coord) => {
    if (hit % 10 === coord % 10) {
      verticalMoves.push(coord);
    }
  });
  console.log(verticalMoves);
  const movesDown = [];
  verticalMoves.slice(verticalMoves.indexOf(hit)).filter((coord, index) => {
    if (coord - hit - index * 10 === 0) {
      movesDown.push(coord);
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
  } else if (!isAdjacentShipHit) {
    // console.log(`begin smart move`);
    cpuMove = getSmartCPUMove();
    // getValidMoves.splice(getValidMoves.indexOf(cpuMove), 1);
  }
  // else if (isAdjacentShipHit) {
  // }
  return cpuMove;
}

let isAdjacentShipHit = false;
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
let hitsDuringAI = [];
let initialCPUHitCoordinates;

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
      isLeft &&
      // first condition is if moveRight DNE upon entering AI bc hits === smartMoves
      !validSmartMoves.validMovesRight[0] &&
      hitsCounter === smartMovesCounter &&
      validSmartMoves.validMovesLeft[0]) ||
    // second condition is for the move immediately after moveRight misses, thus hits and moves differ by 1
    (isRight &&
      isLeft &&
      validSmartMoves.validMovesLeft[0] &&
      !isAHit &&
      hitsCounter === smartMovesCounter - 1) ||
    // third condition is if VMR becomes falsy without sinking the ship by running up against right edge of gameboard
    // in this case, hits will equal smartMoves and go left until VML is falsy or a miss is registered
    (isRight &&
      isLeft &&
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
  } else if (
    !validSmartMoves.validMovesLeft[0] &&
    validSmartMoves.validMovesDown[0] &&
    isAHit &&
    isLeft
  ) {
    console.log(`left edge case`);
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
    isLeft = false;
  } else if (
    validSmartMoves.validMovesUp[0]
    // !isAHit
    // isVertical
  ) {
    move = validSmartMoves.validMovesUp[0];
    validSmartMoves.validMovesUp.shift();
    isLeft = false;
    isDown = false;
    isVertical = true;
  } else {
    breakFromAILoop();
    move = generateComputerAttack();
  }
  return move;
}
// END ----- generates move for computer ----------- //

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
          storedGameboards[1][1].gameboard.filter((object) => {
            if (attackOutcome[0] === object.name) {
              console.log(object.shipPlacement);
              initialCPUHitCoordinates = object.shipPlacement;
            }
          });
          validSmartMoves = getValidAdjacentCPUMoves(attackOutcome[1]);
          console.log(validSmartMoves);
          console.log(initialCPUHitObject);
        }
        if (isAITriggered) {
          if (attackOutcome[0]) {
            hitsDuringAI.push(attackOutcome[1]);
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
            // console.log(sunkShipsChecker);
            // console.log(numberOfShipsSunkByAI);
            // console.log(isInitialShipSunk);
            console.log(hitsDuringAI);
            console.log(initialCPUHitCoordinates);
            // console.log(storedGameboards[1][1].gameboard);
            // if (sunkShipsChecker !== numberOfShipsSunkByAI) {
            //   isAITriggered = false;
            // }
          } else {
            isAHit = false;
          }
        }
        // console.log(validSmartMoves);
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
  // if (hitsDuringAI.length === initialCPUHitObject.length) {
  console.log(`nothing adjacent hit`);
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
  // }
  initialCPUHitCoordinates.forEach((coord, index) => {
    if (hitsDuringAI.includes(coord)) {
      console.log(coord);
      hitsDuringAI.splice(hitsDuringAI.indexOf(coord), 1);
      console.log(hitsDuringAI);
    }
  });
  if (hitsDuringAI.length !== 0) {
    initializeAI(hitsDuringAI[0]);
  }
}

function initializeAI(adjacentHit) {
  storedGameboards[1][1].gameboard.filter((object) => {
    if (object.shipPlacement.includes(adjacentHit)) {
      initialCPUHitObject = object;
      initialCPUHitCoordinates = object.shipPlacement;
    }
  });
  console.log(initialCPUHitObject);
  console.log(initialCPUHitCoordinates);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RyYWdBbmREcm9wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZW5kZXJHYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9EO0FBQ1U7O0FBRTlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGlFQUFtQjtBQUN6QjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUEscUNBQXFDLG9EQUFXO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxQ0FBcUM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFDQUFxQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQ0FBcUM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUNBQXFDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsdUJBQXVCLHFDQUFxQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxRQUFRLDhEQUFpQjtBQUN6QjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsQ0FBQzs7QUFFeUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZUaUQ7QUFDRztBQUMvQjs7QUFFL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRSx5RUFBK0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDhEQUFrQjtBQUN4QztBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLHFEQUFTO0FBQy9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3Qiw4REFBa0I7QUFDMUMsd0JBQXdCLHFEQUFTO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esa0JBQWtCLGFBQWE7QUFDL0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsVUFBVTtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QXdEO0FBQzdELEtBQUssMERBQTBEO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsVUFBVTtBQUNWOztBQUVpQjs7Ozs7OztVQzlCakI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOdUI7O0FBRXZCO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVBsYXllck9iamVjdHMgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuaW1wb3J0IHsgcmVuZGVyUGxheWVyU2hpcHMsIGNsZWFyQm9hcmRzIH0gZnJvbSBcIi4vcmVuZGVyR2FtZVwiO1xuXG5jb25zdCBzZXREcmFnQW5kRHJvcCA9IChmdW5jdGlvbiAoKSB7XG4gIGxldCBwbGF5ZXJGbGVldCA9IFtdO1xuXG4gIGNvbnN0IHNoaXBOYW1lcyA9IFtcbiAgICBgQ2FycmllcmAsXG4gICAgYEJhdHRsZXNoaXBgLFxuICAgIGBEZXN0cm95ZXJgLFxuICAgIGBTdWJtYXJpbmVgLFxuICAgIGBQYXRyb2wgQm9hdGAsXG4gIF07XG4gIGNvbnN0IHNoaXBMZW5ndGhzID0gWzUsIDQsIDMsIDMsIDJdO1xuICBsZXQgc2hpcENvb3JkcyA9IFtdO1xuXG4gIGNvbnN0IGNwdUdhbWVCb2FyZFRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZC1oZWFkZXJgKTtcbiAgY29uc3QgY3B1Qm9hcmRTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdVNxdWFyZWApO1xuXG4gIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNidG4tcm90YXRlLXNoaXBgKTtcbiAgY29uc3QgY2xlYXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY2xlYXItYm9hcmQtYnRuYCk7XG4gIGNvbnN0IHJhbmRvbWl6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNyYW5kb21pemUtcGxheWVyLWZsZWV0YCk7XG5cbiAgY29uc3QgcGxhY2VTaGlwc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGFjZS1zaGlwcy1jb250YWluZXJgKTtcbiAgY29uc3QgcGxheWVyU2hpcENvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgIGAucGxheWVyLXNoaXBzLWNvbnRhaW5lcmBcbiAgKTtcbiAgbGV0IHNoaXBJbWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnNoaXBzLXRvLXBsYWNlYCk7XG5cbiAgZnVuY3Rpb24gaGlkZVNoaXBzVG9QbGFjZSgpIHtcbiAgICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoYGhpZGUtc2hpcGApO1xuICAgIH0pO1xuICAgIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICB9XG5cbiAgLy8gaGlkZXMgYWxsIGJ1dCB0aGUgY2FycmllciBvbiBwYWdlIGxvYWRcbiAgZnVuY3Rpb24gc2V0VXBTaGlwc1RvRHJhZ0FuZERyb3AoKSB7XG4gICAgcGxheWVyRmxlZXQgPSBbXTtcbiAgICBzaGlwSW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuICAgIHNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4gICAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoYG1vdXNlZG93bmAsIGJlZ2luU2hpcFBsYWNlbWVudCk7XG4gICAgICBpZiAoaW5kZXggIT09IDApIHtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKGBoaWRlLXNoaXBgKTtcbiAgICAgIH1cbiAgICAgIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihgbW91c2Vkb3duYCwgYmVnaW5TaGlwUGxhY2VtZW50KTtcbiAgICAgIHNoaXAuc3R5bGUuY3Vyc29yID0gYGdyYWJgO1xuICAgICAgc2hpcC5vbmRyYWdzdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICByYW5kb21pemVCdG4uc3R5bGUuZGlzcGxheSA9IGBmbGV4YDtcbiAgICBjbGVhckJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICB9XG4gIHNldFVwU2hpcHNUb0RyYWdBbmREcm9wKCk7XG5cbiAgLy8gbGFiZWxzIHRoZSBjb21wdXRlciBnYW1lYm9hcmQgb24gcGFnZSBsb2FkXG4gIGNwdUdhbWVCb2FyZFRpdGxlLnRleHRDb250ZW50ID0gYFBMQUNFIFlPVVIgU0hJUFNgO1xuXG4gIC8vIHN0YXJ0IGdhbWUgYnV0dG9uXG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3N0YXJ0LWdhbWUtYnRuYCk7XG4gIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgYmVnaW5HYW1lKTtcblxuICBmdW5jdGlvbiBiZWdpbkdhbWUoKSB7XG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gICAgY3B1R2FtZUJvYXJkVGl0bGUudGV4dENvbnRlbnQgPSBgQ29tcHV0ZXJgO1xuICAgIHBsYXllckJvYXJkLnN0eWxlLmRpc3BsYXkgPSBgYmxvY2tgO1xuICAgIHBsYWNlU2hpcHNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgICBpZiAocGxheWVyRmxlZXQubGVuZ3RoID09PSA1KSB7XG4gICAgICBjcmVhdGVQbGF5ZXJPYmplY3RzKHBsYXllckZsZWV0KTtcbiAgICAgIGNwdUJvYXJkU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbiAgICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGBgO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBjbGVhckJvYXJkcyk7XG4gIHJvdGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHJvdGF0ZVNoaXApO1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZVNoaXAoZSkge1xuICAgIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlID0gYC05MGRlZ2A7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9XG4gICAgICAgIDEwMCArICgoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpIC8gMikgKiAzNSArIGBweGA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlID0gYGA7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9IDEwMCArIGBweGA7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYmVnaW5TaGlwUGxhY2VtZW50KGV2ZW50KSB7XG4gICAgLy8gKDEpIHByZXBhcmUgdG8gbW92ZSBlbGVtZW50OiBtYWtlIGFic29sdXRlIGFuZCBvbiB0b3AgYnkgei1pbmRleFxuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS56SW5kZXggPSAxMDAwO1xuXG4gICAgLy8gbW92ZSBpdCBvdXQgb2YgYW55IGN1cnJlbnQgcGFyZW50cyBkaXJlY3RseSBpbnRvIGNwdUJvYXJkXG4gICAgcGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5hcHBlbmQoXG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdXG4gICAgKTtcblxuICAgIC8vIGNlbnRlcnMgdGhlIGN1cnNvciBpbiB0aGUgZmlyc3QgXCJzcXVhcmVcIiBvZiB0aGUgc2hpcCBpbWFnZVxuICAgIGZ1bmN0aW9uIG1vdmVBdChwYWdlWCwgcGFnZVkpIHtcbiAgICAgIGlmICghc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5sZWZ0ID1cbiAgICAgICAgICBwYWdlWCAtXG4gICAgICAgICAgKHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCArXG4gICAgICAgICAgICAxNy41KSArXG4gICAgICAgICAgXCJweFwiO1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9XG4gICAgICAgICAgcGFnZVkgLVxuICAgICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGhdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkgK1xuICAgICAgICAgICAgMTcuNSkgK1xuICAgICAgICAgIFwicHhcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUubGVmdCA9XG4gICAgICAgICAgcGFnZVggLVxuICAgICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGhdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggK1xuICAgICAgICAgICAgKChzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgICAgMTcuNSArXG4gICAgICAgICAgXCJweFwiO1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9XG4gICAgICAgICAgcGFnZVkgLVxuICAgICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGhdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnkgLVxuICAgICAgICAgICAgKChzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdIC0gMSkgLyAyKSAqIDM1KSAtXG4gICAgICAgICAgMTcuNSArXG4gICAgICAgICAgXCJweFwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG1vdmUgb3VyIGFic29sdXRlbHkgcG9zaXRpb25lZCBjYXJyaWVyIHVuZGVyIHRoZSBwb2ludGVyXG4gICAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbiAgICAvLyBwb3RlbnRpYWwgZHJvcHBhYmxlIHRoYXQgd2UncmUgZmx5aW5nIG92ZXIgcmlnaHQgbm93XG4gICAgbGV0IGN1cnJlbnREcm9wcGFibGUgPSBudWxsO1xuICAgIGxldCBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG4gICAgbGV0IGlzRHJvcFZhbGlkO1xuXG4gICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5oaWRkZW4gPSB0cnVlO1xuICAgICAgbGV0IGVsZW1CZWxvdyA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG5cbiAgICAgIGlmICghZWxlbUJlbG93KSByZXR1cm47XG5cbiAgICAgIC8vIEJFR0lOIC0tLS0gY2hlY2tzIHZhbGlkaXR5IG9mIHRoZSBkcm9wXG4gICAgICBsZXQgYXJyYXlPZkVsZW1lbnRzQmVsb3dUb0NoZWNrVmFsaWRpdHkgPSBbXTtcbiAgICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LnNoaWZ0KCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICBsZXQgZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHk7XG4gICAgICAgIGlmIChzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICAgIGdldENsYXNzVG9DaGVja1ZhbGlkaXR5ID0gZG9jdW1lbnRcbiAgICAgICAgICAgIC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgKyBpICogMzUpXG4gICAgICAgICAgICAuZ2V0QXR0cmlidXRlKGBjbGFzc2ApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdldENsYXNzVG9DaGVja1ZhbGlkaXR5ID0gZG9jdW1lbnRcbiAgICAgICAgICAgIC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFggKyBpICogMzUsIGV2ZW50LmNsaWVudFkpXG4gICAgICAgICAgICAuZ2V0QXR0cmlidXRlKGBjbGFzc2ApO1xuICAgICAgICB9XG4gICAgICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LnB1c2goZ2V0Q2xhc3NUb0NoZWNrVmFsaWRpdHkpO1xuICAgICAgICBpZiAoYXJyYXlPZkVsZW1lbnRzQmVsb3dUb0NoZWNrVmFsaWRpdHlbMF0pIHtcbiAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgYXJyYXlPZkVsZW1lbnRzQmVsb3dUb0NoZWNrVmFsaWRpdHkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKChpdGVtICYmIGl0ZW0uaW5jbHVkZXMoYGludmFsaWRgKSkgfHwgaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGNvdW50ZXIpIHtcbiAgICAgICAgICAgIGlzRHJvcFZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzRHJvcFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEVORCAtLS0tIGNoZWNrcyB2YWxpZGl0eSBvZiB0aGUgZHJvcFxuXG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLmhpZGRlbiA9IGZhbHNlO1xuXG4gICAgICAvLyBwb3RlbnRpYWwgZHJvcHBhYmxlcyBhcmUgdGhlIHNxdWFyZXMgb24gdGhlIGdhbWVib2FyZFxuICAgICAgZHJvcHBhYmxlQmVsb3cgPSBlbGVtQmVsb3cuY2xvc2VzdChcIi5jcHVTcXVhcmVcIik7XG5cbiAgICAgIGlmICghZHJvcHBhYmxlQmVsb3cgfHwgIWlzRHJvcFZhbGlkKSB7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuY3Vyc29yID0gYG5vLWRyb3BgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5jdXJzb3IgPSBgZ3JhYmJpbmdgO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudERyb3BwYWJsZSAhPSBkcm9wcGFibGVCZWxvdykge1xuICAgICAgICBpZiAoY3VycmVudERyb3BwYWJsZSkge1xuICAgICAgICAgIGxlYXZlRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50RHJvcHBhYmxlID0gZHJvcHBhYmxlQmVsb3c7XG4gICAgICAgIGlmIChjdXJyZW50RHJvcHBhYmxlKSB7XG4gICAgICAgICAgZW50ZXJEcm9wcGFibGVBcmVhKGN1cnJlbnREcm9wcGFibGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW50ZXJEcm9wcGFibGVBcmVhKGVsZW1lbnQpIHtcbiAgICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICAgIGNvbnN0IGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ID0gK2VsZW1lbnQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgICAgIGNvbnN0IG1heEhvcml6b250YWwgPSAoTWF0aC5mbG9vcihpbmRleE9mSW5pdGlhbERyb3BQb2ludCAvIDEwKSArIDEpICogMTA7XG4gICAgICBjb25zdCBtYXhWZXJ0aWNhbCA9XG4gICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50IC1cbiAgICAgICAgTWF0aC5mbG9vcihpbmRleE9mSW5pdGlhbERyb3BQb2ludCAvIDEwKSAqIDEwICtcbiAgICAgICAgOTA7XG4gICAgICBpZiAoXG4gICAgICAgICFzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSAmJlxuICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIChzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdIC0gMSkgPFxuICAgICAgICAgIG1heEhvcml6b250YWwgJiZcbiAgICAgICAgaXNEcm9wVmFsaWRcbiAgICAgICkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXSkge1xuICAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbiAgICAgICAgICAgICAgXCIjODI5RTc2XCI7XG4gICAgICAgICAgICBzaGlwQ29vcmRzLnB1c2goaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlICYmXG4gICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAqIDEwIDw9XG4gICAgICAgICAgbWF4VmVydGljYWwgJiZcbiAgICAgICAgaXNEcm9wVmFsaWRcbiAgICAgICkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBdKSB7XG4gICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXG4gICAgICAgICAgICBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzgyOUU3NlwiO1xuICAgICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRyb3BwYWJsZUJlbG93ID0gbnVsbDtcbiAgICAgICAgc2hpcENvb3JkcyA9IFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxlYXZlRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4gICAgICBzaGlwQ29vcmRzID0gW107XG4gICAgICBjb25zdCBpbmRleE9mSW5pdGlhbERyb3BQb2ludCA9ICtlbGVtZW50LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4gICAgICBpZiAoIXNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldKSB7XG4gICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuICAgICAgICAgICAgICBcIiNjMWMxYzFcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXTsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMF0pIHtcbiAgICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tcbiAgICAgICAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBcbiAgICAgICAgICAgIF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjYzFjMWMxXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gKDIpIG1vdmUgdGhlIHNoaXAgb24gbW91c2Vtb3ZlXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG5cbiAgICAvLyAoMykgZHJvcCB0aGUgc2hpcCwgcmVtb3ZlIHVubmVlZGVkIGhhbmRsZXJzXG4gICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5vbm1vdXNldXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0ub25tb3VzZXVwID0gbnVsbDtcbiAgICAgIGlmIChzaGlwQ29vcmRzLmxlbmd0aCAhPT0gMCAmJiBkcm9wcGFibGVCZWxvdyAmJiBpc0Ryb3BWYWxpZCkge1xuICAgICAgICBwbGF5ZXJGbGVldC5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBzaGlwTmFtZXNbcGxheWVyRmxlZXQubGVuZ3RoXSxcbiAgICAgICAgICBzaGlwUGxhY2VtZW50OiBzaGlwQ29vcmRzLFxuICAgICAgICB9KTtcbiAgICAgICAgcGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoIC0gMV0ucmVtb3ZlQ2hpbGQoXG4gICAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoIC0gMV1cbiAgICAgICAgKTtcbiAgICAgICAgcmVuZGVyUGxheWVyU2hpcHMoW3BsYXllckZsZWV0W3BsYXllckZsZWV0Lmxlbmd0aCAtIDFdXSk7XG4gICAgICAgIGNwdUJvYXJkU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbiAgICAgICAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYCNjMWMxYzFgO1xuICAgICAgICB9KTtcbiAgICAgICAgc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoaW5kZXggPT09IHBsYXllckZsZWV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKGBoaWRlLXNoaXBgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocGxheWVyRmxlZXQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgcmFuZG9taXplQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZSBgO1xuICAgICAgICAgIGNsZWFyQnRuLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxheWVyRmxlZXQubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgc3RhcnRCdG4uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICAgIGNsZWFyQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gICAgICAgICAgcm90YXRlQnRuLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYWNlU2hpcHNDb250YWluZXIuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0sXG4gICAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoICsgMV1cbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlKSB7XG4gICAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgPSBgYDtcbiAgICAgICAgfVxuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnRvcCA9IFwiMTAwcHhcIjtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS56SW5kZXggPSAwO1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmN1cnNvciA9IGBncmFiYDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIHJldHVybiB7IGhpZGVTaGlwc1RvUGxhY2UsIHNldFVwU2hpcHNUb0RyYWdBbmREcm9wLCBiZWdpblNoaXBQbGFjZW1lbnQgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IHNldERyYWdBbmREcm9wIH07XG4iLCJpbXBvcnQgeyBHYW1lYm9hcmQsIHBsYWNlQ29tcHV0ZXJGbGVldCwgcmVjZWl2ZUF0dGFjayB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IHsgcmVuZGVyTW92ZSwgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcbmltcG9ydCB7IHNldERyYWdBbmREcm9wIH0gZnJvbSBcIi4vZHJhZ0FuZERyb3BcIjtcblxuY29uc3Qgc3RvcmVkR2FtZWJvYXJkcyA9IFtdO1xuXG5sZXQgdHVybkNvdW50ZXIgPSAxO1xuZnVuY3Rpb24gdHVybkRyaXZlcigpIHtcbiAgbGV0IHdob3NlTW92ZTtcbiAgaWYgKHR1cm5Db3VudGVyICUgMiAhPT0gMCkge1xuICAgIHdob3NlTW92ZSA9IGBwbGF5ZXJgO1xuICB9IGVsc2Uge1xuICAgIHdob3NlTW92ZSA9IGBjb21wdXRlcmA7XG4gIH1cbiAgdHVybkNvdW50ZXIgKz0gMTtcbiAgcmV0dXJuIHdob3NlTW92ZTtcbn1cblxuY29uc3QgcmFuZG9taXplUGxheWVyRmxlZXRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICBgI3JhbmRvbWl6ZS1wbGF5ZXItZmxlZXRgXG4pO1xucmFuZG9taXplUGxheWVyRmxlZXRCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCByYW5kb21pemVQbGF5ZXJGbGVldCk7XG5cbmZ1bmN0aW9uIHJhbmRvbWl6ZVBsYXllckZsZWV0KCkge1xuICBzZXREcmFnQW5kRHJvcC5oaWRlU2hpcHNUb1BsYWNlKCk7XG4gIGNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3N0YXJ0LWdhbWUtYnRuYCk7XG4gIHN0YXJ0QnRuLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgaWYgKHN0b3JlZEdhbWVib2FyZHNbMV0pIHtcbiAgICBzdG9yZWRHYW1lYm9hcmRzLnBvcCgpO1xuICAgIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICAgIGNvbnN0IHJlbmRlcmVkUGxheWVyU2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYC5wbGF5ZXItc2hpcHMtcmVuZGVyZWRgXG4gICAgKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgY3B1Qm9hcmQucmVtb3ZlQ2hpbGQocmVuZGVyZWRQbGF5ZXJTaGlwc1tpXSk7XG4gICAgfVxuICB9XG4gIGNvbnN0IHBsYXllckZsZWV0QXJyYXkgPSBbXTtcbiAgY29uc3QgcGxheWVyRmxlZXQgPSBwbGFjZUNvbXB1dGVyRmxlZXQoYHVzZXJgLCBwbGF5ZXJGbGVldEFycmF5KTtcbiAgY3JlYXRlUGxheWVyT2JqZWN0cyhwbGF5ZXJGbGVldCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBsYXllck9iamVjdHMoZmxlZXQpIHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lYm9hcmQoZmxlZXQpO1xuICBzdG9yZWRHYW1lYm9hcmRzLnB1c2goW2Bjb21wdXRlcmAsIHBsYXllckJvYXJkXSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXB1dGVyT2JqZWN0cygpIHtcbiAgY29uc3QgY3B1RmxlZXRBcnJheSA9IFtdO1xuICBjb25zdCBjb21wdXRlckZsZWV0ID0gcGxhY2VDb21wdXRlckZsZWV0KGBjcHVgLCBjcHVGbGVldEFycmF5KTtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IEdhbWVib2FyZChjb21wdXRlckZsZWV0KTtcbiAgc3RvcmVkR2FtZWJvYXJkcy5wdXNoKFtgcGxheWVyYCwgY29tcHV0ZXJCb2FyZF0pO1xufVxuY3JlYXRlQ29tcHV0ZXJPYmplY3RzKCk7XG5cbmxldCBnZXRWYWxpZE1vdmVzID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG5sZXQgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcgPSBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKTtcblxuZnVuY3Rpb24gaGFuZGxlU3RhdGUoKSB7XG4gIGlmIChzdG9yZWRHYW1lYm9hcmRzLmxlbmd0aCA9PT0gMikge1xuICAgIHN0b3JlZEdhbWVib2FyZHMuc2hpZnQoKTtcbiAgfVxuICBzdG9yZWRHYW1lYm9hcmRzLnNoaWZ0KCk7XG4gIGNyZWF0ZUNvbXB1dGVyT2JqZWN0cygpO1xuICBnZXRWYWxpZE1vdmVzID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG4gIGdldFBsYXllck1vdmVzUmVtYWluaW5nID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG59XG5cbi8vIEJFR0lOIC0tLS0tIGdlbmVyYXRlcyByYW5kb20gbW92ZSBmb3IgY29tcHV0ZXIgLS0tLS0tLS0tLS0gLy9cbmZ1bmN0aW9uIGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpIHtcbiAgY29uc3QgdmFsaWRNb3ZlcyA9IFtdO1xuICBjb25zdCBtYXhNb3ZlcyA9IDEwMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhNb3ZlczsgaSsrKSB7XG4gICAgdmFsaWRNb3Zlcy5wdXNoKGkpO1xuICB9XG4gIHJldHVybiB2YWxpZE1vdmVzO1xufVxuXG4vLyBmdW5jdGlvbiBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCkge1xuLy8gICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdldFZhbGlkTW92ZXMubGVuZ3RoKTtcbi8vICAgY29uc3QgcmFuZG9tTW92ZSA9IGdldFZhbGlkTW92ZXNbcmFuZG9tSW5kZXhdO1xuLy8gICBnZXRWYWxpZE1vdmVzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4vLyAgIHJldHVybiByYW5kb21Nb3ZlO1xuLy8gfVxuXG5sZXQgaXNBSVRyaWdnZXJlZCA9IGZhbHNlO1xubGV0IGluaXRpYWxDUFVIaXRPYmplY3Q7XG5sZXQgdmFsaWRTbWFydE1vdmVzO1xuXG5mdW5jdGlvbiBnZXRWYWxpZEFkamFjZW50Q1BVTW92ZXMoaW5pdGlhbEhpdCkge1xuICBjb25zb2xlLmxvZyhpbml0aWFsSGl0KTtcbiAgY29uc3QgdmFsaWRNb3Zlc1JpZ2h0ID0gZ2V0TW92ZXNSaWdodChpbml0aWFsSGl0KTtcbiAgY29uc3QgdmFsaWRNb3Zlc0xlZnQgPSBnZXRNb3Zlc0xlZnQoaW5pdGlhbEhpdCk7XG4gIGNvbnN0IHZhbGlkTW92ZXNEb3duID0gZ2V0TW92ZXNEb3duKGluaXRpYWxIaXQpO1xuICBjb25zdCB2YWxpZE1vdmVzVXAgPSBnZXRNb3Zlc1VwKGluaXRpYWxIaXQpO1xuICByZXR1cm4geyB2YWxpZE1vdmVzUmlnaHQsIHZhbGlkTW92ZXNMZWZ0LCB2YWxpZE1vdmVzRG93biwgdmFsaWRNb3Zlc1VwIH07XG59XG5cbmZ1bmN0aW9uIGdldE1vdmVzUmlnaHQoaGl0KSB7XG4gIGNvbnN0IGdldEluZGV4ID0gZ2V0VmFsaWRNb3Zlcy5pbmRleE9mKGhpdCk7XG4gIGNvbnN0IG1vdmVzUmlnaHQgPSBbXTtcbiAgZ2V0VmFsaWRNb3Zlcy5zbGljZShnZXRJbmRleCkuZmlsdGVyKChpdGVtLCBpbmRleCkgPT4ge1xuICAgIGlmIChpdGVtIC0gaGl0IC0gaW5kZXggPT09IDAgJiYgaXRlbSA8IChNYXRoLmZsb29yKGhpdCAvIDEwKSArIDEpICogMTApIHtcbiAgICAgIG1vdmVzUmlnaHQucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuICBtb3Zlc1JpZ2h0LnNoaWZ0KCk7XG4gIC8vIGNvbnNvbGUubG9nKHsgbW92ZXNSaWdodCB9KTtcbiAgcmV0dXJuIG1vdmVzUmlnaHQ7XG59XG5cbmZ1bmN0aW9uIGdldE1vdmVzTGVmdChoaXQpIHtcbiAgY29uc3QgZ2V0SW5kZXggPSBnZXRWYWxpZE1vdmVzLmluZGV4T2YoaGl0KTtcbiAgY29uc3QgbWFwVmFsaWRNb3ZlcyA9IGdldFZhbGlkTW92ZXMubWFwKChpdGVtKSA9PiB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH0pO1xuICBjb25zdCBtb3Zlc0xlZnQgPSBbXTtcbiAgbWFwVmFsaWRNb3Zlcy5zcGxpY2UoZ2V0SW5kZXgsIG1hcFZhbGlkTW92ZXMubGVuZ3RoIC0gMSk7XG4gIG1hcFZhbGlkTW92ZXMucmV2ZXJzZSgpLmZpbHRlcigoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaGl0ID09PSBpdGVtICsgaW5kZXggKyAxICYmIGl0ZW0gPj0gTWF0aC5mbG9vcihoaXQgLyAxMCkgKiAxMCkge1xuICAgICAgbW92ZXNMZWZ0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgLy8gY29uc29sZS5sb2coeyBtb3Zlc0xlZnQgfSk7XG4gIHJldHVybiBtb3Zlc0xlZnQ7XG59XG5cbmZ1bmN0aW9uIGdldE1vdmVzRG93bihoaXQpIHtcbiAgY29uc3QgdmVydGljYWxNb3ZlcyA9IFtdO1xuICBnZXRWYWxpZE1vdmVzLmZpbHRlcigoY29vcmQpID0+IHtcbiAgICBpZiAoaGl0ICUgMTAgPT09IGNvb3JkICUgMTApIHtcbiAgICAgIHZlcnRpY2FsTW92ZXMucHVzaChjb29yZCk7XG4gICAgfVxuICB9KTtcbiAgY29uc29sZS5sb2codmVydGljYWxNb3Zlcyk7XG4gIGNvbnN0IG1vdmVzRG93biA9IFtdO1xuICB2ZXJ0aWNhbE1vdmVzLnNsaWNlKHZlcnRpY2FsTW92ZXMuaW5kZXhPZihoaXQpKS5maWx0ZXIoKGNvb3JkLCBpbmRleCkgPT4ge1xuICAgIGlmIChjb29yZCAtIGhpdCAtIGluZGV4ICogMTAgPT09IDApIHtcbiAgICAgIG1vdmVzRG93bi5wdXNoKGNvb3JkKTtcbiAgICB9XG4gIH0pO1xuICBtb3Zlc0Rvd24uc2hpZnQoKTtcbiAgLy8gY29uc29sZS5sb2coeyBtb3Zlc0Rvd24gfSk7XG4gIHJldHVybiBtb3Zlc0Rvd247XG59XG5cbmZ1bmN0aW9uIGdldE1vdmVzVXAoaGl0KSB7XG4gIGNvbnN0IHZlcnRpY2FsTW92ZXMgPSBnZXRWYWxpZE1vdmVzLmZpbHRlcigoY29vcmQpID0+IHtcbiAgICBpZiAoaGl0ICUgMTAgPT09IGNvb3JkICUgMTApIHtcbiAgICAgIHJldHVybiBjb29yZDtcbiAgICB9XG4gIH0pO1xuICB2ZXJ0aWNhbE1vdmVzLnJldmVyc2UoKTtcbiAgY29uc3QgbW92ZXNVcCA9IHZlcnRpY2FsTW92ZXNcbiAgICAuc2xpY2UodmVydGljYWxNb3Zlcy5pbmRleE9mKGhpdCkpXG4gICAgLmZpbHRlcigoY29vcmQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaGl0ID09PSBjb29yZCArIGluZGV4ICogMTApIHtcbiAgICAgICAgcmV0dXJuIGNvb3JkO1xuICAgICAgfVxuICAgIH0pO1xuICBpZiAoXG4gICAgaGl0ICUgMTAgPT09IDAgJiZcbiAgICBnZXRWYWxpZE1vdmVzLmluY2x1ZGVzKDApICYmXG4gICAgaGl0ID09PSBtb3Zlc1VwLmxlbmd0aCAqIDEwXG4gICkge1xuICAgIG1vdmVzVXAucHVzaCgwKTtcbiAgfVxuICBtb3Zlc1VwLnNoaWZ0KCk7XG4gIC8vIGNvbnNvbGUubG9nKHsgbW92ZXNVcCB9KTtcbiAgcmV0dXJuIG1vdmVzVXA7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ29tcHV0ZXJBdHRhY2soKSB7XG4gIGxldCBjcHVNb3ZlO1xuICBpZiAoIWlzQUlUcmlnZ2VyZWQpIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdldFZhbGlkTW92ZXMubGVuZ3RoKTtcbiAgICBjcHVNb3ZlID0gZ2V0VmFsaWRNb3Zlc1tyYW5kb21JbmRleF07XG4gICAgLy8gZ2V0VmFsaWRNb3Zlcy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICB9IGVsc2UgaWYgKCFpc0FkamFjZW50U2hpcEhpdCkge1xuICAgIC8vIGNvbnNvbGUubG9nKGBiZWdpbiBzbWFydCBtb3ZlYCk7XG4gICAgY3B1TW92ZSA9IGdldFNtYXJ0Q1BVTW92ZSgpO1xuICAgIC8vIGdldFZhbGlkTW92ZXMuc3BsaWNlKGdldFZhbGlkTW92ZXMuaW5kZXhPZihjcHVNb3ZlKSwgMSk7XG4gIH1cbiAgLy8gZWxzZSBpZiAoaXNBZGphY2VudFNoaXBIaXQpIHtcbiAgLy8gfVxuICByZXR1cm4gY3B1TW92ZTtcbn1cblxubGV0IGlzQWRqYWNlbnRTaGlwSGl0ID0gZmFsc2U7XG5sZXQgaXNBSGl0ID0gdHJ1ZTtcbmxldCBoaXRzQ291bnRlciA9IDA7XG5sZXQgc21hcnRNb3Zlc0NvdW50ZXIgPSAwO1xubGV0IG51bWJlck9mU2hpcHNTdW5rQnlBSSA9IDA7XG5sZXQgc3Vua1NoaXBzQ2hlY2tlciA9IDA7XG5sZXQgaXNJbml0aWFsU2hpcFN1bmsgPSBmYWxzZTtcbmxldCBpc1ZlcnRpY2FsID0gZmFsc2U7XG5sZXQgaXNSaWdodCA9IHRydWU7XG5sZXQgaXNMZWZ0ID0gdHJ1ZTtcbmxldCBpc0Rvd24gPSB0cnVlO1xubGV0IGhpdHNEdXJpbmdBSSA9IFtdO1xubGV0IGluaXRpYWxDUFVIaXRDb29yZGluYXRlcztcblxuZnVuY3Rpb24gZ2V0U21hcnRDUFVNb3ZlKCkge1xuICBsZXQgbW92ZTtcbiAgc21hcnRNb3Zlc0NvdW50ZXIgKz0gMTtcbiAgaWYgKGlzQUhpdCkge1xuICAgIGhpdHNDb3VudGVyICs9IDE7XG4gIH1cbiAgaWYgKFxuICAgIC8vIGZpcnN0IG1vdmUgaXMgYWx3YXlzIHJpZ2h0IGlmIGFycmF5WzBdIGlzIHRydXRoeVxuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzUmlnaHRbMF0gJiZcbiAgICBpc0FIaXQgJiZcbiAgICBoaXRzQ291bnRlciA9PT0gc21hcnRNb3Zlc0NvdW50ZXJcbiAgKSB7XG4gICAgbW92ZSA9IHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzUmlnaHRbMF07XG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNSaWdodC5zaGlmdCgpO1xuICB9IGVsc2UgaWYgKFxuICAgIChpc1JpZ2h0ICYmXG4gICAgICBpc0xlZnQgJiZcbiAgICAgIC8vIGZpcnN0IGNvbmRpdGlvbiBpcyBpZiBtb3ZlUmlnaHQgRE5FIHVwb24gZW50ZXJpbmcgQUkgYmMgaGl0cyA9PT0gc21hcnRNb3Zlc1xuICAgICAgIXZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzUmlnaHRbMF0gJiZcbiAgICAgIGhpdHNDb3VudGVyID09PSBzbWFydE1vdmVzQ291bnRlciAmJlxuICAgICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0WzBdKSB8fFxuICAgIC8vIHNlY29uZCBjb25kaXRpb24gaXMgZm9yIHRoZSBtb3ZlIGltbWVkaWF0ZWx5IGFmdGVyIG1vdmVSaWdodCBtaXNzZXMsIHRodXMgaGl0cyBhbmQgbW92ZXMgZGlmZmVyIGJ5IDFcbiAgICAoaXNSaWdodCAmJlxuICAgICAgaXNMZWZ0ICYmXG4gICAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnRbMF0gJiZcbiAgICAgICFpc0FIaXQgJiZcbiAgICAgIGhpdHNDb3VudGVyID09PSBzbWFydE1vdmVzQ291bnRlciAtIDEpIHx8XG4gICAgLy8gdGhpcmQgY29uZGl0aW9uIGlzIGlmIFZNUiBiZWNvbWVzIGZhbHN5IHdpdGhvdXQgc2lua2luZyB0aGUgc2hpcCBieSBydW5uaW5nIHVwIGFnYWluc3QgcmlnaHQgZWRnZSBvZiBnYW1lYm9hcmRcbiAgICAvLyBpbiB0aGlzIGNhc2UsIGhpdHMgd2lsbCBlcXVhbCBzbWFydE1vdmVzIGFuZCBnbyBsZWZ0IHVudGlsIFZNTCBpcyBmYWxzeSBvciBhIG1pc3MgaXMgcmVnaXN0ZXJlZFxuICAgIChpc1JpZ2h0ICYmXG4gICAgICBpc0xlZnQgJiZcbiAgICAgICF2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1JpZ2h0WzBdICYmXG4gICAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnRbMF0gJiZcbiAgICAgIGhpdHNDb3VudGVyID09PSBzbWFydE1vdmVzQ291bnRlcilcbiAgKSB7XG4gICAgbW92ZSA9IHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzTGVmdFswXTtcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnQuc2hpZnQoKTtcbiAgICBpc1JpZ2h0ID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoXG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0WzBdICYmXG4gICAgaXNBSGl0ICYmXG4gICAgaXNMZWZ0ICYmXG4gICAgIWlzVmVydGljYWxcbiAgKSB7XG4gICAgLy8gaGFuZGxlcyBpZiBvbmUgb2YgdGhlIGFib3ZlIFwiZWxzZSBpZlwiIGNvbmRpdGlvbnMgcmVnaXN0ZXJzIGEgaGl0IGJ1dCB3aWxsIG5vdCB0cmlnZ2VyIG9uY2UgQUkgcGVyZm9ybXMgYSBtb3ZlIGRvd25cbiAgICBtb3ZlID0gdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0WzBdO1xuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzTGVmdC5zaGlmdCgpO1xuICB9IGVsc2UgaWYgKFxuICAgIC8vIGhhbmRsZXMgdGhlIGNhc2UgaW4gd2hpY2ggdGhlcmUgYXJlIG5vIHZhbGlkIG1vdmVzIHJpZ2h0IG9yIGxlZnQgdXBvbiBlbnRyeSBpbnRvIEFJXG4gICAgIXZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzTGVmdFswXSAmJlxuICAgICF2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1JpZ2h0WzBdICYmXG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duWzBdICYmXG4gICAgLy8gaGl0c0NvdW50ZXIgPT09IHNtYXJ0TW92ZXNDb3VudGVyXG4gICAgaXNMZWZ0ICYmXG4gICAgIWlzVmVydGljYWxcbiAgKSB7XG4gICAgbW92ZSA9IHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93blswXTtcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0Rvd24uc2hpZnQoKTtcbiAgICBpc0xlZnQgPSBmYWxzZTtcbiAgICBpc1ZlcnRpY2FsID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChcbiAgICAhdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0WzBdICYmXG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duWzBdICYmXG4gICAgaXNBSGl0ICYmXG4gICAgaXNMZWZ0XG4gICkge1xuICAgIGNvbnNvbGUubG9nKGBsZWZ0IGVkZ2UgY2FzZWApO1xuICAgIG1vdmUgPSB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0Rvd25bMF07XG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duLnNoaWZ0KCk7XG4gICAgaXNMZWZ0ID0gZmFsc2U7XG4gICAgaXNWZXJ0aWNhbCA9IHRydWU7XG4gIH0gZWxzZSBpZiAodmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duWzBdICYmICFpc0FIaXQgJiYgIWlzVmVydGljYWwpIHtcbiAgICAvLyBoYW5kbGVzIHRoZSBmaXJzdCB0aW1lIGEgbW92ZSBpcyBtYWRlIGRvd24gd2l0aCB0aGUgZXhjZXB0aW9uIG9mIHRoZSBhYm92ZSBlbHNlIGlmLCB0aHVzIHNldHRpbmcgaXNWZXJ0aWNhbCA9IHRydWVcbiAgICBtb3ZlID0gdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duWzBdO1xuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93bi5zaGlmdCgpO1xuICAgIGlzTGVmdCA9IGZhbHNlO1xuICAgIGlzVmVydGljYWwgPSB0cnVlO1xuICB9IGVsc2UgaWYgKFxuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93blswXSAmJlxuICAgIGlzQUhpdCAmJlxuICAgIGlzRG93biAmJlxuICAgIGlzVmVydGljYWxcbiAgKSB7XG4gICAgbW92ZSA9IHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93blswXTtcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0Rvd24uc2hpZnQoKTtcbiAgICBpc0xlZnQgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1VwWzBdXG4gICAgLy8gIWlzQUhpdFxuICAgIC8vIGlzVmVydGljYWxcbiAgKSB7XG4gICAgbW92ZSA9IHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzVXBbMF07XG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNVcC5zaGlmdCgpO1xuICAgIGlzTGVmdCA9IGZhbHNlO1xuICAgIGlzRG93biA9IGZhbHNlO1xuICAgIGlzVmVydGljYWwgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGJyZWFrRnJvbUFJTG9vcCgpO1xuICAgIG1vdmUgPSBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCk7XG4gIH1cbiAgcmV0dXJuIG1vdmU7XG59XG4vLyBFTkQgLS0tLS0gZ2VuZXJhdGVzIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIGdhbWVMb29wKHBsYXllck1vdmUpIHtcbiAgbGV0IGdldFR1cm47XG4gIGxldCBjb29yZE9mQXR0YWNrO1xuICBsZXQgaXNHYW1lT3ZlciA9IGZhbHNlO1xuICBjb25zdCBpbmRleFRvU3BsaWNlID0gZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuZmluZEluZGV4KFxuICAgIChpbmRleCkgPT4gaW5kZXggPT09IHBsYXllck1vdmVcbiAgKTtcbiAgZ2V0UGxheWVyTW92ZXNSZW1haW5pbmcuc3BsaWNlKGluZGV4VG9TcGxpY2UsIDEpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGlmICghaXNHYW1lT3Zlcikge1xuICAgICAgZ2V0VHVybiA9IHR1cm5Ecml2ZXIoKTtcbiAgICAgIGlmIChnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICBjb29yZE9mQXR0YWNrID0gcGxheWVyTW92ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkT2ZBdHRhY2sgPSBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBhdHRhY2tPdXRjb21lID0gcmVjZWl2ZUF0dGFjayhjb29yZE9mQXR0YWNrLCBnZXRUdXJuKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGF0dGFja091dGNvbWUpO1xuXG4gICAgICBpZiAoZ2V0VHVybiA9PT0gYGNvbXB1dGVyYCkge1xuICAgICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSAmJiAhaXNBSVRyaWdnZXJlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBmaXJzdCBoaXRgKTtcbiAgICAgICAgICBpc0FJVHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICBzdG9yZWRHYW1lYm9hcmRzWzFdWzFdLnNoaXBzLmZsZWV0LmZpbHRlcigob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAob2JqZWN0LmlzU3Vuaykge1xuICAgICAgICAgICAgICBudW1iZXJPZlNoaXBzU3Vua0J5QUkgKz0gMTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobnVtYmVyT2ZTaGlwc1N1bmtCeUFJKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzdG9yZWRHYW1lYm9hcmRzWzFdWzFdLnNoaXBzLmZsZWV0LmZpbHRlcigob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAvLyBpZiAoYXR0YWNrT3V0Y29tZVswXSA9PT0gb2JqZWN0Lm5hbWUgJiYgb2JqZWN0LmhpdHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSA9PT0gb2JqZWN0Lm5hbWUpIHtcbiAgICAgICAgICAgICAgaW5pdGlhbENQVUhpdE9iamVjdCA9IG9iamVjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzdG9yZWRHYW1lYm9hcmRzWzFdWzFdLmdhbWVib2FyZC5maWx0ZXIoKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gPT09IG9iamVjdC5uYW1lKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9iamVjdC5zaGlwUGxhY2VtZW50KTtcbiAgICAgICAgICAgICAgaW5pdGlhbENQVUhpdENvb3JkaW5hdGVzID0gb2JqZWN0LnNoaXBQbGFjZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFsaWRTbWFydE1vdmVzID0gZ2V0VmFsaWRBZGphY2VudENQVU1vdmVzKGF0dGFja091dGNvbWVbMV0pO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZhbGlkU21hcnRNb3Zlcyk7XG4gICAgICAgICAgY29uc29sZS5sb2coaW5pdGlhbENQVUhpdE9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQUlUcmlnZ2VyZWQpIHtcbiAgICAgICAgICBpZiAoYXR0YWNrT3V0Y29tZVswXSkge1xuICAgICAgICAgICAgaGl0c0R1cmluZ0FJLnB1c2goYXR0YWNrT3V0Y29tZVsxXSk7XG4gICAgICAgICAgICBpc0FIaXQgPSB0cnVlO1xuICAgICAgICAgICAgaXNJbml0aWFsU2hpcFN1bmsgPSBpbml0aWFsQ1BVSGl0T2JqZWN0LmlzU3VuaztcbiAgICAgICAgICAgIGlmIChpc0luaXRpYWxTaGlwU3Vuaykge1xuICAgICAgICAgICAgICAvLyBpc0FJVHJpZ2dlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIC8vIGluaXRpYWxDUFVIaXRPYmplY3QgPSBudWxsO1xuICAgICAgICAgICAgICAvLyBoaXRzQ291bnRlciA9IDA7XG4gICAgICAgICAgICAgIC8vIHNtYXJ0TW92ZXNDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgLy8gaXNJbml0aWFsU2hpcFN1bmsgPSBmYWxzZTtcbiAgICAgICAgICAgICAgLy8gbnVtYmVyT2ZTaGlwc1N1bmtCeUFJID0gMDtcbiAgICAgICAgICAgICAgYnJlYWtGcm9tQUlMb29wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdW5rU2hpcHNDaGVja2VyKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG51bWJlck9mU2hpcHNTdW5rQnlBSSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpc0luaXRpYWxTaGlwU3Vuayk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhoaXRzRHVyaW5nQUkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coaW5pdGlhbENQVUhpdENvb3JkaW5hdGVzKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHNbMV1bMV0uZ2FtZWJvYXJkKTtcbiAgICAgICAgICAgIC8vIGlmIChzdW5rU2hpcHNDaGVja2VyICE9PSBudW1iZXJPZlNoaXBzU3Vua0J5QUkpIHtcbiAgICAgICAgICAgIC8vICAgaXNBSVRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0FIaXQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2codmFsaWRTbWFydE1vdmVzKTtcbiAgICAgICAgZ2V0VmFsaWRNb3Zlcy5zcGxpY2UoZ2V0VmFsaWRNb3Zlcy5pbmRleE9mKGF0dGFja091dGNvbWVbMV0pLCAxKTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc29sZS5sb2coYXR0YWNrT3V0Y29tZSk7XG4gICAgICByZW5kZXJNb3ZlKGdldFR1cm4sIGF0dGFja091dGNvbWUpO1xuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYXR0YWNrT3V0Y29tZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHN0b3JlZEdhbWVib2FyZHMpO1xuICAgICAgICBzdG9yZWRHYW1lYm9hcmRzLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChpdGVtWzBdID09PSBnZXRUdXJuKSB7XG4gICAgICAgICAgICBpc0dhbWVPdmVyID0gaXRlbVsxXS5pc0dhbWVPdmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gJiYgZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbiAgICAgICAgbGV0IGlzU2hpcFN1bms7XG4gICAgICAgIHN0b3JlZEdhbWVib2FyZHNbMF1bMV0uc2hpcHMuZmxlZXQuZmlsdGVyKChvYmplY3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gPT09IG9iamVjdC5uYW1lKSB7XG4gICAgICAgICAgICBpc1NoaXBTdW5rID0gb2JqZWN0LmlzU3VuaztcbiAgICAgICAgICAgIGlmIChpc1NoaXBTdW5rKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNwdUhpZGRlblNoaXBzID1cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1LXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgICAgICAgICAgIGNwdUhpZGRlblNoaXBzW2luZGV4XS5zdHlsZS5kaXNwbGF5ID0gYGJsb2NrYDtcbiAgICAgICAgICAgICAgY3B1SGlkZGVuU2hpcHNbaW5kZXhdLnN0eWxlLnpJbmRleCA9IGAxYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNHYW1lT3Zlcikge1xuICAgICAgICBjb25zdCBnYW1lT3Zlck1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2dhbWUtb3Zlci1tb2RhbGApO1xuICAgICAgICBjb25zdCBkaXNwbGF5V2lubmVyVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNkaXNwbGF5LXdpbm5lcmApO1xuICAgICAgICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGdldFBsYXllck1vdmVzUmVtYWluaW5nKTtcbiAgICAgICAgaWYgKGdldFR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgICAgICAgZGlzcGxheVdpbm5lclRleHQudGV4dENvbnRlbnQgPSBgWW91IHdpbiFgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BsYXlXaW5uZXJUZXh0LnRleHRDb250ZW50ID0gYFlvdSBsb3NlIWA7XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZU92ZXJNb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBicmVha0Zyb21BSUxvb3AoKSB7XG4gIC8vIGlmIChoaXRzRHVyaW5nQUkubGVuZ3RoID09PSBpbml0aWFsQ1BVSGl0T2JqZWN0Lmxlbmd0aCkge1xuICBjb25zb2xlLmxvZyhgbm90aGluZyBhZGphY2VudCBoaXRgKTtcbiAgaXNBSVRyaWdnZXJlZCA9IGZhbHNlO1xuICBpbml0aWFsQ1BVSGl0T2JqZWN0ID0gbnVsbDtcbiAgaGl0c0NvdW50ZXIgPSAwO1xuICBzbWFydE1vdmVzQ291bnRlciA9IDA7XG4gIGlzSW5pdGlhbFNoaXBTdW5rID0gZmFsc2U7XG4gIG51bWJlck9mU2hpcHNTdW5rQnlBSSA9IDA7XG4gIGlzUmlnaHQgPSB0cnVlO1xuICBpc0xlZnQgPSB0cnVlO1xuICBpc0Rvd24gPSB0cnVlO1xuICBpc1ZlcnRpY2FsID0gZmFsc2U7XG4gIC8vIH1cbiAgaW5pdGlhbENQVUhpdENvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkLCBpbmRleCkgPT4ge1xuICAgIGlmIChoaXRzRHVyaW5nQUkuaW5jbHVkZXMoY29vcmQpKSB7XG4gICAgICBjb25zb2xlLmxvZyhjb29yZCk7XG4gICAgICBoaXRzRHVyaW5nQUkuc3BsaWNlKGhpdHNEdXJpbmdBSS5pbmRleE9mKGNvb3JkKSwgMSk7XG4gICAgICBjb25zb2xlLmxvZyhoaXRzRHVyaW5nQUkpO1xuICAgIH1cbiAgfSk7XG4gIGlmIChoaXRzRHVyaW5nQUkubGVuZ3RoICE9PSAwKSB7XG4gICAgaW5pdGlhbGl6ZUFJKGhpdHNEdXJpbmdBSVswXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUFJKGFkamFjZW50SGl0KSB7XG4gIHN0b3JlZEdhbWVib2FyZHNbMV1bMV0uZ2FtZWJvYXJkLmZpbHRlcigob2JqZWN0KSA9PiB7XG4gICAgaWYgKG9iamVjdC5zaGlwUGxhY2VtZW50LmluY2x1ZGVzKGFkamFjZW50SGl0KSkge1xuICAgICAgaW5pdGlhbENQVUhpdE9iamVjdCA9IG9iamVjdDtcbiAgICAgIGluaXRpYWxDUFVIaXRDb29yZGluYXRlcyA9IG9iamVjdC5zaGlwUGxhY2VtZW50O1xuICAgIH1cbiAgfSk7XG4gIGNvbnNvbGUubG9nKGluaXRpYWxDUFVIaXRPYmplY3QpO1xuICBjb25zb2xlLmxvZyhpbml0aWFsQ1BVSGl0Q29vcmRpbmF0ZXMpO1xufVxuXG5leHBvcnQgeyBzdG9yZWRHYW1lYm9hcmRzLCBnYW1lTG9vcCwgY3JlYXRlUGxheWVyT2JqZWN0cywgaGFuZGxlU3RhdGUgfTtcbiIsImltcG9ydCB7IFNoaXBzIH0gZnJvbSBcIi4vc2hpcE1vZHVsZVwiO1xuaW1wb3J0IHsgc3RvcmVkR2FtZWJvYXJkcyB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyByZW5kZXJDb21wdXRlclNoaXBzLCByZW5kZXJQbGF5ZXJTaGlwcyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcblxuY29uc3QgR2FtZWJvYXJkID0gKGZsZWV0QXJyYXkpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gW1xuICAgIGZsZWV0QXJyYXlbMF0sXG4gICAgZmxlZXRBcnJheVsxXSxcbiAgICBmbGVldEFycmF5WzJdLFxuICAgIGZsZWV0QXJyYXlbM10sXG4gICAgZmxlZXRBcnJheVs0XSxcbiAgXTtcbiAgY29uc3QgbWlzc2VzID0gW107XG4gIGNvbnN0IHNoaXBzID0gU2hpcHMoKTtcblxuICBjb25zdCBpc0dhbWVPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGFycmF5ID0gc2hpcHMuZmxlZXQ7XG4gICAgbGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgICBsZXQgc2hpcHNTdW5rQ291bnRlciA9IDA7XG5cbiAgICBhcnJheS5maWx0ZXIoKG9iaikgPT4ge1xuICAgICAgaWYgKG9iai5pc1N1bmspIHtcbiAgICAgICAgc2hpcHNTdW5rQ291bnRlciArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzaGlwc1N1bmtDb3VudGVyID09PSA1KSB7XG4gICAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGlzR2FtZU92ZXI7XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2FtZWJvYXJkLCBtaXNzZXMsIHNoaXBzLCBpc0dhbWVPdmVyIH07XG59O1xuXG5jb25zdCByZWNlaXZlQXR0YWNrID0gKGF0dGFja0Nvb3JkLCB1c2VyKSA9PiB7XG4gIGxldCBpbmRleDtcbiAgbGV0IGF0dGFja091dGNvbWUgPSBbbnVsbCwgYXR0YWNrQ29vcmRdO1xuICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICBpbmRleCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSAxO1xuICB9XG4gIGNvbnN0IGdhbWVib2FyZE9iamVjdCA9IHN0b3JlZEdhbWVib2FyZHNbaW5kZXhdWzFdO1xuICBnYW1lYm9hcmRPYmplY3QuZ2FtZWJvYXJkLmZvckVhY2goKG9iamVjdCkgPT4ge1xuICAgIGlmIChvYmplY3Quc2hpcFBsYWNlbWVudC5pbmNsdWRlcyhhdHRhY2tDb29yZCkpIHtcbiAgICAgIGF0dGFja091dGNvbWUgPSBbb2JqZWN0Lm5hbWUsIGF0dGFja0Nvb3JkXTtcbiAgICB9XG4gIH0pO1xuICBpZiAoIWF0dGFja091dGNvbWVbMF0pIHtcbiAgICBnYW1lYm9hcmRPYmplY3QubWlzc2VzLnB1c2goYXR0YWNrQ29vcmQpO1xuICB9IGVsc2Uge1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5oaXQoYXR0YWNrT3V0Y29tZSk7XG4gICAgZ2FtZWJvYXJkT2JqZWN0LnNoaXBzLmlzU3VuayhhdHRhY2tPdXRjb21lWzBdKTtcbiAgfVxuICByZXR1cm4gYXR0YWNrT3V0Y29tZTtcbn07XG5cbi8vIEJFR0lOLS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZHMgLS0tLS0tLSAvL1xuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKSB7XG4gIGNvbnN0IG51bWJlck9mQ29vcmRpbmF0ZXMgPSAxMDA7XG4gIGNvbnN0IG9yaWVudGF0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gIGNvbnN0IGZpcnN0Q29vcmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1iZXJPZkNvb3JkaW5hdGVzKTtcbiAgcmV0dXJuIFtvcmllbnRhdGlvbiwgZmlyc3RDb29yZF07XG59XG5cbmZ1bmN0aW9uIG9yaWVudFNoaXAoc3RhcnRDb29yZCwgb3JpZW50YXRpb24sIG5hbWUsIGxlbmd0aCkge1xuICBsZXQgc2hpcFBsYWNlbWVudCA9IFtdO1xuICBsZXQgaG9yaXpvbnRhbExpbWl0O1xuICBpZiAoc3RhcnRDb29yZCA8IDEwKSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gOTtcbiAgfSBlbHNlIHtcbiAgICBob3Jpem9udGFsTGltaXQgPSArKHN0YXJ0Q29vcmQudG9TdHJpbmcoKS5jaGFyQXQoMCkgKyA5KTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9yaWVudGF0aW9uKSB7XG4gICAgICBpZiAoc3RhcnRDb29yZCArIChsZW5ndGggLSAxKSAqIDEwIDwgMTAwKSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSAqIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkIC0gaSAqIDEwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgPD0gaG9yaXpvbnRhbExpbWl0KSB7XG4gICAgICAgIHNoaXBQbGFjZW1lbnQucHVzaChzdGFydENvb3JkICsgaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4geyBuYW1lLCBzaGlwUGxhY2VtZW50IH07XG59XG5cbmZ1bmN0aW9uIHZlcmlmeUNvb3JkcyhhcnJheSwgb2JqZWN0KSB7XG4gIGNvbnN0IHNoaXBUb1ZlcmlmeSA9IG9iamVjdC5zaGlwUGxhY2VtZW50O1xuICBsZXQgaXNQbGFjZW1lbnRWYWxpZCA9IGZhbHNlO1xuICBpZiAoIWFycmF5Lmxlbmd0aCkge1xuICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xuICB9IGVsc2Uge1xuICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFRvVmVyaWZ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgICAgaWYgKGlzUGxhY2VtZW50VmFsaWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2hpcC5zaGlwUGxhY2VtZW50Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChzaGlwVG9WZXJpZnlbaV0gIT09IHNoaXAuc2hpcFBsYWNlbWVudFtqXSkge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpc1BsYWNlbWVudFZhbGlkO1xufVxuXG4vLyB1c2VkIGZvciB0aGUgbmFtZSBhbmQgbGVuZ3RoIHByb3BzIGluIHRoZSBwbGFjZUNvbXB1dGVyRmxlZXQgZnhuXG5jb25zdCBzaGlwQ2xvbmUgPSBTaGlwcygpO1xuXG5mdW5jdGlvbiBwbGFjZUNvbXB1dGVyRmxlZXQodXNlciwgYXJyYXkpIHtcbiAgc2hpcENsb25lLmZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuICAgIHdoaWxlICghaXNWYWxpZCkge1xuICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgY29uc3QgcmFuZG9tVmFsdWVzID0gZ2VuZXJhdGVSYW5kb21QbGFjZW1lbnQoKTtcbiAgICAgIGNvbnN0IHBsYWNlbWVudCA9IG9yaWVudFNoaXAoXG4gICAgICAgIHJhbmRvbVZhbHVlc1sxXSxcbiAgICAgICAgcmFuZG9tVmFsdWVzWzBdLFxuICAgICAgICBzaGlwLm5hbWUsXG4gICAgICAgIHNoaXAubGVuZ3RoXG4gICAgICApO1xuICAgICAgY29uc3QgdmVyaWZ5ID0gdmVyaWZ5Q29vcmRzKGFycmF5LCBwbGFjZW1lbnQpO1xuICAgICAgaWYgKHZlcmlmeSkge1xuICAgICAgICBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgYXJyYXkucHVzaChwbGFjZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmICh1c2VyID09PSBgY3B1YCkge1xuICAgIHJlbmRlckNvbXB1dGVyU2hpcHMoYXJyYXkpO1xuICB9IGVsc2Uge1xuICAgIHJlbmRlclBsYXllclNoaXBzKGFycmF5KTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG4vLyBFTkQtLS0tLS0tLSBjcmVhdGVzIGEgcmFuZG9tbHkgcGxhY2VkIGJvYXJkIGZvciBwbGF5ZXIgLS0tLS0tLSAvL1xuXG5leHBvcnQgeyBHYW1lYm9hcmQsIHBsYWNlQ29tcHV0ZXJGbGVldCwgcmVjZWl2ZUF0dGFjayB9O1xuIiwiaW1wb3J0IHsgZ2FtZUxvb3AsIGhhbmRsZVN0YXRlIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHNldERyYWdBbmREcm9wIH0gZnJvbSBcIi4vZHJhZ0FuZERyb3BcIjtcblxuZnVuY3Rpb24gcmVuZGVyR2FtZWJvYXJkKHVzZXIpIHtcbiAgbGV0IGJvYXJkRGl2O1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgICBib2FyZC5zZXRBdHRyaWJ1dGUoYGlkYCwgYHBsYXllci1zcXVhcmVzLWNvbnRhaW5lcmApO1xuICB9IGVsc2Uge1xuICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICAgIGJvYXJkLnNldEF0dHJpYnV0ZShgaWRgLCBgY3B1LXNxdWFyZXMtY29udGFpbmVyYCk7XG4gIH1cbiAgYm9hcmQuY2xhc3NMaXN0LmFkZChgZ2FtZWJvYXJkYCk7XG4gIGNvbnN0IG1heFNxdWFyZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4U3F1YXJlczsgaSsrKSB7XG4gICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgc3F1YXJlLmRhdGFzZXQuaW5kZXhOdW1iZXIgPSBpO1xuICAgIGlmICh1c2VyID09PSBgcGxheWVyYCkge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYHBsYXllclNxdWFyZWApO1xuICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoYGNwdVNxdWFyZWApO1xuICAgIH1cbiAgICBib2FyZC5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICB9XG4gIGJvYXJkRGl2LmFwcGVuZENoaWxkKGJvYXJkKTtcbn1cblxuY29uc3QgcGxheWVyQXR0YWNrID0gKGUpID0+IHtcbiAgY29uc3QgY29vcmRpbmF0ZUNsaWNrZWQgPSArZS50YXJnZXQuZGF0YXNldC5pbmRleE51bWJlcjtcbiAgZ2FtZUxvb3AoY29vcmRpbmF0ZUNsaWNrZWQpO1xuICBlLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG59O1xuXG5yZW5kZXJHYW1lYm9hcmQoYGNwdWApO1xuXG5mdW5jdGlvbiBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzKGFycmF5KSB7XG4gIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIGFycmF5LmZvckVhY2goKGluZGV4KSA9PiB7XG4gICAgc3F1YXJlc1tpbmRleF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyTW92ZSh3aG9zZVR1cm4sIGF0dGFja0FycmF5KSB7XG4gIC8vIGNvbnNvbGUubG9nKHsgd2hvc2VUdXJuLCBhdHRhY2tBcnJheSB9KTtcbiAgbGV0IHNxdWFyZXM7XG4gIGNvbnN0IGhpdEluZGV4ID0gYXR0YWNrQXJyYXlbMV07XG4gIGlmICh3aG9zZVR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5wbGF5ZXJTcXVhcmVgKTtcbiAgfSBlbHNlIHtcbiAgICBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdVNxdWFyZWApO1xuICB9XG4gIGlmIChhdHRhY2tBcnJheVswXSkge1xuICAgIHNxdWFyZXNbaGl0SW5kZXhdLmNsYXNzTGlzdC5hZGQoYGhpdGApO1xuICB9IGVsc2Uge1xuICAgIHNxdWFyZXNbaGl0SW5kZXhdLmNsYXNzTGlzdC5hZGQoYG1pc3NgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJDb21wdXRlclNoaXBzKGNwdUZsZWV0KSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICBsZXQgaW1nU3JjO1xuXG4gIGNwdUZsZWV0LmZvckVhY2goKHNoaXBPYmplY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChgY3B1LXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgaWYgKHNoaXBPYmplY3QubmFtZSA9PT0gYFBhdHJvbCBCb2F0YCkge1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy9wYXRyb2wucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBwYXRyb2xgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwT2JqZWN0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvJHtzaGlwTmFtZX0ucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXBOYW1lfWApO1xuICAgIH1cbiAgICBzaGlwSW1hZ2Uuc3JjID0gaW1nU3JjO1xuXG4gICAgY29uc3Qgc29ydEFzY2VuZGluZyA9IHNoaXBPYmplY3Quc2hpcFBsYWNlbWVudC5zb3J0KCh4LCB5KSA9PiB4IC0geSk7XG4gICAgY29uc3QgZGltZW5zaW9uT2ZTcXVhcmUgPSAzNTtcbiAgICBsZXQgdG9wT2Zmc2V0O1xuICAgIGxldCBsZWZ0T2Zmc2V0O1xuICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdICsgMSA9PT0gc29ydEFzY2VuZGluZ1sxXSkge1xuICAgICAgLy8gcGxhY2UgaG9yaXpvbnRhbCBzaGlwc1xuICAgICAgdG9wT2Zmc2V0ID0gTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGxhY2UgdmVydGljYWwgc2hpcHNcbiAgICAgIHNoaXBJbWFnZS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKC05MGRlZylgO1xuICAgICAgdG9wT2Zmc2V0ID1cbiAgICAgICAgTWF0aC5mbG9vcihzb3J0QXNjZW5kaW5nWzBdIC8gMTApICogZGltZW5zaW9uT2ZTcXVhcmUgK1xuICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICBzb3J0QXNjZW5kaW5nWzBdICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T2Zmc2V0ID1cbiAgICAgICAgICArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBJbWFnZS5zdHlsZS50b3AgPSBgJHt0b3BPZmZzZXR9cHhgO1xuICAgIHNoaXBJbWFnZS5zdHlsZS5sZWZ0ID0gYCR7bGVmdE9mZnNldH1weGA7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gICAgcGxheWVyQm9hcmQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfSk7XG4gIHJlbmRlckdhbWVib2FyZChgcGxheWVyYCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclBsYXllclNoaXBzKGZsZWV0KSB7XG4gIGlmIChmbGVldFswXS5zaGlwUGxhY2VtZW50WzBdID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgY3B1Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gIGxldCBpbWdTcmM7XG5cbiAgZmxlZXQuZm9yRWFjaCgoc2hpcE9iamVjdCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGBwbGF5ZXItc2hpcHMtcmVuZGVyZWRgKTtcbiAgICBjb25zdCBzaGlwSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBpbWdgKTtcbiAgICBpZiAoc2hpcE9iamVjdC5uYW1lID09PSBgUGF0cm9sIEJvYXRgKSB7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzL3BhdHJvbC5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYHBhdHJvbGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXBPYmplY3QubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy8ke3NoaXBOYW1lfS5wbmdgO1xuICAgICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYCR7c2hpcE5hbWV9YCk7XG4gICAgfVxuICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBpbnZhbGlkYCk7XG4gICAgc2hpcEltYWdlLnNyYyA9IGltZ1NyYztcblxuICAgIGNvbnN0IHNvcnRBc2NlbmRpbmcgPSBzaGlwT2JqZWN0LnNoaXBQbGFjZW1lbnQuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuICAgIGNvbnN0IGRpbWVuc2lvbk9mU3F1YXJlID0gMzU7XG4gICAgbGV0IHRvcE9mZnNldDtcbiAgICBsZXQgbGVmdE9mZnNldDtcbiAgICBpZiAoc29ydEFzY2VuZGluZ1swXSArIDEgPT09IHNvcnRBc2NlbmRpbmdbMV0pIHtcbiAgICAgIC8vIHBsYWNlIGhvcml6b250YWwgc2hpcHNcbiAgICAgIHRvcE9mZnNldCA9IE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlIC0gMzUwO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9ICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBsYWNlIHZlcnRpY2FsIHNoaXBzXG4gICAgICBzaGlwSW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgtOTBkZWcpYDtcbiAgICAgIHRvcE9mZnNldCA9XG4gICAgICAgIE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlICtcbiAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNSAtXG4gICAgICAgIDM1MDtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwSW1hZ2Uuc3R5bGUudG9wID0gYCR7dG9wT2Zmc2V0fXB4YDtcbiAgICBzaGlwSW1hZ2Uuc3R5bGUubGVmdCA9IGAke2xlZnRPZmZzZXR9cHhgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICAgIGNwdUJvYXJkLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhckJvYXJkcyhlKSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICBjb25zdCBwbGF5ZXJTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1zcXVhcmVzLWNvbnRhaW5lcmApO1xuICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgY29uc3QgcGxhY2VTaGlwc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGFjZS1zaGlwcy1jb250YWluZXJgKTtcbiAgY29uc3Qgc2hpcHNPbkNQVUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllci1zaGlwcy1yZW5kZXJlZGApO1xuICBjb25zdCBzaGlwc09uUGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1LXNoaXBzLXJlbmRlcmVkYCk7XG4gIGNvbnN0IHJlbWFpbmluZ1NoaXBzVG9QbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuXG4gIGNvbnN0IGNwdUJvYXJkU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbiAgY3B1Qm9hcmRTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgYDtcbiAgfSk7XG5cbiAgcGxheWVyQm9hcmQucmVtb3ZlQ2hpbGQocGxheWVyU3F1YXJlcyk7XG4gIHJlbW92ZUVsZW1lbnRzKGNwdUJvYXJkLCBzaGlwc09uQ1BVQm9hcmQpO1xuICByZW1vdmVFbGVtZW50cyhwbGF5ZXJCb2FyZCwgc2hpcHNPblBsYXllckJvYXJkKTtcbiAgcmVtb3ZlRWxlbWVudHMocGxhY2VTaGlwc0NvbnRhaW5lciwgcmVtYWluaW5nU2hpcHNUb1BsYWNlKTtcbiAgcmVkaXNwbGF5U2hpcHNUb1BsYWNlKHBsYWNlU2hpcHNDb250YWluZXIpO1xuICBzZXREcmFnQW5kRHJvcC5zZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCgpO1xuICBoYW5kbGVTdGF0ZSgpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFbGVtZW50cyhwYXJlbnQsIGNoaWxkcmVuKSB7XG4gIGlmIChjaGlsZHJlbikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVkaXNwbGF5U2hpcHNUb1BsYWNlKHBhcmVudCkge1xuICBjb25zdCBuYW1lSGVscGVyID0gW1xuICAgIGBjYXJyaWVyYCxcbiAgICBgYmF0dGxlc2hpcGAsXG4gICAgYGRlc3Ryb3llcmAsXG4gICAgYHN1Ym1hcmluZWAsXG4gICAgYHBhdHJvbGAsXG4gIF07XG4gIG5hbWVIZWxwZXIuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIHNoaXBJbWFnZS5zcmMgPSBgLi9pbWdzLyR7c2hpcH0ucG5nYDtcbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwfWApO1xuICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBzaGlwcy10by1wbGFjZWApO1xuICAgIHNoaXBJbWFnZS5zZXRBdHRyaWJ1dGUoYGlkYCwgYHBsYXllci0ke3NoaXB9YCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHNoaXBJbWFnZSk7XG4gIH0pO1xufVxuXG5leHBvcnQge1xuICBkZXJlZ2lzdGVyUmVtYWluaW5nRXZlbnRMaXN0bmVuZXJzLFxuICByZW5kZXJNb3ZlLFxuICByZW5kZXJDb21wdXRlclNoaXBzLFxuICByZW5kZXJQbGF5ZXJTaGlwcyxcbiAgY2xlYXJCb2FyZHMsXG59O1xuIiwiY29uc3QgU2hpcHMgPSAoKSA9PiB7XG4gIGNvbnN0IGZsZWV0ID0gW1xuICAgIHsgbmFtZTogYENhcnJpZXJgLCBsZW5ndGg6IDUsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgQmF0dGxlc2hpcGAsIGxlbmd0aDogNCwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBEZXN0cm95ZXJgLCBsZW5ndGg6IDMsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgU3VibWFyaW5lYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFBhdHJvbCBCb2F0YCwgbGVuZ3RoOiAyLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICBdO1xuXG4gIGNvbnN0IGhpdCA9IChhdHRhY2tEYXRhKSA9PiB7XG4gICAgY29uc3Qgc2hpcEhpdCA9IGF0dGFja0RhdGFbMF07XG4gICAgY29uc3QgY29vcmRPZkhpdCA9IGF0dGFja0RhdGFbMV07XG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXBIaXQgPT09IHNoaXAubmFtZSkge1xuICAgICAgICBzaGlwLmhpdHMucHVzaChjb29yZE9mSGl0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoc2hpcEhpdCkgPT4ge1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUgJiYgc2hpcC5sZW5ndGggPT09IHNoaXAuaGl0cy5sZW5ndGgpIHtcbiAgICAgICAgc2hpcC5pc1N1bmsgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGZsZWV0LCBoaXQsIGlzU3VuayB9O1xufTtcblxuZXhwb3J0IHsgU2hpcHMgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9kcmFnQW5kRHJvcFwiO1xuXG5jb25zdCBuZXdHYW1lQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI25ldy1nYW1lLWJ0bmApO1xubmV3R2FtZUJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsICgpID0+IGxvY2F0aW9uLnJlbG9hZCgpKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=