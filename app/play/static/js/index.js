'use strict';

const socket = io('http://' + document.domain + ':' + location.port + '/play'); 
const diceWrappers = document.querySelectorAll('.dices');
const dices = document.querySelectorAll('.dice');
const diceCup = document.querySelector('#dice-cup');
const tableColumns = [
    document.querySelectorAll('td.scores:nth-child(2)'),
    document.querySelectorAll('td.scores:nth-child(3)')
];
const resultsTable = document.querySelector('.results tbody');

const USER = 0; const BOT = 1;
let round = 1;
let boardIsReady = false;

socket.on('connect', () => {
    socket.emit('start game');
    initActiveListeners();
});

socket.on('first turn', (player) => {
    if (player === USER) {
        diceCup.classList.remove('is-disabled');
        toggleDices();
    }
});

socket.on('fill board', async (data) => {
    if (data.state.player === USER) {
        await animateRoll(data.board[0], 0);
        await sleep(1000);
        await animateRoll(data.board[1], 1);
        boardIsReady = true;
        
        if (!data.state.allowed) {
            diceCup.classList.add('is-disabled');
        }
    } else {
        socket.emit('bot turn');
    }
});

socket.on('end round', (data) => {
    tableColumns[data.group][data.move]
        .classList.add('active-td');
    fillTotalScore(data.score);
    prepareToNewRound();
});

socket.on('show move', (data) => {
    tableColumns[data.group][data.move]
        .classList.add('active-td');
    fillTotalScore(data.score);
});

async function sleep(ms) {
    return new Promise(resolved => setTimeout(resolved, ms));
}

function initActiveListeners(state) {
    diceCup.addEventListener('click', () => {
        clearDices(); 
        const onBoard = getOnBoard();
        socket.emit('roll dices', onBoard);
    });

    dices.forEach(dice => {
        dice.addEventListener('click', () => {
            placeDice('player', dice);
        });
    });
    
    document.querySelectorAll('.scores').forEach(cell => {
        cell.addEventListener('click', () => {
            if (boardIsReady){
                const data = {
                    'group': +cell.getAttribute('group'),
                    'move': +cell.getAttribute('order'),
                    'score': +cell.innerHTML
                }
                socket.emit('player move', data);
            }
        });
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
    const groups = [[], []];
    let dots; let diceOrder;

    for (let dice of dices) {
        if (dots = dice.children.length) {
            diceOrder = +dice.getAttribute('order');
            groups[+(diceOrder > 4)].push(dots);
        }
    }

    return groups;
}

function removeAllChildren(element){
    let lastChild;
    while (lastChild = element.lastChild) {
        element.removeChild(lastChild);
    }
}

function clearDices() {
    for (let group of diceWrappers) {
        for (let dice of group.children) {
            dice.style.display = 'none';
            removeAllChildren(dice);
        }
    }
}

function prepareToNewRound() {
    ++round;
    clearBoard('player');
    boardIsReady = false;
}

function clearBoard(player) {
    for (let dice of dices) {
        if (!dice.parentElement.classList.contains('dices')) {
            placeDice(player, dice);
        }
        removeAllChildren(dice);
        dice.style.display = 'none';
    }
}

async function animateRoll(group, groupIdx) {
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
    let currentCell;
    for (let i = 0; i < tableColumns[0].length; ++i) {
        currentCell = tableColumns[groupIdx][i];
        if (!currentCell.classList.contains('active-td')) {
            currentCell.innerHTML = scores[i];
        }
    }
}

function fillTotalScore(score) {
    const tableRow = resultsTable.children[USER];
    const cell =  tableRow.children[round];
    cell.innerHTML = +cell.innerHTML + score;
}
