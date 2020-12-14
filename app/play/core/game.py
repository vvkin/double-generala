import numpy as np
import random
import pickle
from typing import Dict, List, Tuple

from .const import (
    DICES_NUM, USER, BOT, FIVE_OF_A_KIND,
    COMBINATIONS_NUM,
    ALL_SCORES_FILE, ALL_MOVES_FILE,
)
from .utils import get_random_dices, back_moves


class Game:
    all_scores = pickle.load(open(ALL_SCORES_FILE, 'rb'))
    all_moves = pickle.load(open(ALL_MOVES_FILE, 'rb'))

    def __init__(self):
        self.results = np.zeros(2)
        self.scores = np.zeros(2)
        self.used_mask = np.zeros(COMBINATIONS_NUM, np.bool)
        self.bot = GeneralaBot()
        self.winner = None
        self.moves_now = None

        self.moves_num = 6 # 3 roll for each group
        self.move_idx = 0
        self.allowed = True
        self.moves = np.zeros(2, np.bool)
    
    def get_first_turn(self) -> int:
        choice = random.choice([USER, BOT])
        self.moves_now = choice
        return choice
    
    def get_group_state(self, on_board: List[int]) -> Tuple[List[int], Tuple[int]]:
        self.move_idx += 1
        self.moves_now = USER
        if self.moves[self.move_idx & 1 ^ 1]:
            return [], []

        count = DICES_NUM - len(on_board)
        rand_dices = get_random_dices(count)
        dices = sorted(rand_dices + on_board)
        scores = Game.all_scores[tuple(dices)]

        return rand_dices, scores
    
    def get_bot_dices(self, group: int) -> List[int]:
        self.move_idx += 1
        self.moves_now = BOT
        if self.bot.last[group]: return []

        dices_count = DICES_NUM - len(self.bot.on_board[group])
        self.bot.rand[group] = get_random_dices(dices_count)
        return self.bot.rand[group]
    
    def update_state(self) -> None:
        self.results[self.moves_now] += sum(self.scores)
        self.move_idx = 0
        self.scores[:] = 0
        self.moves[:] = False
        self.bot.update()

        print(f'USER {self.results[USER]} BOT {self.results[BOT]}')
       
    def is_game_end(self) -> bool:
        return not (self.winner is None)

    def get_state(self) -> Dict[str, int or bool]:
        self.allowed = (self.move_idx < self.moves_num)
        return {'allowed':  self.allowed, 'player': self.moves_now}
    
    def is_valid_move(self, group: int, move: int) -> bool:
        return (
            not self.moves[group] and
            not self.used_mask[move]
        )
    
    def is_round_end(self) -> bool:
        return self.moves[0] and self.moves[1]
    
    def get_bot_move(self, group: int) -> Tuple[int]:
        values = self.bot.on_board[group] + self.bot.rand[group]
        moves = (self.moves_num - self.move_idx) // 2
        
        if self.bot.last[group] or not moves:
            best_move = values
            self.scores[group] = Game.get_score(values)
            self.bot.last[group] = True
        else:
            best_move = self.bot.ai(values, 2)
            self.bot.on_board[group] = list(best_move)
            self.bot.last[group] = len(best_move) == DICES_NUM
        return best_move
    
    def get_bot_score(self) -> int:
        return self.results[BOT]

    def get_bot_state(self, group: int) -> Dict[str, int or bool]:
        return {'last': self.bot.last[group], 'score': self.scores[group]}

    def is_bot_end(self) -> bool:
        return self.bot.last[0] and self.bot.last[1]

    def set_move(self, group: int, move: int, score: int) -> None:
        self.moves[group] = True
        self.used_mask[move] = True
        self.scores[USER] += score
        # five of a kind on first move
        if self.move_idx == 2 and score == FIVE_OF_A_KIND:
            self.winner = USER
        
    @staticmethod
    def get_score(dices: List[int]) -> Tuple[int]:
        return max(Game.all_scores[tuple(sorted(dices))])
    
    @staticmethod
    def estimate_move(moves: List[Tuple[List[int], float]]) -> float:
        estimation = 0
        for [dices, prob] in moves:
            score = Game.get_score(dices)
            estimation += prob * score
        return estimation

class AI:
    def __init__(self) -> None:
        self.dices_num = 5
        self.empty = Game.estimate_move(Game.all_moves[5])
    
    def __call__(self, dices: List[int], max_depth: int) -> Tuple[int]:
        self.best_move = tuple(dices)
        self.eps = 0.1 if max_depth > 1 else 0 # gambling coefficient
        self.seek_move(dices, 0, max_depth)
        return self.best_move
    
    def seek_move(self, dices: List[int], depth: int, max_depth: int = 2) -> float:
        if depth == max_depth: return Game.get_score(dices)

        max_value = float('-inf')

        for move in back_moves(dices): # moves after return [0, n] dices
            dice_count = self.dices_num - len(move)
            heuristic = 0

            if not move: # make new roll
                heuristic = self.empty
            elif not dice_count: # choose current board state
                heuristic = Game.get_score(move)
            else: # estimate random moves
                for combs, chance in Game.all_moves[dice_count]:
                    current_dices = move + combs
                    heuristic += chance * self.seek_move(current_dices, depth+1)
            
            if heuristic > max_value:
                max_value = heuristic
                if not depth: self.best_move = move
        
        return max_value

class GeneralaBot:
    def __init__(self) -> None:
        self.update()
        self.ai = AI()
    
    def update(self):
        self.last = [False, False]
        self.on_board = [[], []]
        self.rand = [[], []]
            
    def roll_dices(self, group: int) -> None:
        dices_count = DICES_NUM - len(self.on_board[group])
        self.rand[group] = get_random_dices(dices_count)
        
