'use strict';

const socket = io('http://' + document.domain + ':' + location.port + '/play'); 
const diceWrappers = document.querySelectorAll('.dices');
const dices = document.querySelectorAll('.dice');
const diceCup = document.querySelector('#dice-cup');
const USER = 0; const BOT = 1;

socket.on('connect', () => {
    socket.emit('start game');
    initActiveListeners();
});

socket.on('first turn', (player) => {
    if (player === USER) {
        diceCup.classList.remove('is-disabled');
    }
});

socket.on('fill board', (data) => {
    if (data.state.player === USER) {
        animateRoll(data.board[0], 0);
        setTimeout(animateRoll, 1200, data.board[1], 1)

        if (!data.state.allowed) {
            diceCup.classList.add('is-disabled');
            toggleDices();
        }
    } else {
        socket.emit('bot turn');
    }
});

function initActiveListeners(state) {
    diceCup.addEventListener('click', () => {
        const onBoard = getOnBoard();
        socket.emit('roll dices', onBoard);
        toggleDices();
    });

    dices.forEach(dice => {
        dice.addEventListener('click', () => {
            placeDice('player', dice);
        })
    });
}

function toggleDices() {
    for (let dice of dices) {
        dice.classList.toggle('is-disabled');
    }
}

function placeDice(movesNow, dice) {
    const diceOrder = dice.getAttribute('order');
    const placesRow = document.querySelectorAll(`.${movesNow} .place`);
    const place = placesRow[diceOrder];
    const placeParent = place.parentElement;

    if (dice.parentElement.classList.contains('dices')) {
        place.style.display = 'none';
        placeParent.insertBefore(dice, place);
    } else {
        place.style.display = 'block';
        const dices = document.querySelectorAll('.dices');
        dices[+(diceOrder > 4)].appendChild(dice);
    }
}

function getOnBoard() {
    const groups = [[], []]
    let dots; let diceOrder;

    for (let dice of dices) {
        if (dots = dice.children.length) {
            diceOrder = +dice.getAttribute('order');
            groups[+(diceOrder > 4)].push(dots);
        }
    }

    return groups
}

function animateRoll(group, groupIdx) {
    shakeCup();
    fillDices(group[0], groupIdx);
    fillTables(group[1], groupIdx);
}

function shakeCup() {
    const diceCup = document.querySelector('#dice-cup');
    diceCup.animate([
        {transform: 'rotate(9deg)'},
        {transform: 'rotate(-9deg)'}
    ], {
        duration: 130,
        iterations: 5
    });
}

function clearDots() {
    const dices = document.querySelectorAll('.dice');
    let lastChild;
    for (let dice of dices) {
        while (lastChild = dice.lastChild) {
            dice.removeChild(lastChild);
        }
    }
}

function addDots(element, dotsNumber) {
    element.style.display = 'grid';
    let dot;
    
    for (let i = 0; i < dotsNumber; ++i) {
        dot = document.createElement('span');
        dot.classList.add('dot');
        element.appendChild(dot);
    }
}

function fillDices(dicesValues, groupIdx) {
    const dices = diceWrappers[groupIdx].children;
    for (let i = 0; i < dices.length; ++i) {
        addDots(dices[i], dicesValues[i] - dices[i].children.length);
    }
}

function fillTables(scores, groupIdx) {
    const tableRows = document.querySelectorAll('.combinations tbody tr');
    for (let i = 0; i < tableRows.length; ++i) {
        tableRows[i].children[groupIdx + 1].innerHTML = scores[i];
    }
}
