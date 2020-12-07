import numpy as np
from typing import List
from .const import COMBINATIONS_NUM


class Generala:
    def __init__(self):
        self.dices_num = 10
        self.score = 0
        self.dices = np.zeros(self.dices_num)
        self.prices = np.zeros(COMBINATIONS_NUM * 2)
    
    def roll_dices(self) -> None:
        for idx in range(0, self.dices_num):
            if not self.dices[idx]:
                new_dice = np.random.randint(1, 7)
                self.dices[idx] = new_dice

    def update_prices(self) -> None:
        pass#self.dices[:] *= 0
