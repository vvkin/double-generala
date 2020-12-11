import numpy as np
#from .const import COMBINATIONS_NUM
import itertools
from typing import Tuple, List
import pickle

def get_scores(dices: Tuple[int]) -> Tuple[int]:
    combinations = [0] * 10
    unique_dices = set(dices)

    for dots in range(6): # fill ones, twos, threes, etc.
        combinations[dots] = dices.count(dots) * dots
    
    if dices == (1, 2, 3, 4, 5):
        combinations[7] = 21
    
    if dices == (2, 3, 4, 5, 6):
        combinations[8] = 30

    if len(unique_dices) == 2: # full house
        combinations[9] = sum(dices)
    
    if len(unique_dices) == 1: # five of a kind
        combinations[9] = 50

    return tuple(combinations)


if __name__ == '__main__':
    a = [1, 2, 3, 4, 5, 6]
    perm = list(itertools.combinations_with_replacement(a, 5))
    scores = dict()

    for p in perm:
        scores[p] = get_scores(p)
    
    print(scores)
    
    




