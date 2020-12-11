import numpy as np
import random
import pickle
from typing import Dict, List, Tuple

from .const import DICES_NUM, COMBINATIONS_FILE, USER, BOT
from .utils import get_random_dices


class Game:

    stored_scores = pickle.load(
        open(COMBINATIONS_FILE, 'rb')
    )

    def __init__(self):
        self.scores = np.zeros(2)
        self.bot = Generala()

        self.moves_num = 3
        self.move_idx = 0
        self.allowed = True

    def get_first_turn(self) -> int:
        return random.choice([USER, BOT])
    
    def get_group_state(self, on_board: List[int]) -> Tuple[List[int], Tuple[int]]:
        self.move_idx += 1
        count = DICES_NUM - len(on_board)
        
        rand_dices = get_random_dices(count)
        dices = sorted(rand_dices + on_board)
        scores = Game.stored_scores[tuple(dices)]

        return rand_dices, scores
    
    def update_state(self) -> None:
        self.move_idx = 0

    def get_state(self) -> Dict[str, int or bool]:
        self.allowed = (self.move_idx < self.moves_num)
        return {'allowed':  self.allowed, 'player': USER}
    
    def roll_bot_dices(self) -> None:
        pass
    
class Generala():
    """TODO: AI here"""
    pass
