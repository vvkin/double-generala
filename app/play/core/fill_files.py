import itertools
import pickle
from collections import Counter
from math import factorial
from const import DICES, FACES_NUM, DICES_NUM


def get_scores(dices):
    combinations = [0] * 10
    unique_dices = set(dices)

    for dots in range(6): # fill ones, twos, threes, etc.
        combinations[dots] = dices.count(dots + 1) * (dots + 1)
    
    if dices == (1, 2, 3, 4, 5): # small generala
        combinations[6] = 21
    
    if dices == (2, 3, 4, 5, 6): # big generala
        combinations[7] = 30

    if len(unique_dices) == 2: # full house
        if dices.count(dices[0]) in (2, 3):
            combinations[8] = sum(dices)
    
    if len(unique_dices) == 1: # five of a kind
        combinations[9] = 50

    return combinations

def get_moves(dice_count):
    all_combs = itertools.combinations_with_replacement(
        DICES, dice_count
    )
    all_count = FACES_NUM ** dice_count
    
    for comb in all_combs:
        current = factorial(dice_count)
        for value, count in Counter(comb).items():
            current /= factorial(count)
        
        yield (comb, current / all_count)


if __name__ == '__main__':
    combinations = itertools.combinations_with_replacement(
        DICES, DICES_NUM
    )
    scores = dict()
    moves = dict()

    for comb in combinations:
        scores[comb] = get_scores(comb)
    
    with open('files/all_scores.bin', 'wb') as fhand:
        pickle.dump(scores, fhand)
    
    for dice_count in range(1, FACES_NUM):
        all_moves = list(get_moves(dice_count))
        moves[dice_count] = all_moves
        
    with open('files/all_moves.bin', 'wb') as fhand:
        pickle.dump(moves, fhand)
