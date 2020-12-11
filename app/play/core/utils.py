import random
from typing import List

def get_random_dices(count: int) -> List[int]:
    return [random.randint(1, 6) for _ in range(count)]
