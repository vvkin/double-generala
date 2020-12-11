import itertools
import pickle

def get_scores(dices):
    combinations = [0] * 10
    unique_dices = set(dices)

    for dots in range(6): # fill ones, twos, threes, etc.
        combinations[dots] = dices.count(dots) * dots
    
    if dices == (1, 2, 3, 4, 5): # small generala
        combinations[7] = 21
    
    if dices == (2, 3, 4, 5, 6): # big generala
        combinations[8] = 30

    if len(unique_dices) == 2: # full house
        if dices.count(dices[0]) in (2, 3):
            combinations[9] = sum(dices)
    
    if len(unique_dices) == 1: # five of a kind
        combinations[9] = 50

    return tuple(combinations)

if __name__ == '__main__':
    combinations = itertools.combinations_with_replacement([1, 2, 3, 4, 5, 6], 5)
    scores = dict()

    for comb in combinations:
        scores[comb] = get_scores(comb)
    
    with open('combinations.bin', 'wb') as fhand:
        pickle.dump(scores, fhand)
        
