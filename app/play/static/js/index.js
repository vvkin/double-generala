document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port + '/play'); 
    const diceCup = document.querySelector('#dice-cup');
    const dices = document.querySelectorAll('.dice');
    let rollNow = true;
    let moveNow = true;

    diceCup.addEventListener('click', () => {
        if (rollNow) {
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

    socket.on('player roll', (data) => {
        animateRoll(data.dices, data.prices, 0);
        setTimeout(animateRoll, 1200, data.dices, data.prices, 1);
        rollNow = false;
    });

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
    let dot;
    for (let i = 0; i < dotsNumber; ++i) {
        dot = document.createElement('span');
        dot.classList.add('dot');
        element.appendChild(dot);
    }
}

function fillDices(diceValues, group_idx) {
    const group = document.querySelector(`.dices[order="${group_idx}"]`);
    const dices = group.children;

    for (let i = 0; i < dices.length; ++i) {
        addDots(dices[i], diceValues[i] - dices[i].children.length);
    }
}

function fillTables(prices, group_idx) {
    const tableRows = document.querySelectorAll('.combinations tbody tr');
    for (let i = 0; i < tableRows.length; ++i) {
        tableRows[i].children[group_idx + 1].innerHTML = prices[i];
    }
}
