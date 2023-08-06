const battleshipMethods = require('../logic.js');

let testShip;
let testGameBoard;

beforeEach(() => {
  testShip = battleshipMethods.createShip(4);
  testGameBoard = battleshipMethods.createGameboard();
  player1 = battleshipMethods.createPlayer();
  player2 = battleshipMethods.createPlayer();
});

test('ship', () => {
  expect(testShip.length).toBe(4);
});
test('shipAlive', () => {
  expect(testShip.isSunk()).toBe(false);
});

test('shipSunk', () => {
  testShip.hit();
  testShip.hit();
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});

test('boardCreated', () => {
  expect(testGameBoard.board.length).toBe(100);
});

test('boardAttacked', () => {
  testGameBoard.placeShip(1, 'A', testGameBoard.ships.destroyer1);
  expect(testGameBoard.receiveAttack(1, 1)).toBe(true);
});
test('boardAttacked2', () => {
  expect(testGameBoard.receiveAttack(5, 7)).toBe(false);
});

test('fleetAlive', () => {
  expect(testGameBoard.shipsSunk()).toBe(false);
});

test('fleetDead', () => {
  testGameBoard.placeShip(1, 1, testGameBoard.ships.destroyer1);
  testGameBoard.receiveAttack(1, 1);
  expect(testGameBoard.shipsSunk()).toBe(true);
});
