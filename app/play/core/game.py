import numpy as np
import random
import pickle
from typing import Dict, List, Tuple

from .const import (
    DICES_NUM, USER, BOT, FIVE_OF_A_KIND,
    COMBINATIONS_NUM,
    ALL_SCORES_FILE, ALL_MOVES_FILE,
)
from .utils import get_random_dices


class Game:
    all_scores = pickle.load(open(ALL_SCORES_FILE, 'rb'))
    all_moves = pickle.load(open(ALL_MOVES_FILE, 'rb'))

    def __init__(self):
        self.scores = np.zeros(2)
        self.used_mask = np.zeros(COMBINATIONS_NUM, np.bool)
        self.bot = GeneralaBot()
        self.winner = None

        self.moves_num = 6 # 3 roll for each group
        self.move_idx = 0
        self.allowed = True
        self.moves = np.zeros(2, np.bool)

    def get_first_turn(self) -> int:
        return random.choice([USER, BOT])
    
    def get_group_state(self, on_board: List[int]) -> Tuple[List[int], Tuple[int]]:
        self.move_idx += 1
        if self.moves[self.move_idx & 1 ^ 1]:
            return [], []

        count = DICES_NUM - len(on_board)
        rand_dices = get_random_dices(count)
        dices = sorted(rand_dices + on_board)
        scores = Game.get_score(dices)

        return rand_dices, scores
    
    def update_state(self) -> None:
        self.move_idx = 0
        self.moves[:] = False
    
    def is_game_end(self) -> bool:
        return not (self.winner is None)

    def get_state(self) -> Dict[str, int or bool]:
        self.allowed = (self.move_idx < self.moves_num)
        return {'allowed':  self.allowed, 'player': USER}
    
    def is_valid_move(self, group: int, move: int) -> bool:
        return (
            not self.moves[group] and
            not self.used_mask[move]
        )
    
    def is_round_end(self) -> bool:
        return self.moves[0] and self.moves[1]
    
    def set_move(self, group: int, move: int, score: int) -> None:
        self.moves[group] = True
        self.used_mask[move] = True
        self.scores[USER] += score
        # five of a kind on first move
        if self.move_idx == 2 and score == FIVE_OF_A_KIND:
            self.winner = USER
        
    def roll_bot_dices(self) -> None:
        pass

    @staticmethod
    def get_score(dices: List[int]) -> Tuple[int]:
        return Game.all_scores[tuple(dices)]

class AI:
    def __init__(self) -> None:
        self.dices_num = 5
    
    def __call__(self, dices: List[int], max_depth: int) -> Tuple[int]:
        self.best_move = tuple(dices)
        self.eps = 0.2 if max_depth > 1 else 0 # gambling coefficient
        self.seek_move(dices, 0, max_depth)
        return self.best_move
    
    def seek_move(self, dices: List[int], depth: int, max_depth: int = 2) -> float:
        if depth == max_depth: return Game.get_score(dices)

        max_value = -np.inf

        for move in back_moves(dices): # moves after return [0, n] dices
            dice_count = self.dices_num - len(move)

            if not move: # make new roll
                heuristic = self.empty
            elif not dice_count: # choose current board state
                heuristic = (1 + (max_depth - depth) * self.eps) * Game.get_score(move)
            else: # estimate random moves
                for combs, chance in Game.all_moves[dice_count]:
                    current_dices = move + combs
                    heuristic += change * seek_move(current_dices, depth+1)
            
            if heuristic > max_value:
                max_value = heuristic
                if not depth: self.best_move = move
        
        return max_value

class GeneralaBot:
    pass
