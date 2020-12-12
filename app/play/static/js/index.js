'use strict';

import {USER, BOT} from './DiceManager.js';
import DiceManager from './DiceManager.js';

const socket = io('http://' + document.domain + ':' + location.port + '/play'); 
const diceManager = new DiceManager();
const diceCup = document.querySelector('#dice-cup');
const tableColumns = [
    document.querySelectorAll('td.scores:nth-child(2)'),
    document.querySelectorAll('td.scores:nth-child(3)')
];
const resultsTable = document.querySelector('.results tbody');
let round = 1;
let boardIsReady = false;

socket.on('connect', () => {
    socket.emit('start game');
    initActiveListeners();
});

socket.on('first turn', (player) => {
    if (player === USER) {
        diceCup.classList.remove('is-disabled');
        diceManager.toggleDices();
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

function initActiveListeners() {
    diceCup.addEventListener('click', () => {
        diceManager.hideUnusedDices();
        const onBoard = diceManager.getOnBoardDices();
        socket.emit('roll dices', onBoard);
    });

    document.querySelectorAll('.dice').forEach(dice => {
        dice.addEventListener('click', () => {
            diceManager.moveDice(USER, dice);
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


function prepareToNewRound() {
    diceManager.hideAllDices(USER);
    ++round;
    boardIsReady = false;
}

async function animateRoll(group, groupIdx) {
    shakeCup();
    diceManager.showDicesGroup(group[0], groupIdx);
    fillTables(group[1], groupIdx);
}

function shakeCup() {
    diceCup.animate([
        {transform: 'rotate(9deg)'},
        {transform: 'rotate(-9deg)'}
    ], {
        duration: 130,
        iterations: 5
    });
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
