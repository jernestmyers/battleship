import { createPlayerObjects } from "./gameHandler";
import { renderPlayerShips, clearBoards } from "./renderGame";

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
    createPlayerObjects(playerFleet);
    cpuBoardSquares.forEach((square) => {
      square.style.backgroundColor = ``;
    });
  }
}

clearBtn.addEventListener(`click`, clearBoards);

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
      renderPlayerShips([playerFleet[playerFleet.length - 1]]);
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

export { hideShipsToPlace, setUpShipsToDragAndDrop, beginShipPlacement };
