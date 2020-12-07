document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port + '/play'); 
    const diceCup = document.querySelector('#dice-cup');
    let moveNow = true;

    diceCup.addEventListener('click', () => {
        if (moveNow) {
            socket.emit('roll dices'); // random dices for player
        }
    });

    socket.on('player dices', (data) => {
        animateRoll(data.dices, data.prices, 0);
        setTimeout(animateRoll, 1200, data.dices, data.prices, 1);
        moveNow = false;
    });

    socket.on('bot dices', (dices) => {
        fillBoard(dices);
        moveNow = true;
    });
});

function animateRoll(dices, prices, group_idx) {
    const toFillDices = dices.slice(5*group_idx, 5+group_idx*5);
    const toFillPrices = prices.slice(10*group_idx, 10+group_idx*10);
    shakeCup();
    fillDices(toFillDices, group_idx);
    fillTables(toFillPrices, group_idx);
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

function addDots(element, dotsNumber) {
    let dot = null;
    for (let i = 0; i < dotsNumber; ++i) {
        dot = document.createElement('span');
        dot.classList.add('dot');
        element.appendChild(dot);
    }
}

function fillDices(dices, group_idx) {
    const group = document.querySelector(`#group-${group_idx}`);
    const children = group.children;

    for (let i = 0; i < dices.length; ++i) {
        addDots(children[i], dices[i] - children[i].getAttribute('dots'));
        children[i].setAttribute('dots', dices[i]);
    }
}

function fillTables(prices, group_idx) {
    const tableRows = document.querySelectorAll('.combinations tbody tr');
    for (let i = 0; i < tableRows.length; ++i) {
        tableRows[i].children[group_idx+1].innerHTML = prices[i];
    }
}
