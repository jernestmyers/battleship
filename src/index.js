import { createPlayerObjects } from "./gameHandler";
import { renderPlayerShips, clearBoards, startNewGame } from "./renderGame";

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
    createPlayerObjects(playerFleet);
    cpuBoardSquares.forEach((square) => {
      square.style.backgroundColor = ``;
    });
  }
}

clearBtn.addEventListener(`click`, clearBoards);
newGameBtn.addEventListener(`click`, clearBoards);

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
      renderPlayerShips([playerFleet[playerFleet.length - 1]]);
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

export { hideShipsToPlace, setUpShipsToDragAndDrop, beginShipPlacement };
