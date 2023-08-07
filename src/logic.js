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
    return { x: x, y: y, ship: false, free: true };
  }

  // function returnField(x, y, board) {
  //   for (const field of board) {
  //     if (field.x === x && field.y === y) return field;
  //   }
  // }

  // function getShipFields(x, y, ship, board) {
  //   if (!ship) return;
  //   if (x + ship.length > 10) return false;
  //   const shipFields = [];
  //   for (let i = 0; i < ship.length; i++) {
  //     shipFields.push(returnField(x + i, y, board));
  //   }
  //   return shipFields;
  // }

  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  function getBoard() {
    const board = [];
    for (let i = 1; i <= 10; i++) {
      for (const column of columns) {
        board.push(getField(column, i));
      }
    }
    return board;
  }

  return {
    board: getBoard(),

    ships: {
      boat1: createShip(1),
      boat2: createShip(1),
      boat3: createShip(1),
      boat4: createShip(1),
      destroyer1: createShip(2),
      destroyer2: createShip(2),
      destroyer3: createShip(2),
      submarine1: createShip(3),
      submarine2: createShip(3),
      carrier: createShip(4),
    },

    // placeShip: function (x, y, shipName) {
    //   const places = getShipFields(+x, +y, this.ships[shipName], this.board);
    //   if (!places) return;
    //   places.forEach((place) => {
    //     place.ship = shipName;
    //     place.free = false;
    //   });
    //   return places;
    // },
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

testGameBoard.receiveAttack(1, 'A');

module.exports = { createShip, createGameboard };
