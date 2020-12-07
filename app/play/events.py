from flask import session, request
from flask_socketio import emit, send, disconnect
from app import socketio, games
from app.play.core import Generala

@socketio.on('connect', namespace='/play')
def on_connect():
    name = session['name']
    game = Generala()
    user_id = request.sid
    games[user_id] = game
    print(f'User with sid {user_id} connected!')

@socketio.on('roll dices', namespace='/play')
def on_roll(group_idx):
    user_id = request.sid
    game = games[user_id]
    game.roll_dices(group_idx)
    game.update_prices(group_idx)
    dices = list(game.state[group_idx])
    prices = list(game.prices[group_idx])
    emit('player dices', {'dices': dices, 'prices': prices, 'group_idx': group_idx})

@socketio.on('disconnect', namespace='/play')
def on_disconnect():
    user_id = request.sid
    del games[user_id]
    del session['name']
    print(f'User with sid {user_id} disconnected!')