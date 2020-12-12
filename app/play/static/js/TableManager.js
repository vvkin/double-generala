'use strict';

export default class TableManager {
    constructor() {
        this.enabled = false;
        this.round = 1;
        this.length = 10;
        this.tableColumns = [
            document.querySelectorAll('td.scores:nth-child(2)'),
            document.querySelectorAll('td.scores:nth-child(3)')
        ];
        this.resultsTable = document.querySelector('.results tbody');
    }

    setNewRound() {
        ++this.round;
        this.enabled = false;
    }

    toggleCell(group, idx) {
        this.tableColumns[group][idx]
            .classList.toggle('active-td');
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    setScores(scores, groupIdx) {
        let currentCell;
        for (let i = 0; i < this.length; ++i) {
            currentCell = this.tableColumns[groupIdx][i];
            if (!currentCell.classList.contains('active-td')) {
                currentCell.innerHTML = scores[i];
            }
        }
    }

    clearScores() {
        const cells = document.querySelectorAll('.scores');
        for (let cell of cells) {
            if (!cell.classList.contains('active-td')){
                cell.innerHTML = 0;
            }
        }
    }

    setTotalScore(score) {
        const tableRow = this.resultsTable.children[0];
        const cell = tableRow.children[this.round];
        cell.innerHTML = +cell.innerHTML + score;
    }
}
