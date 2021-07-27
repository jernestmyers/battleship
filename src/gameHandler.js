import { Gameboard, placeComputerFleet, receiveAttack } from "./gameboard";
import { renderMove, deregisterRemainingEventListneners } from "./renderGame";
import { setDragAndDrop } from "./dragAndDrop";

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
  setDragAndDrop.hideShipsToPlace();
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
  const playerFleet = placeComputerFleet(`user`, playerFleetArray);
  createPlayerObjects(playerFleet);
}

function createPlayerObjects(fleet) {
  const playerBoard = Gameboard(fleet);
  storedGameboards.push([`computer`, playerBoard]);
}

function createComputerObjects() {
  const cpuFleetArray = [];
  const computerFleet = placeComputerFleet(`cpu`, cpuFleetArray);
  const computerBoard = Gameboard(computerFleet);
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
      const attackOutcome = receiveAttack(coordOfAttack, getTurn);
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
      renderMove(getTurn, attackOutcome);
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
        deregisterRemainingEventListneners(getPlayerMovesRemaining);
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

export { storedGameboards, gameLoop, createPlayerObjects, handleState };
