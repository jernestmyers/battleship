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
  // console.log(verticalMoves);
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
    validSmartMoves.validMovesRight.length &&
    isAHit &&
    hitsCounter === smartMovesCounter
  ) {
    move = validSmartMoves.validMovesRight[0];
    validSmartMoves.validMovesRight.shift();
  } else if (
    (isRight &&
      isLeft &&
      // first condition is if moveRight DNE upon entering AI bc hits === smartMoves
      !validSmartMoves.validMovesRight.length &&
      hitsCounter === smartMovesCounter &&
      validSmartMoves.validMovesLeft.length) ||
    // second condition is for the move immediately after moveRight misses, thus hits and moves differ by 1
    (isRight &&
      isLeft &&
      validSmartMoves.validMovesLeft.length &&
      !isAHit &&
      hitsCounter === smartMovesCounter - 1) ||
    // third condition is if VMR becomes falsy without sinking the ship by running up against right edge of gameboard
    // in this case, hits will equal smartMoves and go left until VML is falsy or a miss is registered
    (isRight &&
      isLeft &&
      !validSmartMoves.validMovesRight.length &&
      validSmartMoves.validMovesLeft.length &&
      hitsCounter === smartMovesCounter)
  ) {
    move = validSmartMoves.validMovesLeft[0];
    validSmartMoves.validMovesLeft.shift();
    isRight = false;
  } else if (
    validSmartMoves.validMovesLeft.length &&
    isAHit &&
    isLeft &&
    !isVertical
  ) {
    // handles if one of the above "else if" conditions registers a hit but will not trigger once AI performs a move down
    move = validSmartMoves.validMovesLeft[0];
    validSmartMoves.validMovesLeft.shift();
  } else if (
    // handles the case in which there are no valid moves right or left upon entry into AI
    !validSmartMoves.validMovesLeft.length &&
    !validSmartMoves.validMovesRight.length &&
    validSmartMoves.validMovesDown.length &&
    // hitsCounter === smartMovesCounter
    isLeft &&
    !isVertical
  ) {
    move = validSmartMoves.validMovesDown[0];
    validSmartMoves.validMovesDown.shift();
    isLeft = false;
    isVertical = true;
  } else if (
    !validSmartMoves.validMovesLeft.length &&
    validSmartMoves.validMovesDown.length &&
    isAHit &&
    isLeft
  ) {
    console.log(`left edge case`);
    move = validSmartMoves.validMovesDown[0];
    validSmartMoves.validMovesDown.shift();
    isLeft = false;
    isVertical = true;
  } else if (validSmartMoves.validMovesDown.length && !isAHit && !isVertical) {
    // handles the first time a move is made down with the exception of the above else if, thus setting isVertical = true
    move = validSmartMoves.validMovesDown[0];
    validSmartMoves.validMovesDown.shift();
    isLeft = false;
    isVertical = true;
  } else if (
    validSmartMoves.validMovesDown.length &&
    isAHit &&
    isDown &&
    isVertical
  ) {
    move = validSmartMoves.validMovesDown[0];
    validSmartMoves.validMovesDown.shift();
    isLeft = false;
  } else if (validSmartMoves.validMovesUp.length) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RyYWdBbmREcm9wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZW5kZXJHYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9EO0FBQ1U7O0FBRTlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGlFQUFtQjtBQUN6QjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUEscUNBQXFDLG9EQUFXO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxQ0FBcUM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFDQUFxQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQ0FBcUM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUNBQXFDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsdUJBQXVCLHFDQUFxQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxRQUFRLDhEQUFpQjtBQUN6QjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsQ0FBQzs7QUFFeUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZUaUQ7QUFDRztBQUMvQjs7QUFFL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRSx5RUFBK0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDhEQUFrQjtBQUN4QztBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLHFEQUFTO0FBQy9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3Qiw4REFBa0I7QUFDMUMsd0JBQXdCLHFEQUFTO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esa0JBQWtCLGFBQWE7QUFDL0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsVUFBVTtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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RDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFVBQVU7QUFDVjs7QUFFaUI7Ozs7Ozs7VUM5QmpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7O0FDTnVCOztBQUV2QjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVQbGF5ZXJPYmplY3RzIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcbmltcG9ydCB7IHJlbmRlclBsYXllclNoaXBzLCBjbGVhckJvYXJkcyB9IGZyb20gXCIuL3JlbmRlckdhbWVcIjtcblxuY29uc3Qgc2V0RHJhZ0FuZERyb3AgPSAoZnVuY3Rpb24gKCkge1xuICBsZXQgcGxheWVyRmxlZXQgPSBbXTtcblxuICBjb25zdCBzaGlwTmFtZXMgPSBbXG4gICAgYENhcnJpZXJgLFxuICAgIGBCYXR0bGVzaGlwYCxcbiAgICBgRGVzdHJveWVyYCxcbiAgICBgU3VibWFyaW5lYCxcbiAgICBgUGF0cm9sIEJvYXRgLFxuICBdO1xuICBjb25zdCBzaGlwTGVuZ3RocyA9IFs1LCA0LCAzLCAzLCAyXTtcbiAgbGV0IHNoaXBDb29yZHMgPSBbXTtcblxuICBjb25zdCBjcHVHYW1lQm9hcmRUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmQtaGVhZGVyYCk7XG4gIGNvbnN0IGNwdUJvYXJkU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcblxuICBjb25zdCByb3RhdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjYnRuLXJvdGF0ZS1zaGlwYCk7XG4gIGNvbnN0IGNsZWFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NsZWFyLWJvYXJkLWJ0bmApO1xuICBjb25zdCByYW5kb21pemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcmFuZG9taXplLXBsYXllci1mbGVldGApO1xuXG4gIGNvbnN0IHBsYWNlU2hpcHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxhY2Utc2hpcHMtY29udGFpbmVyYCk7XG4gIGNvbnN0IHBsYXllclNoaXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICBgLnBsYXllci1zaGlwcy1jb250YWluZXJgXG4gICk7XG4gIGxldCBzaGlwSW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5zaGlwcy10by1wbGFjZWApO1xuXG4gIGZ1bmN0aW9uIGhpZGVTaGlwc1RvUGxhY2UoKSB7XG4gICAgc2hpcEltZ3MuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKGBoaWRlLXNoaXBgKTtcbiAgICB9KTtcbiAgICByb3RhdGVCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgfVxuXG4gIC8vIGhpZGVzIGFsbCBidXQgdGhlIGNhcnJpZXIgb24gcGFnZSBsb2FkXG4gIGZ1bmN0aW9uIHNldFVwU2hpcHNUb0RyYWdBbmREcm9wKCkge1xuICAgIHBsYXllckZsZWV0ID0gW107XG4gICAgc2hpcEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcbiAgICBzaGlwSW1ncy5mb3JFYWNoKChzaGlwLCBpbmRleCkgPT4ge1xuICAgICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKGBtb3VzZWRvd25gLCBiZWdpblNoaXBQbGFjZW1lbnQpO1xuICAgICAgaWYgKGluZGV4ICE9PSAwKSB7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZChgaGlkZS1zaGlwYCk7XG4gICAgICB9XG4gICAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoYG1vdXNlZG93bmAsIGJlZ2luU2hpcFBsYWNlbWVudCk7XG4gICAgICBzaGlwLnN0eWxlLmN1cnNvciA9IGBncmFiYDtcbiAgICAgIHNoaXAub25kcmFnc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG4gICAgfSk7XG4gICAgcmFuZG9taXplQnRuLnN0eWxlLmRpc3BsYXkgPSBgZmxleGA7XG4gICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9IGBub25lYDtcbiAgfVxuICBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCgpO1xuXG4gIC8vIGxhYmVscyB0aGUgY29tcHV0ZXIgZ2FtZWJvYXJkIG9uIHBhZ2UgbG9hZFxuICBjcHVHYW1lQm9hcmRUaXRsZS50ZXh0Q29udGVudCA9IGBQTEFDRSBZT1VSIFNISVBTYDtcblxuICAvLyBzdGFydCBnYW1lIGJ1dHRvblxuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzdGFydC1nYW1lLWJ0bmApO1xuICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIGJlZ2luR2FtZSk7XG5cbiAgZnVuY3Rpb24gYmVnaW5HYW1lKCkge1xuICAgIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYXllci1ib2FyZGApO1xuICAgIGNwdUdhbWVCb2FyZFRpdGxlLnRleHRDb250ZW50ID0gYENvbXB1dGVyYDtcbiAgICBwbGF5ZXJCb2FyZC5zdHlsZS5kaXNwbGF5ID0gYGJsb2NrYDtcbiAgICBwbGFjZVNoaXBzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBgbm9uZWA7XG4gICAgaWYgKHBsYXllckZsZWV0Lmxlbmd0aCA9PT0gNSkge1xuICAgICAgY3JlYXRlUGxheWVyT2JqZWN0cyhwbGF5ZXJGbGVldCk7XG4gICAgICBjcHVCb2FyZFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICAgIHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgYDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyQnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgY2xlYXJCb2FyZHMpO1xuICByb3RhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCByb3RhdGVTaGlwKTtcblxuICBmdW5jdGlvbiByb3RhdGVTaGlwKGUpIHtcbiAgICBpZiAoIXNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlKSB7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSA9IGAtOTBkZWdgO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPVxuICAgICAgICAxMDAgKyAoKHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF0gLSAxKSAvIDIpICogMzUgKyBgcHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSA9IGBgO1xuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPSAxMDAgKyBgcHhgO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJlZ2luU2hpcFBsYWNlbWVudChldmVudCkge1xuICAgIC8vICgxKSBwcmVwYXJlIHRvIG1vdmUgZWxlbWVudDogbWFrZSBhYnNvbHV0ZSBhbmQgb24gdG9wIGJ5IHotaW5kZXhcbiAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuekluZGV4ID0gMTAwMDtcblxuICAgIC8vIG1vdmUgaXQgb3V0IG9mIGFueSBjdXJyZW50IHBhcmVudHMgZGlyZWN0bHkgaW50byBjcHVCb2FyZFxuICAgIHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aF0uYXBwZW5kKFxuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXVxuICAgICk7XG5cbiAgICAvLyBjZW50ZXJzIHRoZSBjdXJzb3IgaW4gdGhlIGZpcnN0IFwic3F1YXJlXCIgb2YgdGhlIHNoaXAgaW1hZ2VcbiAgICBmdW5jdGlvbiBtb3ZlQXQocGFnZVgsIHBhZ2VZKSB7XG4gICAgICBpZiAoIXNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlKSB7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUubGVmdCA9XG4gICAgICAgICAgcGFnZVggLVxuICAgICAgICAgIChwbGF5ZXJTaGlwQ29udGFpbmVyc1twbGF5ZXJGbGVldC5sZW5ndGhdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggK1xuICAgICAgICAgICAgMTcuNSkgK1xuICAgICAgICAgIFwicHhcIjtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPVxuICAgICAgICAgIHBhZ2VZIC1cbiAgICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55ICtcbiAgICAgICAgICAgIDE3LjUpICtcbiAgICAgICAgICBcInB4XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmxlZnQgPVxuICAgICAgICAgIHBhZ2VYIC1cbiAgICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54ICtcbiAgICAgICAgICAgICgoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpIC8gMikgKiAzNSkgLVxuICAgICAgICAgIDE3LjUgK1xuICAgICAgICAgIFwicHhcIjtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPVxuICAgICAgICAgIHBhZ2VZIC1cbiAgICAgICAgICAocGxheWVyU2hpcENvbnRhaW5lcnNbcGxheWVyRmxlZXQubGVuZ3RoXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55IC1cbiAgICAgICAgICAgICgoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpIC8gMikgKiAzNSkgLVxuICAgICAgICAgIDE3LjUgK1xuICAgICAgICAgIFwicHhcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBtb3ZlIG91ciBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgY2FycmllciB1bmRlciB0aGUgcG9pbnRlclxuICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuXG4gICAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZSB0aGF0IHdlJ3JlIGZseWluZyBvdmVyIHJpZ2h0IG5vd1xuICAgIGxldCBjdXJyZW50RHJvcHBhYmxlID0gbnVsbDtcbiAgICBsZXQgZHJvcHBhYmxlQmVsb3cgPSBudWxsO1xuICAgIGxldCBpc0Ryb3BWYWxpZDtcblxuICAgIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcbiAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uaGlkZGVuID0gdHJ1ZTtcbiAgICAgIGxldCBlbGVtQmVsb3cgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuXG4gICAgICBpZiAoIWVsZW1CZWxvdykgcmV0dXJuO1xuXG4gICAgICAvLyBCRUdJTiAtLS0tIGNoZWNrcyB2YWxpZGl0eSBvZiB0aGUgZHJvcFxuICAgICAgbGV0IGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5ID0gW107XG4gICAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5zaGlmdCgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgbGV0IGdldENsYXNzVG9DaGVja1ZhbGlkaXR5O1xuICAgICAgICBpZiAoc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUpIHtcbiAgICAgICAgICBnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eSA9IGRvY3VtZW50XG4gICAgICAgICAgICAuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZICsgaSAqIDM1KVxuICAgICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBnZXRDbGFzc1RvQ2hlY2tWYWxpZGl0eSA9IGRvY3VtZW50XG4gICAgICAgICAgICAuZWxlbWVudEZyb21Qb2ludChldmVudC5jbGllbnRYICsgaSAqIDM1LCBldmVudC5jbGllbnRZKVxuICAgICAgICAgICAgLmdldEF0dHJpYnV0ZShgY2xhc3NgKTtcbiAgICAgICAgfVxuICAgICAgICBhcnJheU9mRWxlbWVudHNCZWxvd1RvQ2hlY2tWYWxpZGl0eS5wdXNoKGdldENsYXNzVG9DaGVja1ZhbGlkaXR5KTtcbiAgICAgICAgaWYgKGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5WzBdKSB7XG4gICAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICAgIGFycmF5T2ZFbGVtZW50c0JlbG93VG9DaGVja1ZhbGlkaXR5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmICgoaXRlbSAmJiBpdGVtLmluY2x1ZGVzKGBpbnZhbGlkYCkpIHx8IGl0ZW0gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChjb3VudGVyKSB7XG4gICAgICAgICAgICBpc0Ryb3BWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0Ryb3BWYWxpZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFTkQgLS0tLSBjaGVja3MgdmFsaWRpdHkgb2YgdGhlIGRyb3BcblxuICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5oaWRkZW4gPSBmYWxzZTtcblxuICAgICAgLy8gcG90ZW50aWFsIGRyb3BwYWJsZXMgYXJlIHRoZSBzcXVhcmVzIG9uIHRoZSBnYW1lYm9hcmRcbiAgICAgIGRyb3BwYWJsZUJlbG93ID0gZWxlbUJlbG93LmNsb3Nlc3QoXCIuY3B1U3F1YXJlXCIpO1xuXG4gICAgICBpZiAoIWRyb3BwYWJsZUJlbG93IHx8ICFpc0Ryb3BWYWxpZCkge1xuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLmN1cnNvciA9IGBuby1kcm9wYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuY3Vyc29yID0gYGdyYWJiaW5nYDtcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUgIT0gZHJvcHBhYmxlQmVsb3cpIHtcbiAgICAgICAgaWYgKGN1cnJlbnREcm9wcGFibGUpIHtcbiAgICAgICAgICBsZWF2ZURyb3BwYWJsZUFyZWEoY3VycmVudERyb3BwYWJsZSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudERyb3BwYWJsZSA9IGRyb3BwYWJsZUJlbG93O1xuICAgICAgICBpZiAoY3VycmVudERyb3BwYWJsZSkge1xuICAgICAgICAgIGVudGVyRHJvcHBhYmxlQXJlYShjdXJyZW50RHJvcHBhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVudGVyRHJvcHBhYmxlQXJlYShlbGVtZW50KSB7XG4gICAgICBzaGlwQ29vcmRzID0gW107XG4gICAgICBjb25zdCBpbmRleE9mSW5pdGlhbERyb3BQb2ludCA9ICtlbGVtZW50LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4gICAgICBjb25zdCBtYXhIb3Jpem9udGFsID0gKE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKyAxKSAqIDEwO1xuICAgICAgY29uc3QgbWF4VmVydGljYWwgPVxuICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCAtXG4gICAgICAgIE1hdGguZmxvb3IoaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgLyAxMCkgKiAxMCArXG4gICAgICAgIDkwO1xuICAgICAgaWYgKFxuICAgICAgICAhc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5yb3RhdGUgJiZcbiAgICAgICAgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyAoc2hpcExlbmd0aHNbcGxheWVyRmxlZXQubGVuZ3RoXSAtIDEpIDxcbiAgICAgICAgICBtYXhIb3Jpem9udGFsICYmXG4gICAgICAgIGlzRHJvcFZhbGlkXG4gICAgICApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0pIHtcbiAgICAgICAgICAgIGNwdUJvYXJkU3F1YXJlc1tpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgICAgIFwiIzgyOUU3NlwiO1xuICAgICAgICAgICAgc2hpcENvb3Jkcy5wdXNoKGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSAmJlxuICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIChzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdIC0gMSkgKiAxMCA8PVxuICAgICAgICAgIG1heFZlcnRpY2FsICYmXG4gICAgICAgIGlzRHJvcFZhbGlkXG4gICAgICApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3Roc1twbGF5ZXJGbGVldC5sZW5ndGhdOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXSkge1xuICAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW1xuICAgICAgICAgICAgICBpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMFxuICAgICAgICAgICAgXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM4MjlFNzZcIjtcbiAgICAgICAgICAgIHNoaXBDb29yZHMucHVzaChpbmRleE9mSW5pdGlhbERyb3BQb2ludCArIGkgKiAxMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcm9wcGFibGVCZWxvdyA9IG51bGw7XG4gICAgICAgIHNoaXBDb29yZHMgPSBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsZWF2ZURyb3BwYWJsZUFyZWEoZWxlbWVudCkge1xuICAgICAgc2hpcENvb3JkcyA9IFtdO1xuICAgICAgY29uc3QgaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgPSArZWxlbWVudC5kYXRhc2V0LmluZGV4TnVtYmVyO1xuICAgICAgaWYgKCFzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpXSkge1xuICAgICAgICAgICAgY3B1Qm9hcmRTcXVhcmVzW2luZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID1cbiAgICAgICAgICAgICAgXCIjYzFjMWMxXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGhzW3BsYXllckZsZWV0Lmxlbmd0aF07IGkrKykge1xuICAgICAgICAgIGlmIChjcHVCb2FyZFNxdWFyZXNbaW5kZXhPZkluaXRpYWxEcm9wUG9pbnQgKyBpICogMTBdKSB7XG4gICAgICAgICAgICBjcHVCb2FyZFNxdWFyZXNbXG4gICAgICAgICAgICAgIGluZGV4T2ZJbml0aWFsRHJvcFBvaW50ICsgaSAqIDEwXG4gICAgICAgICAgICBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2MxYzFjMVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vICgyKSBtb3ZlIHRoZSBzaGlwIG9uIG1vdXNlbW92ZVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuXG4gICAgLy8gKDMpIGRyb3AgdGhlIHNoaXAsIHJlbW92ZSB1bm5lZWRlZCBoYW5kbGVyc1xuICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0ub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG4gICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLm9ubW91c2V1cCA9IG51bGw7XG4gICAgICBpZiAoc2hpcENvb3Jkcy5sZW5ndGggIT09IDAgJiYgZHJvcHBhYmxlQmVsb3cgJiYgaXNEcm9wVmFsaWQpIHtcbiAgICAgICAgcGxheWVyRmxlZXQucHVzaCh7XG4gICAgICAgICAgbmFtZTogc2hpcE5hbWVzW3BsYXllckZsZWV0Lmxlbmd0aF0sXG4gICAgICAgICAgc2hpcFBsYWNlbWVudDogc2hpcENvb3JkcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHBsYXllclNoaXBDb250YWluZXJzW3BsYXllckZsZWV0Lmxlbmd0aCAtIDFdLnJlbW92ZUNoaWxkKFxuICAgICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aCAtIDFdXG4gICAgICAgICk7XG4gICAgICAgIHJlbmRlclBsYXllclNoaXBzKFtwbGF5ZXJGbGVldFtwbGF5ZXJGbGVldC5sZW5ndGggLSAxXV0pO1xuICAgICAgICBjcHVCb2FyZFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGAjYzFjMWMxYDtcbiAgICAgICAgfSk7XG4gICAgICAgIHNoaXBJbWdzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGluZGV4ID09PSBwbGF5ZXJGbGVldC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShgaGlkZS1zaGlwYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBsYXllckZsZWV0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHJhbmRvbWl6ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmUgYDtcbiAgICAgICAgICBjbGVhckJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYXllckZsZWV0Lmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgIHN0YXJ0QnRuLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgICBjbGVhckJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICAgICAgICAgIHJvdGF0ZUJ0bi5zdHlsZS5kaXNwbGF5ID0gYG5vbmVgO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGFjZVNoaXBzQ29udGFpbmVyLmluc2VydEJlZm9yZShcbiAgICAgICAgICBzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLFxuICAgICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aCArIDFdXG4gICAgICAgICk7XG4gICAgICAgIGlmIChzaGlwSW1nc1twbGF5ZXJGbGVldC5sZW5ndGhdLnN0eWxlLnJvdGF0ZSkge1xuICAgICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUucm90YXRlID0gYGA7XG4gICAgICAgIH1cbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS50b3AgPSBcIjEwMHB4XCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgIHNoaXBJbWdzW3BsYXllckZsZWV0Lmxlbmd0aF0uc3R5bGUuekluZGV4ID0gMDtcbiAgICAgICAgc2hpcEltZ3NbcGxheWVyRmxlZXQubGVuZ3RoXS5zdHlsZS5jdXJzb3IgPSBgZ3JhYmA7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICByZXR1cm4geyBoaWRlU2hpcHNUb1BsYWNlLCBzZXRVcFNoaXBzVG9EcmFnQW5kRHJvcCwgYmVnaW5TaGlwUGxhY2VtZW50IH07XG59KSgpO1xuXG5leHBvcnQgeyBzZXREcmFnQW5kRHJvcCB9O1xuIiwiaW1wb3J0IHsgR2FtZWJvYXJkLCBwbGFjZUNvbXB1dGVyRmxlZXQsIHJlY2VpdmVBdHRhY2sgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCB7IHJlbmRlck1vdmUsIGRlcmVnaXN0ZXJSZW1haW5pbmdFdmVudExpc3RuZW5lcnMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5pbXBvcnQgeyBzZXREcmFnQW5kRHJvcCB9IGZyb20gXCIuL2RyYWdBbmREcm9wXCI7XG5cbmNvbnN0IHN0b3JlZEdhbWVib2FyZHMgPSBbXTtcblxubGV0IHR1cm5Db3VudGVyID0gMTtcbmZ1bmN0aW9uIHR1cm5Ecml2ZXIoKSB7XG4gIGxldCB3aG9zZU1vdmU7XG4gIGlmICh0dXJuQ291bnRlciAlIDIgIT09IDApIHtcbiAgICB3aG9zZU1vdmUgPSBgcGxheWVyYDtcbiAgfSBlbHNlIHtcbiAgICB3aG9zZU1vdmUgPSBgY29tcHV0ZXJgO1xuICB9XG4gIHR1cm5Db3VudGVyICs9IDE7XG4gIHJldHVybiB3aG9zZU1vdmU7XG59XG5cbmNvbnN0IHJhbmRvbWl6ZVBsYXllckZsZWV0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgYCNyYW5kb21pemUtcGxheWVyLWZsZWV0YFxuKTtcbnJhbmRvbWl6ZVBsYXllckZsZWV0QnRuLmFkZEV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcmFuZG9taXplUGxheWVyRmxlZXQpO1xuXG5mdW5jdGlvbiByYW5kb21pemVQbGF5ZXJGbGVldCgpIHtcbiAgc2V0RHJhZ0FuZERyb3AuaGlkZVNoaXBzVG9QbGFjZSgpO1xuICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzdGFydC1nYW1lLWJ0bmApO1xuICBzdGFydEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gIGlmIChzdG9yZWRHYW1lYm9hcmRzWzFdKSB7XG4gICAgc3RvcmVkR2FtZWJvYXJkcy5wb3AoKTtcbiAgICBjb25zdCBjcHVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgICBjb25zdCByZW5kZXJlZFBsYXllclNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGAucGxheWVyLXNoaXBzLXJlbmRlcmVkYFxuICAgICk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgIGNwdUJvYXJkLnJlbW92ZUNoaWxkKHJlbmRlcmVkUGxheWVyU2hpcHNbaV0pO1xuICAgIH1cbiAgfVxuICBjb25zdCBwbGF5ZXJGbGVldEFycmF5ID0gW107XG4gIGNvbnN0IHBsYXllckZsZWV0ID0gcGxhY2VDb21wdXRlckZsZWV0KGB1c2VyYCwgcGxheWVyRmxlZXRBcnJheSk7XG4gIGNyZWF0ZVBsYXllck9iamVjdHMocGxheWVyRmxlZXQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQbGF5ZXJPYmplY3RzKGZsZWV0KSB7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gR2FtZWJvYXJkKGZsZWV0KTtcbiAgc3RvcmVkR2FtZWJvYXJkcy5wdXNoKFtgY29tcHV0ZXJgLCBwbGF5ZXJCb2FyZF0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wdXRlck9iamVjdHMoKSB7XG4gIGNvbnN0IGNwdUZsZWV0QXJyYXkgPSBbXTtcbiAgY29uc3QgY29tcHV0ZXJGbGVldCA9IHBsYWNlQ29tcHV0ZXJGbGVldChgY3B1YCwgY3B1RmxlZXRBcnJheSk7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lYm9hcmQoY29tcHV0ZXJGbGVldCk7XG4gIHN0b3JlZEdhbWVib2FyZHMucHVzaChbYHBsYXllcmAsIGNvbXB1dGVyQm9hcmRdKTtcbn1cbmNyZWF0ZUNvbXB1dGVyT2JqZWN0cygpO1xuXG5sZXQgZ2V0VmFsaWRNb3ZlcyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xubGV0IGdldFBsYXllck1vdmVzUmVtYWluaW5nID0gY3JlYXRlVmFsaWRNb3Zlc0FycmF5KCk7XG5cbmZ1bmN0aW9uIGhhbmRsZVN0YXRlKCkge1xuICBpZiAoc3RvcmVkR2FtZWJvYXJkcy5sZW5ndGggPT09IDIpIHtcbiAgICBzdG9yZWRHYW1lYm9hcmRzLnNoaWZ0KCk7XG4gIH1cbiAgc3RvcmVkR2FtZWJvYXJkcy5zaGlmdCgpO1xuICBjcmVhdGVDb21wdXRlck9iamVjdHMoKTtcbiAgZ2V0VmFsaWRNb3ZlcyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xuICBnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyA9IGNyZWF0ZVZhbGlkTW92ZXNBcnJheSgpO1xufVxuXG4vLyBCRUdJTiAtLS0tLSBnZW5lcmF0ZXMgcmFuZG9tIG1vdmUgZm9yIGNvbXB1dGVyIC0tLS0tLS0tLS0tIC8vXG5mdW5jdGlvbiBjcmVhdGVWYWxpZE1vdmVzQXJyYXkoKSB7XG4gIGNvbnN0IHZhbGlkTW92ZXMgPSBbXTtcbiAgY29uc3QgbWF4TW92ZXMgPSAxMDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4TW92ZXM7IGkrKykge1xuICAgIHZhbGlkTW92ZXMucHVzaChpKTtcbiAgfVxuICByZXR1cm4gdmFsaWRNb3Zlcztcbn1cblxuLy8gZnVuY3Rpb24gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpIHtcbi8vICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnZXRWYWxpZE1vdmVzLmxlbmd0aCk7XG4vLyAgIGNvbnN0IHJhbmRvbU1vdmUgPSBnZXRWYWxpZE1vdmVzW3JhbmRvbUluZGV4XTtcbi8vICAgZ2V0VmFsaWRNb3Zlcy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuLy8gICByZXR1cm4gcmFuZG9tTW92ZTtcbi8vIH1cblxubGV0IGlzQUlUcmlnZ2VyZWQgPSBmYWxzZTtcbmxldCBpbml0aWFsQ1BVSGl0T2JqZWN0O1xubGV0IHZhbGlkU21hcnRNb3ZlcztcblxuZnVuY3Rpb24gZ2V0VmFsaWRBZGphY2VudENQVU1vdmVzKGluaXRpYWxIaXQpIHtcbiAgY29uc29sZS5sb2coaW5pdGlhbEhpdCk7XG4gIGNvbnN0IHZhbGlkTW92ZXNSaWdodCA9IGdldE1vdmVzUmlnaHQoaW5pdGlhbEhpdCk7XG4gIGNvbnN0IHZhbGlkTW92ZXNMZWZ0ID0gZ2V0TW92ZXNMZWZ0KGluaXRpYWxIaXQpO1xuICBjb25zdCB2YWxpZE1vdmVzRG93biA9IGdldE1vdmVzRG93bihpbml0aWFsSGl0KTtcbiAgY29uc3QgdmFsaWRNb3Zlc1VwID0gZ2V0TW92ZXNVcChpbml0aWFsSGl0KTtcbiAgcmV0dXJuIHsgdmFsaWRNb3Zlc1JpZ2h0LCB2YWxpZE1vdmVzTGVmdCwgdmFsaWRNb3Zlc0Rvd24sIHZhbGlkTW92ZXNVcCB9O1xufVxuXG5mdW5jdGlvbiBnZXRNb3Zlc1JpZ2h0KGhpdCkge1xuICBjb25zdCBnZXRJbmRleCA9IGdldFZhbGlkTW92ZXMuaW5kZXhPZihoaXQpO1xuICBjb25zdCBtb3Zlc1JpZ2h0ID0gW107XG4gIGdldFZhbGlkTW92ZXMuc2xpY2UoZ2V0SW5kZXgpLmZpbHRlcigoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXRlbSAtIGhpdCAtIGluZGV4ID09PSAwICYmIGl0ZW0gPCAoTWF0aC5mbG9vcihoaXQgLyAxMCkgKyAxKSAqIDEwKSB7XG4gICAgICBtb3Zlc1JpZ2h0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgbW92ZXNSaWdodC5zaGlmdCgpO1xuICAvLyBjb25zb2xlLmxvZyh7IG1vdmVzUmlnaHQgfSk7XG4gIHJldHVybiBtb3Zlc1JpZ2h0O1xufVxuXG5mdW5jdGlvbiBnZXRNb3Zlc0xlZnQoaGl0KSB7XG4gIGNvbnN0IGdldEluZGV4ID0gZ2V0VmFsaWRNb3Zlcy5pbmRleE9mKGhpdCk7XG4gIGNvbnN0IG1hcFZhbGlkTW92ZXMgPSBnZXRWYWxpZE1vdmVzLm1hcCgoaXRlbSkgPT4ge1xuICAgIHJldHVybiBpdGVtO1xuICB9KTtcbiAgY29uc3QgbW92ZXNMZWZ0ID0gW107XG4gIG1hcFZhbGlkTW92ZXMuc3BsaWNlKGdldEluZGV4LCBtYXBWYWxpZE1vdmVzLmxlbmd0aCAtIDEpO1xuICBtYXBWYWxpZE1vdmVzLnJldmVyc2UoKS5maWx0ZXIoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgaWYgKGhpdCA9PT0gaXRlbSArIGluZGV4ICsgMSAmJiBpdGVtID49IE1hdGguZmxvb3IoaGl0IC8gMTApICogMTApIHtcbiAgICAgIG1vdmVzTGVmdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfSk7XG4gIC8vIGNvbnNvbGUubG9nKHsgbW92ZXNMZWZ0IH0pO1xuICByZXR1cm4gbW92ZXNMZWZ0O1xufVxuXG5mdW5jdGlvbiBnZXRNb3Zlc0Rvd24oaGl0KSB7XG4gIGNvbnN0IHZlcnRpY2FsTW92ZXMgPSBbXTtcbiAgZ2V0VmFsaWRNb3Zlcy5maWx0ZXIoKGNvb3JkKSA9PiB7XG4gICAgaWYgKGhpdCAlIDEwID09PSBjb29yZCAlIDEwKSB7XG4gICAgICB2ZXJ0aWNhbE1vdmVzLnB1c2goY29vcmQpO1xuICAgIH1cbiAgfSk7XG4gIC8vIGNvbnNvbGUubG9nKHZlcnRpY2FsTW92ZXMpO1xuICBjb25zdCBtb3Zlc0Rvd24gPSBbXTtcbiAgdmVydGljYWxNb3Zlcy5zbGljZSh2ZXJ0aWNhbE1vdmVzLmluZGV4T2YoaGl0KSkuZmlsdGVyKChjb29yZCwgaW5kZXgpID0+IHtcbiAgICBpZiAoY29vcmQgLSBoaXQgLSBpbmRleCAqIDEwID09PSAwKSB7XG4gICAgICBtb3Zlc0Rvd24ucHVzaChjb29yZCk7XG4gICAgfVxuICB9KTtcbiAgbW92ZXNEb3duLnNoaWZ0KCk7XG4gIC8vIGNvbnNvbGUubG9nKHsgbW92ZXNEb3duIH0pO1xuICByZXR1cm4gbW92ZXNEb3duO1xufVxuXG5mdW5jdGlvbiBnZXRNb3Zlc1VwKGhpdCkge1xuICBjb25zdCB2ZXJ0aWNhbE1vdmVzID0gZ2V0VmFsaWRNb3Zlcy5maWx0ZXIoKGNvb3JkKSA9PiB7XG4gICAgaWYgKGhpdCAlIDEwID09PSBjb29yZCAlIDEwKSB7XG4gICAgICByZXR1cm4gY29vcmQ7XG4gICAgfVxuICB9KTtcbiAgdmVydGljYWxNb3Zlcy5yZXZlcnNlKCk7XG4gIGNvbnN0IG1vdmVzVXAgPSB2ZXJ0aWNhbE1vdmVzXG4gICAgLnNsaWNlKHZlcnRpY2FsTW92ZXMuaW5kZXhPZihoaXQpKVxuICAgIC5maWx0ZXIoKGNvb3JkLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGhpdCA9PT0gY29vcmQgKyBpbmRleCAqIDEwKSB7XG4gICAgICAgIHJldHVybiBjb29yZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgaWYgKFxuICAgIGhpdCAlIDEwID09PSAwICYmXG4gICAgZ2V0VmFsaWRNb3Zlcy5pbmNsdWRlcygwKSAmJlxuICAgIGhpdCA9PT0gbW92ZXNVcC5sZW5ndGggKiAxMFxuICApIHtcbiAgICBtb3Zlc1VwLnB1c2goMCk7XG4gIH1cbiAgbW92ZXNVcC5zaGlmdCgpO1xuICAvLyBjb25zb2xlLmxvZyh7IG1vdmVzVXAgfSk7XG4gIHJldHVybiBtb3Zlc1VwO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbXB1dGVyQXR0YWNrKCkge1xuICBsZXQgY3B1TW92ZTtcbiAgaWYgKCFpc0FJVHJpZ2dlcmVkKSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnZXRWYWxpZE1vdmVzLmxlbmd0aCk7XG4gICAgY3B1TW92ZSA9IGdldFZhbGlkTW92ZXNbcmFuZG9tSW5kZXhdO1xuICAgIC8vIGdldFZhbGlkTW92ZXMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgfSBlbHNlIGlmICghaXNBZGphY2VudFNoaXBIaXQpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhgYmVnaW4gc21hcnQgbW92ZWApO1xuICAgIGNwdU1vdmUgPSBnZXRTbWFydENQVU1vdmUoKTtcbiAgICAvLyBnZXRWYWxpZE1vdmVzLnNwbGljZShnZXRWYWxpZE1vdmVzLmluZGV4T2YoY3B1TW92ZSksIDEpO1xuICB9XG4gIC8vIGVsc2UgaWYgKGlzQWRqYWNlbnRTaGlwSGl0KSB7XG4gIC8vIH1cbiAgcmV0dXJuIGNwdU1vdmU7XG59XG5cbmxldCBpc0FkamFjZW50U2hpcEhpdCA9IGZhbHNlO1xubGV0IGlzQUhpdCA9IHRydWU7XG5sZXQgaGl0c0NvdW50ZXIgPSAwO1xubGV0IHNtYXJ0TW92ZXNDb3VudGVyID0gMDtcbmxldCBudW1iZXJPZlNoaXBzU3Vua0J5QUkgPSAwO1xubGV0IHN1bmtTaGlwc0NoZWNrZXIgPSAwO1xubGV0IGlzSW5pdGlhbFNoaXBTdW5rID0gZmFsc2U7XG5sZXQgaXNWZXJ0aWNhbCA9IGZhbHNlO1xubGV0IGlzUmlnaHQgPSB0cnVlO1xubGV0IGlzTGVmdCA9IHRydWU7XG5sZXQgaXNEb3duID0gdHJ1ZTtcbmxldCBoaXRzRHVyaW5nQUkgPSBbXTtcbmxldCBpbml0aWFsQ1BVSGl0Q29vcmRpbmF0ZXM7XG5cbmZ1bmN0aW9uIGdldFNtYXJ0Q1BVTW92ZSgpIHtcbiAgbGV0IG1vdmU7XG4gIHNtYXJ0TW92ZXNDb3VudGVyICs9IDE7XG4gIGlmIChpc0FIaXQpIHtcbiAgICBoaXRzQ291bnRlciArPSAxO1xuICB9XG4gIGlmIChcbiAgICAvLyBmaXJzdCBtb3ZlIGlzIGFsd2F5cyByaWdodCBpZiBhcnJheVswXSBpcyB0cnV0aHlcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1JpZ2h0Lmxlbmd0aCAmJlxuICAgIGlzQUhpdCAmJlxuICAgIGhpdHNDb3VudGVyID09PSBzbWFydE1vdmVzQ291bnRlclxuICApIHtcbiAgICBtb3ZlID0gdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNSaWdodFswXTtcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1JpZ2h0LnNoaWZ0KCk7XG4gIH0gZWxzZSBpZiAoXG4gICAgKGlzUmlnaHQgJiZcbiAgICAgIGlzTGVmdCAmJlxuICAgICAgLy8gZmlyc3QgY29uZGl0aW9uIGlzIGlmIG1vdmVSaWdodCBETkUgdXBvbiBlbnRlcmluZyBBSSBiYyBoaXRzID09PSBzbWFydE1vdmVzXG4gICAgICAhdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNSaWdodC5sZW5ndGggJiZcbiAgICAgIGhpdHNDb3VudGVyID09PSBzbWFydE1vdmVzQ291bnRlciAmJlxuICAgICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0Lmxlbmd0aCkgfHxcbiAgICAvLyBzZWNvbmQgY29uZGl0aW9uIGlzIGZvciB0aGUgbW92ZSBpbW1lZGlhdGVseSBhZnRlciBtb3ZlUmlnaHQgbWlzc2VzLCB0aHVzIGhpdHMgYW5kIG1vdmVzIGRpZmZlciBieSAxXG4gICAgKGlzUmlnaHQgJiZcbiAgICAgIGlzTGVmdCAmJlxuICAgICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0Lmxlbmd0aCAmJlxuICAgICAgIWlzQUhpdCAmJlxuICAgICAgaGl0c0NvdW50ZXIgPT09IHNtYXJ0TW92ZXNDb3VudGVyIC0gMSkgfHxcbiAgICAvLyB0aGlyZCBjb25kaXRpb24gaXMgaWYgVk1SIGJlY29tZXMgZmFsc3kgd2l0aG91dCBzaW5raW5nIHRoZSBzaGlwIGJ5IHJ1bm5pbmcgdXAgYWdhaW5zdCByaWdodCBlZGdlIG9mIGdhbWVib2FyZFxuICAgIC8vIGluIHRoaXMgY2FzZSwgaGl0cyB3aWxsIGVxdWFsIHNtYXJ0TW92ZXMgYW5kIGdvIGxlZnQgdW50aWwgVk1MIGlzIGZhbHN5IG9yIGEgbWlzcyBpcyByZWdpc3RlcmVkXG4gICAgKGlzUmlnaHQgJiZcbiAgICAgIGlzTGVmdCAmJlxuICAgICAgIXZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzUmlnaHQubGVuZ3RoICYmXG4gICAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnQubGVuZ3RoICYmXG4gICAgICBoaXRzQ291bnRlciA9PT0gc21hcnRNb3Zlc0NvdW50ZXIpXG4gICkge1xuICAgIG1vdmUgPSB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnRbMF07XG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0LnNoaWZ0KCk7XG4gICAgaXNSaWdodCA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKFxuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzTGVmdC5sZW5ndGggJiZcbiAgICBpc0FIaXQgJiZcbiAgICBpc0xlZnQgJiZcbiAgICAhaXNWZXJ0aWNhbFxuICApIHtcbiAgICAvLyBoYW5kbGVzIGlmIG9uZSBvZiB0aGUgYWJvdmUgXCJlbHNlIGlmXCIgY29uZGl0aW9ucyByZWdpc3RlcnMgYSBoaXQgYnV0IHdpbGwgbm90IHRyaWdnZXIgb25jZSBBSSBwZXJmb3JtcyBhIG1vdmUgZG93blxuICAgIG1vdmUgPSB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnRbMF07XG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0LnNoaWZ0KCk7XG4gIH0gZWxzZSBpZiAoXG4gICAgLy8gaGFuZGxlcyB0aGUgY2FzZSBpbiB3aGljaCB0aGVyZSBhcmUgbm8gdmFsaWQgbW92ZXMgcmlnaHQgb3IgbGVmdCB1cG9uIGVudHJ5IGludG8gQUlcbiAgICAhdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNMZWZ0Lmxlbmd0aCAmJlxuICAgICF2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1JpZ2h0Lmxlbmd0aCAmJlxuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93bi5sZW5ndGggJiZcbiAgICAvLyBoaXRzQ291bnRlciA9PT0gc21hcnRNb3Zlc0NvdW50ZXJcbiAgICBpc0xlZnQgJiZcbiAgICAhaXNWZXJ0aWNhbFxuICApIHtcbiAgICBtb3ZlID0gdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duWzBdO1xuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93bi5zaGlmdCgpO1xuICAgIGlzTGVmdCA9IGZhbHNlO1xuICAgIGlzVmVydGljYWwgPSB0cnVlO1xuICB9IGVsc2UgaWYgKFxuICAgICF2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0xlZnQubGVuZ3RoICYmXG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duLmxlbmd0aCAmJlxuICAgIGlzQUhpdCAmJlxuICAgIGlzTGVmdFxuICApIHtcbiAgICBjb25zb2xlLmxvZyhgbGVmdCBlZGdlIGNhc2VgKTtcbiAgICBtb3ZlID0gdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duWzBdO1xuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93bi5zaGlmdCgpO1xuICAgIGlzTGVmdCA9IGZhbHNlO1xuICAgIGlzVmVydGljYWwgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93bi5sZW5ndGggJiYgIWlzQUhpdCAmJiAhaXNWZXJ0aWNhbCkge1xuICAgIC8vIGhhbmRsZXMgdGhlIGZpcnN0IHRpbWUgYSBtb3ZlIGlzIG1hZGUgZG93biB3aXRoIHRoZSBleGNlcHRpb24gb2YgdGhlIGFib3ZlIGVsc2UgaWYsIHRodXMgc2V0dGluZyBpc1ZlcnRpY2FsID0gdHJ1ZVxuICAgIG1vdmUgPSB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0Rvd25bMF07XG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duLnNoaWZ0KCk7XG4gICAgaXNMZWZ0ID0gZmFsc2U7XG4gICAgaXNWZXJ0aWNhbCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoXG4gICAgdmFsaWRTbWFydE1vdmVzLnZhbGlkTW92ZXNEb3duLmxlbmd0aCAmJlxuICAgIGlzQUhpdCAmJlxuICAgIGlzRG93biAmJlxuICAgIGlzVmVydGljYWxcbiAgKSB7XG4gICAgbW92ZSA9IHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzRG93blswXTtcbiAgICB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc0Rvd24uc2hpZnQoKTtcbiAgICBpc0xlZnQgPSBmYWxzZTtcbiAgfSBlbHNlIGlmICh2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1VwLmxlbmd0aCkge1xuICAgIG1vdmUgPSB2YWxpZFNtYXJ0TW92ZXMudmFsaWRNb3Zlc1VwWzBdO1xuICAgIHZhbGlkU21hcnRNb3Zlcy52YWxpZE1vdmVzVXAuc2hpZnQoKTtcbiAgICBpc0xlZnQgPSBmYWxzZTtcbiAgICBpc0Rvd24gPSBmYWxzZTtcbiAgICBpc1ZlcnRpY2FsID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBicmVha0Zyb21BSUxvb3AoKTtcbiAgICBtb3ZlID0gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpO1xuICB9XG4gIHJldHVybiBtb3ZlO1xufVxuLy8gRU5EIC0tLS0tIGdlbmVyYXRlcyBtb3ZlIGZvciBjb21wdXRlciAtLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBnYW1lTG9vcChwbGF5ZXJNb3ZlKSB7XG4gIGxldCBnZXRUdXJuO1xuICBsZXQgY29vcmRPZkF0dGFjaztcbiAgbGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgY29uc3QgaW5kZXhUb1NwbGljZSA9IGdldFBsYXllck1vdmVzUmVtYWluaW5nLmZpbmRJbmRleChcbiAgICAoaW5kZXgpID0+IGluZGV4ID09PSBwbGF5ZXJNb3ZlXG4gICk7XG4gIGdldFBsYXllck1vdmVzUmVtYWluaW5nLnNwbGljZShpbmRleFRvU3BsaWNlLCAxKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICBpZiAoIWlzR2FtZU92ZXIpIHtcbiAgICAgIGdldFR1cm4gPSB0dXJuRHJpdmVyKCk7XG4gICAgICBpZiAoZ2V0VHVybiA9PT0gYHBsYXllcmApIHtcbiAgICAgICAgY29vcmRPZkF0dGFjayA9IHBsYXllck1vdmU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZE9mQXR0YWNrID0gZ2VuZXJhdGVDb21wdXRlckF0dGFjaygpO1xuICAgICAgfVxuICAgICAgY29uc3QgYXR0YWNrT3V0Y29tZSA9IHJlY2VpdmVBdHRhY2soY29vcmRPZkF0dGFjaywgZ2V0VHVybik7XG4gICAgICAvLyBjb25zb2xlLmxvZyhhdHRhY2tPdXRjb21lKTtcblxuICAgICAgaWYgKGdldFR1cm4gPT09IGBjb21wdXRlcmApIHtcbiAgICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gJiYgIWlzQUlUcmlnZ2VyZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgZmlyc3QgaGl0YCk7XG4gICAgICAgICAgaXNBSVRyaWdnZXJlZCA9IHRydWU7XG4gICAgICAgICAgc3RvcmVkR2FtZWJvYXJkc1sxXVsxXS5zaGlwcy5mbGVldC5maWx0ZXIoKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5pc1N1bmspIHtcbiAgICAgICAgICAgICAgbnVtYmVyT2ZTaGlwc1N1bmtCeUFJICs9IDE7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG51bWJlck9mU2hpcHNTdW5rQnlBSSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc3RvcmVkR2FtZWJvYXJkc1sxXVsxXS5zaGlwcy5mbGVldC5maWx0ZXIoKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgLy8gaWYgKGF0dGFja091dGNvbWVbMF0gPT09IG9iamVjdC5uYW1lICYmIG9iamVjdC5oaXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0gPT09IG9iamVjdC5uYW1lKSB7XG4gICAgICAgICAgICAgIGluaXRpYWxDUFVIaXRPYmplY3QgPSBvYmplY3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc3RvcmVkR2FtZWJvYXJkc1sxXVsxXS5nYW1lYm9hcmQuZmlsdGVyKChvYmplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdID09PSBvYmplY3QubmFtZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvYmplY3Quc2hpcFBsYWNlbWVudCk7XG4gICAgICAgICAgICAgIGluaXRpYWxDUFVIaXRDb29yZGluYXRlcyA9IG9iamVjdC5zaGlwUGxhY2VtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhbGlkU21hcnRNb3ZlcyA9IGdldFZhbGlkQWRqYWNlbnRDUFVNb3ZlcyhhdHRhY2tPdXRjb21lWzFdKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyh2YWxpZFNtYXJ0TW92ZXMpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGluaXRpYWxDUFVIaXRPYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FJVHJpZ2dlcmVkKSB7XG4gICAgICAgICAgaWYgKGF0dGFja091dGNvbWVbMF0pIHtcbiAgICAgICAgICAgIGhpdHNEdXJpbmdBSS5wdXNoKGF0dGFja091dGNvbWVbMV0pO1xuICAgICAgICAgICAgaXNBSGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGlzSW5pdGlhbFNoaXBTdW5rID0gaW5pdGlhbENQVUhpdE9iamVjdC5pc1N1bms7XG4gICAgICAgICAgICBpZiAoaXNJbml0aWFsU2hpcFN1bmspIHtcbiAgICAgICAgICAgICAgLy8gaXNBSVRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAvLyBpbml0aWFsQ1BVSGl0T2JqZWN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgLy8gaGl0c0NvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAvLyBzbWFydE1vdmVzQ291bnRlciA9IDA7XG4gICAgICAgICAgICAgIC8vIGlzSW5pdGlhbFNoaXBTdW5rID0gZmFsc2U7XG4gICAgICAgICAgICAgIC8vIG51bWJlck9mU2hpcHNTdW5rQnlBSSA9IDA7XG4gICAgICAgICAgICAgIGJyZWFrRnJvbUFJTG9vcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3Vua1NoaXBzQ2hlY2tlcik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhudW1iZXJPZlNoaXBzU3Vua0J5QUkpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaXNJbml0aWFsU2hpcFN1bmspO1xuICAgICAgICAgICAgY29uc29sZS5sb2coaGl0c0R1cmluZ0FJKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluaXRpYWxDUFVIaXRDb29yZGluYXRlcyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdG9yZWRHYW1lYm9hcmRzWzFdWzFdLmdhbWVib2FyZCk7XG4gICAgICAgICAgICAvLyBpZiAoc3Vua1NoaXBzQ2hlY2tlciAhPT0gbnVtYmVyT2ZTaGlwc1N1bmtCeUFJKSB7XG4gICAgICAgICAgICAvLyAgIGlzQUlUcmlnZ2VyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXNBSGl0ID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbGlkU21hcnRNb3Zlcyk7XG4gICAgICAgIGdldFZhbGlkTW92ZXMuc3BsaWNlKGdldFZhbGlkTW92ZXMuaW5kZXhPZihhdHRhY2tPdXRjb21lWzFdKSwgMSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKGF0dGFja091dGNvbWUpO1xuICAgICAgcmVuZGVyTW92ZShnZXRUdXJuLCBhdHRhY2tPdXRjb21lKTtcbiAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGF0dGFja091dGNvbWUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzdG9yZWRHYW1lYm9hcmRzKTtcbiAgICAgICAgc3RvcmVkR2FtZWJvYXJkcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoaXRlbVswXSA9PT0gZ2V0VHVybikge1xuICAgICAgICAgICAgaXNHYW1lT3ZlciA9IGl0ZW1bMV0uaXNHYW1lT3ZlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdICYmIGdldFR1cm4gPT09IGBwbGF5ZXJgKSB7XG4gICAgICAgIGxldCBpc1NoaXBTdW5rO1xuICAgICAgICBzdG9yZWRHYW1lYm9hcmRzWzBdWzFdLnNoaXBzLmZsZWV0LmZpbHRlcigob2JqZWN0LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChhdHRhY2tPdXRjb21lWzBdID09PSBvYmplY3QubmFtZSkge1xuICAgICAgICAgICAgaXNTaGlwU3VuayA9IG9iamVjdC5pc1N1bms7XG4gICAgICAgICAgICBpZiAoaXNTaGlwU3Vuaykge1xuICAgICAgICAgICAgICBjb25zdCBjcHVIaWRkZW5TaGlwcyA9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICAgICAgICAgICAgICBjcHVIaWRkZW5TaGlwc1tpbmRleF0uc3R5bGUuZGlzcGxheSA9IGBibG9ja2A7XG4gICAgICAgICAgICAgIGNwdUhpZGRlblNoaXBzW2luZGV4XS5zdHlsZS56SW5kZXggPSBgMWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzR2FtZU92ZXIpIHtcbiAgICAgICAgY29uc3QgZ2FtZU92ZXJNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNnYW1lLW92ZXItbW9kYWxgKTtcbiAgICAgICAgY29uc3QgZGlzcGxheVdpbm5lclRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjZGlzcGxheS13aW5uZXJgKTtcbiAgICAgICAgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhnZXRQbGF5ZXJNb3Zlc1JlbWFpbmluZyk7XG4gICAgICAgIGlmIChnZXRUdXJuID09PSBgcGxheWVyYCkge1xuICAgICAgICAgIGRpc3BsYXlXaW5uZXJUZXh0LnRleHRDb250ZW50ID0gYFlvdSB3aW4hYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwbGF5V2lubmVyVGV4dC50ZXh0Q29udGVudCA9IGBZb3UgbG9zZSFgO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVPdmVyTW9kYWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYnJlYWtGcm9tQUlMb29wKCkge1xuICAvLyBpZiAoaGl0c0R1cmluZ0FJLmxlbmd0aCA9PT0gaW5pdGlhbENQVUhpdE9iamVjdC5sZW5ndGgpIHtcbiAgY29uc29sZS5sb2coYG5vdGhpbmcgYWRqYWNlbnQgaGl0YCk7XG4gIGlzQUlUcmlnZ2VyZWQgPSBmYWxzZTtcbiAgaW5pdGlhbENQVUhpdE9iamVjdCA9IG51bGw7XG4gIGhpdHNDb3VudGVyID0gMDtcbiAgc21hcnRNb3Zlc0NvdW50ZXIgPSAwO1xuICBpc0luaXRpYWxTaGlwU3VuayA9IGZhbHNlO1xuICBudW1iZXJPZlNoaXBzU3Vua0J5QUkgPSAwO1xuICBpc1JpZ2h0ID0gdHJ1ZTtcbiAgaXNMZWZ0ID0gdHJ1ZTtcbiAgaXNEb3duID0gdHJ1ZTtcbiAgaXNWZXJ0aWNhbCA9IGZhbHNlO1xuICAvLyB9XG4gIGluaXRpYWxDUFVIaXRDb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCwgaW5kZXgpID0+IHtcbiAgICBpZiAoaGl0c0R1cmluZ0FJLmluY2x1ZGVzKGNvb3JkKSkge1xuICAgICAgY29uc29sZS5sb2coY29vcmQpO1xuICAgICAgaGl0c0R1cmluZ0FJLnNwbGljZShoaXRzRHVyaW5nQUkuaW5kZXhPZihjb29yZCksIDEpO1xuICAgICAgY29uc29sZS5sb2coaGl0c0R1cmluZ0FJKTtcbiAgICB9XG4gIH0pO1xuICBpZiAoaGl0c0R1cmluZ0FJLmxlbmd0aCAhPT0gMCkge1xuICAgIGluaXRpYWxpemVBSShoaXRzRHVyaW5nQUlbMF0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVBSShhZGphY2VudEhpdCkge1xuICBzdG9yZWRHYW1lYm9hcmRzWzFdWzFdLmdhbWVib2FyZC5maWx0ZXIoKG9iamVjdCkgPT4ge1xuICAgIGlmIChvYmplY3Quc2hpcFBsYWNlbWVudC5pbmNsdWRlcyhhZGphY2VudEhpdCkpIHtcbiAgICAgIGluaXRpYWxDUFVIaXRPYmplY3QgPSBvYmplY3Q7XG4gICAgICBpbml0aWFsQ1BVSGl0Q29vcmRpbmF0ZXMgPSBvYmplY3Quc2hpcFBsYWNlbWVudDtcbiAgICB9XG4gIH0pO1xuICBjb25zb2xlLmxvZyhpbml0aWFsQ1BVSGl0T2JqZWN0KTtcbiAgY29uc29sZS5sb2coaW5pdGlhbENQVUhpdENvb3JkaW5hdGVzKTtcbn1cblxuZXhwb3J0IHsgc3RvcmVkR2FtZWJvYXJkcywgZ2FtZUxvb3AsIGNyZWF0ZVBsYXllck9iamVjdHMsIGhhbmRsZVN0YXRlIH07XG4iLCJpbXBvcnQgeyBTaGlwcyB9IGZyb20gXCIuL3NoaXBNb2R1bGVcIjtcbmltcG9ydCB7IHN0b3JlZEdhbWVib2FyZHMgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xuaW1wb3J0IHsgcmVuZGVyQ29tcHV0ZXJTaGlwcywgcmVuZGVyUGxheWVyU2hpcHMgfSBmcm9tIFwiLi9yZW5kZXJHYW1lXCI7XG5cbmNvbnN0IEdhbWVib2FyZCA9IChmbGVldEFycmF5KSA9PiB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IFtcbiAgICBmbGVldEFycmF5WzBdLFxuICAgIGZsZWV0QXJyYXlbMV0sXG4gICAgZmxlZXRBcnJheVsyXSxcbiAgICBmbGVldEFycmF5WzNdLFxuICAgIGZsZWV0QXJyYXlbNF0sXG4gIF07XG4gIGNvbnN0IG1pc3NlcyA9IFtdO1xuICBjb25zdCBzaGlwcyA9IFNoaXBzKCk7XG5cbiAgY29uc3QgaXNHYW1lT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBhcnJheSA9IHNoaXBzLmZsZWV0O1xuICAgIGxldCBpc0dhbWVPdmVyID0gZmFsc2U7XG4gICAgbGV0IHNoaXBzU3Vua0NvdW50ZXIgPSAwO1xuXG4gICAgYXJyYXkuZmlsdGVyKChvYmopID0+IHtcbiAgICAgIGlmIChvYmouaXNTdW5rKSB7XG4gICAgICAgIHNoaXBzU3Vua0NvdW50ZXIgKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc2hpcHNTdW5rQ291bnRlciA9PT0gNSkge1xuICAgICAgaXNHYW1lT3ZlciA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpc0dhbWVPdmVyO1xuICB9O1xuXG4gIHJldHVybiB7IGdhbWVib2FyZCwgbWlzc2VzLCBzaGlwcywgaXNHYW1lT3ZlciB9O1xufTtcblxuY29uc3QgcmVjZWl2ZUF0dGFjayA9IChhdHRhY2tDb29yZCwgdXNlcikgPT4ge1xuICBsZXQgaW5kZXg7XG4gIGxldCBhdHRhY2tPdXRjb21lID0gW251bGwsIGF0dGFja0Nvb3JkXTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgaW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gMTtcbiAgfVxuICBjb25zdCBnYW1lYm9hcmRPYmplY3QgPSBzdG9yZWRHYW1lYm9hcmRzW2luZGV4XVsxXTtcbiAgZ2FtZWJvYXJkT2JqZWN0LmdhbWVib2FyZC5mb3JFYWNoKChvYmplY3QpID0+IHtcbiAgICBpZiAob2JqZWN0LnNoaXBQbGFjZW1lbnQuaW5jbHVkZXMoYXR0YWNrQ29vcmQpKSB7XG4gICAgICBhdHRhY2tPdXRjb21lID0gW29iamVjdC5uYW1lLCBhdHRhY2tDb29yZF07XG4gICAgfVxuICB9KTtcbiAgaWYgKCFhdHRhY2tPdXRjb21lWzBdKSB7XG4gICAgZ2FtZWJvYXJkT2JqZWN0Lm1pc3Nlcy5wdXNoKGF0dGFja0Nvb3JkKTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lYm9hcmRPYmplY3Quc2hpcHMuaGl0KGF0dGFja091dGNvbWUpO1xuICAgIGdhbWVib2FyZE9iamVjdC5zaGlwcy5pc1N1bmsoYXR0YWNrT3V0Y29tZVswXSk7XG4gIH1cbiAgcmV0dXJuIGF0dGFja091dGNvbWU7XG59O1xuXG4vLyBCRUdJTi0tLS0tLS0tIGNyZWF0ZXMgYSByYW5kb21seSBwbGFjZWQgYm9hcmRzIC0tLS0tLS0gLy9cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCkge1xuICBjb25zdCBudW1iZXJPZkNvb3JkaW5hdGVzID0gMTAwO1xuICBjb25zdCBvcmllbnRhdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICBjb25zdCBmaXJzdENvb3JkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtYmVyT2ZDb29yZGluYXRlcyk7XG4gIHJldHVybiBbb3JpZW50YXRpb24sIGZpcnN0Q29vcmRdO1xufVxuXG5mdW5jdGlvbiBvcmllbnRTaGlwKHN0YXJ0Q29vcmQsIG9yaWVudGF0aW9uLCBuYW1lLCBsZW5ndGgpIHtcbiAgbGV0IHNoaXBQbGFjZW1lbnQgPSBbXTtcbiAgbGV0IGhvcml6b250YWxMaW1pdDtcbiAgaWYgKHN0YXJ0Q29vcmQgPCAxMCkge1xuICAgIGhvcml6b250YWxMaW1pdCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgaG9yaXpvbnRhbExpbWl0ID0gKyhzdGFydENvb3JkLnRvU3RyaW5nKCkuY2hhckF0KDApICsgOSk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChvcmllbnRhdGlvbikge1xuICAgICAgaWYgKHN0YXJ0Q29vcmQgKyAobGVuZ3RoIC0gMSkgKiAxMCA8IDEwMCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkgKiAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCAtIGkgKiAxMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGFydENvb3JkICsgKGxlbmd0aCAtIDEpIDw9IGhvcml6b250YWxMaW1pdCkge1xuICAgICAgICBzaGlwUGxhY2VtZW50LnB1c2goc3RhcnRDb29yZCArIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFBsYWNlbWVudC5wdXNoKHN0YXJ0Q29vcmQgLSBpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgbmFtZSwgc2hpcFBsYWNlbWVudCB9O1xufVxuXG5mdW5jdGlvbiB2ZXJpZnlDb29yZHMoYXJyYXksIG9iamVjdCkge1xuICBjb25zdCBzaGlwVG9WZXJpZnkgPSBvYmplY3Quc2hpcFBsYWNlbWVudDtcbiAgbGV0IGlzUGxhY2VtZW50VmFsaWQgPSBmYWxzZTtcbiAgaWYgKCFhcnJheS5sZW5ndGgpIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbiAgfSBlbHNlIHtcbiAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBUb1ZlcmlmeS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXkuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICAgIGlmIChpc1BsYWNlbWVudFZhbGlkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXAuc2hpcFBsYWNlbWVudC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICBpZiAoc2hpcFRvVmVyaWZ5W2ldICE9PSBzaGlwLnNoaXBQbGFjZW1lbnRbal0pIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc1BsYWNlbWVudFZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaXNQbGFjZW1lbnRWYWxpZDtcbn1cblxuLy8gdXNlZCBmb3IgdGhlIG5hbWUgYW5kIGxlbmd0aCBwcm9wcyBpbiB0aGUgcGxhY2VDb21wdXRlckZsZWV0IGZ4blxuY29uc3Qgc2hpcENsb25lID0gU2hpcHMoKTtcblxuZnVuY3Rpb24gcGxhY2VDb21wdXRlckZsZWV0KHVzZXIsIGFycmF5KSB7XG4gIHNoaXBDbG9uZS5mbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcbiAgICB3aGlsZSAoIWlzVmFsaWQpIHtcbiAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHJhbmRvbVZhbHVlcyA9IGdlbmVyYXRlUmFuZG9tUGxhY2VtZW50KCk7XG4gICAgICBjb25zdCBwbGFjZW1lbnQgPSBvcmllbnRTaGlwKFxuICAgICAgICByYW5kb21WYWx1ZXNbMV0sXG4gICAgICAgIHJhbmRvbVZhbHVlc1swXSxcbiAgICAgICAgc2hpcC5uYW1lLFxuICAgICAgICBzaGlwLmxlbmd0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHZlcmlmeSA9IHZlcmlmeUNvb3JkcyhhcnJheSwgcGxhY2VtZW50KTtcbiAgICAgIGlmICh2ZXJpZnkpIHtcbiAgICAgICAgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIGFycmF5LnB1c2gocGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAodXNlciA9PT0gYGNwdWApIHtcbiAgICByZW5kZXJDb21wdXRlclNoaXBzKGFycmF5KTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJQbGF5ZXJTaGlwcyhhcnJheSk7XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuLy8gRU5ELS0tLS0tLS0gY3JlYXRlcyBhIHJhbmRvbWx5IHBsYWNlZCBib2FyZCBmb3IgcGxheWVyIC0tLS0tLS0gLy9cblxuZXhwb3J0IHsgR2FtZWJvYXJkLCBwbGFjZUNvbXB1dGVyRmxlZXQsIHJlY2VpdmVBdHRhY2sgfTtcbiIsImltcG9ydCB7IGdhbWVMb29wLCBoYW5kbGVTdGF0ZSB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XG5pbXBvcnQgeyBzZXREcmFnQW5kRHJvcCB9IGZyb20gXCIuL2RyYWdBbmREcm9wXCI7XG5cbmZ1bmN0aW9uIHJlbmRlckdhbWVib2FyZCh1c2VyKSB7XG4gIGxldCBib2FyZERpdjtcbiAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgaWYgKHVzZXIgPT09IGBwbGF5ZXJgKSB7XG4gICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxheWVyLWJvYXJkYCk7XG4gICAgYm9hcmQuc2V0QXR0cmlidXRlKGBpZGAsIGBwbGF5ZXItc3F1YXJlcy1jb250YWluZXJgKTtcbiAgfSBlbHNlIHtcbiAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNjcHUtYm9hcmRgKTtcbiAgICBib2FyZC5zZXRBdHRyaWJ1dGUoYGlkYCwgYGNwdS1zcXVhcmVzLWNvbnRhaW5lcmApO1xuICB9XG4gIGJvYXJkLmNsYXNzTGlzdC5hZGQoYGdhbWVib2FyZGApO1xuICBjb25zdCBtYXhTcXVhcmVzID0gMTAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1heFNxdWFyZXM7IGkrKykge1xuICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGRpdmApO1xuICAgIHNxdWFyZS5kYXRhc2V0LmluZGV4TnVtYmVyID0gaTtcbiAgICBpZiAodXNlciA9PT0gYHBsYXllcmApIHtcbiAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKGBwbGF5ZXJTcXVhcmVgKTtcbiAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKGBjbGlja2AsIHBsYXllckF0dGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKGBjcHVTcXVhcmVgKTtcbiAgICB9XG4gICAgYm9hcmQuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgfVxuICBib2FyZERpdi5hcHBlbmRDaGlsZChib2FyZCk7XG59XG5cbmNvbnN0IHBsYXllckF0dGFjayA9IChlKSA9PiB7XG4gIGNvbnN0IGNvb3JkaW5hdGVDbGlja2VkID0gK2UudGFyZ2V0LmRhdGFzZXQuaW5kZXhOdW1iZXI7XG4gIGdhbWVMb29wKGNvb3JkaW5hdGVDbGlja2VkKTtcbiAgZS50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCBwbGF5ZXJBdHRhY2spO1xufTtcblxucmVuZGVyR2FtZWJvYXJkKGBjcHVgKTtcblxuZnVuY3Rpb24gZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyhhcnJheSkge1xuICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLnBsYXllclNxdWFyZWApO1xuICBhcnJheS5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgIHNxdWFyZXNbaW5kZXhdLnJlbW92ZUV2ZW50TGlzdGVuZXIoYGNsaWNrYCwgcGxheWVyQXR0YWNrKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlck1vdmUod2hvc2VUdXJuLCBhdHRhY2tBcnJheSkge1xuICAvLyBjb25zb2xlLmxvZyh7IHdob3NlVHVybiwgYXR0YWNrQXJyYXkgfSk7XG4gIGxldCBzcXVhcmVzO1xuICBjb25zdCBoaXRJbmRleCA9IGF0dGFja0FycmF5WzFdO1xuICBpZiAod2hvc2VUdXJuID09PSBgcGxheWVyYCkge1xuICAgIHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAucGxheWVyU3F1YXJlYCk7XG4gIH0gZWxzZSB7XG4gICAgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5jcHVTcXVhcmVgKTtcbiAgfVxuICBpZiAoYXR0YWNrQXJyYXlbMF0pIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBoaXRgKTtcbiAgfSBlbHNlIHtcbiAgICBzcXVhcmVzW2hpdEluZGV4XS5jbGFzc0xpc3QuYWRkKGBtaXNzYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29tcHV0ZXJTaGlwcyhjcHVGbGVldCkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgbGV0IGltZ1NyYztcblxuICBjcHVGbGVldC5mb3JFYWNoKChzaGlwT2JqZWN0KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgZGl2YCk7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoYGNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICAgIGNvbnN0IHNoaXBJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYGltZ2ApO1xuICAgIGlmIChzaGlwT2JqZWN0Lm5hbWUgPT09IGBQYXRyb2wgQm9hdGApIHtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvcGF0cm9sLnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgcGF0cm9sYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcE9iamVjdC5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpbWdTcmMgPSBgLi9pbWdzLyR7c2hpcE5hbWV9LnBuZ2A7XG4gICAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgJHtzaGlwTmFtZX1gKTtcbiAgICB9XG4gICAgc2hpcEltYWdlLnNyYyA9IGltZ1NyYztcblxuICAgIGNvbnN0IHNvcnRBc2NlbmRpbmcgPSBzaGlwT2JqZWN0LnNoaXBQbGFjZW1lbnQuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuICAgIGNvbnN0IGRpbWVuc2lvbk9mU3F1YXJlID0gMzU7XG4gICAgbGV0IHRvcE9mZnNldDtcbiAgICBsZXQgbGVmdE9mZnNldDtcbiAgICBpZiAoc29ydEFzY2VuZGluZ1swXSArIDEgPT09IHNvcnRBc2NlbmRpbmdbMV0pIHtcbiAgICAgIC8vIHBsYWNlIGhvcml6b250YWwgc2hpcHNcbiAgICAgIHRvcE9mZnNldCA9IE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gPCAxMCkge1xuICAgICAgICBsZWZ0T2Zmc2V0ID0gc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9ICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBsYWNlIHZlcnRpY2FsIHNoaXBzXG4gICAgICBzaGlwSW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgtOTBkZWcpYDtcbiAgICAgIHRvcE9mZnNldCA9XG4gICAgICAgIE1hdGguZmxvb3Ioc29ydEFzY2VuZGluZ1swXSAvIDEwKSAqIGRpbWVuc2lvbk9mU3F1YXJlICtcbiAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgc29ydEFzY2VuZGluZ1swXSAqIGRpbWVuc2lvbk9mU3F1YXJlIC1cbiAgICAgICAgICAoKHNvcnRBc2NlbmRpbmcubGVuZ3RoIC0gMSkgLyAyKSAqIDM1O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdE9mZnNldCA9XG4gICAgICAgICAgK3NvcnRBc2NlbmRpbmdbMF0udG9TdHJpbmcoKS5jaGFyQXQoMSkgKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwSW1hZ2Uuc3R5bGUudG9wID0gYCR7dG9wT2Zmc2V0fXB4YDtcbiAgICBzaGlwSW1hZ2Uuc3R5bGUubGVmdCA9IGAke2xlZnRPZmZzZXR9cHhgO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH0pO1xuICByZW5kZXJHYW1lYm9hcmQoYHBsYXllcmApO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQbGF5ZXJTaGlwcyhmbGVldCkge1xuICBpZiAoZmxlZXRbMF0uc2hpcFBsYWNlbWVudFswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGNwdUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NwdS1ib2FyZGApO1xuICBsZXQgaW1nU3JjO1xuXG4gIGZsZWV0LmZvckVhY2goKHNoaXBPYmplY3QpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBkaXZgKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChgcGxheWVyLXNoaXBzLXJlbmRlcmVkYCk7XG4gICAgY29uc3Qgc2hpcEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgaW1nYCk7XG4gICAgaWYgKHNoaXBPYmplY3QubmFtZSA9PT0gYFBhdHJvbCBCb2F0YCkge1xuICAgICAgaW1nU3JjID0gYC4vaW1ncy9wYXRyb2wucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGBwYXRyb2xgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwT2JqZWN0Lm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGltZ1NyYyA9IGAuL2ltZ3MvJHtzaGlwTmFtZX0ucG5nYDtcbiAgICAgIHNoaXBJbWFnZS5jbGFzc0xpc3QuYWRkKGAke3NoaXBOYW1lfWApO1xuICAgIH1cbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgaW52YWxpZGApO1xuICAgIHNoaXBJbWFnZS5zcmMgPSBpbWdTcmM7XG5cbiAgICBjb25zdCBzb3J0QXNjZW5kaW5nID0gc2hpcE9iamVjdC5zaGlwUGxhY2VtZW50LnNvcnQoKHgsIHkpID0+IHggLSB5KTtcbiAgICBjb25zdCBkaW1lbnNpb25PZlNxdWFyZSA9IDM1O1xuICAgIGxldCB0b3BPZmZzZXQ7XG4gICAgbGV0IGxlZnRPZmZzZXQ7XG4gICAgaWYgKHNvcnRBc2NlbmRpbmdbMF0gKyAxID09PSBzb3J0QXNjZW5kaW5nWzFdKSB7XG4gICAgICAvLyBwbGFjZSBob3Jpem9udGFsIHNoaXBzXG4gICAgICB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSAtIDM1MDtcbiAgICAgIGlmIChzb3J0QXNjZW5kaW5nWzBdIDwgMTApIHtcbiAgICAgICAgbGVmdE9mZnNldCA9IHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPSArc29ydEFzY2VuZGluZ1swXS50b1N0cmluZygpLmNoYXJBdCgxKSAqIGRpbWVuc2lvbk9mU3F1YXJlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwbGFjZSB2ZXJ0aWNhbCBzaGlwc1xuICAgICAgc2hpcEltYWdlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoLTkwZGVnKWA7XG4gICAgICB0b3BPZmZzZXQgPVxuICAgICAgICBNYXRoLmZsb29yKHNvcnRBc2NlbmRpbmdbMF0gLyAxMCkgKiBkaW1lbnNpb25PZlNxdWFyZSArXG4gICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzUgLVxuICAgICAgICAzNTA7XG4gICAgICBpZiAoc29ydEFzY2VuZGluZ1swXSA8IDEwKSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgIHNvcnRBc2NlbmRpbmdbMF0gKiBkaW1lbnNpb25PZlNxdWFyZSAtXG4gICAgICAgICAgKChzb3J0QXNjZW5kaW5nLmxlbmd0aCAtIDEpIC8gMikgKiAzNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnRPZmZzZXQgPVxuICAgICAgICAgICtzb3J0QXNjZW5kaW5nWzBdLnRvU3RyaW5nKCkuY2hhckF0KDEpICogZGltZW5zaW9uT2ZTcXVhcmUgLVxuICAgICAgICAgICgoc29ydEFzY2VuZGluZy5sZW5ndGggLSAxKSAvIDIpICogMzU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcEltYWdlLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGA7XG4gICAgc2hpcEltYWdlLnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YDtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hpcEltYWdlKTtcbiAgICBjcHVCb2FyZC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2xlYXJCb2FyZHMoZSkge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItYm9hcmRgKTtcbiAgY29uc3QgcGxheWVyU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXItc3F1YXJlcy1jb250YWluZXJgKTtcbiAgY29uc3QgY3B1Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY3B1LWJvYXJkYCk7XG4gIGNvbnN0IHBsYWNlU2hpcHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxhY2Utc2hpcHMtY29udGFpbmVyYCk7XG4gIGNvbnN0IHNoaXBzT25DUFVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5wbGF5ZXItc2hpcHMtcmVuZGVyZWRgKTtcbiAgY29uc3Qgc2hpcHNPblBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmNwdS1zaGlwcy1yZW5kZXJlZGApO1xuICBjb25zdCByZW1haW5pbmdTaGlwc1RvUGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuc2hpcHMtdG8tcGxhY2VgKTtcblxuICBjb25zdCBjcHVCb2FyZFNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuY3B1U3F1YXJlYCk7XG4gIGNwdUJvYXJkU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUpID0+IHtcbiAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYGA7XG4gIH0pO1xuXG4gIHBsYXllckJvYXJkLnJlbW92ZUNoaWxkKHBsYXllclNxdWFyZXMpO1xuICByZW1vdmVFbGVtZW50cyhjcHVCb2FyZCwgc2hpcHNPbkNQVUJvYXJkKTtcbiAgcmVtb3ZlRWxlbWVudHMocGxheWVyQm9hcmQsIHNoaXBzT25QbGF5ZXJCb2FyZCk7XG4gIHJlbW92ZUVsZW1lbnRzKHBsYWNlU2hpcHNDb250YWluZXIsIHJlbWFpbmluZ1NoaXBzVG9QbGFjZSk7XG4gIHJlZGlzcGxheVNoaXBzVG9QbGFjZShwbGFjZVNoaXBzQ29udGFpbmVyKTtcbiAgc2V0RHJhZ0FuZERyb3Auc2V0VXBTaGlwc1RvRHJhZ0FuZERyb3AoKTtcbiAgaGFuZGxlU3RhdGUoKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRWxlbWVudHMocGFyZW50LCBjaGlsZHJlbikge1xuICBpZiAoY2hpbGRyZW4pIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAocGFyZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlZGlzcGxheVNoaXBzVG9QbGFjZShwYXJlbnQpIHtcbiAgY29uc3QgbmFtZUhlbHBlciA9IFtcbiAgICBgY2FycmllcmAsXG4gICAgYGJhdHRsZXNoaXBgLFxuICAgIGBkZXN0cm95ZXJgLFxuICAgIGBzdWJtYXJpbmVgLFxuICAgIGBwYXRyb2xgLFxuICBdO1xuICBuYW1lSGVscGVyLmZvckVhY2goKHNoaXApID0+IHtcbiAgICBjb25zdCBzaGlwSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBpbWdgKTtcbiAgICBzaGlwSW1hZ2Uuc3JjID0gYC4vaW1ncy8ke3NoaXB9LnBuZ2A7XG4gICAgc2hpcEltYWdlLmNsYXNzTGlzdC5hZGQoYCR7c2hpcH1gKTtcbiAgICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChgc2hpcHMtdG8tcGxhY2VgKTtcbiAgICBzaGlwSW1hZ2Uuc2V0QXR0cmlidXRlKGBpZGAsIGBwbGF5ZXItJHtzaGlwfWApO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChzaGlwSW1hZ2UpO1xuICB9KTtcbn1cblxuZXhwb3J0IHtcbiAgZGVyZWdpc3RlclJlbWFpbmluZ0V2ZW50TGlzdG5lbmVycyxcbiAgcmVuZGVyTW92ZSxcbiAgcmVuZGVyQ29tcHV0ZXJTaGlwcyxcbiAgcmVuZGVyUGxheWVyU2hpcHMsXG4gIGNsZWFyQm9hcmRzLFxufTtcbiIsImNvbnN0IFNoaXBzID0gKCkgPT4ge1xuICBjb25zdCBmbGVldCA9IFtcbiAgICB7IG5hbWU6IGBDYXJyaWVyYCwgbGVuZ3RoOiA1LCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYEJhdHRsZXNoaXBgLCBsZW5ndGg6IDQsIGhpdHM6IFtdLCBpc1N1bms6IGZhbHNlIH0sXG4gICAgeyBuYW1lOiBgRGVzdHJveWVyYCwgbGVuZ3RoOiAzLCBoaXRzOiBbXSwgaXNTdW5rOiBmYWxzZSB9LFxuICAgIHsgbmFtZTogYFN1Ym1hcmluZWAsIGxlbmd0aDogMywgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgICB7IG5hbWU6IGBQYXRyb2wgQm9hdGAsIGxlbmd0aDogMiwgaGl0czogW10sIGlzU3VuazogZmFsc2UgfSxcbiAgXTtcblxuICBjb25zdCBoaXQgPSAoYXR0YWNrRGF0YSkgPT4ge1xuICAgIGNvbnN0IHNoaXBIaXQgPSBhdHRhY2tEYXRhWzBdO1xuICAgIGNvbnN0IGNvb3JkT2ZIaXQgPSBhdHRhY2tEYXRhWzFdO1xuICAgIGZsZWV0LmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwSGl0ID09PSBzaGlwLm5hbWUpIHtcbiAgICAgICAgc2hpcC5oaXRzLnB1c2goY29vcmRPZkhpdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKHNoaXBIaXQpID0+IHtcbiAgICBmbGVldC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcEhpdCA9PT0gc2hpcC5uYW1lICYmIHNoaXAubGVuZ3RoID09PSBzaGlwLmhpdHMubGVuZ3RoKSB7XG4gICAgICAgIHNoaXAuaXNTdW5rID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4geyBmbGVldCwgaGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCB7IFNoaXBzIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vZHJhZ0FuZERyb3BcIjtcblxuY29uc3QgbmV3R2FtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNuZXctZ2FtZS1idG5gKTtcbm5ld0dhbWVCdG4uYWRkRXZlbnRMaXN0ZW5lcihgY2xpY2tgLCAoKSA9PiBsb2NhdGlvbi5yZWxvYWQoKSk7XG4iXSwic291cmNlUm9vdCI6IiJ9