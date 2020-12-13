from flask import session, request
from flask_socketio import emit, send, disconnect
from app import socketio, games
from app.play.core import Game

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
    if player: game.roll_bot_dices()

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

@socketio.on('disconnect', namespace='/play')
def on_disconnect():
    user_id = request.sid
    del games[user_id]
    del session['name']
    print(f'User with sid {user_id} disconnected!')