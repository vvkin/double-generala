'use strict';

export const USER = 0;
export const BOT = 1;
export const DICES_NUM = 5;

export default class DiceManager {
    constructor() {
        this.diceWrappers = document.querySelectorAll('.dices');
        this.dices = document.querySelectorAll('.dice');
        this.places = [
            document.querySelectorAll('#player .place'),
            document.querySelectorAll('#bot', '.place')
        ]
    }

    toggleDices() {
        for (let dice of this.dices) {
            dice.classList.toggle('is-disabled');
        }
    }

    removeAllChildren(element) {
        let lastChild;
        while (lastChild = element.lastChild) {
            element.removeChild(lastChild);
        }
    }

    moveDice(playerIdx, dice) {
        const diceOrder = dice.getAttribute('order');
        const place = this.places[playerIdx][diceOrder];
        const placeRow = place.parentElement;

        if (dice.parentElement.classList.contains('dices')) {
            place.style.display = 'none';
            placeRow.insertBefore(dice, place);
        } else {
            place.style.display = 'block';
            this.diceWrappers[+(diceOrder > 4)].appendChild(dice);
        }

    }

    showDice(dice, dotsNumber) {
        let dot;
        dice.style.display = 'grid';
        
        for (let i = 0; i < dotsNumber; ++i) {
            dot = document.createElement('span');
            dot.classList.add('dot');
            dice.appendChild(dot);
        }
    }

    showDicesGroup(diceValues, groupIdx) {
        const dices = this.diceWrappers[groupIdx].children;
        for (let i = 0; i < DICES_NUM; ++i) {
            this.showDice(dices[i], diceValues[i] - dices[i].children.length);
        }
    }

    hideDice(dice) {
        dice.style.display = 'none';
        this.removeAllChildren(dice);
    }

    hideUnusedDices() {
       for (let diceGroup of this.diceWrappers) {
           for (let dice of diceGroup.children) {
               this.hideDice(dice);
           }
       }
    }

    hideAllDices(playerIdx) {
        for (let dice of this.dices) {
            if (!dice.parentElement.classList.contains('dices')) {
                this.moveDice(playerIdx, dice);
            }
            this.removeAllChildren(dice);
            dice.style.display = 'none';
        }
    }

    getOnBoardDices() {
        const groups = [[], []];
        let dots; let diceOrder;

        for (let dice of this.dices) {
            if (dots = dice.children.length) {
                diceOrder = +dice.getAttribute('order');
                groups[+(diceOrder > 4)].push(dots);
            }
        }

        return groups;
    }
}