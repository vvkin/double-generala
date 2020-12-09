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
def on_roll():
    user_id = request.sid
    game = games[user_id]
    game.roll_dices()
    game.update_prices()
    dices = list(game.dices)
    prices = list(game.prices)
    emit('player roll', {'dices': dices, 'prices': prices})

@socketio.on('disconnect', namespace='/play')
def on_disconnect():
    user_id = request.sid
    del games[user_id]
    del session['name']
    print(f'User with sid {user_id} disconnected!')