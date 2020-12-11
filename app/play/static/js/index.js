document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port + '/play'); 
    const diceCup = document.querySelector('#dice-cup');
    const dices = document.querySelectorAll('.dice');

    let rollNow = true;
    let moveNow = true;

    diceCup.addEventListener('click', () => {
        if (rollNow) {
            const firstGroup = 
            socket.emit('roll dices');
        }
    });

    dices.forEach(dice => {
        dice.addEventListener('click', () => {
            if (moveNow) {
                placeDice('player', dice);
            }
        })
    });

    socket.on('fill dices', (dices) => {
        animateRoll(dices);
    });

    socket.on('fill tables')

    socket.on('bot roll', (dices) => {
        fillBoard(dices);
        rollNow = true;
    });
});

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

function animateRoll(dices) {
    shakeCup();
    fillDices(dices.slice(0, 5), 0);
    fillDices(dices.slice(5, 10), 1);
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

function fillDices(diceValues, group_idx) {
    const group = document.querySelectorAll('.dices')[group_idx];
    const dices = group.children;
    let dotsNumber = 0;

    for (let i = 0; i < dices.length; ++i) {
        dotsNumber = dices[i].children.length;
        if (!dotsNumber) {
            addDots(dices[i], diceValues[i] - dotsNumber);
        }
    }
}

function fillTables(prices, group_idx) {
    const tableRows = document.querySelectorAll('.combinations tbody tr');
    for (let i = 0; i < tableRows.length; ++i) {
        tableRows[i].children[group_idx + 1].innerHTML = prices[i];
    }
}
