from flask import session, request
from flask_socketio import emit, send, disconnect
from app import socketio, games
from app.play.core import Game

@socketio.on('connect', namespace='/play')
def on_connect():
    name = session['name']
    game = Game()
    user_id = request.sid
    games[user_id] = game
    print(f'User with sid {user_id} connected!')

@socketio.on('roll dices', namespace='/play')
def on_roll():
    dices = Game.roll_dices()
    emit('fill dices', dices)

@socketio.on('get scores', namespace='/play')
def on_scores(dices):
    scores = Game.get_scores(dices)
    emit('fill tables', scores)
    
@socketio.on('disconnect', namespace='/play')
def on_disconnect():
    user_id = request.sid
    del games[user_id]
    del session['name']
    print(f'User with sid {user_id} disconnected!')