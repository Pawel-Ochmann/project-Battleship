const battleshipMethods = require('../logic.js');

let testShip;
let testGameBoard
beforeEach(()=> {
  testShip = battleshipMethods.createShip(4);
  testGameBoard = battleshipMethods.createGameboard();
})
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

test('boardCreated', ()=> {
  expect(testGameBoard.board.length).toBe(100);
})