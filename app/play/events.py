from flask import session, request
from flask_socketio import emit, send, disconnect
from app import socketio, games
from app.play.core import Game
import time

@socketio.on('connect', namespace='/play')
def on_connect():
    user_id = request.sid
    print(f'User with sid {user_id} connected!')

@socketio.on('start game', namespace='/play')
def on_start():
    game = Game()
    games[request.sid] = game
    player = game.get_first_turn()
    emit('first turn', player)
    if player: roll_bot_dices(request.sid)

@socketio.on('roll dices', namespace='/play')
def on_roll(on_board):
    game = games[request.sid]
    board_state = (
        game.get_group_state(on_board[0]),
        game.get_group_state(on_board[1])
    )
    state = game.get_state()
    data = {'board': board_state, 'state': state}
    emit('fill board', data)

@socketio.on('player move', namespace='/play')
def on_turn(data):
    game = games[request.sid]
    move = data['move']
    score = data['score']
    group = data['group']

    if game.is_valid_move(group, move):
        data['end'] = False
        game.set_move(group, move, score)
    
        if game.is_round_end():
            game.update_state()
            data['end'] = True

        emit('show move', data)

        if game.is_game_end(): 
            emit('game over', game.winner)

@socketio.on('bot roll', namespace='/play')
def on_bot_roll():
    game = games[request.sid]
    if game.is_bot_end():
        game.update_state()
        emit('bot done', sum(game.scores))
    else: roll_bot_dices(request.sid)
    
@socketio.on('bot turn', namespace='/play')
def on_bot_turn():
    start = time.time()
    game = games[request.sid]
    moves = [
        game.get_bot_move(0),
        game.get_bot_move(1)
    ]
    state = [
        game.get_bot_state(0),
        game.get_bot_state(1)
    ]
    emit('bot move', {'moves': moves, 'state': state})

@socketio.on('disconnect', namespace='/play')
def on_disconnect():
    user_id = request.sid
    del games[user_id]
    del session['name']
    print(f'User with sid {user_id} disconnected!')


def roll_bot_dices(user_id: int):
    game = games[user_id]
    dices = [
        game.get_bot_dices(0),
        game.get_bot_dices(1)
    ]
    state = [
        game.get_bot_state(0),
        game.get_bot_state(1)
    ]
    emit('fill board', {'dices': dices, 'state' : state})