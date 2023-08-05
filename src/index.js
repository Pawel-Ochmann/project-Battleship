import './main.scss';

const domMethods = require('./domMethods');
const logicMethods = require('./logic');

function newGame() {
  const playerHuman = logicMethods.createGameboard();
  const playerComputer = logicMethods.createGameboard();

  domMethods.appendBoards(playerHuman.board, playerComputer.board);
  domMethods.placeShip();
}

newGame();
