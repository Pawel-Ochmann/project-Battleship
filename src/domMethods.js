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

function returnField(e, fields) {
  let field = null;
  for (const elem of fields) {
    if (e.x === elem.dataset.x && e.y === elem.dataset.y) {
      field = elem;
      break;
    }
  }
  return field;
}

function updateBoard(arrayFromLogic, fields, ship) {
  arrayFromLogic.forEach((el) => {
    const field = returnField(el, fields);
    console.log(field);
    field.dataset.ship = ship;
    field.dataset.free = false;
  });
}

function placeShip(board) {
  const fields = document.querySelectorAll('.player.board>div');

  const ships = document.querySelectorAll('.fleet.player img');

  const rotateIcons = document.querySelectorAll('.fleet i');

  const freeFields = [...fields].filter((field) => field.dataset.free);

  function showFreeFields() {
    freeFields.forEach((field) => {
      field.classList.add('fieldFree');
    });
  }
  function hideFreeFields() {
    freeFields.forEach((field) => {
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

    const shipToLoad = new Image();
    shipToLoad.src = `./images/${this.dataset.ship}.png`;
    shipToLoad.classList.add('shipToLoad');
    element.appendChild(shipToLoad);
    this.classList.add('inactive');
    this.removeEventListener('drag', showFreeFields);
    this.removeEventListener('dragend', dragend);
    const places = board.placeShip(
      element.dataset.x,
      element.dataset.y,
      this.dataset.ship
    );
    if (!places) return;

    updateBoard(places, fields, this.dataset.ship);
  }
  ships.forEach((ship) => {
    ship.addEventListener('drag', showFreeFields);
    ship.addEventListener('dragend', dragend);
  });
}

module.exports = { appendBoards, placeShip };
