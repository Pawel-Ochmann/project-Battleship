const playerBoard = document.querySelector('.player.board');
const board = document.querySelector('.boardContainer');
const computerBoardNode = document.createElement('div');
const cannon = document.querySelector('.cannon');
computerBoardNode.classList.add('computer', 'board', 'hidden');

const audio = (function () {
  const missAudio = document.querySelector('#miss');
  const scoreAudio = document.querySelector('#score');
  const shotAudio = document.querySelector('#shot');
  shotAudio.volume = 0.5;
  const sinkAudio = document.querySelector('#sink');

  function clear() {
    missAudio.currentTime = 0;
    scoreAudio.currentTime = 0;
    shotAudio.pause();
    shotAudio.currentTime = 0;
    sinkAudio.currentTime = 0;
  }

  return {
    miss: function () {
      clear();
      missAudio.play();
      console.log('miss');
    },
    score: function () {
      clear();
      scoreAudio.play();
    },
    shot: function () {
      clear();
      shotAudio.play();
      console.log('shot');
    },
    sink: function () {
      clear();
      sinkAudio.play();
    },
  };
})();

function randomOneToTen() {
  return Math.floor(Math.random() * 10 + 1);
}
function randomFalseTrue() {
  const outcome = Math.floor(Math.random() * 2);
  return outcome === 1 ? true : false;
}

function appendBoardPlayer(board) {
  for (const field of board) {
    const box = document.createElement('div');
    box.dataset.x = field.x;
    box.dataset.y = field.y;
    box.dataset.free = true;
    box.dataset.ship = false;
    playerBoard.appendChild(box);
  }
}

function appendBoardComputer(player) {
  function placeShipComputer(ship) {
    let fields = [];
    if (randomFalseTrue()) {
      fields = getShipFieldsHorizontal(
        ship.length,
        randomOneToTen(),
        randomOneToTen(),
        'computer'
      );
    } else
      fields = getShipFieldsVertical(
        ship.length,
        randomOneToTen(),
        randomOneToTen(),
        'computer'
      );

    if (fields.length < ship.length) {
      fields = placeShipComputer(ship);
    }
    return fields;
  }

  for (const field of player.board) {
    const box = document.createElement('div');
    box.dataset.x = field.x;
    box.dataset.y = field.y;
    box.dataset.free = true;
    box.dataset.ship = false;
    box.classList.add('fieldComputerHidden');
    box.addEventListener('click', makeMovePlayer);
    computerBoardNode.appendChild(box);
  }

  const ships = Object.entries(player.ships);
  for (const ship of ships) {
    let fields = placeShipComputer(ship[1]);
    fields.forEach((field) => {
      field.classList.add('fieldComputer');
      field.dataset.ship = ship[0];
      field.dataset.free = false;
      const fieldsAround = getFieldsAround(field, 'computer');
      fieldsAround.forEach((el) => {
        el.dataset.free = false;
        el.classList.add('fieldAround');
      });
    });
  }
  cannon.classList.remove('cannonHidden');
  const scoreAudio = document.querySelector('#score');
  setTimeout(() => {
    scoreAudio.pause();
  }, 1000);
}

function getShipFieldsHorizontal(length, x, y, player) {
  const shipFields = [];
  for (let i = 0; i < length; i++) {
    const field = document.querySelector(
      `div.${player} div[data-x='${+x + i}'][data-y='${y}'][data-free="true"]`
    );

    if (field) shipFields.push(field);
  }

  return shipFields;
}
function getShipFieldsVertical(length, x, y, player) {
  const shipFields = [];
  for (let i = 0; i < length; i++) {
    const field = document.querySelector(
      `div.${player} div[data-x='${x}'][data-y='${+y + i}'][data-free='true']`
    );

    if (field) shipFields.push(field);
  }
  return shipFields;
}

function markFalse(field) {
  field.dataset.free = 'false';
}

function getFieldsAround(field, player) {
  const x = field.dataset.x;
  const y = field.dataset.y;
  const fieldsAround = [
    [x - 1, y - 1],
    [x, y - 1],
    [+x + 1, y - 1],
    [x - 1, y],
    [+x + 1, y],
    [x - 1, +y + 1],
    [x, +y + 1],
    [+x + 1, +y + 1],
  ];
  const divsAround = [];
  fieldsAround.forEach((field) => {
    const div = document.querySelector(
      `div.${player} div[data-x='${field[0]}'][data-y='${field[1]}'][data-free='true']`
    );
    if (div) divsAround.push(div);
  });
  return divsAround;
}

function placeShip(computerBoard) {
  const ships = document.querySelectorAll('.fleet.player img');

  const rotateIcons = document.querySelectorAll('.fleet i');

  function checkIfDone() {
    const fleet = [...document.querySelectorAll('.fleet.player img')];
    if (fleet.length > 0) return false;
    else return true;
  }

  function getFreeFields() {
    const freeFields = document.querySelectorAll("div[data-free='true']");

    return freeFields;
  }
  function getTakenFields() {
    const takenFields = document.querySelectorAll(
      "div[data-free='false'][data-ship='false']"
    );

    return takenFields;
  }

  function showFreeFields() {
    getFreeFields().forEach((field) => {
      field.classList.add('fieldFree');
    });
    getTakenFields().forEach((field) => {
      field.classList.add('fieldTaken');
    });
  }
  function hideFreeFields() {
    getFreeFields().forEach((field) => {
      field.classList.remove('fieldFree');
    });
    getTakenFields().forEach((field) => {
      field.classList.remove('fieldTaken');
    });
  }

  rotateIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const shipToRotate = icon.nextElementSibling;
      shipToRotate.classList.toggle('shipRotate');

      const imageNextTo = icon.nextElementSibling;
      imageNextTo.classList.toggle('horizontal');
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
        element.dataset.y,
        'player'
      );
    } else
      shipFields = getShipFieldsVertical(
        this.dataset.length,
        element.dataset.x,
        element.dataset.y,
        'player'
      );

    if (shipFields.length < this.dataset.length) return;
    shipFields.forEach((field) => {
      field.dataset.free = 'false';
      field.dataset.ship = this.dataset.ship;
      getFieldsAround(field, 'player').forEach((el) => {
        markFalse(el);
      });
      audio.score();
    });

    const shipToLoad = new Image();
    shipToLoad.src = `./images/${this.dataset.ship}.png`;
    shipToLoad.classList.add('shipToLoad');
    if (!this.classList.contains('horizontal')) {
      shipToLoad.classList.add('vertical');
    }
    element.appendChild(shipToLoad);
    this.classList.add('inactive');
    this.parentNode.remove();
    if (checkIfDone()) {
      board.appendChild(computerBoardNode);
      document.querySelector('div.fleet.player').classList.add('hidden');
      appendBoardComputer(computerBoard);
      computerBoardNode.classList.remove('hidden');
      appendStats('player');
      appendStats('computer');
      document.querySelector('.statsContainer').classList.remove('hidden');
      const header = document.querySelector('header');
      header.textContent = '';
      const newHeader = document.createElement('h1');
      newHeader.textContent = 'Destroy Enemy Fleet!';
      const headerP = document.createElement('p');
      headerP.textContent =
        'Chose field on enemy board and click to shoot on it.';
      header.appendChild(newHeader);
      header.appendChild(headerP);
    }
  }
  ships.forEach((ship) => {
    ship.addEventListener('dragstart', showFreeFields);
    ship.addEventListener('dragend', dragend);
  });
}

// create boards with stats

function getStats(player) {
  const fields = document.querySelectorAll(`div.${player}.board div`);
  const fleet = [...fields].reduce(
    (ships, field) => {
      const ship = field.dataset.ship;
      if (ship !== 'false') {
        switch (ship) {
          case 'boat1':
          case 'boat2':
          case 'boat3':
          case 'boat4':
            if (!ships.boats[ship]) {
              ships.boats[ship] = 0;
            }
            ships.boats[ship]++;
            break;

          case 'destroyer1':
          case 'destroyer2':
          case 'destroyer3':
            if (!ships.destroyers[ship]) {
              ships.destroyers[ship] = 0;
            }
            ships.destroyers[ship]++;
            break;

          case 'submarine1':
          case 'submarine2':
            if (!ships.submarines[ship]) {
              ships.submarines[ship] = 0;
            }
            ships.submarines[ship]++;
            break;

          case 'carrier':
            if (!ships.carrier[ship]) {
              ships.carrier[ship] = 0;
            }
            ships.carrier[ship]++;
            break;

          default:
            // Handle unexpected ship types
            break;
        }
      }
      return ships;
    },
    { boats: {}, destroyers: {}, submarines: {}, carrier: {} }
  );
  return fleet;
}

function appendStats(player) {
  const statContainer = document.querySelector('.statsContainer');
  const stats = getStats(player);
  const statField = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = `${player}'s fleet: `;
  statField.appendChild(title);
  const boatsStats = document.createElement('p');
  boatsStats.classList.add(`${player}`);
  boatsStats.textContent = `Boats: ${Object.keys(stats.boats).length}`;
  statField.appendChild(boatsStats);
  const destroyersStats = document.createElement('p');
  destroyersStats.classList.add(`${player}`);
  destroyersStats.textContent = `Destroyers: ${
    Object.keys(stats.destroyers).length
  }`;
  statField.appendChild(destroyersStats);
  const submarinesStats = document.createElement('p');
  submarinesStats.classList.add(`${player}`);
  submarinesStats.textContent = `Submarines: ${
    Object.keys(stats.submarines).length
  }`;
  statField.appendChild(submarinesStats);
  const carrierStats = document.createElement('p');
  carrierStats.textContent = `Carrier: ${Object.keys(stats.carrier).length}`;
  carrierStats.classList.add(`${player}`);
  statField.appendChild(carrierStats);
  statContainer.appendChild(statField);
}

function makeMovePlayer() {
  if (board.classList.contains('block')) return;
  board.classList.add('block');
  this.removeEventListener('click', makeMovePlayer);
  this.classList.remove('fieldComputerHidden');
  if (this.dataset.ship !== 'false') {
    this.classList.add('hitShip');
    audio.shot();
  } else {
    audio.miss();
  }
  this.dataset.ship = 'hit';

  const fleetCountPrev = shipsCount('computer');
  document.querySelector('.statsContainer').textContent = '';
  appendStats('player');
  appendStats('computer');
  const fleetCountAfter = shipsCount('computer');
  if (fleetCountAfter === 0) {
    return winGame();
  }
  if (fleetCountPrev !== fleetCountAfter) {
    getFieldsAroundHits('computer').forEach((field) => {
      field.classList.add('fieldsAroundHits2');
      field.removeEventListener('click', makeMovePlayer);
      field.classList.remove('fieldComputerHidden');
    });
  }
  board.classList.add('block');
  cannon.classList.add('loading');
  document.querySelector('.board.computer').classList.add('inactive');
  setTimeout(makeMoveComputer, 1000);
}

function makeMoveComputer() {
  const lastFields = [...checkFieldHit()];
  let fieldHit = null;
  if (lastFields.length === 1) {
    const divsAround = [];

    const x = lastFields[0].dataset.x;
    const y = lastFields[0].dataset.y;
    const fieldsAround = [
      [x, y - 1],
      [x - 1, y],
      [+x + 1, y],
      [x, +y + 1],
    ];
    fieldsAround.forEach((field) => {
      const div = document.querySelector(
        `div.player div[data-x='${field[0]}'][data-y='${field[1]}']`
      );
      if (div) divsAround.push(div);
    });
    fieldHit = divsAround[Math.floor(Math.random() * divsAround.length)];
  } else if (lastFields.length === 3) {
    fieldHit = document.querySelector(
      "div.player.board>div[data-ship='carrier']"
    );
  } else if (lastFields.length > 1) {
    const horizontal = (lastFields[0].dataset.x - lastFields[1].dataset.x) * -1;

    //case ship is positione horizontally
    if (horizontal === 1) {
      const before =
        Math.floor(
          (parseInt(lastFields[0].dataset.x) +
            parseInt(lastFields[1].dataset.x)) /
            2
        ) - 1;
      const after =
        Math.ceil(
          (parseInt(lastFields[0].dataset.x) +
            parseInt(lastFields[1].dataset.x)) /
            2
        ) + 1;
      const fieldBefore = document.querySelector(
        `.board.player>div[data-x='${before}'][data-y='${lastFields[0].dataset.y}']`
      );
      const fieldAfter = document.querySelector(
        `.board.player>div[data-x='${after}'][data-y='${lastFields[0].dataset.y}']`
      );
      const divsToMatch = [];
      if (fieldBefore) {
        divsToMatch.push(fieldBefore);
      }
      if (fieldAfter) {
        divsToMatch.push(fieldAfter);
      }
      fieldHit = divsToMatch[Math.floor(Math.random() * divsToMatch.length)];
    }
    //case ship is positioned vertically
    else {
      const before =
        Math.floor(
          (parseInt(lastFields[0].dataset.y) +
            parseInt(lastFields[1].dataset.y)) /
            2
        ) - 1;
      const after =
        Math.ceil(
          (parseInt(lastFields[0].dataset.y) +
            parseInt(lastFields[1].dataset.y)) /
            2
        ) + 1;
      const fieldBefore = document.querySelector(
        `.board.player>div[data-x='${+lastFields[0].dataset
          .x}'][data-y='${before}']`
      );
      const fieldAfter = document.querySelector(
        `.board.player>div[data-x='${+lastFields[0].dataset
          .x}'][data-y='${after}']`
      );

      const divsToMatch = [];
      if (fieldBefore) {
        divsToMatch.push(fieldBefore);
      }
      if (fieldAfter) {
        divsToMatch.push(fieldAfter);
      }
      fieldHit = divsToMatch[Math.floor(Math.random() * divsToMatch.length)];
      
    }
  } else {
    const x = randomOneToTen();
    const y = randomOneToTen();
    fieldHit = document.querySelector(
      `.board.player>div[data-x='${x}'][data-y='${y}']`
    );
  }

  if (fieldHit.dataset.ship === 'hit') {
    return makeMoveComputer();
  } else if (fieldHit.dataset.ship === 'false') {
    const image = new Image();
    image.src = './images/miss.gif';
    image.classList.add('imageForMiss');
    fieldHit.appendChild(image);
    audio.miss();
  } else {
    const image = new Image();
    image.src = './images/fire.gif';
    image.classList.add('imageForHit');
    fieldHit.appendChild(image);
    fieldHit.dataset.lasthit = true;
    audio.shot();
  }
  fieldHit.dataset.ship = 'hit';
  const fleetCountPrev = shipsCount('player');
  document.querySelector('.statsContainer').textContent = '';
  appendStats('player');
  appendStats('computer');
  const fleetCountAfter = shipsCount('player');
  if (fleetCountAfter === 0) {
    return loseGame();
  }
  if (fleetCountPrev !== fleetCountAfter) {
    clearLastHit();
    getFieldsAroundHits('player').forEach((field) => {
      field.classList.add('fieldsAroundHits');
      field.dataset.ship = 'hit';
    });
  }
  setTimeout(() => {
    board.classList.remove('block');
    cannon.classList.remove('loading');
    document.querySelector('.board.computer').classList.remove('inactive');
  }, 1000);
}

function shipsCount(player) {
  let ships = document.querySelectorAll(`p.${player}`);
  const shipsCounted = [...ships].reduce((sum, ship) => {
    const text = +ship.textContent[ship.textContent.length - 1];
    return sum + text;
  }, 0);
  return shipsCounted;
}

function checkFieldHit() {
  const fieldHit = document.querySelectorAll(
    "div.player.board>div[data-lasthit='true']"
  );
  return fieldHit;
}

function clearLastHit() {
  document
    .querySelectorAll("div.player.board>div[data-lasthit='true']")
    .forEach((field) => {
      field.dataset.lasthit = false;
    });
}

function getFieldsAroundHits(player) {
  let hitsPlayer = [];
  if (player === 'player') {
    document.querySelectorAll('.imageForHit').forEach((field) => {
      hitsPlayer.push(field.parentElement);
    });
  } else hitsPlayer = document.querySelectorAll('.hitShip');

  function getAround(field, player) {
    const x = field.dataset.x;
    const y = field.dataset.y;
    const fieldsAround = [
      [x - 1, y - 1],
      [x, y - 1],
      [+x + 1, y - 1],
      [x - 1, y],
      [+x + 1, y],
      [x - 1, +y + 1],
      [x, +y + 1],
      [+x + 1, +y + 1],
    ];
    let divsAround = [];

    for (const field of fieldsAround) {
      const div = document.querySelector(
        `div.${player} div[data-x='${field[0]}'][data-y='${field[1]}']`
      );

      if (div && div.dataset.ship !== 'false' && div.dataset.ship !== 'hit') {
        divsAround = false;
        break;
      }

      if (div && div.dataset.ship === 'false') {
        divsAround.push(div);
      }
    }
    return divsAround;
  }

  const fieldsAround = [];
  hitsPlayer.forEach((field) => {
    if (getAround(field, player)) {
      fieldsAround.push(...getAround(field, player));
    }
  });

  return fieldsAround;
}

function winGame() {
  cannon.classList.add('cannonHidden');
  const header = document.querySelector('header');
  header.textContent = '';
  const winTitle = document.createElement('h1');
  winTitle.textContent = 'YOU WON!';
  header.appendChild(winTitle);

  const main = document.querySelector('main');
  main.textContent = '';
  const winBox = document.createElement('div');
  winBox.classList.add('box');
  main.appendChild(winBox);

  const reloadButton = document.createElement('button');
  reloadButton.textContent = 'Play again';
  main.appendChild(reloadButton);
  reloadButton.addEventListener('click', () => {
    location.reload();
  });
  main.appendChild(loadGif('win'));
}

function loseGame() {
  cannon.classList.add('cannonHidden');
  const header = document.querySelector('header');
  header.textContent = '';
  const loseTitle = document.createElement('h1');
  loseTitle.textContent = 'YOU LOSE!';
  header.appendChild(loseTitle);

  const main = document.querySelector('main');
  main.textContent = '';
  const loseBox = document.createElement('div');
  loseBox.classList.add('box');
  main.appendChild(loseBox);

  const reloadButton = document.createElement('button');
  reloadButton.textContent = 'Play again';
  main.appendChild(reloadButton);
  reloadButton.addEventListener('click', () => {
    location.reload();
  });
  main.appendChild(loadGif('lose'));
}

function loadGif(phrase) {
  const image = new Image();
  image.classList.add('box');
  fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=yj95txvwzdxGDuFA4J2CeomczmxZRQ1D&s=${phrase}`,
    {
      mode: 'cors',
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      image.src = response.data.images.original.url;
    });
  return image;
}

module.exports = {
  appendBoardPlayer,
  placeShip,
};
