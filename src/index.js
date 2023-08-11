import './main.scss';

const domMethods = require('./domMethods');
const logicMethods = require('./logic');

function newGame() {
  const playerHuman = logicMethods.createGameboard();
  const playerComputer = logicMethods.createGameboard();

  domMethods.appendBoardPlayer(playerHuman.board);
  domMethods.appendBoardComputer(playerComputer)
  domMethods.placeShip(playerHuman);
}

newGame();
