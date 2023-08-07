const playerBoard = document.querySelector('.player.board');
const computerBoard = document.querySelector('.computer.board');

function appendBoards(board1, board2) {
  for (const field of board1) {
    const box = document.createElement('div');
    box.dataset.x = field.x;
    box.dataset.y = field.y;
    box.dataset.free = true;
    box.dataset.ship = false;
    playerBoard.appendChild(box);
  }
  if (board2) {
    for (const field of board2) {
      const box = document.createElement('div');
      box.dataset.x = field.x;
      box.dataset.y = field.y;
      computerBoard.appendChild(box);
    }
  }
}

// function returnField(e, fields) {
//   let field = null;
//   for (const elem of fields) {
//     if (e.x === elem.dataset.x && e.y === elem.dataset.y) {
//       field = elem;
//       break;
//     }
//   }
//   return field;
// }

function getShipFieldsHorizontal(length, x, y) {
  const shipFields = [];
  for (let i = 0; i < length; i++) {
    const field = document.querySelector(
      `div[data-x='${+x + i}'][data-y='${y}'][data-free="true"]`
    );
    if (field) shipFields.push(field);
  }
  return shipFields;
}
function getShipFieldsVertical(length, x, y) {
  const shipFields = [];
  for (let i = 0; i < length; i++) {
    const field = document.querySelector(
      `img[data-x=${x}][data-y=${+y + i}][data-free="true]`
    );
    if (field) shipFields.push(field);
  }
  return shipFields;
}

function placeShip() {
  const ships = document.querySelectorAll('.fleet.player img');

  const rotateIcons = document.querySelectorAll('.fleet i');

  function getFreeFields() {
    const freeFields = document.querySelectorAll("div[data-free='true']");

    return freeFields;
  }

  function showFreeFields() {
    getFreeFields().forEach((field) => {
      field.classList.add('fieldFree');
    });
  }
  function hideFreeFields() {
    getFreeFields().forEach((field) => {
      field.classList.remove('fieldFree');
    });
  }

  rotateIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const shipToRotate = icon.nextElementSibling;
      shipToRotate.classList.toggle('shipRotate');
    });
  });

  function dragend(e) {
    hideFreeFields();
    e.preventDefault();
    const element = document.elementFromPoint(
      e.pageX - window.scrollX,
      e.pageY - window.scrollY
    );
    if (!element.dataset.free) return;

    let shipFields = [];
    if (this.classList.contains('horizontal')) {
      shipFields = getShipFieldsHorizontal(
        this.dataset.length,
        element.dataset.x,
        element.dataset.y
      );
    } else
      shipFields = getShipFieldsVertical(
        this.dataset.length,
        element.dataset.x,
        element.dataset.y
      );

    if (shipFields.length < this.dataset.length) return;
    shipFields.forEach((field) => {
      field.dataset.free = 'false';
      field.dataset.ship = this.dataset.ship;
    });

    const shipToLoad = new Image();
    shipToLoad.src = `./images/${this.dataset.ship}.png`;
    shipToLoad.classList.add('shipToLoad');
    element.appendChild(shipToLoad);
    this.classList.add('inactive');
    this.removeEventListener('drag', showFreeFields);
    this.removeEventListener('dragend', dragend);
  }
  ships.forEach((ship) => {
    ship.addEventListener('drag', showFreeFields);
    ship.addEventListener('dragend', dragend);
  });
}

module.exports = { appendBoards, placeShip };
