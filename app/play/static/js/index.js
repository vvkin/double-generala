'use strict';

import {USER, BOT} from './DiceManager.js';
import DiceManager from './DiceManager.js';
import TableManger from './TableManager.js';

const socket = io('http://' + document.domain + ':' + location.port + '/play'); 
const diceManager = new DiceManager();
const tableManager = new TableManger();
const diceCup = document.querySelector('#dice-cup');

socket.on('connect', () => {
    socket.emit('start game');
    initActiveListeners();
});

socket.on('first turn', (player) => {
    if (player === USER) {
        diceCup.classList.remove('is-disabled');
        diceManager.setEnabled(true);
    }
});

socket.on('fill board', async (data) => {
    if (data.state.player === USER) {
        await animateRound(data.board);
        tableManager.setEnabled(true);
        
        if (!data.state.allowed) {
            diceCup.classList.add('is-disabled');
        }
    } else {
        diceManager.setEnabled(false);
        await animateBotRound(data.dices);
        socket.emit('bot turn');
    }
});

socket.on('show move', async (data) => {
    tableManager.toggleCell(data.group, data.move);
    tableManager.setTotalScore(data.score, USER);
    diceManager.hideDicesGroup(USER, data.group);

    if (data.end) {
        diceCup.classList.add('is-disabled');
        tableManager.setNewRound();
        tableManager.clearScores();
        socket.emit('bot roll');
    }
});

socket.on('bot move', async (data) => {
    for (let i = 0; i < data.moves.length; ++i) {
        await diceManager.setBotMove(data.moves[i], i);
        await sleep(500);
        if (data.state[i].last) {
            tableManager.setTotalScore(data.state[i].score, BOT);
            diceManager.hideDicesGroup(BOT, i);
        }
    }
    await diceManager.hideUnusedDices();
    socket.emit('bot roll');
});

socket.on('bot done', async (score) => {
    tableManager.setTotalScore(score, BOT);
    diceCup.classList.remove('is-disabled');
    tableManager.setNewRound();
    diceManager.setEnabled(true);
    socket.emit('is end');
});

socket.on('game over', (data) => {
    diceCup.classList.add('is-disabled');
    diceManager.setEnabled(false);
    diceManager.hideAllDices();
    tableManager.setEnabled(false);
    
    tableManager.setNewRound();
    tableManager.setTotalScore(data.scores[BOT], BOT);
    tableManager.setTotalScore(data.scores[USER], USER);
    tableManager.markWinner(data.winner);

    socket.disconnect();
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
            if (tableManager.enabled){
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

async function animateRoll(group, groupIdx) {
    shakeCup();
    diceManager.showDicesGroup(group[0], groupIdx);
    tableManager.setScores(group[1], groupIdx);
}

async function animateBotRoll(dices, groupIdx) {
    shakeCup();
    diceManager.showDicesGroup(dices, groupIdx);
}

async function animateBotRound(dices) {
    for (let i = 0; i < 2; ++i) {
        if (dices[i].length) {
            await animateBotRoll(dices[i], i);
            (!i) && await sleep(1000);
        }
    }
}

async function animateRound(board) {
    for (let i = 0; i < 2; ++i){
        if (board[i][0].length) { // there are dices
            await animateRoll(board[i], i);
            (!i) && await sleep(1000);
        }
    }
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