document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port + '/play'); 
    const diceCup = document.querySelector('#dice-cup');
    let moveNow = true;

    diceCup.addEventListener('click', () => {
        if (moveNow) {
            socket.emit('roll dices', 0); // first group
            socket.emit('roll dices', 1); // second group
        }
    });

    socket.on('player dices', (data) => {
        fillDices(data.dices, data.group_idx);
        fillTables(data.prices, data.group_idx);
        moveNow = false;
    });

    socket.on('bot dices', (dices) => {
        fillBoard(dices);
        moveNow = true;
    });
});

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

    for (let i = 0; i < 5; ++i) {
        addDots(children[i], dices[i] - children[i].getAttribute('dots'));
        children[i].setAttribute('dots', dices[i]);
    }
}

function fillTables(prices, group_idx) {
    return;
}

