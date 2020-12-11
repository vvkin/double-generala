COMBINATIONS = ( # all possible combinations
    'Ones',
    'Twos',
    'Threes',
    'Fours',
    'Fives',
    'Sixes',
    'Small General',
    'Big General',
    'Full House',
    'Five of a Kind'
)

USER, BOT = 0, 1 # just indices to distinguish a user from a bot

COMBINATIONS_NUM = len(COMBINATIONS) # total number of combinations

COMBINATIONS_FILE = 'app/play/core/combinations.bin' # file with scores for all combinations

DICES = [1, 2, 3, 4, 5, 6] # possible values on dice sides

DICES_NUM = 5 # dices in one group
