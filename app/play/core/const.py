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

ALL_SCORES_FILE = 'app/play/core/files/all_scores.bin' # file with scores for all combinations

ALL_MOVES_FILE = 'app/play/core/files/all_moves.bin' # file with all possible moves (length from 0 to 6)

FACES_NUM = 6 # number of possible values on the dice sides

DICES = [1, 2, 3, 4, 5, 6] # possible values on dice sides

DICES_NUM = 5 # dices in one group

FIVE_OF_A_KIND = 50 # win combination of first move
