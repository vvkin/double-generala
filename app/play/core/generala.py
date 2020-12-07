import numpy as np
from typing import List
from .const import COMBINATIONS_NUM


class Generala:
    def __init__(self):
        self.group_size = 5
        self.state = np.zeros((2, self.group_size))
        self.prices = np.zeros((2, self.group_size))

    def roll_dices(self, group_idx) -> None:
        for idx in range(self.group_size):
            if not self.state[group_idx][idx]:
                new_dice = np.random.randint(1, 7)
                self.state[group_idx][idx] = new_dice

    def clear_dices(self) -> None:
        self.state[:] *= 0

    def update_prices(self, group_idx) -> None:
        pass
