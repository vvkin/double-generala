document.addEventListener('DOMContentLoaded', () => {
    //const rollCup = document.querySelector('#');
    let element = null;

    for (let i = 0; i < 10; ++i) {
        element = document.getElementById(`dice-${i}`);
        addDots(element, i % 6 + 1);
    }
    
});

function addDots(element, dotsNumber) {
    let dot = null;

    for (let i = 0; i < dotsNumber; ++i) {
        dot = document.createElement('span');
        dot.classList.add('dot');
        element.appendChild(dot);
    }
}