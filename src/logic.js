function createShip(length) {
  return {
    length: length,
    hitsTaken: 0,
    hit: function () {
      this.hitsTaken++;
    },
    isSunk: function () {
      return this.length > this.hitsTaken ? false : true;
    },
  };
}

function createGameboard() {
  function getField(x, y) {
    return { x: x, y: y, ship: false, clicked: false };
  }

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  function getBoard() {
    const board = [];
    for (let i = 1; i <= 10; i++) {
      for (const column of columns) {
        board.push(getField(i, column));
      }
    }
    return board;
  }

  return {
    board: getBoard(),

    ships: {
      destroyer1: createShip(1),
      // destroyer2: createShip(1),
      // destroyer3: createShip(1),
      // destroyer4: createShip(1),
      // submarine1: createShip(2),
      // submarine2: createShip(2),
      // submarine3: createShip(2),
      // cruiser1: createShip(3),
      // cruiser2: createShip(3),
      // carrier: createShip(4),
    },

    placeShip: function (x, y, ship) {
      for (const field of this.board) {
        if (field.x === x && field.y === y) {
          field.ship = ship;
          return;
        }
      }
    },
    receiveAttack: function (x, y) {
      for (const field of this.board) {
        if (field.x === x && field.y === y) {
          field.clicked = true;
          if (field.ship) {
            field.ship.hit();
            return true;
          } else return false;
        }
      }
    },
    shipsSunk: function () {
      for (const ship in this.ships) {
        if (!this.ships[ship].isSunk()) return false;
      }
      return true;
    },
  };
}


const testGameBoard = createGameboard();
testGameBoard.placeShip(1, 'A', testGameBoard.ships.destroyer1);
testGameBoard.receiveAttack(1, 'A');
console.log(testGameBoard.shipsSunk());

module.exports = { createShip, createGameboard, createPlayer };

