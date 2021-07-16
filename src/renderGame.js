import { gameLoop } from "./gameHandler";

function renderGameboard() {
  const main = document.querySelector(`main`);
  const board = document.createElement(`div`);
  board.classList.add(`gameboard`);
  const maxSquares = 100;
  for (let i = 0; i < maxSquares; i++) {
    const square = document.createElement(`div`);
    square.textContent = i;
    square.dataset.indexNumber = i;
    square.classList.add(`square`);
    square.addEventListener(`click`, playerAttack);
    board.appendChild(square);
  }
  main.appendChild(board);
}

const playerAttack = (e) => {
  const coordinateClicked = +e.target.dataset.indexNumber;
  console.log(coordinateClicked);
  gameLoop(coordinateClicked);
  e.target.removeEventListener(`click`, playerAttack);
};

renderGameboard();

function deregisterRemainingEventListneners(array) {
  const squares = document.querySelectorAll(`.square`);
  array.forEach((index) => {
    squares[index].removeEventListener(`click`, playerAttack);
  });
}

export { deregisterRemainingEventListneners };
