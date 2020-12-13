import random
from typing import List
from itertools import chain,repeat,islice,count
from collections import Counter

def get_random_dices(count: int) -> List[int]:
    return [random.randint(1, 6) for _ in range(count)]

def norepeat_combinations(iterable: List[int] or Tuple[int], n: int):
    values, counts = zip(*Counter(iterable).items())

    function = lambda num, count: chain.from_iterable(
        map(repeat, num, count))
    
    length = len(counts)
    indices = list(islice(function(count(),counts), n))

    if len(indices) < n: return

    while True:
        yield tuple(values[i] for i in indices)
        
        for i, j in zip(reversed(range(n)), function(reversed(range(length)), reversed(counts))):
            if indices[i] != j:
                break
        else:
            return
        
        j = indices[i]+1
        for i, j in zip(range(i, n), function(count(j), islice(counts, j, None))):
            indices[i] = j


def back_moves(iterable: List[int] or Tuple[int]):
    n = len(iterable)
    return chain.from_iterable(norepeat_combinations(iterable, i) for i in range(n + 1))
