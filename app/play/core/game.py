import numpy as np
import random
import pickle
from typing import List
from .const import COMBINATIONS_NUM, DICES, DICES_NUM, COMBINATIONS_FILE

class Game:

    stored_scores = pickle.load(
        open(COMBINATIONS_FILE, 'rb')
    )

    def __init__(self):
        self.scores = np.zeros(2)
        self.round = 1
        self.player = None
        self.bot = Generala()
        self.moves_num = 0
        self.move_idx = 0

    @staticmethod
    def roll_dices() -> List[int]:
        dices = random.choices(DICES, k=DICES_NUM)
        return dices
    

    
class Generala:
    pass



